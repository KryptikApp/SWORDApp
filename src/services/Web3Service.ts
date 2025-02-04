import { ServiceState } from "./types";
import BaseService from "./BaseService";
import { defaultTokenAndNetwork, NetworkDb } from "./models/network";
import {
  JsonRpcProvider,
  StaticJsonRpcProvider,
} from "@ethersproject/providers";
import { Contract } from "ethers";

import { NetworkFamily, NetworkFamilyFromFamilyName } from "hdseedloop";
import {
  CreateEVMContractParameters,
  TokenDb,
  TokenAndNetwork,
} from "./models/token";
import { erc20Abi } from "../abis/erc20Abi";
import { KryptikProvider } from "./models/provider";
import {
  networkFromNetworkDb,
  getContractByNetwork,
} from "../helpers/utils/networkUtils";
import { IWallet } from "../models/KryptikWallet";
import { IWeb3Service } from "./models/IWeb3Service";
import { EVM_NULL_ADDRESS } from "../constants/evmConstants";
import { fetchNetworks, fetchTokens } from "../helpers/assets";
import { TokenContract } from "@prisma/client";

export interface IConnectWalletReturn {
  wallet: IWallet;
  remoteShare?: string;
}

// todo: update to route all price requests through this service
// so we can take advantage of cached responses
class Web3Service extends BaseService implements IWeb3Service {
  getProviderForNetwork(nw: NetworkDb): KryptikProvider {
    return this.networkProviders[nw.ticker];
  }
  public NetworkDbs: NetworkDb[] = [];
  public TickerToNetworkDbs: { [ticker: string]: NetworkDb } = {};
  public tokenDbs: TokenDb[] = [];
  // NetworkDb is referenced by its BIP44 chain id
  public rpcEndpoints: { [ticker: string]: string } = {};
  public web3Provider: StaticJsonRpcProvider =
    null as unknown as StaticJsonRpcProvider;
  //providers for each network
  public networkProviders: { [ticker: string]: KryptikProvider } = {};

  constructor() {
    super();
  }

  async InternalStartService() {
    // console logs for debugging
    // REMOVE for production
    console.log("Internal start service: KryptiK Web3");
    console.log("Service Id:");
    console.log(this.serviceId);
    // fetch network data
    try {
      await this.populateNetworkDbsAsync();
    } catch (e) {
      console.log(e);
      throw Error(
        "Error: Unable to populate NetworkDbs when starting web3 service."
      );
    }
    // fetch token data
    try {
      await this.populateTokenDbsAsync();
    } catch (e) {
      console.log(e);
      throw new Error(
        "Error: Unable to populate TokenDb array from database when starting web3 service."
      );
    }
    this.setRpcEndpoints();
    this.setSupportedProviders();
    return this;
  }

  // sets rpc endpoints for each supported NetworkDb
  private setRpcEndpoints() {
    for (const NetworkDb of this.NetworkDbs) {
      let ticker: string = NetworkDb.ticker;
      if (NetworkDb.isSupported) {
        try {
          this.rpcEndpoints[ticker] = NetworkDb.provider;
        } catch {
          // TODO: add better handler
          console.warn(
            "NetworkDb is specified as supported, but there was an error adding rpc endpoint. Check rpc config."
          );
        }
      }
    }
  }

  // sets providers for each supported NetworkDb
  private setSupportedProviders() {
    for (let ticker in this.rpcEndpoints) {
      this.setProviderFromTicker(ticker);
    }
  }

  private setProviderFromTicker(ticker: string): KryptikProvider {
    let rpcEndpoint: string = this.rpcEndpoints[ticker];
    let networkDb = this.NetworkDbs.find((nw) => nw.ticker == ticker);
    // TODO: ADD NON-BREAKING ERROR HANDLER
    if (!networkDb)
      throw new Error("Error: Unable to find service networkdb by ticker.");
    let newKryptikProvider = new KryptikProvider(rpcEndpoint, networkDb);
    this.networkProviders[ticker] = newKryptikProvider;
    return newKryptikProvider;
  }

  private async populateTokenDbsAsync(): Promise<TokenDb[]> {
    const tokensFromDb = await fetchTokens();
    if (tokensFromDb) {
      this.tokenDbs = tokensFromDb;
    } else {
      this.tokenDbs = [];
    }
    return this.tokenDbs;
  }

  private async populateNetworkDbsAsync(): Promise<NetworkDb[]> {
    console.log("Populating Networks from db");
    console.log("Service ID:");
    console.log(this.serviceId);
    // TODO: HANDLE UNSUPPORTED NETWORKS
    const networksFromDb = await fetchNetworks();
    if (networksFromDb) {
      this.NetworkDbs = networksFromDb;
    } else {
      this.NetworkDbs = [];
      return [];
    }
    // populate network dictionary
    const newNetworkDict: { [ticker: string]: NetworkDb } = {};
    networksFromDb.map((n) => {
      newNetworkDict[n.ticker] = n;
    });
    this.TickerToNetworkDbs = newNetworkDict;
    return this.NetworkDbs;
  }

