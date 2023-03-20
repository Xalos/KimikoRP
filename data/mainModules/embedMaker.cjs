// embedRP.js
// ========

const prefix = '!';
const s = ' ';

const hexSet = {

    grey : 0x4F545C,
    gold : 0xFFFF00,
    blue : 0x006EDD,
    green : 0x008000,
    jade : 0x41F495,

};

module.exports = {
    
    //Fonction principale générant les Embed des messages RP
    rp: async function (rpData) {
        const embedResult = await new this.EmbedBuilder()

            //Ajoute la couleur lié au personnage et le message souhaité
            .setColor(rpData.color)
            .setDescription(rpData.message);
            
            //Vérification de la précense d'une image de pp sinon retire l'icone
            if(rpData.head != null && rpData.head != "")embedResult.setAuthor({ name:  rpData.firstname+" "+rpData.lastname, iconURL: rpData.head})
            else embedResult.setAuthor({ name:  rpData.firstname+" "+rpData.lastname})
          
            //Vérification de la précense d'une image de corp sinon retire la thumbnail
            if(rpData.body != null && rpData.body != "")embedResult.setThumbnail(rpData.body)

         return embedResult;
    },
 
    //Génère les Embed des messages de description MJ et Joueurs
    description: async function (rpData,type) {

        rpData.message = await this.cClear(rpData.message,/!desmj |!des /); 

        const embedResult = await new this.EmbedBuilder()

            
            //Ajoute le message souhaité ainsi que la couleur par défaut
            .setColor(hexSet.grey)
            .setDescription(rpData.message);
            
            //Vérification de la précense d'une image de pp sinon retire l'icone
            if(type == "mj")embedResult.setAuthor({ name:  "Description du Mj"})
            else embedResult.setAuthor({ name: "Description"})

         return embedResult;
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

    playerlist: async function (listData,type,message,global) {

        var userName = message.author.username;
        var idUser = message.author.id;
        var listSize = 0;
        var listText = "";

        for (i=0;i < listData.length;i++){
            
            if(global || listData[i][2] == idUser){
                listSize++;
                listText += "**"+listData[i][0]+s+listData[i][1];
                if(listData[i][2] == idUser && global)listText += " :sparkling_heart:";
                listText += "**\n";
            }
        }

        const embedResult = await new this.EmbedBuilder()

            //Affiche l'image, le nom et la couleur du personnage
            .setColor(hexSet.jade)
            .setDescription(listText);
		   
		    if (!global)embedResult.setTitle("Liste des personnages de "+userName+" **["+listSize+"]**");
            else embedResult.setTitle("Liste des "+type+" **["+listSize+"]**");

         return embedResult;
    },
    
    //Génère le
    ticket: async function (message,ask) {

        //Apee
        ticketMsg = await this.cClear(message.content,/!ticket |!ask /); 

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




  