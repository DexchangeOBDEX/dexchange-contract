/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPaymaster,
  IPaymasterInterface,
} from "../../../../../../@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_context",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ergsLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ergsPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerErg",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerErg",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256[6]",
            name: "reserved",
            type: "uint256[6]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "_txHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_suggestedSignedHash",
        type: "bytes32",
      },
      {
        internalType: "enum ExecutionResult",
        name: "_txResult",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_maxRefundedErgs",
        type: "uint256",
      },
    ],
    name: "postOp",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_txHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_suggestedSignedHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ergsLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ergsPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerErg",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerErg",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256[6]",
            name: "reserved",
            type: "uint256[6]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
    ],
    name: "validateAndPayForPaymasterTransaction",
    outputs: [
      {
        internalType: "bytes",
        name: "context",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

export class IPaymaster__factory {
  static readonly abi = _abi;
  static createInterface(): IPaymasterInterface {
    return new utils.Interface(_abi) as IPaymasterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPaymaster {
    return new Contract(address, _abi, signerOrProvider) as IPaymaster;
  }
}
