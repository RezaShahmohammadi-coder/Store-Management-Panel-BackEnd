import express from 'express'
import{getAllProduct} from"../../Controllers/Products/Product.js"
import {deleteProductById} from"../../Controllers/Products/Product.js"
import { body } from "express-validator";
import {createProduct} from"../../Controllers/Products/Product.js"
import { updateProduct } from '../../Controllers/Products/Product.js';
 import { getProductById } from '../../Controllers/Products/Product.js';
import { checkLogin } from '../../MiddleWare/LoginCheack.js';
import { rbac } from '../../MiddleWare/RBACMiddleware.js';
import { Roles } from '../../Models/enum/RolesEnum.js';


export const ProductRouter= express.Router();

ProductRouter.get("/", getAllProduct)

ProductRouter.delete("/Delete/:id",checkLogin,rbac(Roles.SUPER_ADMIN), deleteProductById)

ProductRouter.post("/Create",checkLogin,[
body("title")
    .trim()
    .notEmpty()
    .withMessage("نام محصول را وارد کنید")
    .isLength({ min: 3, max: 100 })
    .withMessage("عنوان محصول باید بین ۳ تا ۱۰۰ کاراکتر باشد"),
    
    body("price")
    .notEmpty()
    .withMessage("قیمت محصول الزامی است")
    .isNumeric()
    .withMessage("قیمت باید عدد باشد")
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error("قیمت باید بیشتر از صفر باشد");
      }

      return true;
    }),

      body("category")
    .trim()
    .notEmpty()
    .withMessage("دسته‌بندی الزامی است")
    .isIn(["پیراهن", "شلوار", "لباس"])
    .withMessage("دسته‌بندی نامعتبر است"),

   

     body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("توضیحات نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد"),
], createProduct
    

)

ProductRouter.put("/Update/:id",checkLogin,rbac(Roles.SUPER_ADMIN),[
body("title")
    .trim()
    .notEmpty()
    .withMessage("نام محصول را وارد کنید")
    .isLength({ min: 3, max: 100 })
    .withMessage("عنوان محصول باید بین ۳ تا ۱۰۰ کاراکتر باشد"),
    
    body("price")
    .notEmpty()
    .withMessage("قیمت محصول الزامی است")
    .isNumeric()
    .withMessage("قیمت باید عدد باشد")
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error("قیمت باید بیشتر از صفر باشد");
      }

      return true;
    }),

      body("category")
    .trim()
    .notEmpty()
    .withMessage("دسته‌بندی الزامی است")
    .isIn(["پیراهن", "شلوار", "لباس"])
    .withMessage("دسته‌بندی نامعتبر است"),

   

     body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("توضیحات نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد"),
],updateProduct)

ProductRouter.get("/:id",getProductById)