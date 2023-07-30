import React, { useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

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
      const success = await invoke("get_os", { name: osName }); // Pass 'name' key with 'osName' value
      console.log(success);
    } catch (error) {
      console.error(error);
    }
  }

  async function is_process_running() {
    try {
      const is_process_running = await invoke("is_process_running", {
        name: "zoom",
      });
      if(is_process_running){
        const isMinimized = await appWindow.isMinimized();
if(isMinimized){await appWindow.unminimize();}
      }
    
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    give_os();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { 

      // Call the async function every 5 seconds
  
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
