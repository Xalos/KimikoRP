// dataBaseNexus
// ========

const utils = require("./utils.cjs");

const { host, user, password, database, port } = require('./../../config.json');

const mariadb = require('mariadb');
const pool = mariadb.createPool({host: host,port: port,user: user,password: password,database: database, connectionLimit: 100});


module.exports = {
    
    test: async function () {
    
        let conn;
        try {
                console.log("----------   Start DB Test  -----------")
                conn = await pool.getConnection();
                conn.query('SELECT * FROM NPC').then((rows) => {console.log(rows);});
                conn.query('SELECT * FROM PlayerPageList').then((rows) => {console.log(rows);});
                conn.query('SELECT * FROM MainLock').then((rows) => {console.log(rows);});
                conn.query('SELECT * FROM VIP').then((rows) => {console.log(rows);});
                conn.query('SELECT * FROM ChannelBan').then((rows) => {console.log(rows);});
                conn.query('SELECT * FROM ServerList').then((rows) => {console.log(rows);});
                conn.query('SELECT * FROM `Character`').then((rows) => {console.log(rows);});
                await console.log("----------   End DB Test  -----------")


                //rows[0].id_charac


                // rows: [ {val: 1}, meta: ... ]
            
                //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
                // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }

        } finally {
              if (conn) conn.release(); //release to pool
        }


        return 
    },

    character: async function (message,mContent,type) {

        var serverId = message.guildId;
        var playerId = message.author.id;
        var rpData = await (await utils.cClear(mContent,/!rp |!npc |r /)).split(' ');

       
        if(!rpData[1])throw ["ErrorReply","Votre message ne contient aucun text",message];

        let conn;
        
        
        console.log(serverId+" "+playerId+" "+rpData[0]);
        
        try {
            conn = await pool.getConnection();
           
            var result = await conn.query("SELECT * FROM `Character` WHERE id_server = ? AND id_player = ? AND first_name = ?",[serverId,playerId,rpData[0]]);

            

            if(result.length === 0 || !result)throw ["ErrorReply","Impossible de trouver __votre__ personnage : **"+rpData[0]+"**",message];

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

    characterd: async function (message) {

        var Mcontent 

        let conn;
        
        try {
            conn = await pool.getConnection();

            conn.query('SELECT '+d+' FROM `Character`').then((rows) => {
                
                
                console.log(rows);
            
            
            
            });

        } finally {
        if (conn) conn.release(); //release to pool
    }

    },

  }
