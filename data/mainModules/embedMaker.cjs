// embedRP.js
// ========

const utils = require("./utils.cjs");

const prefix = '!';
const s = ' ';

const hexSet = {

    grey : 0x4F545C,
    gold : 0xFFFF00,
    blue : 0x006EDD,
    green : 0x008000,
    jade : 0x41F495,
    purple : 0x8C198C,
    kingGold : 0xFF9900,
    failRed : 0xFF0000,
    winGreen : 0x00FF00

};

module.exports = {
    
    //Fonction principale générant les Embed des messages RP
    rp: async function (rpData) {

       

        if (rpData == "unlock")return "unlock";

        const embedResult = await new this.EmbedBuilder()

            //Ajoute la couleur lié au personnage et le message souhaité
            .setDescription(rpData.message);
            
            //Vérification de la précense d'une image de pp sinon retire l'icone
            if(rpData.head != null && rpData.head != "")embedResult.setAuthor({ name:  rpData.firstname+" "+rpData.lastname, iconURL: rpData.head})
            else embedResult.setAuthor({ name:  rpData.firstname+" "+rpData.lastname})
          
            //Vérification de la précense d'une image de corp sinon retire la thumbnail
            if(rpData.body != null && rpData.body != "")embedResult.setThumbnail(rpData.body)
            if(rpData.color)embedResult.setColor(rpData.color);

         return [rpData,embedResult];
    },

    edit: async function (rpData) {

        const embedResult = await new this.EmbedBuilder()

            //Ajoute la couleur lié au personnage et le message souhaité
            embedResult.setDescription(rpData.message);
            
            //Vérification de la précense d'une image de pp sinon retire l'icone
            
            if(rpData.head != "")embedResult.setAuthor({ name:  rpData.author, iconURL: rpData.head});
            else embedResult.setAuthor({ name: rpData.author});
          
            //Vérification de la précense d'une image de corp sinon retire la thumbnail
            if(rpData.body != "")embedResult.setThumbnail(rpData.body)
            if(rpData.color != null && rpData.color != "")embedResult.setColor(rpData.color);

         return embedResult;
    },
 
    //Génère les Embed des messages de description MJ et Joueurs
    description: async function (mContent,type) {

        let message = await utils.cClear(mContent,/!desmj |!des /i); 

        const embedResult = await new this.EmbedBuilder()

           
            
            //Ajoute le message souhaité ainsi que la couleur par défaut
            .setColor(hexSet.grey)
            .setDescription(message);
            
            //Vérification de la précense d'une image de pp sinon retire l'icone
            if(type == "mj")embedResult.setAuthor({ name:  "Description du Mj"})
            else embedResult.setAuthor({ name: "Description"})

            
            //This is not the best away to do this but it will work for now
            let rpData = {
                type: "description",
                firstname: null,
                lastname: null,
                message: null,
                color: Number(hexSet.grey),
                body: null,
                head: null,
                hide: null
            };

         return [rpData,embedResult];
    },

    //Génère les Embed des messages de description MJ et Joueurs
    see: async function (rpData,type) {

        const embedResult = await new this.EmbedBuilder()

            
            //Affiche l'image, le nom et la couleur du personnage
            .setColor(rpData.color)
		    .setAuthor({ name:  rpData.firstname+s+rpData.lastname+s+"["+type+"]"})
		    if (rpData.body != null)embedResult.setImage(rpData.body);

         return embedResult;
    },

    //Make the Embed of a list of all Character on the server, or only the one related to the message author
    playerlist: async function (listData,type,message,global) {

        var userName = message.author.username;
        var idUser = message.author.id;
        var listSize = 0;
        var listText = "";

        for (i=0;i < listData.length;i++){
            
            if(global || listData[i][2] == idUser){
                listSize++;
                listText += "**"+listData[i][0]+" "+listData[i][1];
                if(listData[i][2] == idUser && global)listText += " :sparkling_heart:";
                listText += "**\n";
            }
        }

        const embedResult = await new this.EmbedBuilder()

            //Affiche l'image, le nom et la couleur du personnage
            .setColor(hexSet.jade)
            if(listText)embedResult.setDescription(listText);
		   
		    if (!global)embedResult.setTitle("Liste des personnages de "+userName+" **["+listSize+"]**");
            else embedResult.setTitle("Liste des "+type+" **["+listSize+"]**");

         return embedResult;
    },

    statsList: async function (listData,type,message,global) {

        //var userName = message.author.username;
        // var idUser = message.author.id;
        var listSize = 0;
        var listText = "";

        for (i=0;i < listData.length;i++){

                listSize++;
                listText += "__"+listData[i][0]+"__ **"+listData[i][1]+"** "+listData[i][2];
                listText += "\n";
            
        }

        const embedResult = await new this.EmbedBuilder()

            //Affiche l'image, le nom et la couleur du personnage
            .setColor(hexSet.kingGold)
		    .setTitle("Liste des Caractéristiques **["+listSize+"]**");
            if(listText)embedResult.setDescription(listText)
          

         return embedResult;
    },

    //Make the Embed of a classic dice roll
    roll: async function (rollData,userName) {

        rollMessage = rollData[0];
        rollRolled = rollData[1];
        rollResult = rollData[2];

        const embedResult = await new this.EmbedBuilder()
            
            //Affiche l'image, le nom et la couleur du personnage
            .setTitle("Jet de **"+userName+"**")
            .setColor(hexSet.purple)
		    .setDescription(rollMessage+" = ["+rollRolled+"] = **"+rollResult+"**");

         return embedResult;
    },
    
    advRoll: async function (rollData) {

        rollMessage = rollData[0];
        rollRolled = rollData[1];
        rollResult = rollData[2];

        const embedResult = await new this.EmbedBuilder()
            
            //Affiche l'image, le nom et la couleur du personnage
            .setTitle("Jet __**"+rollData[4]+"**__ de **"+rollData[5]+" "+rollData[6]+" ...**")
            .setDescription(rollMessage+" = ["+rollRolled+"] = **"+rollResult+"** = **"+rollData[3]+"**");
            
            if(rollData[3] == "Réussite")embedResult.setColor(hexSet.winGreen);
            else embedResult.setColor(hexSet.failRed);
		    

         return embedResult;
    },

    
    //Génère le
    ticket: async function (message,ask) {

        //Apee
        ticketMsg = await utils.cClear(message.content,/!ticket |!ask /i); 

	    var tag = message.author.tag;

        //Regarde si l'utillisateur et l'owner un l'admin ou un simple utilisateur, et ajoute un facteur de priorité au ticket en fonction de cela
        var defcon = "userTicket";
        //if (message.member.permissionsIn(message.channel).has("ADMINISTRATOR"))defcon = "adminTicket";
        if (message.guild.ownerId == message.author.id)defcon = "ownerTicket";
        

        const embedResult = await new this.EmbedBuilder()

            .setTitle("User : **__"+tag+"__**               Serveur **__"+message.guildId+"__**")
            .addFields(
                { name: '__ID Utilisateur__', value: message.author.id },
                { name: '__Description du ticket__', value: ticketMsg },
            );

            switch(defcon) {
                case "ownerTicket":
                    embedResult.setColor(hexSet.gold);
                  break;
                case "userTicket":
                    embedResult.setColor(hexSet.blue);
                  break;
              }

            if(ask)embedResult.setColor(hexSet.green);
            
     return [defcon,embedResult];
    }

  };




  