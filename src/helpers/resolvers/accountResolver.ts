import { NetworkDb } from "../../services/models/network";
import { KryptikProvider } from "../../services/models/provider";

export interface IAccountResolverParams {
  account: string;
  networkDB: NetworkDb;
  kryptikProvider: KryptikProvider;
}

export interface IResolvedAccount {
  address: string;
  isResolved: boolean;
  avatarPath?: string;
  names?: string[];
}

export const defaultResolvedAccount: IResolvedAccount = {
  address: "",
  isResolved: false,
};
