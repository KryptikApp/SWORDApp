import { NextPage } from "next";
import Link from "next/link";
import { AiOutlineLock, AiOutlineSetting, AiOutlineSync } from "react-icons/ai";
import { useKryptikAuthContext } from "../KryptikAuthProvider";

const AccountActions: NextPage = () => {
  const { kryptikWallet } = useKryptikAuthContext();

  return (
    <div className="w-full">
      <div className="flex flex-row space-x-12 mx-auto px-8 w-fit rounded-full border border-2 py-2 bg-[#D8F2FD]">
        <div className="flex flex-col">
          <div className="p-2 rounded-full hover:cursor-pointer text-blue-500 hover:text-blue-600">
            <Link href="../profile/security">
              <AiOutlineLock size={30} />
            </Link>
          </div>
          <p className="text-center text-slate-700 dark:text-slate-200 text-sm">
            {" "}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="border p-2 rounded-full hover:cursor-pointer text-blue-500 hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-800">
            <Link href="../sync">
              <AiOutlineSync size={30} />
            </Link>
          </div>
          <p className="text-center text-slate-700 dark:text-slate-200 text-sm">
            {" "}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="p-2 rounded-full hover:cursor-pointer text-blue-500 hover:text-blue-600">
            <Link href="../profile/settings">
              <AiOutlineSetting size={30} />
            </Link>
          </div>
          <p className="text-center text-slate-700 dark:text-slate-200 text-sm">
            {" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountActions;
