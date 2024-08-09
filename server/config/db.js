import mongoose from 'mongoose'
import colors from 'colors'
const connect_db= async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)

    }
    catch(error){
        console.log('Error in db ${error}'.bgRed)
    }
};

export  default connect_db;