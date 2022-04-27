const router = require("express").Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/post-create", (req, res, next) => {
    User.find()
    .then((dbUsers) => {
        res.render("posts/create", { dbUsers });
    })
    .catch((err) => console.log(`error while displaying the post: ${err}`));
});

router.post('/post-create', isLoggedIn, (req, res, next) => {
    const { title, content, author, rating } = req.body;

    Post.create({ title, content, author, rating })
        .then(dbPost => {
            return User.findByIdAndUpdate(author, { $push: { posts: dbPost._id } });
        })
        .then(() => res.redirect('/posts'))
        .catch(err => {
            errorMessage: `Error while creating the post! ${err}`;
            next(err);
        });
});

router.get('/post-list', isLoggedIn, (req, res, next) => {
    Post.find()
        .populate('author')
        .then(dbPosts => {
            res.render('posts/post-list', { dbPosts });
             
        })
        .catch(err => {
            console.log(`Err retrieving posts from database: ${err}`);
            next(err);
        });
});

router.get('/posts/:postId', (req, res, next) => {
    const { postId } = req.params;

    Post.findById(postId)
        .populate('author comments')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .then(foundPost => res.render('posts/post-detail', foundPost))
        .catch(err => {
            console.log(`Err retreiving the post from the database: ${err}`);
            next(err);
        });
});

router.get('/posts/:postId/edit', (req, res, next) => {
    const { postId } = req.params;

    Post.findById(postId)
        .then(postToEdit => {
            res.render('posts/edit', { post: postToEdit });
        })
        .catch(err => next(err));
});

router.post('/posts/:postId/edit', (req, res, next) => {
    const { postId } = req.params;
    const { title, content, rating } = req.body;

    Post.findByIdAndUpdate(postId, { title, content, rating }, { new: true })
        .then(updatePost => res.redirect(`/posts/${updatePost.id}`))
        .catch(err => next(err));
});

module.exports = router;