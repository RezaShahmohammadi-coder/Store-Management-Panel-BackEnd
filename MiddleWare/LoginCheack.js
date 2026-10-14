import jwt from "jsonwebtoken";

export function checkLogin(req, res, next) {
    const getToken = req.cookies.adminToken
    console.log(getToken)
    try {
        if (!getToken) {
          return res.status(401).json({
             success:false,
                message:"لطفا ابتدا وارد حساب کاربری خود بشوید"
          })
        }
        const decode = jwt.verify(getToken, process.env.JWT_SECRET)
        req.sub = decode.sub
        req.role=decode.role
        return next()

    } catch (err) {
        const error=new Error(err.message)
        error.status=401
        return next(error)
    }
}