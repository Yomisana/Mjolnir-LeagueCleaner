'use strict';
require('./global');

const check = require('./client');

const find = require('find-process');
const exec = require('child_process').exec;

const $ = {
    is_garena_open: function(){
        find('name', 'Garena', true).then(function (process_list){
            // let garena_info = JSON.stringify(process_list);
            // console.log("Garena Process info: " + garena_info);
            // [{"pid":25604,"ppid":10380,"bin":"C:\\Program Files (x86)\\Garena\\Garena\\Garena.exe","name":"Garena.exe","cmd":"\"C:\\Program Files (x86)\\Garena\\Garena\\Garena.exe\""}]
            if(process_list != 0){ // 不等於 0 代表有開 Garena
                console.log("[INFO] 發現Garena主程序執行中...");
                console.log("name: " + process_list[0].name);
                console.log("PID: " + process_list[0].pid);
                console.log("PPID: " + process_list[0].ppid);
                console.log("cmd: " + process_list[0].cmd + "\n");
                garena_is_found = true;
                $.save_client_token();
                // console.log("[INFO] 準備發送結束Garena主程序指令...");
            }
        });
    },
    save_client_token: function(){
        find('name', 'RiotClientServices', true).then(function (process_list){
            console.log("[INFO] 發現RiotClientServices主程序執行中...");
            console.log("name: " + process_list[0].name);
            console.log("PID: " + process_list[0].pid);
            console.log("PPID: " + process_list[0].ppid);
            console.log("cmd: " + "[隱藏]");
            // console.log("cmd: " + process_list[0].cmd);
            client_cmd = process_list[0].cmd;
            $.killer_garena();
            // console.log(`儲存過的cmd: ${process_list[0].cmd}`);
        });
    },
    killer_garena: function(){
        exec('taskkill /f /im Garena.exe',function (error, stdout, stderr) {
             //console.log(stdout);
            console.log("[INFO] 發送結束Garena主程序完畢!");
            if(error){
                console.error("[ERROR] " + error);
            }                
        });
        exec('taskkill /f /im gxxcef.exe',function (error, stdout, stderr) {
            //console.log(stdout);
           console.log("[INFO] 發送結束gxxcef主程序完畢!");
           if(error){
               console.error("[ERROR] " + error);
           }                
        });
        exec('taskkill /f /im gxxsvc.exe',function (error, stdout, stderr) {
            //console.log(stdout);
           console.log("[INFO] 發送結束gxxsvc主程序完畢!");
           if(error){
               console.error("[ERROR] " + error);
           }                
        });
        exec('taskkill /f /im gxxapphelper.exe',function (error, stdout, stderr) {
            //console.log(stdout);
           console.log("[INFO] 發送結束gxxapphelper主程序完畢!");
           if(error){
               console.error("[ERROR] " + error);
           }                
        });
        exec('taskkill /f /im LeagueClient.exe',function (error, stdout, stderr) {
            //console.log(stdout);
            console.log("[INFO] 發送結束LOL客戶端主程序完畢!");
            client_is_found = false;client_is_notfound = false;
            is_lockfile_get = false;
            $.restart_lol();
            console.log("[INFO] 發送啟動LOL客戶端主程序完畢!");
            if(error){
                console.error("[ERROR] " + error);
            }                
        });
    },
    restart_lol:function(){
        exec(client_cmd,function (error, stdout, stderr) {
            //console.log(stdout);
            //console.log("[INFO] 發送啟動LOL客戶端主程序完畢!");
            if(error){
                console.error("[ERROR] " + error);
            }
        });
    }
}

module.exports = $;