// router file, e.g., authRoutes.js
import express from 'express';
import { registerController,loginController,testController, updateProfileController  } from '../controllers/authcontroller.js';  // Ensure correct import
import { isAdmin, requireSignIn } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Define route for user registration
router.post('/register', registerController);
//login/post
router.post('/login',loginController);
//test routes

router.get('/test',requireSignIn,isAdmin,testController);
//protected routes
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});


});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });

  });
  //update profile

router.put("/profile", requireSignIn, updateProfileController);
  

export default router;
