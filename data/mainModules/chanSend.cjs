// chanSend.js
// ========

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
    image: function (msg) {
        sendMsgToChan(this.client,idList.image,msg);
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
    rp: function (message,msg) {
    
        message.delete();
        message.channel.send({ embeds: [msg]});
    }
  };
 
  async function sendMsgToChan(client,ChanId,msg){
    try {  
        console.log("YESF");
        console.log(ChanId);
        if (typeof msg === 'string')await client.guilds.cache.get(idList.server).channels.cache.get(ChanId).send(msg);
        else await client.guilds.cache.get(idList.server).channels.cache.get(ChanId).send({ embeds: [msg]});
    
    } catch (error) {console.error(error);};    
	

  }
