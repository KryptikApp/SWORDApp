import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { KryptikAuthProvider } from "../components/KryptikAuthProvider";
import { KryptikThemeProvider } from "../components/ThemeProvider";
import { useEffect } from "react";
import "highlight.js/styles/github-dark-dimmed.css";

function MyApp({ Component, pageProps, router }: AppProps) {
  const handleOffline = function () {
    router.push("../status/offline");
  };

  const addOfflineHandler = function () {
    // handle if offline
    if (!window.navigator.onLine) {
      handleOffline();
    }
    // add connection handler
    window.addEventListener("offline", () => handleOffline());
  };

  useEffect(() => {
    // on page load... add offline handler to DOM
    addOfflineHandler();
  }, []);
  return (
    <KryptikAuthProvider>
      <KryptikThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </KryptikThemeProvider>
    </KryptikAuthProvider>
  );
}

export default MyApp;
