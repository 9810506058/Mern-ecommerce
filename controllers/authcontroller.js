import { comparePassword,hashpassword } from "../helpers/authHelper.js"
import usermodel from "../models/usermodel.js"
import JWT from "jsonwebtoken"

export const registerController = async(req,res) => {
  try{
    const{name,email,password,phone,address} =req.body
    if(!name){
      return res.send({error:'Name is required'})
    }
    if(!email){
      return res.send({error:'Email is required'})
    }
    if(!password || password.length < 6){
      return res.send({error:'Password is required and should be 6 character long'})
    }
    if(!phone){
      return res.send({error:'Phone number is required'})
    }
    if(!address){
      return res.send({error:'Address is required'})
    }
  
    const existingUser = await usermodel.findOne({email})
    if(existingUser){
      return res.status(200).send({
        success:false,
        message:'Already exist'
      })
    }
     const hashedpassword= await  hashpassword(password) 

     const user = new usermodel ({name,email,phone,address,password:hashedpassword }).save()
      res.status(201).send({
         success:true,
         message:"user register successfully",
         user
      })
  }

  catch(error)
  {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"error in registration process",
      error
    })
  }
    
  };

  export const loginController = async(req,res) => {
    try{
      const {email,password} = req.body
      if(!email || !password){
        return res.status(404).send({
          success:false,
          message:"invalid email or password"
        })
      }
//check user
      const user = await usermodel.findOne({email})
      if(!user){
        return res.status(404).send({
          success:false,
          message:"user not found"
        })
      }

      const match = await comparePassword(password,user.password)
      if(!match){
        return res.status(404).send({
          success:false,
          message:"invalid email or password"
        })
      }
      //await token

      const token = await JWT.sign({ _id:user._id},process.env.JWT_SECRET,{expiresIn:"7d",});

      res.status(200).send({
        success:true,
        message:"login successfully",
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          phone:user.phone,
          address:user.address,
          role:user.role
        },
        token
      })


    }
    catch(error){
      console.log(error)
      res.status(500).send({
        success:false,
        message:"Error in login",
        error
      })
    }
  }
  ;
  export const testcontroller=(req,res)=>{
    console.log("protected Route");
  }
;
      

  