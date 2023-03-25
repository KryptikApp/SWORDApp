import { NextPage } from "next";
import { useEffect, useState } from "react";
import { WalletStatus } from "../../src/models/KryptikWallet";
import { NetworkDb } from "../../src/services/models/network";
import Divider from "../Divider";
import { useKryptikAuthContext } from "../KryptikAuthProvider";
import NetworkAddress from "./NetworkAddress";

const AccountsCard: NextPage = () => {
  const { kryptikService, loadingWallet, walletStatus } =
    useKryptikAuthContext();
  const [networksToShow, setNetworksToShow] = useState<NetworkDb[]>([]);
  useEffect(() => {
    const newNetworks: NetworkDb[] = kryptikService.getAllNetworkDbs();
    setNetworksToShow(newNetworks);
  }, [loadingWallet]);
  return (
    <div className="m-4 max-w-lg max-h-screen dark:text-white border border-gray-400 dark:border-gray-500 pt-10 pb-20 mx-auto my-auto px-4 rounded rounded-lg bg-[#F2FBFE] dark:bg-[#010F15]">
      <div>
        <p className="text-2xl font-semibold text-center">Accounts</p>
        <Divider />
        <div className="overflow-y-auto max-h-[60vh] no-scrollbar rounded-lg border mx-2">
          {!loadingWallet && walletStatus == WalletStatus.Connected && (
            <div className="flex flex-col space-y-2 mx-auto">
              {networksToShow.map((n) => (
                <NetworkAddress networkDb={n} />
              ))}
            </div>
          )}
        </div>
        {loadingWallet && (
          <p className="text-center text-xl">Loading wallet...</p>
        )}
      </div>
    </div>
  );
};

export default AccountsCard;
