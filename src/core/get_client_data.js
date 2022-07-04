'use strict';
require('./global');

const request = require('request');

const $ = {
    wallet: function(){
        // /lol-store/v1/wallet
        request.get({
            url: url_prefix + '/lol-store/v1/wallet',
            strictSSL: false,
            headers:{
                'Accept': 'application/json',
                'Authorization': client_lockfile.lockfile_token
            }
        },
            function(err, httpResponse, body){
                try{
                    let wallet_str = JSON.parse(body);
                }catch (error){
                    console.error("[ERROR - check(wallet)] " + error);
                    client_is_found = false;
                }
            }
        );
    }
}

module.exports = $;