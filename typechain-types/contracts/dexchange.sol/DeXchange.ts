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
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace Dexchange {
  export type OrderStruct = {
    nonce: PromiseOrValue<string>;
    user: PromiseOrValue<string>;
    amount: PromiseOrValue<BigNumberish>;
    signature: PromiseOrValue<BytesLike>;
  };

  export type OrderStructOutput = [string, string, BigNumber, string] & {
    nonce: string;
    user: string;
    amount: BigNumber;
    signature: string;
  };

  export type OrderBookTradeStruct = {
    market: PromiseOrValue<string>;
    orderType: PromiseOrValue<string>;
    orderSide: PromiseOrValue<string>;
    baseAsset: PromiseOrValue<string>;
    quoteAsset: PromiseOrValue<string>;
    rate: PromiseOrValue<BigNumberish>;
  };

  export type OrderBookTradeStructOutput = [
    string,
    string,
    string,
    string,
    string,
    BigNumber
  ] & {
    market: string;
    orderType: string;
    orderSide: string;
    baseAsset: string;
    quoteAsset: string;
    rate: BigNumber;
  };
}

export interface DexchangeInterface extends utils.Interface {
  functions: {
    "balanceOf(address,address)": FunctionFragment;
    "depositToken(address,address,uint256,string,bytes)": FunctionFragment;
    "feeAccount()": FunctionFragment;
    "feePercent()": FunctionFragment;
    "forwarder()": FunctionFragment;
    "getHash(string,address,string,string,string,uint256,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setFee(address,uint256)": FunctionFragment;
    "setForwarder(address)": FunctionFragment;
    "tokensBalance(address,address)": FunctionFragment;
    "trade((string,address,uint256,bytes),(string,address,uint256,bytes),(string,string,string,address,address,uint256))": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdrawToken(address,address,uint256,string,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balanceOf"
      | "depositToken"
      | "feeAccount"
      | "feePercent"
      | "forwarder"
      | "getHash"
      | "owner"
      | "renounceOwnership"
      | "setFee"
      | "setForwarder"
      | "tokensBalance"
      | "trade"
      | "transferOwnership"
      | "withdrawToken"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "depositToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "feeAccount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "feePercent",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "forwarder", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getHash",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFee",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setForwarder",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensBalance",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "trade",
    values: [
      Dexchange.OrderStruct,
      Dexchange.OrderStruct,
      Dexchange.OrderBookTradeStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "feeAccount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feePercent", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "forwarder", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getHash", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "trade", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawToken",
    data: BytesLike
  ): Result;

  events: {
    "Deposit(address,address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Withdraw(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export interface DepositEventObject {
  token: string;
  user: string;
  amount: BigNumber;
}
export type DepositEvent = TypedEvent<
  [string, string, BigNumber],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface WithdrawEventObject {
  token: string;
  user: string;
  amount: BigNumber;
}
export type WithdrawEvent = TypedEvent<
  [string, string, BigNumber],
  WithdrawEventObject
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface Dexchange extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DexchangeInterface;

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
    balanceOf(
      _token: PromiseOrValue<string>,
      _user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    depositToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    feeAccount(overrides?: CallOverrides): Promise<[string]>;

    feePercent(overrides?: CallOverrides): Promise<[BigNumber]>;

    forwarder(overrides?: CallOverrides): Promise<[string]>;

    getHash(
      _nonce: PromiseOrValue<string>,
      _wallet: PromiseOrValue<string>,
      _market: PromiseOrValue<string>,
      _type: PromiseOrValue<string>,
      _side: PromiseOrValue<string>,
      _quantity: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFee(
      _feeAccount: PromiseOrValue<string>,
      _feePercent: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setForwarder(
      _forwarder: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tokensBalance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    trade(
      _buy: Dexchange.OrderStruct,
      _sell: Dexchange.OrderStruct,
      _order: Dexchange.OrderBookTradeStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  balanceOf(
    _token: PromiseOrValue<string>,
    _user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  depositToken(
    _token: PromiseOrValue<string>,
    _owner: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    _nonce: PromiseOrValue<string>,
    _signature: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  feeAccount(overrides?: CallOverrides): Promise<string>;

  feePercent(overrides?: CallOverrides): Promise<BigNumber>;

  forwarder(overrides?: CallOverrides): Promise<string>;

  getHash(
    _nonce: PromiseOrValue<string>,
    _wallet: PromiseOrValue<string>,
    _market: PromiseOrValue<string>,
    _type: PromiseOrValue<string>,
    _side: PromiseOrValue<string>,
    _quantity: PromiseOrValue<BigNumberish>,
    _rate: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFee(
    _feeAccount: PromiseOrValue<string>,
    _feePercent: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setForwarder(
    _forwarder: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tokensBalance(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  trade(
    _buy: Dexchange.OrderStruct,
    _sell: Dexchange.OrderStruct,
    _order: Dexchange.OrderBookTradeStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawToken(
    _token: PromiseOrValue<string>,
    _owner: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    _nonce: PromiseOrValue<string>,
    _signature: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balanceOf(
      _token: PromiseOrValue<string>,
      _user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    depositToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    feeAccount(overrides?: CallOverrides): Promise<string>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    forwarder(overrides?: CallOverrides): Promise<string>;

    getHash(
      _nonce: PromiseOrValue<string>,
      _wallet: PromiseOrValue<string>,
      _market: PromiseOrValue<string>,
      _type: PromiseOrValue<string>,
      _side: PromiseOrValue<string>,
      _quantity: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setFee(
      _feeAccount: PromiseOrValue<string>,
      _feePercent: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setForwarder(
      _forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    tokensBalance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    trade(
      _buy: Dexchange.OrderStruct,
      _sell: Dexchange.OrderStruct,
      _order: Dexchange.OrderBookTradeStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Deposit(address,address,uint256)"(
      token?: null,
      user?: null,
      amount?: null
    ): DepositEventFilter;
    Deposit(token?: null, user?: null, amount?: null): DepositEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "Withdraw(address,address,uint256)"(
      token?: null,
      user?: null,
      amount?: null
    ): WithdrawEventFilter;
    Withdraw(token?: null, user?: null, amount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    balanceOf(
      _token: PromiseOrValue<string>,
      _user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    depositToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    feeAccount(overrides?: CallOverrides): Promise<BigNumber>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    forwarder(overrides?: CallOverrides): Promise<BigNumber>;

    getHash(
      _nonce: PromiseOrValue<string>,
      _wallet: PromiseOrValue<string>,
      _market: PromiseOrValue<string>,
      _type: PromiseOrValue<string>,
      _side: PromiseOrValue<string>,
      _quantity: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFee(
      _feeAccount: PromiseOrValue<string>,
      _feePercent: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setForwarder(
      _forwarder: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tokensBalance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    trade(
      _buy: Dexchange.OrderStruct,
      _sell: Dexchange.OrderStruct,
      _order: Dexchange.OrderBookTradeStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(
      _token: PromiseOrValue<string>,
      _user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    depositToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    feeAccount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feePercent(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    forwarder(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getHash(
      _nonce: PromiseOrValue<string>,
      _wallet: PromiseOrValue<string>,
      _market: PromiseOrValue<string>,
      _type: PromiseOrValue<string>,
      _side: PromiseOrValue<string>,
      _quantity: PromiseOrValue<BigNumberish>,
      _rate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFee(
      _feeAccount: PromiseOrValue<string>,
      _feePercent: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setForwarder(
      _forwarder: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tokensBalance(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    trade(
      _buy: Dexchange.OrderStruct,
      _sell: Dexchange.OrderStruct,
      _order: Dexchange.OrderBookTradeStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _owner: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _nonce: PromiseOrValue<string>,
      _signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
