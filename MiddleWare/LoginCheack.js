import jwt from "jsonwebtoken";

export function checkLogin(req, res, next) {
    const getToken = req.cookies.adminToken
    try {
        if (!getToken) {
            throw new Error("لطفا ابتدا وارد حستب کاربری خود شوید")
        }
        const decode = jwt.verify(getToken, process.env.JWT_SECRET)
        req.sub = decode.sub
        return next()

    } catch (err) {
        const error=new Error(err.message)
        error.status=401
        return next(error)
    }
}