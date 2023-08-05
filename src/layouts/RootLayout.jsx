import React, { useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

export default function RootLayout() {
  function convertPath(inputString) {
    // Replace backslashes with forward slashes
    // let convertedString = inputString.replace(/\\/g, '/');

    // Find the last occurrence of '/' and remove everything after it (including '.exe')
    // const lastSlashIndex = convertedString.lastIndexOf('/');
    const lastSlashIndex = convertedString.lastIndexOf("\\");
    if (lastSlashIndex !== -1) {
      convertedString = convertedString.substring(0, lastSlashIndex);
    }

    // Remove '.exe' if present at the end
    convertedString = convertedString.replace(/\.exe$/i, "");

    return convertedString;
  }

  async function auto_launch_setup() {
    try {
      const path_to_exe = await invoke("get_exe_path");
      // const directory_path=convertPath(path_to_exe);
      const success1 = await invoke("set_auto_launch", {
        appName: "spoolapp",
        appPath: path_to_exe,
        enable: true,
      });
      console.log(path_to_exe, success1);
    } catch (error) {
      console.error(error);
    }
  }
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

  async function give_os() {
    try {
      const success = await invoke("get_os", { name: getOSName()}); // Pass 'name' key with 'osName' value
      console.log(success);
    } catch (error) {
      console.error(error);
    }
  }

  //if zoom is running and window is minimized
  async function is_process_running() {
    try {
      const is_process_running = await invoke("is_process_running", {
        name: "zoom",
      });
      if (is_process_running) {
        const isMinimized = await appWindow.isMinimized();
        if (isMinimized) {
          await appWindow.unminimize();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    give_os();
    auto_launch_setup();
  }, []);

  //check if zoom is running continuously
  useEffect(() => {
    const interval = setInterval(() => {
      is_process_running();
    }, 5000); // 5000 milliseconds = 5 seconds

    //if any function is written here it will run only once
    //it can run before interval

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []); // The empty dependency array ensures the effect runs only once during component mount

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
