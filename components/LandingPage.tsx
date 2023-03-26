import type { NextPage } from "next";

import { useKryptikAuthContext } from "../components/KryptikAuthProvider";
import BrandLandingPage from "./landings/BrandLandingPage";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { defaultUser } from "../src/models/user";
import AccountsCard from "./wallet/AccountsCard";

const LandingPage: NextPage = () => {
  const router = useRouter();
  const { authUser, loadingAuthUser, loadingWallet } = useKryptikAuthContext();

  // useEffect(()=>{
  //   if(!loading && kryptikWallet.connected){
  //     router.push("/wallet")
  //   }
  // }, [loading])

  return (
    <div>
      <div className="dark:text-white">
        {loadingAuthUser ||
        loadingWallet ||
        (authUser && authUser != defaultUser) ? (
          <AccountsCard />
        ) : (
          <BrandLandingPage />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
