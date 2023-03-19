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
    }



  };
  