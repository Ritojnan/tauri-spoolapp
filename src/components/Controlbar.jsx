import React from 'react'
import { appWindow } from '@tauri-apps/api/window';


export default function Navbar() {
appWindow.show()
  async function close_window(){
     const hide= await appWindow.hide();
    console.log("hide")
    }

  return (
<>
<div className="custom-frame" id="CustomFrame">
      <div className="title-bar">
        <div className="title">
          <img src="/logo.png" height="25" className="spool-logo"/>
          <p>spoolapp</p>
        </div>
        <div className="window-controls">
          <div className="minimize">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" className="bi bi-dash" viewBox="0 0 16 16">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
        </div>
          <div className="maximize"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="white" className="bi bi-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          </svg></div>
          <div className="close" onClick={close_window}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </div>
        </div>
      </div>
    </div>
    




</>  )
}
