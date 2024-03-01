import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "tsconfig-paths/register";
import { getSingletonFactoryInfo } from "@safe-global/safe-singleton-factory";

dotenv.config();

import "@/tasks";
import { DeterministicDeploymentInfo } from "hardhat-deploy/types";

const mnemonic =
  process.env.MNEMONIC ??
  process.env.DEPLOYER_MNEMONIC ??
  "tattoo clip ankle prefer cruise car motion borrow bread future legal system";
export const accounts = {
  mnemonic: mnemonic,
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 10,
  passphrase: "",
};

const polygonRpcUrl =
  process.env.POLYGON_RPC_URL ??
  (process.env.INFURA_API_KEY
    ? `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
    : undefined) ??
  (process.env.ALCHEMY_API_KEY
    ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    : undefined) ??
  "https://polygon-pokt.nodies.app";

const mumbaiRpcUrl =
  process.env.MUMBAI_RPC_URL ??
  (process.env.INFURA_API_KEY
    ? `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`
    : undefined) ??
  (process.env.ALCHEMY_API_KEY
    ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    : undefined) ??
  "https://polygon-mumbai-pokt.nodies.app";

const sepoliaRpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const arbSepoliaRpcUrl =
  "https://arbitrum-sepolia.blockpi.network/v1/rpc/public";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.23", // TODO: Bump to 0.8.24
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      loggingEnabled: true,
      accounts,
      saveDeployments: true,
      autoImpersonate: true,
      deploy: ["deploy/local"],
      // forking: {
      //   url: sepoliaRpcUrl,
      // },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts,
      saveDeployments: true,
      autoImpersonate: true,
      deploy: ["deploy/local"],
    },
    mumbai: {
      url: mumbaiRpcUrl,
      accounts,
      saveDeployments: true,
      deploy: ["deploy/public"],
    },
    sepolia: {
      url: sepoliaRpcUrl,
      accounts,
      saveDeployments: true,
      deploy: ["deploy/public"],
    },
    arbitrumSepolia: {
      url: arbSepoliaRpcUrl,
      accounts,
      saveDeployments: true,
      deploy: ["deploy/public"],
    },
  },
  paths: {
    tests: "./test/mocha",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    owner: 0,
    deployer: 1,
    spokePool: {
      default: "0x5ef6C01E11889d86803e0B23e3cB3F9E9d97B662", // TODO: Update
      sepolia: "0x5ef6C01E11889d86803e0B23e3cB3F9E9d97B662",
      arbitrumSepolia: "0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75",
    },
    entrypoint: {
      default: 8, // TODO: Update
    },
    WETH: {
      sepolia: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      // sepoliaBase: "",
    },
  },
  deterministicDeployment,
  typechain: {
    target: "ethers-v6",
    outDir: "./typechain-types",
  },
};

function deterministicDeployment(network: string): DeterministicDeploymentInfo {
  const info = getSingletonFactoryInfo(parseInt(network));
  if (!info) {
    throw new Error(`
      Safe factory not found for network ${network}. You can request a new deployment at https://github.com/safe-global/safe-singleton-factory.
      For more information, see https://github.com/safe-global/safe-contracts#replay-protection-eip-155
    `);
  }

  const gasLimit = BigInt(info.gasLimit);
  const gasPrice = BigInt(info.gasPrice);

  return {
    factory: info.address,
    deployer: info.signerAddress,
    funding: String(gasLimit * gasPrice),
    signedTx: info.transaction,
  };
}

export default config;
