const router = require("express").Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model")
const isLoggedIn = require("../middleware/isLoggedIn");

router.post('/posts/:postId/comment', isLoggedIn, (req, res, next) => {
    const { postId } = req.params;
    const { author, content } = req.body;

    let user = req.session.currentUser;

    console.log(user, postId, req.params)
    Post.findById(postId)
    .then(dbPost => {
        let newComment;

        newComment = new Comment({ author: user._id, content });

        newComment
        .save()
        .then(dbComment => {
            dbPost.comments.push(dbComment._id);

            dbPost
                .save()
                .then(updatedPost => res.redirect(`/posts/${updatedPost._id}`))
        })
        .catch(err => {
        console.log(`Error while creating comment: ${err}`);
        next(err);
        })
    });
})

// router.post('/posts/:postId/comment/delete', isLoggedIn, (req, res, next) => {
//     const { postId } = req.params;

//     Comment.findByIdAndDelete(postId)
//         .then(() => res.redirect('/posts'))
//         .catch(err => next(err));
// });

module.exports = router;