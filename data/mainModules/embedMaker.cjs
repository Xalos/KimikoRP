// embedRP.js
// ========

module.exports = {
   
    rp: async function (rpData) {
        const embedResult = await new this.EmbedBuilder()

            .setColor(rpData.color)
            .setDescription(rpData.message);
            
            //vérification de la précense d'une image de pp sinon retire l'icone
            if(rpData.head != null && rpData.head != "")embedResult.setAuthor({ name:  rpData.firstname+" "+rpData.lastname, iconURL: rpData.head})
            else embedResult.setAuthor({ name:  rpData.firstname+" "+rpData.lastname})
          
            //vérification de la précense d'une image de corp sinon retire la thumbnail
            if(rpData.body != null && rpData.body != "")embedResult.setThumbnail(rpData.body)

         return embedResult;
    },
    
    ticket: async function (message,ask) {

        prefix = '!';

        
        var ticketMsg = message.content.replace(prefix+"ticket ","");
        var ticketMsg = message.content.replace(prefix+"ask ","");
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
                    embedResult.setColor(0xFFFF00);
                  break;
                case "userTicket":
                    embedResult.setColor(0x008000);
                  break;
              }

            if(ask != null)embedResult.setColor(0x008000);
            
            console.log(embedResult);
     return [defcon,embedResult];
    }
  };
  