const sendRes = require("../modules/sendRes")
const adminUserSchema = require("../Schemas/adminUserSchema")



module.exports={
    
    login: async (req,res)=>{
       const {username, password}= req.body
       const user = await adminUserSchema.findOne({username, password})
       if(user){
        return res.send({message: "logged in as admin", error:false, user})
       }
       res.send({message: "bad username or password", error:true})
        
    }

   

}
