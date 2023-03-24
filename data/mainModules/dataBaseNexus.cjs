// dataBaseNexus
// ========

const utils = require("./utils.cjs");
const { discord } = require('discord.js');
const embedMaker = require("./embedMaker.cjs");

const npcBluePurple = 0x4D4DFF;

const { host, user, password, database, port } = require('./../../config.json');

const mariadb = require('mariadb');
const pool = mariadb.createPool({host: host,port: port,user: user,password: password,database: database, connectionLimit: 10});




module.exports = {
    
    test: async function () {
    
    },
    
    see: async function (message,mContent,type) {
        
        var serverId = message.guildId;
        var rpData = await (await utils.cClear(mContent,/!see |!seenpc /i)).split(' ');

        
        if(rpData[0] == "")throw ["ErrorReply","Aucun personnages n'a été spécifié",message];

        let conn;

        try {

            if(type == "Joueur"){
               
                conn = await pool.getConnection();
            
                var result = await conn.query("SELECT * FROM `Character` WHERE id_server = ? AND first_name = ?",[serverId,rpData[0]]);

                

                if(result.length === 0 || !result)throw ["ErrorReply","Le personnage demander n'éxiste pas : **"+rpData[0]+"**",message];

            }

            else if(type == "npc"){

                conn = await pool.getConnection();
            
                var result = await conn.query("SELECT * FROM NPC WHERE id_server = ? AND first_name = ?",[serverId,rpData[0]]);

                if(result.length === 0 || !result)throw ["ErrorReply","Le NPC demander n'éxiste pas : **"+rpData[0]+"**",message];

            }

            
         

                let data = result[0];
                let dataPict = JSON.parse(data.version_data)[data.version];
    
                var rpData = {
                    firstname: data.first_name,
                    lastname: data.last_name,
                    message: rpData[1],
                    color: Number(dataPict.color),
                    body: dataPict.body,
                    head: dataPict.head,
                };
                
           
            return rpData;
            
           
        

        } finally {
        if (conn) conn.release(); //release to pool
    }

    },

    character: async function (message,mContent,type) {

        var serverId = message.guildId;
        var playerId = message.author.id;
        var rpData = await (await utils.cClear(mContent,/!rp |!npc |r |n /i)).split(' ');
        var mContent = await utils.cClear((await utils.cClear(mContent,/!rp |!npc |r |n /i)),rpData[0]);

       
        if(!rpData[1])throw ["ErrorReply","Votre message ne contient aucun text",message];

        let conn;
        
        
        //console.log(serverId+" "+playerId+" "+rpData[0]);
        
        try {

            if(type == "Joueur"){
               
                conn = await pool.getConnection();
            
                var result = await conn.query("SELECT * FROM `Character` WHERE id_server = ? AND id_player = ? AND first_name = ?",[serverId,playerId,rpData[0]]);

                

                if(result.length === 0 || !result)throw ["ErrorReplyMP","Impossible de trouver __votre__ personnage : **"+rpData[0]+"**",message];

            }

            else if(type == "npc"){

                conn = await pool.getConnection();
            
                var result = await conn.query("SELECT * FROM NPC WHERE id_server = ? AND first_name = ?",[serverId,rpData[0]]);

            }

            if(result.length === 0 || !result){

                var rpData = {
                    firstname: rpData[0],
                    lastname: '',
                    message: mContent,
                    color: npcBluePurple
                };
            }
            else {

                let data = result[0];
                let dataPict = JSON.parse(data.version_data)[data.version];
    
                var rpData = {
                    firstname: data.first_name,
                    lastname: data.last_name,
                    message: mContent,
                    color: Number(dataPict.color),
                    body: dataPict.body,
                    head: dataPict.head,
                    hide: data.hide
                };
            }     
           
          

            return rpData;
            
           
        

        } finally {
        if (conn) conn.release(); //release to pool
    }

    },

    lockSystem: async function (message,mContent,type) {

        var serverId = message.guildId;
        var playerId = message.author.id;

        let conn;
        
        try {
           
            conn = await pool.getConnection();

            if(type != "unlock"){
            
                var rpData = await (await utils.cClear(mContent,/!lock |!main /i)).split(' ');

              
                var resultChar = await conn.query("SELECT * FROM `Character` WHERE id_server = ? AND id_player = ? AND first_name = ?",[serverId,playerId,rpData[0]]);
                

                if(resultChar.length === 0 || !resultChar)throw ["ErrorReply","Impossible de trouver __votre__ personnage : **"+rpData[0]+"**",message];
  
                idChar = resultChar[0].id_charac;
                
                let msg;

                switch(type){
                case "lock": 
                    await conn.query("INSERT INTO MainLock (id_server,id_player,id_lock) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id_lock = (?)",[serverId,playerId,idChar,idChar]);
                    msg = "**"+resultChar[0].first_name+" "+resultChar[0].last_name+"** est désormais verrouillé, le mode fastrp est désactiver";
                break;

                case "main":
                    await conn.query("INSERT INTO MainLock (id_server,id_player,id_main) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id_main = (?)",[serverId,playerId,idChar,idChar]);
                    msg = "**"+resultChar[0].first_name+" "+resultChar[0].last_name+"** est désormais votre personnage principal";
                break;

                }

                return msg;
        }
        else{
            await conn.query("DELETE FROM MainLock WHERE id_server = ? AND id_player = ? AND EXISTS(SELECT * FROM MainLock WHERE id_server = ? AND id_player = ?)",[serverId,playerId,serverId,playerId]);
            return "Vous n'étes plus verrouillé";
        }
    
        } finally {
        if (conn) conn.release(); //release to pool
    }
        
    
   
    },

    lockMessage: async function (message,mContent) {
        
        
        var serverId = message.guildId;
        var playerId = message.author.id;

        let conn;

        try {
           
            conn = await pool.getConnection();

                var resultLock = await conn.query("SELECT * FROM MainLock WHERE id_server = ? AND id_player = ? AND id_lock IS NOT NULL",[serverId,playerId]);
               

                if(resultLock.length === 0 || !resultLock)return "unlock";
                else {

                 var result = await conn.query("SELECT * FROM `Character` WHERE id_charac = ?",[resultLock[0].id_lock]);

                    if(result.length === 0 || !result)return "unlock";
                    else{

                        let data = result[0];
                        let dataPict = JSON.parse(data.version_data)[data.version];
            
                        var rpData = {
                            firstname: data.first_name,
                            lastname: data.last_name,
                            message: mContent,
                            color: Number(dataPict.color),
                            body: dataPict.body,
                            head: dataPict.head,
                            hide: data.hide
                        };

                       
                        
                        return rpData;

                    }
                
                }

        } finally {
        if (conn) conn.release(); //release to pool
        }

    },

    listChar: async function (message,type) {

        try {
        
           conn = await pool.getConnection();
           
           var serverId = message.guildId;

           if(type == "Joueur"){

           var resultLock = await conn.query("SELECT * FROM `Character` WHERE id_server = ?",[serverId]);

           var listData = new Array(resultLock.length);
           var rF;
               
           for(i=0;i < resultLock.length;i++){
                rF = resultLock[i];
                listData[i] = [rF.first_name,rF.last_name,rF.id_player]
           }

           return listData;

           }

           else if(type == "npc"){

            var resultLock = await conn.query("SELECT * FROM NPC WHERE id_server = ?",[serverId]);

           var listData = new Array(resultLock.length);
           var rF;
               
           for(i=0;i < resultLock.length;i++){
                rF = resultLock[i];
                listData[i] = [rF.first_name,rF.last_name]
           }

           return listData;


           }

        } finally {
            if (conn) conn.release(); //release to pool
            }

   }, 
    
   logRp: async function (rpData,message,author) {

        //console.log("We are in !!!");

        //console.log(rpData);

        //console.log(message);

        //console.log(message.guildId);

        let id_server = message.guildId;
        let id_player = author;
        let id_chan = message.channelId;
        let id_msg = message.id;
        
        var queryArray = [id_server,id_player,id_chan,rpData.firstname,rpData.lastname,id_msg,rpData.head,rpData.body,rpData.color,rpData.hide,id_chan,rpData.firstname,rpData.lastname,id_msg,rpData.head,rpData.body,rpData.color,rpData.hide];

        //console.log(queryArray);


    try {   

        //console.log("PreDB");
        
        conn = await pool.getConnection();

        await conn.query("INSERT INTO LastMSG (id_server,id_player,id_chan,first_name,last_name,id_msg,head,body,color,hide) VALUES (?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id_chan = (?), first_name = (?), last_name = (?), id_msg = (?),head = (?), body = (?), color = (?), hide = (?)",queryArray);
        
        //console.log("PostDB");

    } finally {
        if (conn) conn.release(); //release to pool
        }


   },
   
    delEdit: async function (message,type) {
        
        var serverId = message.guildId;
        var playerId = message.author.id;

        //console.log(serverId);
        //console.log(playerId);
        
        try {
        
            conn = await pool.getConnection();
 
            var resultLastMSG = await conn.query("SELECT * FROM LastMSG WHERE id_server = ? AND id_player = ?",[serverId,playerId]);

            if(resultLastMSG.length === 0 || !resultLastMSG)throw ["ErrorReply","Vous ne possedez pas d'ancien message RP sur ce serveur",message];
                
                resultLastMSG = resultLastMSG[0];

                const channel = await this.client.channels.cache.get(resultLastMSG.id_chan);
                    //console.log(resultLastMSG.id_chan);
                
                try {
                    var messageToDelEdit = await channel.messages.fetch(resultLastMSG.id_msg);
                }
                catch {
                    await conn.query("DELETE FROM LastMSG WHERE id_server = ? AND id_player = ?",[serverId,playerId]);
                    throw ["ErrorReply","Votre précédent message a été supprimé ou est innacessible. Votre historique va être purgé",message];
                }

                if(!messageToDelEdit){
                    //This never should trigger but it can happen so... 
                    await conn.query("DELETE FROM LastMSG WHERE id_server = ? AND id_player = ?",[serverId,playerId]);
                    throw ["ErrorReply","Votre précédent message a été supprimé ou est innacessible. Votre historique va être purgé",message];
                }


                if(type == "delete"){

                    await messageToDelEdit.delete();

                    await conn.query("DELETE FROM LastMSG WHERE id_server = ? AND id_player = ?",[serverId,playerId]);

                    return "Message RP supprimer";
                
                }
                else if(type == "edit"){

                    let embed = await messageToDelEdit.embeds[0];

                    console.log(embed);

                    var rpData = {
                        author: embed.author.name,
                        message: message.content.replace("!edit ",""),
                        color: embed.color,
                        body: "",
                        head: ""
                    };


                   if(embed.thumbnail)rpData.body = embed.thumbnail.url;
                   if(embed.author.iconURL)rpData.head = embed.author.iconURL;

                   console.log("Data : "+rpData.body);
                   console.log(embed.author);
                   console.log("Data : "+rpData.head);


                    let editEmbed = await embedMaker.edit(await rpData);
                    

                    await messageToDelEdit.edit({ embeds: [editEmbed] });

                    return "Message RP édité";
                }
            
           
 
         } finally {
             if (conn) conn.release(); //release to pool
             }




    },
  }
