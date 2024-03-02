import React, { useContext } from 'react';
import { ethers } from 'ethers';
import { SignerContext } from '../Context/Signer';

import { Button, Text, Title } from '@mantine/core';
import theme from '../utils/theme';
import {
  DEFAULT_TESTNET_TO_ADD,
  addNetwork,
  decimalToHexChainId,
} from '../utils/helpers';
import { SUPPORTED_NETWORKS } from '../utils/chains';
import { CurrentNetworkContext } from '../Context/CurrentNetwork';
import { useAccount, useEnsName } from 'wagmi'


const ConnectWalletButton = () => {
  const { address } = useAccount()
  const { data, error, status } = useEnsName({ address })

  
  const { setSigner, signer } = useContext(SignerContext);
  const { currentNetwork, setCurrentNetwork } = useContext(
    CurrentNetworkContext
  );

  return signer ? (
    <Text size="md">{`${signer.address.slice(0, 5)}...${signer.address.slice(
      -4
    )}`}</Text>
  ) : (
    <Button
      radius="xl"
      // color="violet"
      style={{ background: theme.styles.colors.teal }}
      onClick={async () => {
        // @ts-expect-error
        if (window.ethereum) {
          // @ts-expect-error
          const provider = new ethers.BrowserProvider(window?.ethereum);
          // @ts-expect-error
          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          });
          const network = await provider.getNetwork();
          // const net = await window?.ethereum
          // const net = await provider._network;

          await provider.send('eth_requestAccounts', []);
          const walletSigner = await provider.getSigner();

          // if they're not on any of the nets already, add ETH sepolia or switch
          if (!SUPPORTED_NETWORKS[chainId]) {
            try {
              // switch to chain they want to deploy vault on
              // @ts-expect-error
              await window?.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [
                  {
                    // switch to ETH sepolia tesnet
                    chainId: DEFAULT_TESTNET_TO_ADD,
                  },
                ],
              });
              // NOTE: refresh the signer with new network connection
              const provider = new ethers.BrowserProvider(
                // @ts-expect-error
                window?.ethereum
              );
              // refresh signer with new network
              const walletWithNewNetwork = await provider.getSigner();
              setSigner(walletWithNewNetwork);
              setCurrentNetwork(DEFAULT_TESTNET_TO_ADD);
            } catch (err) {
              // if they don't have ETH sepolia testnet added to their wallet
              if (err.code == 4902) {
                await addNetwork(DEFAULT_TESTNET_TO_ADD);
                const provider = new ethers.BrowserProvider(
                  // @ts-expect-error
                  window?.ethereum
                );
                // set new signer with newly added network
                const walletWithNewNetwork = await provider.getSigner();
                setSigner(walletWithNewNetwork);
                setCurrentNetwork(DEFAULT_TESTNET_TO_ADD);
              }
            }
            setSigner(walletSigner);
            return;
          }
          setSigner(walletSigner);
          setCurrentNetwork(chainId);
        }
      }}
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;

// 11155420n;
