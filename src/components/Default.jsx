import React,{useEffect} from 'react';
// import { Command} from '@tauri-apps/api/shell';
import { invoke } from "@tauri-apps/api/tauri";

const Default = () => {

  function convertPath(inputString) {
    // Replace backslashes with forward slashes
    // let convertedString = inputString.replace(/\\/g, '/');
  
    // Find the last occurrence of '/' and remove everything after it (including '.exe')
    // const lastSlashIndex = convertedString.lastIndexOf('/');
    const lastSlashIndex = convertedString.lastIndexOf('\\');
    if (lastSlashIndex !== -1) {
      convertedString = convertedString.substring(0, lastSlashIndex);
    }
  
    // Remove '.exe' if present at the end
    convertedString = convertedString.replace(/\.exe$/i, '') ;
  
    return convertedString;
  }
    
async function is_process_running() {
    try {
     const success= await invoke("is_process_running", { name: "zoom" }); 
     const path_to_exe= await invoke("get_exe_path"); 
// const directory_path=convertPath(path_to_exe);
     const success1= await invoke("set_auto_launch", { appName: "spoolapp" ,appPath:path_to_exe,enable:true}); 
     console.log(success,path_to_exe,success1)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    is_process_running();
  }, []);
  return <button onClick={is_process_running}>Open Command Prompt</button>;
};

export default Default;
