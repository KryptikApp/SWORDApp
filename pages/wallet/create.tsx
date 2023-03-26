import type { NextPage } from "next";

// kryptik imports
import LoginCard from "../../components/auth/LoginCard";
import { useKryptikAuthContext } from "../../components/KryptikAuthProvider";

const CreateWallet: NextPage = () => {
  const { authUser } = useKryptikAuthContext();
  console.log(authUser);

  return (
    <div>
      <div className="h-[15vh]">
        {/* padding div for space between top and main elements */}
      </div>
      <div className="max-w-2xl mx-auto">
        <LoginCard />
        <div className="mt-12 bg-[#F2FBFE] dark:bg-gradient-to-br dark:to-[#0d0d0d] dark:from-[#0c0c0c] max-w-md mx-auto rounded-xl border border-solid dark:border-gray-700 border-gray-200 hover:border-red-200 dark:hover:border-red-800 py-2 px-2">
          <h2 className="text-red-500">Warning</h2>
          <p className="text-slate-500 text-md mt-2">
            This is a demo only. Do not store funds on the demo application. For
            a production wallet, visit{" "}
            <a
              className="hover:cursor-pointer hover:text-sky-500 text-sky-400"
              href={`https://kryptik.app`}
              target="_blank"
              rel="noopener noreferrer"
            >
              kryptik.app
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;
