// chanSend.js
// ========

const nexus = require("./dataBaseNexus.cjs");

const idList = {

    server : "539713857308852224",
    log : "539713926644891669",
    image : "539713961784770570",
    addServ : "539714884988829706",
    delServ : "540831649076609027",
    help : "548168730681540612",
    
    ownerTicket : "540154188009832449",
    adminTicket : '1087022547687718922',
    userTicket : "539713994496409601",
    askTicket : "540156618588028938",
    
    contest : "540156618588028938",
    ban : "540435148089327618",
    unban : "540440387223814154",
    bandef : "540446390783049750",

};

module.exports = {
    
    log: function (msg) {
        sendMsgToChan(this.client,idList.log,msg);
    },
    image: function (imageData) {
        sendImageToChan(this.client,idList.image,image);
    },
    addServ: function (msg) {
        sendMsgToChan(this.client,idList.addServ,msg);	
    },
    delServ: function (msg) {
        sendMsgToChan(this.client,idList.delServ,msg);	
    },
    help: function (msg) {
        sendMsgToChan(this.client,idList.help,msg);	
    },
    ticket: function (ticketData) {
        sendMsgToChan(this.client,idList[ticketData[0]],ticketData[1]);	
    },
    askTicket: function (ticketData) {
        sendMsgToChan(this.client,idList.askTicket,ticketData[1]);	
    },
    rp: async function (message,msg) {
        
        //Si pas lock break
        if (msg == "unlock")return "unlock";
        
        //Si channel ban break
        if((await nexus.channelf(message,"check")).length != 0)return "unlock";
            message.delete();
            await message.channel.send({ embeds: [msg[1]]})
                .then(msgSend => { nexus.logRp(msg[0],msgSend,message.author.id)});
        
    },
    rpRoll: function (message,msg) {
        
        message.channel.send({ embeds: [msg]});
        
    },
    embed: function (message,msg) {
        message.delete();
        message.channel.send({ embeds: [msg]});
    },
    reply: function (message,msg) {
        message.delete();
        message.channel.send(msg);
    },
    notif: function (message,msg) {
        message.delete();
        message.channel.send(msg).then(msg => {setTimeout(() => msg.delete(), 10000)}).catch(console.error);
     },
     notifNoDel: function (message,msg) {
        message.channel.send(msg);
     },
    notifChanMp: function (message,msg) {
        message.delete();
        message.channel.send(msg[1]);
        this.client.users.fetch(msg[0], false).then((user) => {
            user.send(msg[2]);
        });

     },
    error: function (message,msg) {
        message.delete();
        message.channel.send(message.member.user.toString()+" "+msg).then(msg => {setTimeout(() => msg.delete(), 10000)}).catch(console.error);
     },
    errorMP: function (message,msg) {
        message.author.send("__Une Erreur est survenue, voici une copie de votre commande :__\n"+message.content).catch(console.error);
     }
     
  };
 
  async function sendMsgToChan(client,ChanId,msg){
    try {  

        if (typeof msg === 'string')await client.guilds.cache.get(idList.server).channels.cache.get(ChanId).send(msg);
        else if (typeof msg === 'string')d;
        else await client.guilds.cache.get(idList.server).channels.cache.get(ChanId).send({ embeds: [msg]});
    
    } catch (error) {console.error(error);};    
	

  }

  async function sendImageToChan(client,ChanId,imageData){
    try {  

        await client.guilds.cache.get(idList.server).channels.cache.get(ChanId).send({ files: imageData});
   
    
    } catch (error) {console.error(error);};    
	

  }
  