import express from "express";
import { createUserController,updateUserController,UserControlller
    ,singleUserControlller,deleteUserController
 } from "../controllers/createUserController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router =express.Router()

router.post('/create-User',requireSignIn,isAdmin,createUserController);
//update user 
router.put(
    "/update-Usery/:id",
    requireSignIn,
    isAdmin,
  updateUserController
  );
  //get user
  router.get("/get-User", UserControlller);
  //single user
  router.get("/single-User/:id", singleUserControlller);
  //delete user
  router.delete("/delete-User/:id", requireSignIn, isAdmin, deleteUserController);

  



export default router;
