import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import { createCategoryController } from "../controllers/createCategoryController.js";

const router =express.Router()

router.post('/create-category',requireSignIn,isAdmin,createCategoryController);


export default router;
