import React, { useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";

export default function RootLayout() {
  function getOSName() {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("win") !== -1) {
      return "Windows";
    } else if (
      userAgent.indexOf("mac") !== -1 ||
      userAgent.indexOf("darwin") !== -1
    ) {
      return "macOS";
    } else if (userAgent.indexOf("linux") !== -1) {
      return "Linux";
    } else if (userAgent.indexOf("android") !== -1) {
      return "Android";
    } else if (
      userAgent.indexOf("ios") !== -1 ||
      userAgent.indexOf("ipad") !== -1 ||
      userAgent.indexOf("iphone") !== -1
    ) {
      return "iOS";
    } else {
      return "Unknown";
    }
  }

  const osName = getOSName();
  console.log("Operating System:", osName);

  async function give_os() {
    try {
     const success= await invoke("get_os", { name: osName }); // Pass 'name' key with 'osName' value
     console.log(success)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    give_os();
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
