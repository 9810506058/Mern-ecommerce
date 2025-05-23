import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,

    },
    phone:{
        type:String,
        require:true,

    },
    address:{
        type:{},
        require:true,
    },

    role:{
        type:Number,
        default:0, //o for user 1 for admin
    }
},{timestamps:true}
)
;



export  default mongoose.model('users',userSchema)