  getSupportedNetworkDbs(): NetworkDb[] {
    return this.NetworkDbs;
    // UNCOMMENT CODE BELOW TO HANDLE UNSUPPORTED NETWORKS;
    // let NetworkDbsResult:NetworkDb[] = [];
    // for(const NetworkDb of this.NetworkDbs){
    //     // filter results based on searchquery
    //     if(NetworkDb.isSupported){
    //         // build NetworkDb object from doc result
    //         NetworkDbsResult.push(NetworkDb);
    //     }
    // }
    // return NetworkDbsResult;
  }

  async searchNetworkDbsAsync(
    searchQuery: string,
    onlySupported?: boolean
  ): Promise<NetworkDb[]> {
    // set default to false if not specified
    if (onlySupported == undefined) {
      onlySupported = false;
    }
    // TODO: update to be if null or empty
    if (searchQuery == "") {
      if (onlySupported) {
        return this.getSupportedNetworkDbs();
      } else {
        return this.NetworkDbs;
      }
    }
    // standardize search query
    searchQuery = searchQuery.toUpperCase();
    // initialize NetworkDbs list
    let NetworkDbsResult: NetworkDb[] = [];
    if (onlySupported) {
      this.NetworkDbs.forEach((NetworkDb) => {
        // filter results based on searchquery
        if (
          (NetworkDb.ticker.toUpperCase().includes(searchQuery) ||
            NetworkDb.fullName.toUpperCase().includes(searchQuery)) &&
          NetworkDb.isSupported
        ) {
          // build NetworkDb object from doc result
          NetworkDbsResult.push(NetworkDb);
        }
      });
    } else {
      this.NetworkDbs.forEach((NetworkDb) => {
        // filter results based on searchquery
        if (
          NetworkDb.ticker.toUpperCase().includes(searchQuery) ||
          NetworkDb.fullName.toUpperCase().includes(searchQuery)
        ) {
          // build NetworkDb object from doc result
          NetworkDbsResult.push(NetworkDb);
        }
      });
    }
    return NetworkDbsResult;
  }

  getAllNetworkDbs(onlySupported: boolean = true): NetworkDb[] {
    if (this.serviceState != ServiceState.started)
      throw "Service is not running. NetworkDb data has not been populated.";
    if (onlySupported) {
      return this.getSupportedNetworkDbs();
    } else {
      return this.NetworkDbs;
    }
  }

  getAllTokens(onlySupported: boolean = true): TokenDb[] {
    if (this.serviceState != ServiceState.started) {
      throw "Service is not running. NetworkDb data has not been populated.";
    }
    // update to respect onlySupported request
    // currently assuming all tokens in service are supported
    return this.tokenDbs;
  }

  // send rpc call given a NetworkDb
  async sendRpcCall(
    payload: {
      method: string;
      params: any[];
    },
    provider: StaticJsonRpcProvider | null = null
  ): Promise<any> {
    return (provider || this.web3Provider)?.send(
      payload.method,
      payload.params
    );
  }

  // helper functions!!
  async getKryptikProviderForNetworkDb(
    networkDb: NetworkDb
  ): Promise<KryptikProvider> {
    return this.getKryptikProviderFromTicker(networkDb.ticker);
  }

  private async getKryptikProviderFromTicker(
    ticker: string
  ): Promise<KryptikProvider> {
    // try to get existing provider (set on construction)... else, make provider and add to dict.
    if (this.networkProviders[ticker] != null)
      return this.networkProviders[ticker];
    let newKryptikProvider: KryptikProvider =
      this.setProviderFromTicker(ticker);
    return newKryptikProvider;
  }

  getNetworkDbByTicker(ticker: string): NetworkDb | null {
    let networkDbRes: NetworkDb = this.TickerToNetworkDbs[ticker];
    if (networkDbRes) return networkDbRes;
    return null;
  }

  getNetworkDbById(id: number): NetworkDb | null {
    let networkDbRes: NetworkDb | undefined = this.NetworkDbs.find(
      (n) => n.id == id
    );
    if (networkDbRes) return networkDbRes;
    return null;
  }

  getNetworkDbByBlockchainId(id: string): NetworkDb | null {
    const networkDbRes: NetworkDb | null =
      this.NetworkDbs.find(
        (nd) => nd.blockchainId.toLowerCase() == id.toLowerCase()
      ) || null;
    return networkDbRes;
  }

  // creates and returns an erc20 contract
  createERC20Contract = async (
    params: CreateEVMContractParameters
  ): Promise<Contract | null> => {
    // hdseedloop compatible network
    let network = networkFromNetworkDb(params.networkDb);
    let provider = await this.getKryptikProviderForNetworkDb(params.networkDb);
    if (!provider.ethProvider) return null;
    let ethProvider: JsonRpcProvider = provider.ethProvider;
    let erc20ContractData: TokenContract | null = getContractByNetwork(
      params.networkDb,
      params.erc20Db
    );
    if (!erc20ContractData) return null;
    let erc20Contract = new Contract(erc20ContractData.address, erc20Abi);
    let contractConnected = erc20Contract.connect(ethProvider);
    return contractConnected;
  };
}

export default Web3Service;
