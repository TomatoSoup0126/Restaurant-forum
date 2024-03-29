const db = require('../models')
const Comment = db.Comment

const commentService = require('../services/commentService')

let commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => {
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },

  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, (data) => {
      return res.redirect('back')
    })
  }
}
module.exports = commentController