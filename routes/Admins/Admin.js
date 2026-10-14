import express from 'express'
import { body } from "express-validator";
import { postAdminInfo } from '../../Controllers/Admin/Admin.js';
import { adminLogin } from '../../Controllers/Admin/Admin.js';
import { getProfile} from '../../Controllers/Admin/Admin.js';
import{checkLogin} from "../../MiddleWare/LoginCheack.js"
import { logout} from '../../Controllers/Admin/Admin.js'
import {geAlltAdmins} from '../../Controllers/Admin/Admin.js'
import { rbac } from '../../MiddleWare/RBACMiddleware.js';
import { Roles } from '../../Models/enum/RolesEnum.js';

export const AdminRouter= express.Router()

AdminRouter.post("/Register",checkLogin,rbac(Roles.SUPER_ADMIN), [
    body("name")
    .notEmpty()
    .withMessage("لطفا نام مدیر را وارد کنید")
    .isLength({min:5,max:50})
    .withMessage("لطفا نام مدیر را کامل وارد کنید بین 5 تا 50 کاراکتر")
    .trim(),

    body("username")
    .notEmpty()
    .withMessage("لطفا نام کاربری مدیر را وارد کنید")
    .isLength({min:3,max:25})
    .withMessage("نام کاربری مدیر باید بین 3 تا 25 کاراکتر باشد")
    .trim(),

    body("email")
    .notEmpty()
    .withMessage("لطفا ایمیل مدیر را وارد کنید")
    .isEmail()
    .withMessage("ایمیل وارد شده معتبر نمی باشد")
    .trim(),

   body("password")
  .notEmpty()
  .withMessage("لطفا یک رمز عبور مناسب ایجاد کنید")

  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage(
    "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، حروف کوچک، عدد و علامت باشد"
  )

  .trim(),

    body("confirmPassword")
    .notEmpty()
    .withMessage("لطفا تکرار رمز عبور خود را وارد کنید")

],postAdminInfo)

AdminRouter.get("/admins",geAlltAdmins)

AdminRouter.post("/Login",adminLogin )

AdminRouter.get("/Me",checkLogin,getProfile)

AdminRouter.post("/Logout", logout)

