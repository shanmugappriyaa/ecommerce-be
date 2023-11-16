const express = require('express')
const { createBrand, updateBrand, getBrand, getAllBrand } = require('../controller/brandCtrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/',authMiddleware,isAdmin,createBrand)
router.post('/:id',authMiddleware,isAdmin,updateBrand)
router.delete('/:id',authMiddleware,isAdmin,updateBrand)
router.get('/:id',getBrand)
router.get('/',getAllBrand)

module.exports = router