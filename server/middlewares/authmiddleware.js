import JWT from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

//protexted route token base

export const requireSignIn=async (req,res,next)=>{
    try{
        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user=decode;
    
next();
    }
    catch(error){
        console.log(error )
        return res.status(401).json({message:"Unauthorized"});

    }
}
//admin acess

export const isAdmin =async (req,res,next)=>{
    try{
        const user = await usermodel.findById(req.user._id)

        if(user.role !== 1){
            return res.status(401).send({
                success:false,
                message:"UnAuthorized"
            })
        }

        next();
        

    }
    catch(error){
        console.log(error )

    }
}