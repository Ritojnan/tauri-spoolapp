# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
// import { appWindow } from "@tauri-apps/api/window";
// appWindow.listen("my-window-event", ({ event, payload }) => { });

import { appWindow, LogicalSize } from '@tauri-apps/api/window';
document.getElementById('btn-test').addEventListener('click',async()=>{appWindow.setMaxSize(new LogicalSize(1000, 500));})

function setWindowSize(width, height) {
  window.__TAURI__.invoke('setWindowSize', { width, height });
}

// Example usage:
setWindowSize(800, 600); // Set window size to 800x60

import reactLogo from "./assets/react.svg";

 {/* 
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} classNameName="logo react" alt="React logo" />
        </a> */}


        "tasklist /fi \"IMAGENAME eq ZOOM.EXE\" /FO CSV /NH /V"

        "tasklist /fi \"IMAGENAME eq ZOOM.EXE\" /FO CSV /NH /V"



        # Image Resizer

Electron application that allows you to select an image and easily change the width and/or height.

<div style="display: flex; justify-content: center">
<img src="./assets/screen.png" width="400" />
</div>

## Usage

Install dependencies:

```bash

npm install
```

Run:

```bash
npm start
```

You can also use `Electronmon` to constantly run and not have to reload after making changes

```bash
npx electronmon .
```

## Packaging

There are multiple ways to package Electron apps. I would suggest [Electron Forge](https://www.electronforge.io/). I did not implement any packaging into this app.

## Developer Mode

If your `NODE_ENV` is set to `development` then you will have the dev tools enabled and available in the menu bar. It will also open them by default.

When set to `production`, the dev tools will not be available.