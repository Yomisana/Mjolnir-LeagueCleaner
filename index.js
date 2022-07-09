"use strict";
require('./src/core/global');

const {version} = require("./package.json");
// const set = require('./src/core/index');
const {app, BrowserWindow, ipcMain, Tray, Menu, shell , clipboard} = require('electron');
const instanceLock = app.requestSingleInstanceLock();
const electronLogger = require('electron-log');
const {autoUpdater} = require("electron-updater");
const fs = require('fs-extra');
const path = require('path');
const fsutil = require("nodejs-fs-utils");

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
    taskbar: function(){
        let type = (process.platform == "darwin")?'png':'ico';

        taskbar_tray = new Tray(path.join(__dirname,'./src/resource/img/taskbar/mlc-taskbar-32.'+type)); //MAX 32 MIN 16
        const contextMenu = Menu.buildFromTemplate([
          {
            icon: path.join(__dirname,'./src/resource/img/taskbar/mlc-taskbar-contextmenu-16.png'), // 16 {右鍵後裡面的}
            label: `Mjolnir League Cleaner v.${version}`,
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Github', click: function () {
              shell.openExternal("https://github.com/yomisana");
              shell.openExternal("https://github.com/Yomisana/Mjolnir-LeagueCleaner");
            }
          },
          {
            type: 'separator'
          },
          {
            label: `Clean log (${logstorage.storage} ${logstorage.type})`, click: function () {
              $.cleanlog();
              console.log(`[INFO] 已經清除了 ${logstorage.storage} ${logstorage.type} 記錄檔了`);
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit Mjolnir League Cleaner', click: function () {
              $.closeApp();
            }
          }
        ]);
        //taskbar_tray.setToolTip(`Mjolnir League v.${version}`);
        taskbar_tray.setToolTip(`Mjolnir League Cleaner`);
        taskbar_tray.setContextMenu(contextMenu);
        // console.log(contextMenu.items[4].label);
        taskbar_tray.on('click', async ()=>{
          await $.calculatestorage();
          const contextMenu = Menu.buildFromTemplate([
            {
              icon: path.join(__dirname,'./src/resource/img/taskbar/mlc-taskbar-contextmenu-16.png'), // 16 {右鍵後裡面的}
              label: `Mjolnir League Cleaner v.${version}`,
              enabled: false
            },
            {
              type: 'separator'
            },
            {
              label: 'Github', click: function () {
                shell.openExternal("https://github.com/yomisana");
                shell.openExternal("https://github.com/Yomisana/Mjolnir-LeagueCleaner");
              }
            },
            {
              type: 'separator'
            },
            {
              label: `Clean log (${logstorage.storage} ${logstorage.type})`, click: function () {
                $.cleanlog();
                console.log(`[INFO] 已經清除了 ${logstorage.storage} ${logstorage.type} 記錄檔了`);
              }
            },
            {
              type: 'separator'
            },
            {
              label: 'Quit Mjolnir League Cleaner', click: function () {
                $.closeApp();
              }
            }
          ]);
          taskbar_tray.setContextMenu(contextMenu);
        });
    },
    showMessage: function(window, message, type, title){
      dialog.showMessageBoxSync(window, {
          message: message,
          type: type,
          title: title
      });
    },
    calculatestorage:function(){
        return new Promise((resolve,reject)=>{
          fsutil.fsize(path.join(log_dir), {
            countFolders: false
          }, function (err, size) {
              logstorage.storage = null; logstorage.type = "null";
              // console.log(size); // bytes : 1024 bytes = 1KB
              logstorage.storage = (size / 1024).toFixed();
              logstorage.type = "KB";
              if(logstorage.storage >= 1024){ // 1024 KB
                let kbtomb = logstorage.storage
                logstorage.storage = (kbtomb / 1024).toFixed();
                logstorage.type = "MB";
                if(logstorage.storage >= 1024){ // 1024 KB
                  let mbtogb = logstorage.storage
                  logstorage.storage = (mbtogb / 1024).toFixed();
                  logstorage.type = "GB";
                }
              }
              // console.log(`${(size / 1024).toFixed()}`);
              console.log(`log folder size: ${logstorage.storage} ${logstorage.type}`);
              resolve(true);
          });
        });
    },
    cleanlog: function(){
      fs.readdir(path.join(log_dir), async (err, files) => {
        if (err) {
          console.error("[ERROR - Clean log] "+err);
        }
        for (const file of files) {
          fs.unlink(path.join(log_dir, file), err => {
            if (err) {
              console.error("[ERROR - Ready Clean log] "+err);
            }
          });
        }
        // update tray contextMenu
        await $.calculatestorage();
        const contextMenu = Menu.buildFromTemplate([
          {
            icon: path.join(__dirname,'./src/resource/img/taskbar/mlc-taskbar-contextmenu-16.png'), // 16 {右鍵後裡面的}
            label: `Mjolnir League Cleaner v.${version}`,
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: 'Github', click: function () {
              shell.openExternal("https://github.com/yomisana");
              shell.openExternal("https://github.com/Yomisana/Mjolnir-LeagueCleaner");
            }
          },
          {
            type: 'separator'
          },
          {
            label: `Clean log (${logstorage.storage} ${logstorage.type})`, click: function () {
              $.cleanlog();
              console.log(`[INFO] 已經清除了 ${logstorage.storage} ${logstorage.type} 記錄檔了`);
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit Mjolnir League Cleaner', click: function () {
              $.closeApp();
            }
          }
        ]);
        taskbar_tray.setContextMenu(contextMenu);
      });
    }
}

