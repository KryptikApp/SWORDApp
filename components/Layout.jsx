import Head from "next/head";
import { useKryptikThemeContext } from "./ThemeProvider";
import Navbar from "./navbars/Navbar";
import { Toaster } from "react-hot-toast";
import AccountsCard from "./wallet/AccountsCard";

// TODO: Update to support dynamic headers
export default function Layout({ children }) {
  const { isDark } = useKryptikThemeContext();
  return (
    <>
      <Head>
        <title>SWORD Demo</title>
        <meta
          name="description"
          content="SWORD is a novel way to manage private keys online."
        />
        <link rel="icon" href="/pixelated sword icon.png" />
      </Head>
      <Toaster />

      <main
        className={`min-h-screen ${isDark ? "dark" : ""} ${
          isDark ? "bg-[#0c0c0c]" : "bg-[#F2FBFE]"
        } px-4`}
      >
        <Navbar />
        {children}
        <div className="min-h-[10vh] md:min-h-0"></div>
      </main>
    </>
  );
}
