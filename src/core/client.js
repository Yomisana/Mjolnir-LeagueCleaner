'use strict';
require('./global');
const killer = require('./killer');

const find = require('find-process');
const exec = require('child_process').exec;
const fs = require('fs');
const base64 = require('hi-base64');
const request = require('request');

const $ = {
    is_lol_client_open: function(){
        find('name', 'LeagueClient', true).then(function (process_list) {
            if(process_list.length != 0){ // 代表有開 LOL
                if(client_is_found == false){
                    exec('wmic process where name="LeagueClient.exe" get executablepath',function (error, stdout, stderr) {
                        client_path = stdout.replace('ExecutablePath',"").trim();
                        client_dir = client_path.replace("LeagueClient.exe","");
                        if(client_dir && client_path != ""){
                            console.log('[INFO] 找到 LOL 客戶端');
                            // console.log('[INFO] 找到 LOL 客戶端(Path):' + client_path);
                            // console.log('[INFO] 找到 LOL 客戶端(Dir):' + client_dir + "\n");
                            mlc_main.webContents.send("client_is_found", client_status[1]);
                            client_is_found = true;
                            $.lockfile();
                        }else{
                            console.log("[INFO - exec] 尚未找到 LOL 客戶端");
                            client_is_found = false;client_is_notfound = false;is_lockfile_get = false;
                        }
                    });
                }
            }else{
                $.clear_ipc();
                if(client_is_notfound == false){
                    console.log('[INFO] 尚未找到 LOL 客戶端' + "\n");
                    $.clear_ipc();
                    client_is_found = false;client_is_notfound = true;is_lockfile_get = false;
                    console.log("[INFO] Clean Data");
                    client_path = null;
                    client_dir = null
                    lockfile_str = null;
                    client_lockfile.lockfile_name = null;
                    client_lockfile.lockfile_pid = null;
                    client_lockfile.lockfile_port = null;
                    client_lockfile.lockfile_token = "";
                    client_lockfile.lockfile_method = null;
                    url_prefix = null;
                    console.log("[INFO] Clean Data Done!");
                }
            }
        });        
    },
    lockfile: function(){
        fs.readFile(client_dir + '/lockfile', 'utf8', (err, data) => {
            try{
                lockfile_str = data;
                //console.log("[INFO] "+ lockfile_str + "\n");
                lockfile = lockfile_str?.split(':');
                // lockfile 
                client_lockfile.lockfile_name =  lockfile[0];
                client_lockfile.lockfile_pid = lockfile[1];
                client_lockfile.lockfile_port = lockfile[2];
                //lockfile.lockfile_token = lockfile[3];
                client_lockfile.lockfile_method = lockfile[4];
                // Token 解密
                let tmp_token = "riot:" + lockfile[3];
                let encode_token = base64.encode(tmp_token);
                client_lockfile.lockfile_token = "Basic " + encode_token
                // console.log("[INFO] Token:" + client_lockfile.lockfile_token);
    
                // console.log("\n",client_lockfile.lockfile_name,"\n",client_lockfile.lockfile_pid,"\n",client_lockfile.lockfile_port,"\n",client_lockfile.lockfile_token,"\n",client_lockfile.lockfile_method,);
                console.log("[INFO] LOL lockfile extraction done!");
    
                url_prefix = client_lockfile.lockfile_method + "://127.0.0.1:" + client_lockfile.lockfile_port;
                // console.log("[INFO] api url:" + url_prefix);
                // console.log("Account: riot");
                // console.log("Passwd: " + lockfile[3]);
                console.log("[INFO] LOL api url extraction done!\n");
                game_is_notfound = false; is_lockfile_get = true;
                // 紀錄啟動時間
                request.get({
                    url: url_prefix + '/telemetry/v1/application-start-time',
                    strictSSL: false,
                    headers:{
                        'Accept': 'application/json',
                        'Authorization': client_lockfile.lockfile_token
                    }
                },
                    function(err, httpResponse, body){
                        try{
                            let timestamp = JSON.parse(body);
                            // console.log(timestamp);
                            if(!garena_is_found){
                                console.log("[INFO] LOL Client start time(first_active) log done!\n");
                                client_active.first_active = timestamp;
                                console.log(`第一次啟動: ${client_active.first_active}`);
                                killer.is_garena_open();
                            }else{
                                console.log("[INFO] LOL Client start time(second_active) log done!\n");
                                client_active.second_active = timestamp;
                                console.log(`第二次啟動: ${client_active.second_active}`);
                                // clean kill data
                                garena_is_found = false;
                            }
                        }catch (error){
                            console.error("[ERROR - 啟動時間] " + error);
                            client_is_found = false;
                        }
                    }
                );
            }catch(error){
                client_is_found = false;client_is_notfound = false;is_lockfile_get = false;
                console.error("[ERROR - lockfile] "+err);
                console.error("[ERROR - lockfile] "+error);
                console.warn("[WARN - lockfile] 請確認是否有使用管理員權限執行，或是確保你的遊戲是否啟動了!" + "\n");
            }
        });
    },
    is_game_running: function(){
        find('name', 'League of Legends', true).then(function (process_list) {
            //console.log("我有偷跑");
            if(process_list.length != 0){ // 代表有開 LOL
                if(!game_is_found){
                    console.log("[INFO] 遊戲端有開著!");
                    game_is_found = true;game_is_notfound = false;
                }
            }else{
                if(!game_is_notfound){
                    console.log("[INFO] 遊戲端沒開著!");
                    game_is_found = false;game_is_notfound = true;
                }
            }
        });
    },
    clear_ipc: function(){
        mlc_main.webContents.send("client_is_found", client_status[0]);
    }
}

module.exports = $;