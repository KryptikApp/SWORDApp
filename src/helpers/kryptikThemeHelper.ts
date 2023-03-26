import { defaultNetworks } from "hdseedloop";
import { useEffect, useState } from "react";
import { useKryptikAuthContext } from "../../components/KryptikAuthProvider";
import { IWallet } from "../models/KryptikWallet";
import { getAddressForNetwork } from "./utils/accountUtils";

export function useKryptikTheme() {
  // init state
  const [isDark, setIsDark] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const [themeLoading, setThemeLoading] = useState(true);
  const { authUser } = useKryptikAuthContext();
  const defaultTheme: ITheme = {
    isAdvanced: false,
    isDark: false,
    isVisible: false,
    hideBalances: false,
    lastUpdated: Date.now(),
  };
  interface ITheme {
    isAdvanced: boolean;
    isDark: boolean;
    isVisible: boolean;
    hideBalances: boolean;
    lastUpdated: number;
  }

  const generateThemeLocation = function (uid: string) {
    let themeLocation = `sword|${uid}|theme`;
    return themeLocation;
  };

  const fetchTheme = function (uid?: string) {
    let theme: ITheme;
    let themeString: string | null = null;
    if (uid) {
      let themeLocation = generateThemeLocation(uid);
      themeString = localStorage.getItem(themeLocation);
    }
    // fetch stored theme
    if (!themeString) {
      theme = defaultTheme;
    } else {
      theme = { ...JSON.parse(themeString) };
    }
    // update state
    setIsDark(theme.isDark);
    setHideBalances(theme.hideBalances);
    if (theme.isAdvanced) {
      setIsAdvanced(theme.isAdvanced);
    }
    if (theme.isVisible) {
      setIsVisible(theme.isVisible);
    }
  };

  const updateIsDark = function (
    newIsDark: boolean,
    uid: string,
    persist: boolean = true
  ) {
    console.log("updating is dark...");
    // update app state
    setIsDark(newIsDark);
    if (persist) {
      let newTheme: ITheme = {
        isAdvanced: isAdvanced,
        isDark: newIsDark,
        isVisible: isVisible,
        hideBalances: hideBalances,
        lastUpdated: Date.now(),
      };
      // update stored theme
      updateTheme(newTheme, uid);
    }
  };

  // updates local storage theme value
  const updateTheme = function (newTheme: ITheme, uid: string) {
    let themeLocation = generateThemeLocation(uid);
    let themeString = JSON.stringify(newTheme);
    localStorage.setItem(themeLocation, themeString);
  };

  useEffect(() => {
    setThemeLoading(true);
    // fetch current theme
    fetchTheme(authUser?.uid);
    setThemeLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setThemeLoading(true);
    // fetch current theme
    fetchTheme(authUser?.uid);
    setThemeLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return {
    isDark,
    updateIsDark,
    themeLoading,
  };
}
