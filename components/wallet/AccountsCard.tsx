import { NextPage } from "next";
import Divider from "../Divider";

const AccountsCard: NextPage = () => {
  return (
    <div className="m-4 max-w-xl max-h-screen dark:text-white border border-gray-400 dark:border-gray-500 pt-10 pb-20 mx-auto my-auto px-4 rounded rounded-lg bg-[#F2FBFE] dark:bg-[#010F15]">
      <div>
        <p className="text-2xl font-semibold text-center">Accounts</p>
        <Divider />
      </div>
    </div>
  );
};

export default AccountsCard;
