import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import Safe, { SafeFactory, EthersAdapter } from "@safe-global/protocol-kit";
import { RPC_URLS, SUPPORTED_NETWORKS } from "@/utils/chains";
import { NETWORK_FALLBACK_HANDLERS } from "@/utils/helpers";
import ISafeABI from "@/utils/ABIs";

interface MakeSafeReq extends NextApiRequest {
  query: {
    address: string;
    salt?: string;
    chainIds?: string[];
  };
  // TODO: Extend to support multiple signers w/ threshold
}

interface MakeSafeResData {
  data: {
    safes?: {
      [chainId: string]: {
        address: string;
        isModuleEnabled: boolean;
      };
    };
    success?: boolean;
    error?: string;
  };
}

const handler = async (
  req: MakeSafeReq,
  res: NextApiResponse<MakeSafeResData | { error: string }>
) => {
  let { address, chainIds, salt } = JSON.parse(req.body);
  if (!ethers.isAddress(address)) {
    res.status(400).send({ error: 'Invalid address' });
    return;
  }

  console.log('SOME CONFIGS', address, chainIds, salt);

  chainIds = chainIds ?? Object.keys(SUPPORTED_NETWORKS);
  const deployerSigner = new ethers.Wallet(process.env.DEPLOYER_PKEY as string);

  let data = await Promise.all(
    chainIds.map(async (chainId) => {
      const provider = deployerSigner.connect(
        new ethers.JsonRpcProvider(RPC_URLS[chainId])
      );
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: provider,
      });

      let safeSdk = await SafeFactory.create({ ethAdapter });

      const accountConfig = {
        owners: [address, deployerSigner.address],
        threshold: 1,
        fallbackHandler: NETWORK_FALLBACK_HANDLERS[chainId],
      };
      const predictedAddress = await safeSdk.predictSafeAddress(
        accountConfig,
        salt
      );
      safeSdk = await SafeFactory.create({ ethAdapter });

      const safe = await Safe.create({
        ethAdapter,
        predictedSafe: {
          safeAccountConfig: accountConfig,
          safeDeploymentConfig: { saltNonce: salt },
        },
      });

      const isDeployed = await safe.isSafeDeployed();
      const safeContract = new ethers.Contract(predictedAddress, ISafeABI, provider);
      return {
        chainId,
        safe: {
          address: predictedAddress,
          isModuleEnabled: isDeployed
            ? await safeContract.isModuleEnabled(
                NETWORK_FALLBACK_HANDLERS[chainId]
              )
            : false,
        },
      };
    })
  );

  const safes = Object.fromEntries(data.map((d) => [d.chainId, d.safe]));

  return res.send({
    data: {
      safes,
      success: true,
    },
  });
};
export default handler;
