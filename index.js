"use strict";
require('./src/core/global');

const {version} = require("./package.json");
const {app, BrowserWindow, ipcMain, Tray, Menu, shell , clipboard} = require('electron');
const electronLogger = require('electron-log');
const {autoUpdater} = require("electron-updater");
const instanceLock = app.requestSingleInstanceLock();

// 區域宣告
let isQuiting;

const $ = {
    closeApp: function(){
      if(pid){
          process.kill(pid);
          pid = 0;
      }
    //   set.closetimer();
      app.quit();
      process.exit();
    },
    taskbar: async function(win){
        let type = (process.platform == "darwin")?'png':'ico';

        taskbar_tray = new Tray(path.join(__dirname,'./src/resource/img/ml-logo.'+type));
        const contextMenu = Menu.buildFromTemplate([
          {
            icon: path.join(__dirname,'./src/resource/img/ml-logo-taskbar.png'),
            label: `Mjolnir League v.${version}`,
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Github', click: function () {
              shell.openExternal("https://github.com/yomisana");
              shell.openExternal("https://github.com/Yomisana/Mjolnir-League");
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit Mjolnir League', click: function () {
              $.closeApp();
            }
          }
        ]);
        //taskbar_tray.setToolTip(`Mjolnir League v.${version}`);
        taskbar_tray.setToolTip(`Mjolnir League`);
        taskbar_tray.setContextMenu(contextMenu);

        taskbar_tray.on('click', () => {
          win.show();
        });
    },
    showMessage: function(window, message, type, title){
      dialog.showMessageBoxSync(window, {
          message: message,
          type: type,
          title: title
      });
    }
}