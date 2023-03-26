// dataBaseNexus
// ========

const {discord} = require('discord.js');
const Jimp = require("jimp");

const utils = require("./utils.cjs");
const embedMaker = require("./embedMaker.cjs");
const diceRoll = require("./diceRoll.cjs");

const npcBluePurple = 0x4D4DFF;

const { host, user, password, database, port } = require('./../../config.json');

const mariadb = require('mariadb');
const pool = mariadb.createPool({host: host,port: port,user: user,password: password,database: database, connectionLimit: 10});

const maxImageSize = 663;



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
                    color: dataPict.color.toString(16),
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
                    color: dataPict.color.toString(16),
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
                            color: dataPict.color.toString(16),
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

        console.log(queryArray);


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

    channelf: async function (message,type) {

        let serverId = message.guildId;
        let chanId = message.channelId;

        try {

            conn = await pool.getConnection();

            switch (type) {
            
                case 'add':
                    await conn.query("INSERT INTO ChannelBan (id_server,id_channel) VALUES (?,?) ON DUPLICATE KEY UPDATE id_server = (?), id_channel = (?)",[serverId,chanId,serverId,chanId]);
                    return "Ce channel est désormais interdit au message rp";
                break;

                case 'del':
                    await conn.query("DELETE FROM ChannelBan WHERE id_server = ? AND id_channel = ?",[serverId,chanId,serverId,chanId]);
                    return "Ce channel n'est plus interdit au rp";
                break;

                case 'check':
                    var check = await conn.query("SELECT * FROM ChannelBan WHERE id_server = ? AND id_channel = ?",[serverId,chanId,serverId,chanId]);
                    return check;
                break;

            }

        } finally {
            if (conn) conn.release(); //release to pool
        }

    },

    addCharacter: async function (message,mContent,type) {

        var serverId = message.guildId;
        //console.log(message.guild);
        var serverName = message.guild.name;
        var rpData = await (await utils.cClear(mContent,/!addplayer |!addnpc /i)).split(' ');

        let regex = /<(?::\w+:|@!*&*|#)[0-9]+>/i


        if(rpData[0] == undefined || rpData[1] == undefined)throw ["ErrorReply","Vous n'avez pas spécifié de nom ou prénom",message];

        if(regex.test(rpData[0]) || regex.test(rpData[1]))throw ["ErrorReply","Les données fournis sont invalide",message];

        

        if (type == "Joueur"){

        let userMention = message.mentions.members.first()
        let playerId = userMention.id;

        if(!userMention)throw ["ErrorReply","Vous n'avez pas mentionné de Joueur",message];

        if(rpData[2] == undefined )throw ["ErrorReply","Vous n'avez pas spécifé de nom ou prénom",message];
        
        if(!regex.test(rpData[2]))throw ["ErrorReply","Les données fournis sont invalide",message];

        }


        let conn;
        
        try {

            conn = await pool.getConnection();

            if(type == "Joueur"){
               
                var result = await conn.query("SELECT * FROM `Character` WHERE id_server = ? AND id_player = ? AND first_name = ? AND last_name = ?",[serverId,playerId,rpData[0],rpData[1]]);
                if(result.length !== 0)throw ["ErrorReply","Ce personnage est déjà existant : **"+rpData[0]+" "+rpData[1]+"**",message];
                else{
                    await conn.query("INSERT INTO `Character` (id_server,id_player,first_name,last_name) VALUES (?,?,?,?)",[serverId,playerId,rpData[0],rpData[1]]);
                    return [playerId,"Nouveau personnage créé : **"+rpData[0]+" "+rpData[1]+"**","Votre personnage __**"+rpData[0]+" "+rpData[1]+"**__ à été créé sur le serveur __**"+serverName+"**__. \nSi votre personnage a été créé pour du rp écrit, vous pouvez désormais envoyer les images et assigner la couleur de la bande (couleur principale ou des cheveux).\n\nFaites __**!khelp**__ sur le serveur pour avoir plus d'infos sur les commandes.\n\n(L'assignation de couleur et d'images n'est en aucun cas obligatoires)"];
                }
            }

            else if(type == "NPC"){
              
                var result = await conn.query("SELECT * FROM NPC WHERE id_server = ? AND first_name = ? AND last_name = ?",[serverId,rpData[0],rpData[1]]);
                if(result.length !== 0)throw ["ErrorReply","Ce NPC est déjà existant : **"+rpData[0]+" "+rpData[1]+"**",message];
                else{
                    await conn.query("INSERT INTO NPC (id_server,first_name,last_name) VALUES (?,?,?)",[serverId,rpData[0],rpData[1]]);
                    return "Nouveau NPC créé : **"+rpData[0]+" "+rpData[1]+"**";
                }
            }

        } finally {
        if (conn) conn.release(); //release to pool
    }
    
    },

    setColor: async function (message,mContent,type) {

        let version = 0;
        var serverId = message.guildId;
        var playerId = message.author.id;
        var rpData = await (await utils.cClear(mContent,/!color |!colornpc /i)).split(' ');

        let conn;

        let regex = /([a-fA-F0-9]{6})$/i;

        if(!regex.test(rpData[0]))throw ["ErrorReply","Vous n'avez pas spécifié de couleur valide",message];

        if(rpData[1] == undefined || rpData[2] == undefined)throw ["ErrorReply","Vous n'avez pas spécifié de nom ou prénom",message];

        let color = await regex.exec(rpData[0])[0];
        
        try {

            conn = await pool.getConnection();

            switch(type){
                case"Joueur":

                    let colorArrayJoueur = ['$['+version+'].color',color,serverId,playerId,rpData[1],rpData[2]];

                    var result = await conn.query("UPDATE `Character` SET version_data = JSON_SET(version_data, ?, ?) WHERE id_server = ? AND id_player = ? AND first_name = ? AND last_name = ?",colorArrayJoueur);

                    if(result.affectedRows == 0)throw ["ErrorReply","Impossible de trouver __votre__ personnage : **"+rpData[1]+" "+rpData[2]+"**",message];

                    return "La couleur de **"+rpData[1]+" "+rpData[2]+"** a été changée avec succès";

                break;
                case"NPC":

                    let colorArrayNpc = ['$['+version+'].color',color,serverId,rpData[1],rpData[2]];

                    var result = await conn.query("UPDATE NPC SET version_data = JSON_SET(version_data, ?, ?) WHERE id_server = ? AND first_name = ? AND last_name = ?",colorArrayNpc);

                    //console.log(result);

                    if(result.affectedRows == 0)throw ["ErrorReply","Impossible de trouver le NPC : **"+rpData[1]+" "+rpData[2]+"**",message];

                    return "La couleur de **"+rpData[1]+" "+rpData[2]+"** a été changée avec succès";

                break;

            }
            

        } finally {
            if (conn) conn.release(); //release to pool
        }




    
    },

    delCharacter: async function (message,mContent,type) {

        var serverId = message.guildId;
        var rpData = await (await utils.cClear(mContent,/!delplayer |!delnpc /i)).split(' ');

        let regex = /<(?::\w+:|@!*&*|#)[0-9]+>/i


        if(rpData[0] == undefined || rpData[1] == undefined)throw ["ErrorReply","Vous n'avez pas spécifié de nom ou prénom",message];

        if(regex.test(rpData[0]) || regex.test(rpData[1]))throw ["ErrorReply","Les données fournis sont invalide",message];

        console.log(rpData);

        let conn;
        
        try {

            conn = await pool.getConnection();

            if(type == "Joueur"){
               
                var result = await conn.query("DELETE FROM `Character` WHERE id_server = ? AND first_name = ? AND last_name = ?",[serverId,rpData[0],rpData[1]]);
                if(result.affectedRows == 0)throw ["ErrorReply","Impossible de trouver le personnage : **"+rpData[0]+" "+rpData[1]+"**",message];
                return "Le personnage : **"+rpData[0]+" "+rpData[1]+"** a été supprimé";
               
            }

            else if(type == "NPC"){
              
                var result = await conn.query("DELETE FROM NPC WHERE id_server = ? AND first_name = ? AND last_name = ?",[serverId,rpData[0],rpData[1]]);
                if(result.affectedRows == 0)throw ["ErrorReply","Impossible de trouver le NPC : **"+rpData[0]+" "+rpData[1]+"**",message];
                return "Le NPC : **"+rpData[0]+" "+rpData[1]+"** a été supprimé";
            }

        } finally {
        if (conn) conn.release(); //release to pool
    }
    
    },

    upload: async function (message,mContent,type) {

        let version = 0;
        var serverId = message.guildId;
        var playerId = message.author.id;

        let regex = /body|head/i;
        
        var uploadData = await (await utils.cClear(mContent,/!upload |!uploadnpc /i)).split(' ');

        

        var attachment = message.attachments.first();
        var url = attachment ? attachment.url : null;

        if(!url)throw ["ErrorReply","Vous n'avez pas envoyer d'images dans votre upload",message];

        if(!regex.test(uploadData[0]))throw ["ErrorReply","Vous n'avez pas spécifié de valeur valide pour le choix de l'images",message];

        if(uploadData[1] == undefined || uploadData[2] == undefined)throw ["ErrorReply","Vous n'avez pas spécifié de nom ou prénom",message];

        if(regex.test(uploadData[1]) || regex.test(uploadData[2]))throw ["ErrorReply","Vous n'avez pas spécifié de nom ou prénom",message];
        
        let conn;
        
        try {

            conn = await pool.getConnection();
            var bodyHead = uploadData[0].toLowerCase()

           
                    switch(type){

                    case "Joueur":

                    var result = await conn.query("SELECT * FROM `Character` WHERE id_server = ? AND id_player = ? AND first_name = ? AND last_name = ?",[serverId,playerId,uploadData[1],uploadData[2]]);

                    if(result.length === 0 || !result)throw ["ErrorReplyMP","Impossible de trouver __votre__ personnage : **"+uploadData[1]+" "+uploadData[2]+"**",message];

                    let imageEdit = await Jimp.read(url);

                    imageEdit.resize(Jimp.AUTO, maxImageSize);

                    let imageBuffer = await imageEdit.getBufferAsync(Jimp.MIME_PNG);
                    

                      try {  
                        
                        await this.client.guilds.cache.get("539713857308852224").channels.cache.get("539713961784770570").send({ files: [{ attachment: imageBuffer }]}).then(async msgupload => {

	                        var attachment = msgupload.attachments.first();
                            var url = attachment ? attachment.url : null;

                            let imageArrayJoueur = ['$['+version+'].'+bodyHead,url,serverId,playerId,uploadData[1],uploadData[2]];

                            await conn.query("UPDATE `Character` SET version_data = JSON_SET(version_data, ?, ?) WHERE id_server = ? AND id_player = ? AND first_name = ? AND last_name = ?",imageArrayJoueur);

                        });

                        return "L'image de "+bodyHead+" de **"+uploadData[1]+" "+uploadData[2]+"** a été changée avec succès";
                   
                    } catch (error) {console.error(error);};    
        
                        break;
                        case "NPC":
                        
                        var result = await conn.query("SELECT * FROM NPC WHERE id_server = ? AND first_name = ? AND last_name = ?",[serverId,uploadData[1],uploadData[2]]);

                        if(result.length === 0 || !result)throw ["ErrorReplyMP","Impossible de trouver le NPC : **"+uploadData[1]+" "+uploadData[2]+"**",message];

                        let imageEditNPC = await Jimp.read(url);

                        imageEditNPC.resize(Jimp.AUTO, maxImageSize);

                        let imageBufferNPC = await imageEditNPC.getBufferAsync(Jimp.MIME_PNG);
                    

                        try {  
                        
                            await this.client.guilds.cache.get("539713857308852224").channels.cache.get("539713961784770570").send({ files: [{ attachment: imageBufferNPC }]}).then(async msgupload => {

	                        var attachment = msgupload.attachments.first();
                            var url = attachment ? attachment.url : null;

                            let imageArrayNPC = ['$['+version+'].'+bodyHead,url,serverId,uploadData[1],uploadData[2]];

                            await conn.query("UPDATE NPC SET version_data = JSON_SET(version_data, ?, ?) WHERE id_server = ? AND first_name = ? AND last_name = ?",imageArrayNPC);

                        });

                        return "L'image du "+bodyHead+" de NPC **"+uploadData[1]+" "+uploadData[2]+"** a été changée avec succès";
                   
                    } catch (error) {console.error(error);};    


                }

        } finally {
            if (conn) conn.release(); //release to pool
        }
    
    },

    carac: async function (message,mContent,type) {

        var serverId = message.guildId;

        let regexOptions = /add|del/i;
        let regexSymbol = /\+|\-|\*/i;
        let regexForbidenChar = /\W|_/i;
        
        
        var caracData = await (await utils.cClear(mContent,/!carac /i)).split(' ');

        if(!regexOptions.test(caracData[0]))throw ["ErrorReply","Vous n'avez pas spécifié de valeur valide pour le choix d'ajout ou de supression",message];

        let options = caracData[0].toLowerCase();
    
        if(caracData[1] == undefined)throw ["ErrorReply","Certaines valeurs requises sont manquantes",message];

        if(regexForbidenChar.test(caracData[1]))throw ["ErrorReplyMP","La commande utilise des caractère interdit",message];
        
        let conn;
        
        var caracKey = caracData[1].toLowerCase();

        try {

            switch(options) {
            
            case "add":

            if(caracData[2] == undefined || caracData[3] == undefined || caracData[4] == undefined)throw ["ErrorReply","Certaines valeurs requises sont manquantes",message];
        
            if(!diceRoll.diceTest(caracData[3]))throw ["ErrorReplyMP","Vous n'avez pas spécifié de valeur de dé valide",message];

            if(!regexSymbol.test(caracData[4]))throw ["ErrorReplyMP","Vous n'avez pas spécifié de symbol valide",message];

            conn = await pool.getConnection();
            
            let caracJson = {
                [caracKey]: 
                    {
                        name: caracData[2],
                        dice: caracData[3],
                        type: caracData[4]
                    }
            }

            let caracJsonData = {
                        name: caracData[2],
                        dice: caracData[3],
                        type: caracData[4]
            }
        
        let caracArray = [serverId,caracJson];
        
        let result = await conn.query("INSERT IGNORE INTO ServerList (id_server,server_stats) VALUES (?,?)",caracArray)
        
        if(result.affectedRows == 0){
            
            let resultSearch = await conn.query("SELECT server_stats FROM ServerList WHERE id_server = ?",serverId);

            let searchData = JSON.parse(resultSearch[0].server_stats);

            if(searchData.hasOwnProperty(caracKey))throw ["ErrorReply","Une caractéristique utilise déjà cette commande : **"+caracKey+"**",message];

            searchData[caracKey] = caracJsonData;

            caracDataToSend = JSON.stringify(searchData)
            
            await conn.query("UPDATE ServerList SET server_stats = ? WHERE id_server = ?",[caracDataToSend,serverId])

            return "La caractéristique : **"+caracData[2]+"** utilisant la commande __**$"+caracKey+"**__ a été ajouté";

        }
     
        break;
        case "del" :

        conn = await pool.getConnection();

        
        
        let delResult = await conn.query("UPDATE ServerList SET server_stats = JSON_REMOVE(server_stats, ?) WHERE id_server = ? ",["$."+caracKey,serverId]);

       

        return "La caractéristique utilisant la commande __**$"+caracKey+"**__ a été supprimer";

        break;
        }

        } finally {
            if (conn) conn.release(); //release to pool
        }
    
    },




    setcarac: async function (message,mContent) {

        var serverId = message.guildId;

        //let regexOptions = /add|del/i;
        let regexNumber = /(^[-]?\d*\d+)$/;
        let regexForbidenChar = /\W|_/i;
        
        
        var caracData = await (await utils.cClear(mContent,/!setcarac /i)).split(' ');

        if(caracData[1] == undefined || caracData[2] == undefined || caracData[3] == undefined)throw ["ErrorReply","Certaines valeurs requises sont manquantes",message];

        if(regexForbidenChar.test(caracData[0]))throw ["ErrorReply","La commande utilise des caractère interdit",message];

        
        if(!regexNumber.test(caracData[1]))throw ["ErrorReply","La valeur numérique de la caractéristique n'est pas valide",message];
    
        let conn;

        var caracKey = caracData[0];
        var caracNum = caracData[1];
        var firstname = caracData[2];
        var lastname = caracData[3];
        
        try {

            conn = await pool.getConnection();


            let resultSearchServ = await conn.query("SELECT server_stats FROM ServerList WHERE id_server = ?",serverId);

            let searchDataServ = JSON.parse(resultSearchServ[0].server_stats);

          
            if(!searchDataServ.hasOwnProperty(caracKey))throw ["ErrorReplyMP","Aucunes caractéristiques n'utilise cette commande : **"+caracKey+"**",message];

            let resultSearch = await conn.query("SELECT stats_data FROM `Character` WHERE id_server = ? AND first_name = ? AND last_name = ?",[serverId,firstname,lastname]);

            if(resultSearch === 0 || !resultSearch)throw ["ErrorReplyMP","Impossible de trouver le personnage : **"+uploadData[2]+" "+uploadData[3]+"**",message];

             let searchData = JSON.parse(resultSearch[0].stats_data);

             searchData[caracKey] = caracNum;

             caracDataToSend = JSON.stringify(searchData)
            
             await conn.query("UPDATE `Character` SET stats_data = ? WHERE id_server = ? AND first_name = ? AND last_name = ?",[caracDataToSend,serverId,firstname,lastname])
 
             return "La caractéristique __**"+searchDataServ[caracKey].name+"**__ a été ajouté au personnage **"+firstname+" "+lastname+"** avec pour valeur __**"+caracNum+"**__";

        } finally {
            if (conn) conn.release(); //release to pool
        }
    
    },



    statsList: async function (message) {

        var serverId = message.guildId;

        let conn;
        
        try {

            conn = await pool.getConnection();


            let result = await conn.query("SELECT server_stats FROM ServerList WHERE id_server = ?",[serverId]);

            let searchData = await JSON.parse(result[0].server_stats);

            let listDataStats = new Array();

            let i = 0
            
            for (var key in searchData) {

                listDataStats.push([searchData[key].name, key, searchData[key].dice]);
                i++;
            }
            
            console.log(listDataStats);

             return listDataStats;

        } finally {
            if (conn) conn.release(); //release to pool
        }
    
    },

    statsListChar: async function (message) {

        var serverId = message.guildId;

        var authorId = message.author.id;

        let conn;
        
        try {

            conn = await pool.getConnection();

            let resultMain = await conn.query("SELECT id_main FROM MainLock WHERE id_player = ? AND id_server",[authorId,serverId]);

            let idCharacter = await JSON.parse(resultMain[0].id_main);

            let result = await conn.query("SELECT stats_data FROM `Character` WHERE id_charac = ?",[idCharacter]);

            let searchData = await JSON.parse(result[0].stats_data);

            let listDataStatsChar = new Array();

            let i = 0
            
            for (var key in searchData) {

                listDataStatsChar.push([key, searchData[key]]);
                i++;
            }

             return listDataStatsChar;

        } finally {
            if (conn) conn.release(); //release to pool
        }
    
    },

    statsRoll: async function (message,mContent) {

        var caracData = await (await utils.cClear(mContent,/\$/i)).split(' ');

        var serverId = message.guildId;
        var authorId = message.author.id;

        let statsName = caracData[0];

        let conn;
        
        try {

            conn = await pool.getConnection();

            let resultMain = await conn.query("SELECT id_main FROM MainLock WHERE id_player = ? AND id_server",[authorId,serverId]);

            let idCharacter = await JSON.parse(resultMain[0].id_main);

            let resultChar = await conn.query("SELECT * FROM `Character` WHERE id_charac = ?",[idCharacter]);

            

            let searchDataChar = await JSON.parse(resultChar[0].stats_data);
            let firstname = await resultChar[0].first_name;
            let lastname = await resultChar[0].last_name;

            let resultDice = await conn.query("SELECT server_stats FROM ServerList WHERE id_server = ?",[serverId]);

          

            let searchDataDice = await JSON.parse(resultDice[0].server_stats);

            let advDice = [searchDataDice[statsName].name,searchDataDice[statsName].dice,searchDataDice[statsName].type,searchDataChar[statsName],firstname,lastname];

            console.log(advDice);
            return advDice;

        } finally {
            if (conn) conn.release(); //release to pool
        }
    
    },


    test: async function () {

        let conn;
        
        try {

            conn = await pool.getConnection();

            var result = await conn.query("SELECT * FROM NPC WHERE id_server = ? AND first_name = ? AND last_name = ?",[serverId,rpData[0],rpData[1]]);
            


        } finally {
            if (conn) conn.release(); //release to pool
        }
    
    },


  }
