
const ISafeABI = [
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "dataHash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "signatures",
          "type": "bytes"
        }
      ],
      "name": "checkSignatures",
      "outputs": [],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "prevModule",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "module",
          "type": "address"
        }
      ],
      "name": "disableModule",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "domainSeparator",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "module",
          "type": "address"
        }
      ],
      "name": "enableModule",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "operation",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "safeTxGas",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "baseGas",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "gasPrice",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "gasToken",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "refundReceiver",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "signatures",
          "type": "bytes"
        }
      ],
      "name": "execTransaction",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "operation",
          "type": "uint8"
        }
      ],
      "name": "execTransactionFromModule",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "operation",
          "type": "uint8"
        }
      ],
      "name": "execTransactionFromModuleReturnData",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "returnData",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "start",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "pageSize",
          "type": "uint256"
        }
      ],
      "name": "getModulesPaginated",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "array",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "next",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "module",
          "type": "address"
        }
      ],
      "name": "isModuleEnabled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "handler",
          "type": "address"
        }
      ],
      "name": "setFallbackHandler",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  export default ISafeABI;
