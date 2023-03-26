import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

// wallet SDK helpers
import { useKryptikAuthContext } from "../KryptikAuthProvider";
import { WalletStatus } from "../../src/models/KryptikWallet";
import Menu, { MenuItem } from "../menu/menu";

const NavbarProduction: NextPage = () => {
  const { authUser, walletStatus } = useKryptikAuthContext();
  const router = useRouter();

  return (
    <Menu>
      <MenuItem>
        <Link href="../about">
          <span
            className={`p-2 lg:px-4 md:mx-2 text-gray-400 rounded hover:bg-gray-200 hover:cursor-pointer hover:text-gray-700 dark:hover:bg-gray-100 dark:hover:text-black transition-colors duration-300 ${
              router.pathname == "/about" ? "font-bold" : ""
            } `}
          >
            Guide
          </span>
        </Link>
      </MenuItem>

      <MenuItem>
        <Link href="../blog">
          <span
            className={`p-2 lg:px-4 md:mx-2 text-gray-400 md:text-center border border-transparent rounded hover:text-white hover:cursor-pointer hover:bg-sky-400 dark:hover:text-black transition-colors duration-300 ${
              router.pathname == "/explore" ? "font-bold" : ""
            }`}
          >
            Research
          </span>
        </Link>
      </MenuItem>

      {/* show disconnect button if connected and vise versa */}
      {authUser ? (
        walletStatus == WalletStatus.OutOfSync && (
          <MenuItem>
            <Link href="../sync">
              <span
                className={`p-2 lg:px-4 md:mx-2 text-green-400 md:text-center md:border md:border-solid border-gray-300 dark:border-gray-600 dark:hover:border-sky-200 rounded hover:bg-sky-500 hover:cursor-pointer hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1`}
              >
                Sync Wallet
              </span>
            </Link>
          </MenuItem>
        )
      ) : (
        <MenuItem>
          <Link href="../wallet/create">
            <span
              className={`p-2 lg:px-4 md:mx-2 text-sky-500 md:text-center md:border md:border-solid border-gray-300 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-200 rounded-lg hover:bg-sky-500 hover:cursor-pointer hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1`}
            >
              Live Demo
            </span>
          </Link>
        </MenuItem>
      )}
    </Menu>
  );
};

export default NavbarProduction;
