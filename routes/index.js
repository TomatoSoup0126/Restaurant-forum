const restController = require('../controllers/restController.js')
const userController = require('../controllers/userController')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/restaurants'))

  app.get('/restaurants', restController.getRestaurants)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
}