app.whenReady().then(() => {
    locate = app.getLocale();
    software_version = `${version}`;
    mlc_splash = new BrowserWindow({
      title: splash_set.title,
      icon: window_icon,
      autoHideMenuBar: true,
      backgroundColor: window_BackgroundColor,
      width: splash_set.width, height: splash_set.height,
      minWidth: splash_set.min_width, minHeigh: splash_set.min_width,
      maxWidth: splash_set.max_width, maxHeight: splash_set.max_height,
      transparent: true,
      titleBarStyle: 'hiddenInset',
      frame: false,
      show: false,
      webPreferences:{
          devTools: false,
          fullscreenBoolean: false,
          fullscreenableBoolean: false,
          simpleFullscreenBoolean: false,
          preload: __dirname + "/preload.js"
      }
    });

    mlc_splash.loadFile('src/resource/html/mlc_splash.html');
    mlc_splash.setMenu(null);
    mlc_splash.center();

    mlc_splash.once('ready-to-show', async () => {
      mlc_splash.show();

      if(app.isPackaged){
          autoUpdater.checkForUpdatesAndNotify();
      }
      else{
          let starterTimer = setInterval(()=>{
            if(mainWindowReady){
              clearInterval(starterTimer);
              //mlc_main.show();
              mlc_splash.close();
            }
          },100);
      }
    });

    //主畫面
    mlc_main = new BrowserWindow
    ({
      title: main_set.title,
      icon: window_icon,
      autoHideMenuBar: true,
      //resizable: false,
      width: main_set.width, height: main_set.height,
      minWidth: main_set.min_width,
      minHeight: main_set.min_height,
      //maxWidth: main_set.max_width, maxHeight: main_set.max_height,
      titleBarStyle: 'hiddenInset',
      frame: true,
      show: false,
      webPreferences: {
          devTools: false,
          fullscreenBoolean: false,
          fullscreenableBoolean: false,
          simpleFullscreenBoolean: false,
          nodeIntegration: true,
          contextIsolation: true,
          enableRemoteModule: false, // turn off remote
          preload: __dirname + "/preload.js" // use a preload script
      }
    });

    mlc_main.setMenu(null);
    mlc_main.loadFile('src/resource/html/mlc_main.html');

    mlc_main.once('ready-to-show', async () => {
      console.log("[INFO] 版本: ", software_version);
      console.log(`[INFO] 主畫面渲染完畢`);
      mainWindowReady = true;
      await $.calculatestorage();
      $.taskbar();
      require('./src/core/permission');
    });

    // 主畫面最小化時
    mlc_main.on('minimize', (event) => {
      //if(pid)
      event.preventDefault();
      mlc_main.hide();
    });

      // 主畫面將要關閉時
    mlc_main.on('close', (event) => {
      if (!isQuiting) {
        event.preventDefault();
        mlc_main.hide();
        event.returnValue = false;
      }
    });
});

// 單一處理程序鎖定，有兩個以上的處理程序時，強制關閉最後開啟的那個
if(!instanceLock)
  $.closeApp();
else{
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 如果啟動第二個處理程序，則將原先啟動的那個彈出來並聚焦
    if (mlc_main) {
      if (mlc_main.isMinimized()) mlc_main.restore();
      mlc_main.focus();
    }
  });
}

// log
if(!fs.existsSync(path.join(log_dir)))
    fs.mkdirSync(path.join(log_dir),{ recursive: true });


// autoUpdater
autoUpdater.logger = electronLogger;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('checking-for-update', () => {
    console.log('[INFO] Checking for update...');
    mlc_splash.webContents.send('update_status','Checking for updates...');
})

autoUpdater.on('update-available', (info) => {
  console.log('[INFO] Update available.');
  mlc_splash.webContents.send('update_status','Preparing download...');
})

autoUpdater.on('update-not-available', (info) => {
  console.log('[INFO] Update is latest.');
  let starterTimer = setInterval(()=>{
    if(mainWindowReady){
      clearInterval(starterTimer);
      // mlc_main.show();
      mlc_splash.close();
    }
  },100);
})

autoUpdater.on('error', (err) => {
  console.warn('[WARN] Error in auto-updater. ' + err);
  mlc_splash.webContents.send('update_status','Update error');
  //Error in auto-updater. HttpError: 500
  let reg = RegExp(/HttpError: 500/);
  if(reg.exec(err)){
    $.showMessage(lh_splash,"Updater Error 500 - Github have some issue\n Tips: This time Update is skip.","error", software_name + " - Updater error");
  }
  //$.closeApp();
})

autoUpdater.on('download-progress', (progressObj) => {
  let percent = progressObj.percent.toFixed(0);
  console.log('[INFO] Download progress:' + percent + '%');
  mlc_splash.webContents.send('update_status','Downloading... '+ percent + '%');
  mlc_splash.webContents.send('update_percent',percent);
})
autoUpdater.on('update-downloaded', (info) => {
  console.log('[INFO] Restarting  Mjolnir League then Installing update.');
  mlc_splash.webContents.send('update_status','Restarting Mjolnir League Installing update...');
});
// 更新檔下載完畢後 過 x 秒 關閉軟體更新後重啟軟體
autoUpdater.on('update-downloaded', (ev, info) => {
  autoUpdater.quitAndInstall(false, true); // isSilent: false, isForceRunAfter: true
})
