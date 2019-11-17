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
const restController = require('../controllers/api/restController')


// JWT signin
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)


router.get('/admin', authenticated, authenticatedAdmin, (req, res) => res.redirect('/api/admin/restaurants'))
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), authenticated, authenticatedAdmin, adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), authenticated, authenticatedAdmin, adminController.putRestaurant)

router.get('/admin/users', authenticated, authenticatedAdmin, adminController.editUsers)
router.put('/admin/users/:id', authenticated, authenticatedAdmin, adminController.putUsers)

router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategories)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategories)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)

router.get('/', authenticated, authenticatedAdmin, (req, res) => res.redirect('/api/restaurants'))
router.get('/restaurants', authenticated, authenticatedAdmin, restController.getRestaurants)
router.get('/restaurants/top', authenticated, authenticatedAdmin, restController.getTopRestaurant)
router.get('/restaurants/feeds', authenticated, authenticatedAdmin, restController.getFeed)
router.get('/restaurants/:id', authenticated, authenticatedAdmin, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, authenticatedAdmin, restController.getDashboard)

module.exports = router