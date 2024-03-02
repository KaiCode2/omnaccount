import { http, createConfig } from 'wagmi'
import { sepolia, optimismSepolia, baseSepolia, arbitrumSepolia, lineaTestnet, } from 'wagmi/chains'

export const config = createConfig({
  chains: [sepolia, optimismSepolia, baseSepolia, arbitrumSepolia, lineaTestnet],
  transports: {
    [sepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [lineaTestnet.id]: http(),
  },
})

