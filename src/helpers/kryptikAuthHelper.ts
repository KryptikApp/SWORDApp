// helps with integrating web3service into app. context
import { useEffect, useRef, useState } from "react";
import SignClient from "@walletconnect/sign-client";

import { defaultWallet } from "../models/defaultWallet";
import { UserDB } from "../models/user";
import Web3Service from "../services/Web3Service";
import { IWallet, WalletStatus } from "../models/KryptikWallet";
import { ConnectWalletLocalandRemote } from "./wallet";
import { NetworkDb } from "../services/models/network";
import { getActiveUser, updateProfile } from "./user";
import { handleApprove, logout } from "./auth";
import { updateVaultName } from "../handlers/wallet/vaultHandler";
import HDSeedLoop, { NetworkFromTicker } from "hdseedloop";

export function useKryptikAuth() {
  //create service
  let initServiceState: Web3Service = new Web3Service();
  // init state
  const [kryptikService, setKryptikService] = useState(initServiceState);
  const [kryptikWallet, setKryptikWallet] = useState(defaultWallet);
  const [walletStatus, setWalletStatus] = useState(defaultWallet.status);
  const [authUser, setAuthUser] = useState<UserDB | null>(null);
  const [loadingAuthUser, setLoadingAuthUser] = useState<boolean>(false);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);
  const [walletConnectInitialized, setWalletConnectInitialized] =
    useState(false);
  const authWorker = useRef<Worker>();

  // update standard firestore user's profile
  async function updateCurrentUserKryptik(user: UserDB) {
    console.log("Updatiing user profile...");
    try {
      await updateProfile(user);
    } catch (e) {
      console.warn("Unable to update profile");
    }
  }

  const updateWalletStatus = function (newWalletStatus: WalletStatus) {
    kryptikWallet.status = newWalletStatus;
    setWalletStatus(newWalletStatus);
  };

  // sign in with external auth token
  // TODO: UPDATE TO REMOVE DEPENDANCY ON EMAIL
  async function signInWithToken(
    token: string,
    email: string,
    seed?: string
  ): Promise<boolean> {
    const approved = await handleApprove(email, token);
    if (!approved) return false;
    setLoadingAuthUser(true);
    const user: UserDB | null = await getActiveUser();
    setAuthUser(user);
    if (!user) {
      console.log("No user available. Running clear...");
      clear();
      return false;
    }
    // begin update, but don't wait...
    updateAuthContext(user, seed);
    return true;
  }

  async function refreshUserAndWallet() {
    const user: UserDB | null = await getActiveUser();
    if (!user) {
      console.log("No user available.");
      return;
    } else {
      updateAuthContext(user);
    }
  }

  const updateAuthContext = async (user: UserDB, seed?: string) => {
    // update loading state
    setLoadingAuthUser(true);
    setLoadingWallet(true);
    const formattedUser: UserDB = user;
    // start web3 kryptik service
    const ks = await kryptikService.StartSevice();
    setKryptikService(ks);
    let newWalletKryptik: IWallet;
    // get networks to add to seedloop
    const networksToAdd: NetworkDb[] = ks.getAllNetworkDbs(true);
    const uid: string = formattedUser.uid;
    // migrate legacy vault versions
    updateVaultName(formattedUser);
    // connect with provided seed
    if (seed && seed != "") {
      const connectionObject = await ConnectWalletLocalandRemote({
        uid: uid,
        seed: seed,
        networksToAdd: networksToAdd,
      });
      newWalletKryptik = connectionObject.wallet;
    }
    // otherwise new seed will be generated
    else {
      const connectionObject = await ConnectWalletLocalandRemote({
        uid: uid,
        networksToAdd: networksToAdd,
      });
      newWalletKryptik = connectionObject.wallet;
    }
    // set data
    setKryptikWallet(newWalletKryptik);
    setWalletStatus(newWalletKryptik.status);
    setAuthUser(formattedUser);
    setLoadingAuthUser(false);
    setLoadingWallet(false);
  };

  function updateWallet(seedloop: HDSeedLoop) {
    if (!authUser) return;
    // get primary ethereum addreses for kryptik wallet
    let ethNetwork = NetworkFromTicker("eth");
    let etheAddysAll = seedloop.getAddresses(ethNetwork);
    let ethAddyFirst = etheAddysAll[0];

    let newWalletStatus: WalletStatus = seedloop.getIsLocked()
      ? WalletStatus.Locked
      : WalletStatus.Connected;

    // set values for new wallet
    let newKryptikWallet: IWallet = new IWallet({
      ...defaultWallet,
      walletProviderName: "kryptik",
      status: newWalletStatus,
      seedLoop: seedloop,
      resolvedEthAccount: { address: ethAddyFirst, isResolved: false },
      uid: authUser.uid,
    });
    setKryptikWallet(newKryptikWallet);
    setWalletStatus(WalletStatus.Connected);
  }

  function signOut() {
    logout().then(() => {
      clear();
    });
  }

  // clear current kryptik web 3 service state
  const clear = () => {
    setAuthUser(null);
    setKryptikWallet(defaultWallet);
    setKryptikService(new Web3Service());
    setWalletStatus(defaultWallet.status);
    setLoadingAuthUser(false);
    setLoadingWallet(false);
  };

  useEffect(() => {
    // add auth web worker
    authWorker.current = new Worker(new URL("/authWorker.ts", import.meta.url));

    // should fire once upon refresh
    authWorker.current.onmessage = (event: MessageEvent<boolean>) => {
      if (event.data) {
        refreshUserAndWallet();
      }
    };
    // run balance refresh every 5 minutes... disabled for now
    // TODO: FIX CALLBACK ERROR
    // setInterval(refreshBalances, 300000);
  }, []);

  return {
    authUser,
    loadingAuthUser,
    loadingWallet,
    refreshUserAndWallet,
    signInWithToken,
    updateCurrentUserKryptik,
    signOut,
    kryptikService,
    kryptikWallet,
    walletStatus,
    updateWalletStatus,
    updateWallet,
    clear,
  };
}
