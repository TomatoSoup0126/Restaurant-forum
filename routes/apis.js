const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')


// JWT signin
router.post('/signin', userController.signIn)

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), authenticated, authenticatedAdmin, adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), authenticated, authenticatedAdmin, adminController.putRestaurant)

router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategories)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategories)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)

module.exports = router