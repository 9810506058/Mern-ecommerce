// router file, e.g., authRoutes.js
import express from 'express';
import { registerController,loginController,testcontroller  } from '../controllers/authcontroller.js';  // Ensure correct import
import { requireSignIn,isAdmin } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Define route for user registration
router.post('/register', registerController);
//login/post
router.post('/login',loginController);
//test routes

router.get('/test',requireSignIn,isAdmin,testcontroller);
//protected routes
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});

});

export default router;
