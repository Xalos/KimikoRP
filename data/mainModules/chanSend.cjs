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
    userTicket : "539713994496409601",
    askTicket : "540156618588028938",
    
    contest : "540156618588028938",
    ban : "540435148089327618",
    unban : "540440387223814154",
    bandef : "540446390783049750",

};

module.exports = {
    log: function (msg) {
        sendMsgToChan(idList.log,msg);
    },
    image: function (msg) {
        sendMsgToChan(idList.image,msg);
    },
    addServ: function (msg) {
        sendMsgToChan(idList.addServ,msg);	
    },
    delServ: function (msg) {
        sendMsgToChan(idList.delServ,msg);	
    },
    help: function (msg) {
        sendMsgToChan(idList.help,msg);	
    },
    ownerTicket: function (msg) {
        sendMsgToChan(idList.ownerTicket,msg);	
    },
    userTicket: function (msg) {
        sendMsgToChan(idList.userTicket,msg);	
    },
    askTicket: function (msg) {
        sendMsgToChan(idList.askTicket,msg);	
    },
    rp: function (message,msg) {
        message.delete();
        message.channel.send({ embeds: [msg]});
    }
  };


  function sendMsgToChan(ChanId,msg){
    this.client.channels.cache.get(ChanId).send(msg);
   //this.client.c
  }
  
 
