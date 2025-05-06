import express from "express";
import { createCategoryController,updateCategoryController,categoryControlller
    ,singlecategoryControlller,deleteCategoryController
 } from "../controllers/createCategoryController.js";
import { isAdmin, requireSignIn } from "../src/middlewares/authmiddleware.js";

const router =express.Router()

router.post('/create-category',requireSignIn,isAdmin,createCategoryController);
//update category
router.put(
    "/update-category/:id",
    requireSignIn,
    isAdmin,
    updateCategoryController
  );
  
//getALl category
router.get("/get-category", categoryControlller);

//single category
router.get("/single-category/:slug", singlecategoryControlller);

//delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);




export default router;
