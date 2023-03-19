import Head from "next/head";
import { useKryptikThemeContext } from "./ThemeProvider";
import Navbar from "./navbars/Navbar";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

// TODO: Update to support dynamic headers
export default function Layout({ children }) {
  const { isDark } = useKryptikThemeContext();
  return (
    <div
      className={`min-h-screen ${isDark ? "dark" : ""} ${
        isDark ? "bg-[#0c0c0c]" : "bg-white"
      }`}
    >
      <Head>
        <title>SWORD Demo</title>
        <meta
          name="description"
          content="SWORD is a novel way to manage private keys online."
        />
        <link rel="icon" href="/pixelated sword icon.png" />
      </Head>
      <Toaster />

      <main className={`px-4 mx-auto`}>
        <Navbar></Navbar>
        {children}
      </main>
    </div>
  );
}
