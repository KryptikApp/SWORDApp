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
        <Link href="../guide">
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
        <Link href="../research">
          <span
            className={`p-2 lg:px-4 md:mx-2 text-gray-400 md:text-center border border-transparent rounded hover:text-white hover:cursor-pointer hover:bg-blue-400 dark:hover:text-black transition-colors duration-300 ${
              router.pathname == "/explore" ? "font-bold" : ""
            }`}
          >
            Research
          </span>
        </Link>
      </MenuItem>

      {authUser && walletStatus != WalletStatus.Connected && (
        <MenuItem>
          <Link href="../profile/settings">
            <span
              className={`p-2 lg:px-4 md:mx-2 text-gray-400 rounded hover:bg-gray-200 hover:cursor-pointer hover:text-gray-700 dark:hover:bg-gray-100 dark:hover:text-black transition-colors duration-300 ${
                router.pathname == "/about" ? "font-bold" : ""
              } `}
            >
              Settings
            </span>
          </Link>
        </MenuItem>
      )}

      {/* show disconnect button if connected and vise versa */}
      {authUser ? (
        walletStatus == WalletStatus.OutOfSync && (
          <MenuItem>
            <Link href="../sync">
              <span
                className={`p-2 lg:px-4 md:mx-2 text-blue-500 md:text-center md:border md:border-solid border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-300 rounded hover:bg-blue-500 hover:cursor-pointer hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1`}
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
              className={`p-2 lg:px-4 md:mx-2 text-blue-500 md:text-center md:border md:border-solid border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-300 rounded-lg hover:bg-blue-500 hover:cursor-pointer hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1`}
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
