import { NextPage } from "next";
import { useEffect, useState } from "react";
import { WalletStatus } from "../../src/models/KryptikWallet";
import { NetworkDb } from "../../src/services/models/network";
import Divider from "../Divider";
import { useKryptikAuthContext } from "../KryptikAuthProvider";
import AccountActions from "./AcountActions";
import NetworkAddress from "../networks/NetworkAddress";
import NetworkAddressLoader from "../networks/NetworkAddressLoader";

const AccountsCard: NextPage = () => {
  const { kryptikService, loadingWallet, walletStatus } =
    useKryptikAuthContext();
  const [networksToShow, setNetworksToShow] = useState<NetworkDb[]>([]);
  useEffect(() => {
    let newNetworks: NetworkDb[] = kryptikService.getAllNetworkDbs();
    setNetworksToShow(newNetworks);
  }, [loadingWallet]);
  return (
    <div className="max-w-lg max-h-screen hover:border hover:border-blue-500 dark:text-white border border-gray-400 dark:border-gray-500 pt-10 pb-8 mx-auto px-4 my-auto rounded rounded-xl bg-[#E5F6FE] dark:bg-[#010F15]">
      <div>
        <p className="text-2xl font-semibold">Accounts</p>
        <Divider />
        <div
          className={`relative overflow-y-auto max-h-[60vh] no-scrollbar rounded-lg border mx-2`}
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
        </div>
        {!loadingWallet && walletStatus == WalletStatus.Connected && (
          <div className="mt-6">
            <AccountActions />
          </div>
        )}
        {loadingWallet && (
          <div className="mt-6 animate-pulse bg-slate-400 w-[304px] h-[62px] rounded-full mx-auto"></div>
        )}
      </div>
    </div>
  );
};

export default AccountsCard;
