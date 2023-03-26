import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useKryptikAuthContext } from "../../components/KryptikAuthProvider";
import toast, { Toaster } from "react-hot-toast";
import Divider from "../../components/Divider";
import { useKryptikThemeContext } from "../../components/ThemeProvider";
import Link from "next/link";
import NavProfile from "../../components/navbars/NavProfile";
import { defaultUser } from "../../src/models/user";
import { WalletStatus } from "../../src/models/KryptikWallet";

const Settings: NextPage = () => {
  const { authUser, signOut, kryptikWallet } = useKryptikAuthContext();
  const { updateIsDark, isDark } = useKryptikThemeContext();
  const [updateVisibleLoading, setUpdateVisibleLoading] = useState(false);
  const router = useRouter();

  const handleLogout = function () {
    try {
      signOut();
      router.push("/");
    } catch (e) {
      toast.error("Unable to sign out. Please contact support.");
    }
  };

  return (
    <div>
      <div className="h-[2rem]">
        {/* padding div for space between top and main elements */}
      </div>

      <div className="lg:px-[30%]">
        <h1 className="text-4xl font-bold sans mb-5 dark:text-white">
          Settings
        </h1>
        <Divider />
        <p className="mb-2 text-justify text-green-500 dark:text-green-600">
          Your wallet settings will be managed on this page.
        </p>

        {/* dark mode stereo */}

        <div className="hover:bg-gray-100 hover:dark:bg-[#141414] py-4 rounded px-1">
          <h1 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-1 text-left">
            Theme
          </h1>

          <div className="flex mb-2">
            <div
              className="form-check form-check-inline"
              onClick={() =>
                updateIsDark(false, authUser ? authUser.uid : defaultUser.uid)
              }
            >
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-[#F2FBFE] checked:bg-sky-500 checked:border-sky-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadioLight"
                value="light"
                onChange={() => {}}
                checked={isDark ? false : true}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-slate-200"
                htmlFor="inlineRadioLight"
              >
                Light
              </label>
            </div>

            <div
              className="form-check form-check-inline ml-4"
              onClick={() =>
                updateIsDark(true, authUser ? authUser.uid : defaultUser.uid)
              }
            >
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-[#F2FBFE] checked:bg-sky-500 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadioDark"
                value="dark"
                onChange={() => {}}
                checked={isDark ? true : false}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-slate-200"
                htmlFor="inlineRadioDark"
              >
                Dark
              </label>
            </div>
          </div>
          <p className="text-slate-500 text-sm">
            Switch between stealthy night mode and <em>clean as a dream</em>{" "}
            light mode.
          </p>
        </div>

        <Divider />
        <button
          onClick={() => handleLogout()}
          className="bg-transparent hover:bg-red-500 text-black-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-5 dark:text-white"
        >
          Logout
        </button>
        <br />
        <Link href="../wallet/delete">
          <p className="text-red-500 mb-4 text-sm hover:cursor-pointer">
            Delete Wallet
          </p>
        </Link>
      </div>

      <div className="h-[7rem]">
        {/* padding div for space between top and main elements */}
      </div>
      <NavProfile />
    </div>
  );
};

export default Settings;
