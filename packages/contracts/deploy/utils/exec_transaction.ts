import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { TransactionRequest, ZeroAddress } from 'ethers'

import { ISafe } from '@/typechain-types'

export default async function execSafeTransaction(safe: ISafe, { to, data, value = 0 }: TransactionRequest, signer: SignerWithAddress, operation = 0) {
  const address = await safe.getAddress()
  const chainId = await signer.provider.getNetwork().then(({ chainId }) => chainId)
  const nonce = await safe.nonce()

  const { domain, types, message } = createSafeTxParams(address, chainId, { to, data, value }, nonce)

  const signature = await signer.signTypedData(domain, types, message)

  // @ts-ignore
  return safe.execTransaction(
    to as string,
    value as number | bigint,
    data as string,
    operation,
    0,
    0,
    0,
    ZeroAddress,
    ZeroAddress,
    signature,
  )
}

export function createSafeTxParams(address: string, chainId: bigint, { to, data, value }: TransactionRequest, nonce: bigint | number) {
  const domain = { verifyingContract: address, chainId }
  const primaryType = 'SafeTx' as const
  const types = {
    SafeTx: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'value' },
      { type: 'bytes', name: 'data' },
      { type: 'uint8', name: 'operation' },
      { type: 'uint256', name: 'safeTxGas' },
      { type: 'uint256', name: 'baseGas' },
      { type: 'uint256', name: 'gasPrice' },
      { type: 'address', name: 'gasToken' },
      { type: 'address', name: 'refundReceiver' },
      { type: 'uint256', name: 'nonce' },
    ],
  }
  const message = {
    to,
    value,
    data,
    operation: 0,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: ZeroAddress,
    refundReceiver: ZeroAddress,
    nonce,
  }

  return { domain, primaryType, types, message }
}
