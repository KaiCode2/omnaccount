import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { DeterministicDeploymentInfo } from "hardhat-deploy/types";
import { getSingletonFactoryInfo } from '@safe-global/safe-singleton-factory'
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-tracer";
import "tsconfig-paths/register";

dotenv.config();

import "@/tasks";

const mnemonic =
  process.env.MNEMONIC ??
  process.env.DEPLOYER_MNEMONIC ??
  'tattoo clip ankle prefer cruise car motion borrow bread future legal system'
export const accounts = {
  mnemonic: mnemonic,
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 10,
  passphrase: '',
}

const mumbaiRpcUrl =
  process.env.MUMBAI_RPC_URL ??
  (process.env.INFURA_API_KEY ? `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}` : undefined) ??
  (process.env.ALCHEMY_API_KEY
    ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    : undefined) ??
  "https://polygon-mumbai-pokt.nodies.app"

const opSepoliaRpcUrl = process.env.OP_SEPOLIA_RPC_URL ?? "https://optimism-sepolia.blockpi.network/v1/rpc/public";
const baseSepoliaRpcUrl = process.env.BASE_SEPOLIA_RPC_URL ?? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const baseGoerliRpcUrl = process.env.BASE_GOERLI_RPC_URL ?? `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL ?? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const arbSepoliaRpcUrl = process.env.ARB_SEPOLIA_RPC_URL ?? "https://arbitrum-sepolia.blockpi.network/v1/rpc/public";


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
      forking: {
        url: sepoliaRpcUrl,
      }
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
      chainId: 80001,
      saveDeployments: true,
      deploy: ["deploy/public"],
      live: true,
    },
    sepolia: {
      url: sepoliaRpcUrl,
      accounts,
      chainId: 11155111,
      saveDeployments: true,
      deploy: ["deploy/public"],
      live: true,
    },
    arbitrumSepolia: {
      url: arbSepoliaRpcUrl,
      accounts,
      chainId: 421614,
      saveDeployments: true,
      deploy: ["deploy/public"],
      live: true,
    },
    opSepolia: {
      url: opSepoliaRpcUrl,
      accounts,
      chainId: 11155420,
      saveDeployments: true,
      deploy: ["deploy/public"],
      live: true,
    },
    baseSepolia: {
      url: baseSepoliaRpcUrl,
      accounts,
      chainId: 84532,
      saveDeployments: true,
      deploy: ["deploy/public"],
      live: true,
    },
    baseGoerli: {
      url: baseGoerliRpcUrl,
      chainId: 84531,
      accounts,
      saveDeployments: true,
      deploy: ["deploy/public"],
      live: true,
    },
    lineaGoerli: {
      url: "https://rpc.goerli.linea.build",
      chainId: 59140,
      accounts,
      saveDeployments: true,
      deploy: ["deploy/public"],
      live: true,
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
      default: "0x5ef6C01E11889d86803e0B23e3cB3F9E9d97B662",
      sepolia: "0x5ef6C01E11889d86803e0B23e3cB3F9E9d97B662",
      arbitrumSepolia: "0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75",
      opSepolia: "0x4e8E101924eDE233C13e2D8622DC8aED2872d505",
      baseSepolia: "0x82B564983aE7274c86695917BBf8C99ECb6F0F8F",
      baseGoerli: "0x1F5AA71C79ec6a11FC55789ed32dAE3B64d75791",
      lineaGoerli: "0xfa3DA25059F4ff59dA7566B58D3299dB8a04691F",
    },
    entrypoint: {
      default: 8, // TODO: Update
    },
    WETH: {
      default: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      sepolia: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      arbitrumSepolia: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
      opSepolia: "0x4200000000000000000000000000000000000006",
      baseSepolia: "0x4200000000000000000000000000000000000006",
      baseGoerli: "0x4200000000000000000000000000000000000006",
      lineaGoerli: "0x2c1b868d6596a18e32e61b901e4060c872647b6c",
    },
    relayer: 9,
  },
  deterministicDeployment,
  typechain: {
    target: "ethers-v6",
    outDir: "./typechain-types",
  },
  tracer: {
    // tasks: ["tasks", "scripts", "deploy"],
  }
};

function deterministicDeployment(network: string): DeterministicDeploymentInfo {
  const info = getSingletonFactoryInfo(parseInt(network))
  if (!info) {
    throw new Error(`
      Safe factory not found for network ${network}. You can request a new deployment at https://github.com/safe-global/safe-singleton-factory.
      For more information, see https://github.com/safe-global/safe-contracts#replay-protection-eip-155
    `)
  }

  const gasLimit = BigInt(info.gasLimit)
  const gasPrice = BigInt(info.gasPrice)

  return {
    factory: info.address,
    deployer: info.signerAddress,
    funding: String(gasLimit * gasPrice),
    signedTx: info.transaction,
  }
}

export default config;
