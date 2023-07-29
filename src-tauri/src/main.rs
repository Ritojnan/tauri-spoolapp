// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use sysinfo::{ProcessExt, System, SystemExt};
use auto_launch::*;
use std::env;

#[tauri::command]
fn set_auto_launch(app_name: &str, app_path: &str, enable: bool) {
    let auto = AutoLaunchBuilder::new()
        .set_app_name(app_name)
        .set_app_path(app_path)
        .set_use_launch_agent(true)
        .build()
        .unwrap();

    if enable {
        auto.enable().unwrap();
        println!("Result")
        } else {
        auto.disable().unwrap();
    }
}

#[tauri::command]
fn get_exe_path() -> String {
    match env::current_exe() {
        Ok(exe_path) => exe_path.display().to_string(),
        Err(e) => format!("failed to get current exe path: {}", e),
    }
}

#[tauri::command]
fn is_process_running(name: &str) -> bool {
    let mut system = System::new();

    // Refresh the system data to get the latest process information
    system.refresh_processes();

    // Iterate through the list of processes to check if any process starts with the given name
    for (_pid, process) in system.processes() {
        if process.name().to_lowercase().starts_with(&name.to_lowercase()) {
            return true;
        }
    }

    false
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_os(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,get_os,is_process_running,get_exe_path,set_auto_launch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


// app.on('second-instance', (event, commandLine, workingDirectory) => {
//     // Someone tried to run a second instance, we should focus our window.
// 	console.log("in second instance req");
//     if (mainWindow) {
// 		console.log("Denying new instnace");
//       if (mainWindow.isMinimized()) 
// 		  mainWindow.reelectron_store();
//       mainWindow.focus();
//     }
//   })
  