'use strict';
require('./global');

const {app, dialog} = require('electron');
const exec = require('child_process').exec;
const $ = {
    closeApp: function(){
        if(pid){
            process.kill(pid);
            pid = 0;
        }
        app.quit();
        process.exit(1);
    },
    showMessage: function(window, message, type, title){
        dialog.showMessageBoxSync(window, {
            message: message,
            type: type,
            title: title
        });
    },
    check_permission: function(){
        console.log("[INFO] 檢查權限中...");
        exec('NET SESSION', function(err,so,se) {
            if(se.length === 0){
                console.log("[INFO] 以管理員權限執行了!");
                // mlc_main.webContents.send("software_version", software_version);
                // mlc_main.webContents.send("admin_permission", "管理員權限");
                // $.showMessage(mlc_main,"以管理員權限執行!","info", software_name + " - 以管理員權限執行!");
                require('./index');
                permission = true;
            }else{
                console.warn("[WARN] 沒有以管理員權限執行!");
                $.showMessage(mlc_main,"沒有以管理員權限執行!","error", software_name + " - 請以管理員權限執行!");
                $.closeApp();
                permission = false;
            }
        });
    },
}

$.check_permission();