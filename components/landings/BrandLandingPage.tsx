import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import { Press_Start_2P } from "@next/font/google";

import { useKryptikAuthContext } from "../../components/KryptikAuthProvider";
import { useKryptikThemeContext } from "../ThemeProvider";
import { motion } from "framer-motion";
import { RiArrowRightCircleLine } from "react-icons/ri";
import Link from "next/link";

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["cyrillic"] });

// main landing page for those who don't yet have a wallet or are logged out
const BrandLandingPage: NextPage = () => {
  const router = useRouter();
  const { kryptikWallet, authUser, loadingAuthUser } = useKryptikAuthContext();
  const { isDark, themeLoading } = useKryptikThemeContext();

  const handleGetStarted = async () => {
    router.push("/wallet/create");
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto flex flex-col dark:text-white">
        <div className="mx-auto border rounded-xl p-2 mb-6 hover:bg-gray-100 dark:hover:bg-gray-900">
          <motion.div whileHover={{ scale: 1.2, rotateZ: 90 }}>
            <Image
              src={"/pixelated sword icon.png"}
              alt={"Pixelated sword icon."}
              width={55}
              height={55}
              className=""
            />
          </motion.div>
        </div>
        <div className="text-center">
          <h3
            className={`text-xl md:text-2xl ${pixelFont.className} font-bold sans text-gray-800 dark:text-gray-200`}
          >
            SWORD Key Management
          </h3>
          <h1
            className={`text-3xl md:text-5xl mt-8 ${pixelFont.className} font-bold sans dark:text-white leading-normal`}
          >
            The Future of Online{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-400 via-sky-300 to-sky-500 background-animate">
              Ownership
            </span>
          </h1>
          <h1 className="text-xl text-center mt-4 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-500">
            Keeping secrets just got easier. SWORD uses threshold cryptography
            to keep wallets secure. This makes it simple to provide delightful
            user experiences like passwordless authentication.
          </h1>
          <Link href={"/blog/sword"}>
            <div className="mt-4 text-2xl font-semibold text-center text-sky-500">
              <p className="inline">Read the full paper to learn more</p>
              <RiArrowRightCircleLine size={18} className="inline ml-2" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandLandingPage;
