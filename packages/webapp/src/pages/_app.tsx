import { Notifications } from '@mantine/notifications';
import '../styles/global.css';
import '@mantine/notifications/styles.css';

import SignerProvider from '../Context/Signer';
import React from 'react';
import '@mantine/core/styles.css';

import type { AppProps } from 'next/app';
import { createTheme, MantineProvider } from '@mantine/core';
import CurrentNetworkProvider, {
  CurrentNetworkContext,
} from '../Context/CurrentNetwork';

import { ApolloProvider } from 'react-apollo';
import { client } from '../lib/graphql/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { WagmiProvider } from 'wagmi' 
import { config } from '@/utils/config' 

const theme = createTheme({
  /** Put your mantine theme override here */
});

const queryClient = new QueryClient() 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <WagmiProvider config={config}> 
        <QueryClientProvider client={queryClient}> 
        {/* <CurrentNetworkProvider> */}
          <MantineProvider defaultColorScheme="dark" theme={theme}>
            <Notifications position="bottom-center" />

            <Component {...pageProps} />
          </MantineProvider>
        {/* </CurrentNetworkProvider> */}
        </QueryClientProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
}
