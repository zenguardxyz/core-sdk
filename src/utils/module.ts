import Safe, { HexAddress } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { NetworkUtil } from './networks';
import { Wallet, Contract, ZeroAddress } from 'ethers';
import Safe7579 from "./Safe7579.json";

import {
  getClient,
  getModule,
  getAccount,
  installModule as install7579Module,
  isModuleInstalled,
  ModuleType,
  Module,
} from "@rhinestone/module-sdk";
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';

const safe7579Module = '0x6572f74fb630cfe9132143dd4007ddd013e40f83';


type Hex = `0x${string}`

export class SafeCore7579 {
  private chainId: number;
  private privateKey?: string;
  private safeAddress: string;
  private ownerAddress: string;
  private protocolKit: any;
  private apiKit: any;

  constructor(chainId: number, safeAddress: string, ownerAddress: string,  privateKey?: string) {
    this.chainId = chainId;
    this.privateKey = privateKey;
    this.safeAddress = safeAddress;
    this.ownerAddress = ownerAddress;
  }

  async init() {
    const provider = NetworkUtil.getNetworkById(this.chainId)?.url!;
    this.protocolKit = await Safe.init({ provider, safeAddress: this.safeAddress, signer: this.privateKey });
    this.apiKit = new SafeApiKit({ chainId: BigInt(this.chainId) });
  }

  async buildInitSafe7579(): Promise<MetaTransactionData[]> {
    const enableFallbackHandlerTx = await this.protocolKit.createEnableFallbackHandlerTx(safe7579Module);
    const enableModuleTx = await this.protocolKit.createEnableModuleTx(safe7579Module);

    const safe7579 = new Contract(safe7579Module, Safe7579.abi);
    const initSafe7579Tx = {
      to: this.safeAddress,
      value: "0",
      data: (await safe7579.initializeAccount.populateTransaction([], [], [], [], { registry: ZeroAddress, attesters: [], threshold: 0 })).data
    };

    return [enableFallbackHandlerTx.data, enableModuleTx.data, initSafe7579Tx];
  }

  async buildInstallModule(moduleAddress: HexAddress, type: ModuleType, initData: Hex): Promise<MetaTransactionData> {
    const client = getClient({ rpcUrl: NetworkUtil.getNetworkById(this.chainId)?.url! });

    const accountBefore7579 = getAccount({ address: safe7579Module, type: "safe" });
    const account = getAccount({ address: this.safeAddress, type: "safe" });



    const module = getModule({ module: moduleAddress, initData: initData, type: type });

    let moduleInstalled = false;

    try {
     moduleInstalled =  await isModuleInstalled({ client, account , module })
    }
    catch {

    }

    if ( !moduleInstalled) {
      const executions = await install7579Module({ client, account: accountBefore7579, module });
      return { to: this.safeAddress, value: executions[0].value.toString(), data: executions[0].callData };
    } else {
      throw new Error('Module is already installed');
    }
  }

  async installModule(module: Module) {
    let transactions: MetaTransactionData[] = [];

    try {
      transactions = await this.buildInitSafe7579();
    } catch (e) {
    }

    let sender;
    if(this.privateKey) {
    sender = new Wallet(this.privateKey);
    } 
    else {
      throw("Signer is needed to install the Module")
    }

    console.log(module)
    try {
      const installModuleTx = await this.buildInstallModule(
        module.module,
        module.type,
        module.initData!
      );

      transactions.push(installModuleTx);
    } catch(e) {

      console.log(e)

    }

    if (transactions.length === 0) {
      throw("Module can't be installed or already installed");
    }

    const safeTransaction = await this.protocolKit.createTransaction({ transactions });
    const safeTxHash = await this.protocolKit.getTransactionHash(safeTransaction);
    const signature = await this.protocolKit.signHash(safeTxHash);

    try {
      await this.apiKit.proposeTransaction({
        safeAddress: this.safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: sender.address,
        senderSignature: signature.data
      });
    } catch (e) {
      throw("Failed to propose transaction")
    }
  }
}
