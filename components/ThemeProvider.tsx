import { createContext, useContext } from "react";

import { useKryptikTheme } from "../src/helpers/kryptikThemeHelper";

const kryptikThemeContext = createContext({
  isDark: false,
  themeLoading: true,
  updateIsDark: (newIsDark: boolean, uid: string, persist?: boolean) => {},
});

export function KryptikThemeProvider(props: any) {
  const { value, children } = props;
  const theme = useKryptikTheme();
  return (
    <kryptikThemeContext.Provider value={theme}>
      {children}
    </kryptikThemeContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useKryptikThemeContext = () => useContext(kryptikThemeContext);
