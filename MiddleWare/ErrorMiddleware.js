
export function errormidleware(error,req,res, next){
console.error(error)
const statusCode = error.status || 500;
return res.status(statusCode).json({
    success:false,
    message: error.message||"خطای سرور، لظفا لحظاتی دیگر مجددا تلاش کنید"
})

}