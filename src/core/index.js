'use strict';
require('./global');

const check = require('./client');

const reInterval = require('reinterval');

let check_timer = reInterval(function(){
    // console.log("Tik Tok Tik Tok This is reinterval timer loop");
    if(client_is_found){
        // console.log("LOL client is active...");
        check_timer.reschedule(refresh_check_path_timer.open);
        
    }else{
        //console.log("檢查客戶端是否啟動中...")
        check.is_lol_client_open(); // client
        check_timer.reschedule(refresh_check_path_timer.close);
    }
}, 1000) // default timer