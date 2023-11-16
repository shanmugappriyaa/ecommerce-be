const express= require('express')
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating, uploadImages, deleteImages } = require('../controller/productCtrl')
const router = express.Router()
const {isAdmin,authMiddleware} = require('../middleware/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middleware/uploadImages')

router.post('/create',authMiddleware,isAdmin,createProduct)
router.put('/upload',authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages)
router.delete('/delete-img/:id',authMiddleware,isAdmin,deleteImages)
router.get('/:id',getaProduct)
router.get('/',getAllProducts)
router.put('/:id',authMiddleware,isAdmin,updateProduct)
router.delete('/:id',authMiddleware,isAdmin,deleteProduct)
router.put('/wishlist',authMiddleware,addToWishList)
router.put('/rating',rating)

module.exports =router