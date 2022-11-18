/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../../common";

export type TransactionStruct = {
  txType: PromiseOrValue<BigNumberish>;
  from: PromiseOrValue<BigNumberish>;
  to: PromiseOrValue<BigNumberish>;
  ergsLimit: PromiseOrValue<BigNumberish>;
  ergsPerPubdataByteLimit: PromiseOrValue<BigNumberish>;
  maxFeePerErg: PromiseOrValue<BigNumberish>;
  maxPriorityFeePerErg: PromiseOrValue<BigNumberish>;
  paymaster: PromiseOrValue<BigNumberish>;
  reserved: PromiseOrValue<BigNumberish>[];
  data: PromiseOrValue<BytesLike>;
  signature: PromiseOrValue<BytesLike>;
  factoryDeps: PromiseOrValue<BytesLike>[];
  paymasterInput: PromiseOrValue<BytesLike>;
  reservedDynamic: PromiseOrValue<BytesLike>;
};

export type TransactionStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber[],
  string,
  string,
  string[],
  string,
  string
] & {
  txType: BigNumber;
  from: BigNumber;
  to: BigNumber;
  ergsLimit: BigNumber;
  ergsPerPubdataByteLimit: BigNumber;
  maxFeePerErg: BigNumber;
  maxPriorityFeePerErg: BigNumber;
  paymaster: BigNumber;
  reserved: BigNumber[];
  data: string;
  signature: string;
  factoryDeps: string[];
  paymasterInput: string;
  reservedDynamic: string;
};

export interface IPaymasterInterface extends utils.Interface {
  functions: {
    "postOp(bytes,(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256[6],bytes,bytes,bytes32[],bytes,bytes),bytes32,bytes32,uint8,uint256)": FunctionFragment;
    "validateAndPayForPaymasterTransaction(bytes32,bytes32,(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256[6],bytes,bytes,bytes32[],bytes,bytes))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "postOp" | "validateAndPayForPaymasterTransaction"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "postOp",
    values: [
      PromiseOrValue<BytesLike>,
      TransactionStruct,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "validateAndPayForPaymasterTransaction",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      TransactionStruct
    ]
  ): string;

  decodeFunctionResult(functionFragment: "postOp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "validateAndPayForPaymasterTransaction",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IPaymaster extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPaymasterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    postOp(
      _context: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _txResult: PromiseOrValue<BigNumberish>,
      _maxRefundedErgs: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    validateAndPayForPaymasterTransaction(
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  postOp(
    _context: PromiseOrValue<BytesLike>,
    _transaction: TransactionStruct,
    _txHash: PromiseOrValue<BytesLike>,
    _suggestedSignedHash: PromiseOrValue<BytesLike>,
    _txResult: PromiseOrValue<BigNumberish>,
    _maxRefundedErgs: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  validateAndPayForPaymasterTransaction(
    _txHash: PromiseOrValue<BytesLike>,
    _suggestedSignedHash: PromiseOrValue<BytesLike>,
    _transaction: TransactionStruct,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    postOp(
      _context: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _txResult: PromiseOrValue<BigNumberish>,
      _maxRefundedErgs: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    validateAndPayForPaymasterTransaction(
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    postOp(
      _context: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _txResult: PromiseOrValue<BigNumberish>,
      _maxRefundedErgs: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    validateAndPayForPaymasterTransaction(
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    postOp(
      _context: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _txResult: PromiseOrValue<BigNumberish>,
      _maxRefundedErgs: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    validateAndPayForPaymasterTransaction(
      _txHash: PromiseOrValue<BytesLike>,
      _suggestedSignedHash: PromiseOrValue<BytesLike>,
      _transaction: TransactionStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
