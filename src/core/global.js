"use strict";
const electronLogger = require('electron-log');
const path = require('path');

/*
 *  全區域變數
 */

// electron
global.logstorage = {
    storage: null,
    type: null
}
global.permission = false;
global.taskbar_tray = null; // Windows tray
global.locate = null; // Window locate
global.pid = 0; // Mjolnir League本身的 PID
global.software_version = ""; // Auto
global.software_name = "Mjolnir League Cleaner"
global.main_dir = process.env.APPDATA + '\\.Mjolnir-League-Cleaner\\bin';
global.log_dir = process.env.APPDATA + '\\.Mjolnir-League-Cleaner\\logger';
    // Window
    global.mainWindowReady = false; // 主視窗是否渲染完畢?
    global.window_BackgroundColor = '#fcfcfc';
    global.window_icon = './src/resource/img/icon/mlc-taskbar-32.ico';
    global.mlc_splash = null;
        global.splash_set = {
            width: 460,
            height: 100,
            min_width: 460,
            min_height: 100,
            max_width: 460,
            max_height: 100,
            // general
            title: software_name + " Loading"
        }
    global.mlc_main = null;
        global.main_set = {
            width: 816,
            height: 489,
            min_width: 816,
            min_height: 489,
            max_width: 816,
            max_height: 489,
            // general
            title: software_name
        }
// game setting
global.refresh_check_path_timer = { // check lol client path timer
    open: 1000,
    close: 5000,
} 
    // client found?
    global.client_is_found = false; // main
    global.client_is_notfound = false;
    // game  found?
    global.game_is_found = false; // main
    global.game_is_notfound = false;
    // client path
    global.client_path = null; // ..LeagueClient\LeagueClient.exe
    global.client_dir = null; // ..LeagueClient\
    // client api
    global.is_lockfile_get = false;
    global.lockfile_str = null;
    global.lockfile = null;
    global.client_lockfile = {
        lockfile_name: null,
        lockfile_pid: null,
        lockfile_port: null,
        lockfile_token: "",
        lockfile_method: null,
    }
    global.url_prefix = null;
    global.client_status = ["尋找LOL客戶端中...","找到 LOL 客戶端"];
    // garena found?
    global.garena_is_found = false;
    global.garena_is_notfound = false;
    global.client_cmd = null;
    global.client_active = {
        first_active: null,
        second_active: null,
    }



// Logger
global.nowtimes = function(flags){
    let date = new Date();

    let year = date.getFullYear();
    let month = (date.getMonth() < 10)?'0'+date.getMonth():date.getMonth();
    let day = (date.getDay() < 10)?'0'+date.getDay():date.getDay();

    let hour = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    let minute = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
    let second = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();

    let formatDate = `[${year}-${month}-${day} ${hour}:${minute}:${second}] `;

    return (flags)?new Date().getTime():formatDate;
}

const startTime = nowtimes(true);

electronLogger.transports.file.resolvePath = () => path.join(log_dir, `/mlc-${startTime}.log`);
global.console.log = function(...raw) {
    let ex = new Error().stack.split('\n')[2].trim().split(' ');
    let out = path.parse(ex[ex.length-1].replace('(','').replace(')',''));
    electronLogger.transports.console.format = '{h}:{i}:{s}.{ms} ('+out.base+') > {text}';

    electronLogger.info(raw.join(" "));
};
global.console.warn = function(...raw) {
    let ex = new Error().stack.split('\n')[2].trim().split(' ');
    let out = path.parse(ex[ex.length-1].replace('(','').replace(')',''));
    electronLogger.transports.console.format = '{h}:{i}:{s}.{ms} ('+out.base+') > {text}';

    electronLogger.warn(raw.join(" "));
};
global.console.error = function(...raw) {
    let ex = new Error().stack.split('\n')[2].trim().split(' ');
    let out = path.parse(ex[ex.length-1].replace('(','').replace(')',''));
    electronLogger.transports.console.format = '{h}:{i}:{s}.{ms} ('+out.base+') > {text}';

    electronLogger.error(raw.join(" "));
};