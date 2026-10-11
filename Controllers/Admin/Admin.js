import { PanelAdmin } from "../../Models/Admin.js"
import { validationResult } from "express-validator";
import next from "next"
import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken";


export async function postAdminInfo(req, res, next) {

    const result = validationResult(req);
    /* ما ارور هارو به 3 صورت ارورز که برای ولیدتور است و مسیج پاس میدیم به فرانت اند
    */

    if (!result.isEmpty()) {
        const errors = result.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));

        return res.status(400).json({
            success: false,
            message: "اطلاعات وارد شده صحیح نیست",
            errors,
        })
    }

    const HashPassword = await bcrypt.hash(req.body.password, 12)
    const info = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: HashPassword,
        available: req.body.available,
        confirmPassword: req.body.confirmPassword

    }


    console.log(info)

    try {
        const findAdmin = await PanelAdmin.findOne({ username: info.username })
        if (findAdmin) {
            const error = new Error("نام کاربری وارد شده تکراری است و از قبل در سیستم وجود دارد، لطفا نام کاربری دیگری وارد کنید")
            error.status = 400
            throw error
        }

        if (req.body.password !== info.confirmPassword) {
            const error = new Error("تکرار رمز عبور با رمز عبور مطابقت ندارد")
            error.status = 400
            throw error

        }

        const newAdmin = await PanelAdmin.create(info)
        if (newAdmin) {
            return res.status(201).json({
                message: " یک مدیر جدید  توسط شما با موفقیت ایجاد شد",
                data: newAdmin
            })
            console.log(newAdmin);

        }
    } catch (err) {
        next(err)
    }

}


export async function adminLogin(req, res, next) {
    const info = {
        username: req.body.username,
        password: req.body.password
    }

    try {
        const Admin = await PanelAdmin.findOne({ username: info.username })
        if (!Admin) {
            const error = new Error("نام کاربری یا رمز عبور اشتباه است");
            error.status = 401;
            throw error;
        }

        const cheackPassword = await bcrypt.compare(info.password, Admin.password)
        if (!cheackPassword) {
            const error = new Error("رمز عبور شما اشتباه است")
            error.status = 400
            throw error

        }

        const token = jwt.sign({ sub: Admin._id, name: Admin.name, email: Admin.email }, process.env.JWT_SECRET, { expiresIn: "1m" })

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 1000,
        });

        res.status(200).json({
    message: "ورود موفقیت‌آمیز بود"
});

        // req.session.adminId = Admin._id.toString()
        //req.session.isLoggedIn = true;

        /* res.status(200).json({
             message: "شما با موفقیت وارد پنل  شدید",
             isLoggedIn:req.session.isLoggedIn
 
         })*/


    } catch (err) {
        next(err)
    }
}


export function getProfile(req, res, next) {
    res.status(200).json({
        isLoggedIn: true,
        adminId: req.sub
    })
}

export function logout(req, res,next){
     res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    message: "با موفقیت از حساب کاربری خارج شدید",
  });
}

export async function geAlltAdmins(req,res,next){

}