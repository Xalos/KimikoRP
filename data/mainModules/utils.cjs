// utils.cjs
// ========

module.exports = {
    
    cClear: async function (mContent,command) {
       mContent = await mContent.replace(command,"");
       return mContent
    }

}
