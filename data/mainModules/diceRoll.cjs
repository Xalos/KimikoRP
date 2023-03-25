// diceRoll
// ========

const utils = require("./utils.cjs");

const Roll = require('roll');
const dice = new Roll();

module.exports = {
    
    classicRoll: async function (message) {

        var rollMsg = await utils.cClear(message.content,/!roll |!r /i); 
       
        if(dice.validate(rollMsg)){
        var rollData = dice.roll(rollMsg);
        return [rollMsg,rollData.rolled,rollData.result]}

        else throw ["ErrorReply","La valeur __**"+rollMsg+"**__ assignée au dé n'est pas valide",message];
    },
    advanceRoll: async function (rollDataDB) {

        if(dice.validate(rollDataDB[1])){
            var rollData = dice.roll(rollDataDB[1]);
            console.log(rollDataDB);    
            let winFail = "Fail";

            switch(rollDataDB[2]){
                case "-" :
                    if(rollDataDB[3] >= rollData.result)winFail = "Réussite";
                    console.log("-");
                break;
                case "+" :
                    if(rollDataDB[3] <= rollData.result)winFail = "Réussite";
                    console.log("+");
                break;
            }

            console.log([rollDataDB[1],rollData.rolled,rollData.result,winFail,rollDataDB[0],rollDataDB[4],rollDataDB[5]]);

            return [rollDataDB[1],rollData.rolled,rollData.result,winFail,rollDataDB[0],rollDataDB[4],rollDataDB[5]]
        }
        

        //Si cette erreur ce trigger c'est qu'il y a un sacré problème
        else throw ["ErrorReply","La valeur __**"+rollMsg+"**__ assignée au dé dan la statistique n'est pas valide",message];
        
    },
    diceTest: async function (message) {

        return dice.validate(message);
        
    }

}
