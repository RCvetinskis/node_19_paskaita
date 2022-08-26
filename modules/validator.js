const sendRes = require("./sendRes")


module.exports={
    validateRegister:(req,res,next)=>{
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const {email, passOne, passTwo} = req.body
        if(passOne !==passTwo) return sendRes(res, "password should match",true)
        if(passOne.length< 4) return sendRes(res,"password minimum length 5",true)
        if(!email.match(mailformat)) return sendRes(res, "email should include @ and .", true)
        next()
    }
   
}