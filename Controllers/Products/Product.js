import next from "next"
import { Product } from "../../Models/Product.js"
import { validationResult } from "express-validator";

export async function getAllProduct(req, res) {

    try {
        const Products = await Product.find()
        if (Products.length === 0) {
            return res.status(404).json({
                message: "محصولی در سامانه شما یافت نشد"
            })
        }
        res.status(200).json({
            message: "محصولات دیتابیس با موفقیت یافت شدند",
            data: Products
        })
    } catch (err) {
        console.error(err)
    }

}



export async function deleteProductById(req, res, next) {
    const { id } = await req.params
    try {
        const lastProduct = await Product.findByIdAndDelete(id)
        if (!lastProduct || !id) {
            throw new Error("محصولی با این آیدی وجود ندارد")
        }
        res.status(200).json({
            success: true,
            message: "محصول مورد نطر با موفقیت از سبد خرید حذف شد",
            data: lastProduct

        })
    } catch (err) {
        const error = new Error(err)
        error.status = 500
        return next(error)
    }
}


export async function createProduct(req, res, next) {

    console.log(req.body)
    const result = validationResult(req);
    console.log(result)

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

    try {
        const details = {
            title: req.body.title,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
            description: req.body.description,
            id: Date.now()
        }
        const newProduct = await Product.create(details)
        res.status(201).json({
            message: "محصول شما با موفقیت ایجاد شد",
            data: newProduct
        })
    } catch (err) {
        const error = new Error(err)
        error.status = 500
        return next(error)
    }
}


export async function updateProduct(req, res, next) {
    const { id } = req.params
    const { title, price, image, category, description } = req.body
    try {
        let product = await Product.findByIdAndUpdate(
            id,
            { title, price, image, category, description },
            { new: true, runValidators: true }
        )
        res.status(200).json({
            success: true,
            data: product
        })

        if (!id || !product) {
            const error = new Error("محصولی با این شناسه وجود ندارد")
            error.status = 400
            throw error
        }

    } catch (err) {
        next(err)
    }


}

export async function getProductById(req, res, next) {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        
        if (!product) {
            const error = new Error("محصولی با این شناسه وجود ندارد")
            error.status = 404
            throw error
        }

         res.status(200).json({
            success:true,
            data:product
        })
        
    } catch(err){
        next(err)
    }
    }