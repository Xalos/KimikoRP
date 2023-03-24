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
    advanceRoll: async function (message) {

        //var rollMsg = await utils.cClear(message.content,/!roll |!r /);
        
        //if(dice.validate())
        
    }

}
