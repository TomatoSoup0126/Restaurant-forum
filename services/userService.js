const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Like = db.Like
const Comment = db.Comment
const Restaurant = db.Restaurant
const Followship = db.Followship

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '139178d64d36915'

const userController = {
  getUser: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [{ model: Restaurant }] },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    }).then(userResult => {
      let comments = userResult.Comments
      let uniqueComments = Array.from(new Set(comments.map(comment => comment.RestaurantId))) //Array複寫comments, Set()將map成comment.RestaurantId的陣列重複值忽略
        .map(RestaurantId => {
          return comments.find(comment => comment.RestaurantId === RestaurantId) //用篩過的餐廳id去篩留言id
        })
      callback({ userResult, uniqueComments })
    })
  },

  editUser: (req, res) => {
    let user = req.user
    return User.findByPk(req.params.id)
      .then(userResult => {
        if (userResult.id !== user.id) {
          req.flash('error_messages', '嗶嗶! 不可以改人家的資訊!')
          res.redirect(`/users/${req.params.id}`)
        } else {
          return res.render('editUser', { userResult })
        }
      })
  },

  putUser: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "記得填名字!" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : restaurant.image,
            })
              .then((user) => {
                callback({ status: 'success', message: '個人資訊更新囉' })
              })
          })
      })
    }
    else
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image,
          })
            .then((user) => {
              callback({ status: 'success', message: '個人資訊更新囉' })
            })
        })
  },

  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        callback({ status: 'success', message: '' })
      })
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  },

  like: (req, res, callback) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        callback({ status: 'success', message: '' })
      })
  },

  unlike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  },

  getTopUser: (req, res, callback) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      callback({ users: users })
    })
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        callback({ status: 'success', message: '' })
      })
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = userController