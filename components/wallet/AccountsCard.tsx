import { NextPage } from "next";
import { useEffect, useState } from "react";
import { WalletStatus } from "../../src/models/KryptikWallet";
import { NetworkDb } from "../../src/services/models/network";
import Divider from "../Divider";
import { useKryptikAuthContext } from "../KryptikAuthProvider";
import AccountActions from "./AcountActions";
import NetworkAddress from "../networks/NetworkAddress";
import NetworkAddressLoader from "../networks/NetworkAddressLoader";
import Link from "next/link";

const AccountsCard: NextPage = () => {
  const { kryptikService, loadingWallet, walletStatus } =
    useKryptikAuthContext();
  const [networksToShow, setNetworksToShow] = useState<NetworkDb[]>([]);
  useEffect(() => {
    let newNetworks: NetworkDb[] = kryptikService.getAllNetworkDbs();
    setNetworksToShow(newNetworks);
  }, [loadingWallet]);
  return (
    <div className="max-w-lg max-h-screen hover:border hover:border-blue-500 dark:hover:border-blue-500 dark:text-white border border-gray-400 dark:border-gray-500 pt-10 pb-8 mx-auto px-4 my-auto rounded rounded-xl bg-[#E5F6FE] dark:bg-[#010F15]">
      <div>
        <p className="text-2xl font-semibold">Accounts</p>
        <Divider />
        <div
          className={`relative overflow-y-auto max-h-[60vh] h-[60vh] no-scrollbar rounded-lg border mx-2 dark:border-gray-700`}
        >
          {!loadingWallet && walletStatus == WalletStatus.Connected && (
            <div className="flex flex-col space-y-2 mx-auto">
              {networksToShow.map((n) => (
                <NetworkAddress networkDb={n} key={n.fullName} />
              ))}
            </div>
          )}
          {loadingWallet && (
            <div className="flex flex-col space-y-2 mx-auto">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <NetworkAddressLoader key={n} />
              ))}
            </div>
          )}
          {!loadingWallet && walletStatus == WalletStatus.OutOfSync && (
            <div className="text-center mt-[20vh] px-2">
              <p>Sync wallet to begin.</p>
              <p className="text-gray-500 text-md">
                Connect to your primary device in under 60 seconds.
              </p>
            </div>
          )}
          {!loadingWallet && walletStatus == WalletStatus.Locked && (
            <div className="text-center mt-[20vh] px-2">
              <p>Unlock wallet to begin.</p>
              <p className="text-gray-500 text-md">
                Your password is required to unencrypt your secure vault.
              </p>
            </div>
          )}
        </div>

        {!loadingWallet && walletStatus == WalletStatus.Connected && (
          <div className="mt-6">
            <AccountActions />
          </div>
        )}
        {loadingWallet && (
          <div className="mt-6 animate-pulse bg-slate-400 w-[304px] h-[62px] rounded-full mx-auto"></div>
        )}
        {!loadingWallet && walletStatus == WalletStatus.OutOfSync && (
          <Link href="../sync">
            <div className="mt-6 border border-slate-400 hover:border-blue-400 bg-blue-400 hover:bg-blue-500 text-white w-[304px] h-[62px] rounded-full mx-auto text-center">
              <p className="mt-[14px] text-xl font-semibold">Sync</p>
            </div>
          </Link>
        )}
        {!loadingWallet && walletStatus == WalletStatus.Locked && (
          <Link href="../sync">
            <div className="mt-6 border border-slate-400 hover:border-blue-400 bg-blue-400 hover:bg-blue-500 text-white w-[304px] h-[62px] rounded-full mx-auto text-center">
              <p className="mt-[14px] text-xl font-semibold">Unlock</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AccountsCard;
