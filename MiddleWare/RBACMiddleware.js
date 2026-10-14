
export function rbac(...roles){
    return function(req,res,next){
        if(!req.sub){
            return res.status(401).json({
                success:false,
                message:"!لطفا ابتدا وارد حساب کاربری خود شوید"
            })
        }

        if(!roles.includes(req.role)){
            res.status(403).json({
                success:false,
                message:"شما دسترسی برای انجام این عملیات را ندارید!!!"
            })
        }
        return next()
    }
    
}