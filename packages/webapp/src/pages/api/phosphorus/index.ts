import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import Safe, { SafeFactory, EthersAdapter } from '@safe-global/protocol-kit';
import { RPC_URLS, SUPPORTED_NETWORKS } from '@/utils/chains';
import { NETWORK_FALLBACK_HANDLERS } from '@/utils/helpers';
import ISafeABI from '../../../../../contracts/artifacts/contracts/interfaces/ISafe.sol/ISafe.json';

interface MakeVaultNFTReq extends NextApiRequest {
  body: {
    address: string;
    chainIds?: string[];
  };
  // TODO: Extend to support multiple signers w/ threshold
}

interface MakeSafeResData {
  data: {
    nfts?: {
      [chainId: string]: {
        tokenURI: string;
      };
    };
    success?: boolean;
    error?: string;
  };
}

const handler = async (
  req: MakeVaultNFTReq,
  res: NextApiResponse<MakeSafeResData | { error: string }>
) => {
  try {
    let { address, chainIds }  = req.body;

    if (req.method !== 'POST') {
      res.status(405).send({ error: 'Method not allowed' });
      return;
    } else if (!ethers.isAddress(address)) {
      res.status(400).send({ error: 'Invalid address' });
      return;
    }

    // TODO: change in prod?
    salt = Date.now();

    chainIds = chainIds ?? Object.keys(SUPPORTED_NETWORKS);
    const deployerSigner = new ethers.Wallet(
      process.env.DEPLOYER_PKEY as string
    );

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
          // to: NETWORK_FALLBACK_HANDLERS[chainId],
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

        const safeIsDeployed = await safe.isSafeDeployed();
        console.log(`is safe already deployed?`, safeIsDeployed);

        // if safe isn't deployed, deploy
        if (!safeIsDeployed) {
          const deployedSafe = await safeSdk.deploySafe({
            safeAccountConfig: accountConfig,
            saltNonce: salt,
            options: {
              gasLimit: 400_000,
            },
          });
          const enableModuleTx = await deployedSafe.createEnableModuleTx(
            NETWORK_FALLBACK_HANDLERS[chainId]
          );

          const executeEnableModuleTx = await deployedSafe.executeTransaction(
            enableModuleTx,
            {
              gasLimit: 400_000,
            }
          );

          await executeEnableModuleTx.transactionResponse.wait();

          // check if fallback module was successully added
          const moduleIsEnabled = await deployedSafe.isModuleEnabled(
            NETWORK_FALLBACK_HANDLERS[chainId]
          );
          console.log(`module is enabled`, moduleIsEnabled);
          // after we've added the module to the vaule, revoke deployer as owner
          if (moduleIsEnabled) {
            const removeDeployerTx = await deployedSafe.createRemoveOwnerTx({
              ownerAddress: deployerSigner.address,
              threshold: 1,
            });
            // remove deployer from vault
            const removeDeployerTxResponse =
              await deployedSafe.executeTransaction(removeDeployerTx);
            await removeDeployerTxResponse.transactionResponse?.wait();
          }

          return {
            chainId,
            safe: {
              address: predictedAddress,
              isModuleEnabled: moduleIsEnabled,
            },
          };
        } else {
          const safeContract = new ethers.Contract(
            predictedAddress,
            ISafeABI.abi,
            provider
          );
          return {
            chainId,
            safe: {
              address: predictedAddress,
              isModuleEnabled: await safeContract.isModuleEnabled(
                NETWORK_FALLBACK_HANDLERS[chainId]
              ),
            },
          };
        }
      })
    );

    const safes = Object.fromEntries(data.map((d) => [d.chainId, d.safe]));

    return res.send({
      data: {
        safes,
        success: true,
      },
    });
  } catch (err) {
    return res.send({
      // success:false,
      data: {
        success: false,
        error: err.message,
      },
    });
  }
};
export default handler;


//https://admin-api.phosphor.xyz/v1/collections