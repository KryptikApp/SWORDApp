import { NetworkDb } from "@prisma/client";
import { formatAddress, Network, truncateAddress } from "hdseedloop";
import { NextPage } from "next";
import { ColorEnum } from "../../src/helpers/utils";
import { networkFromNetworkDb } from "../../src/helpers/utils/networkUtils";
import Button from "../buttons/Button";
import Divider from "../Divider";
import { useKryptikAuthContext } from "../KryptikAuthProvider";

type Props = {
  networkDb: NetworkDb;
};

const NetworkAddress: NextPage<Props> = (props) => {
  const { networkDb } = { ...props };
  const { kryptikWallet } = useKryptikAuthContext();
  const network: Network = networkFromNetworkDb(networkDb);
  const address = kryptikWallet.seedLoop.getAddresses(network)[0];
  const readableAddress = truncateAddress(address, network);

  return (
    <div
      className="rounded-lg"
      style={{
        backgroundColor: networkDb.hexColor,
        borderColor: networkDb.hexColor,
      }}
    >
      <div
        className="w-full rounded-lg p-2 flex flex-col  bg-white bg-opacity-40 dark:bg-black border border-2"
        style={{
          borderColor: networkDb.hexColor,
        }}
      >
        <div className="flex flex-row space-x-2 px-2">
          <div className="flex-shrink-0 min-w-[48px]">
            <img
              className="w-10 h-10 mt-2 rounded-full"
              src={networkDb.iconPath}
              alt={`${networkDb.fullName} logo`}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-center">
              {networkDb.fullName}
            </p>
            <p className="text-slate-700 dark:text-slate-200 text-lg">
              {readableAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkAddress;
