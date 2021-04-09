const express = require("express");
const Posts = require("../posts/posts-model.js");
const Users = require("./users-model.js");
const {
    validateUserId,
    validateUser,
    validatePost,
} = require("../middleware/middleware.js");

const router = express.Router();

router.get("/", (req, res, next) => {
    Users.get(req.query)
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            next(error);
        });
}); // RETURN AN ARRAY WITH ALL THE USERS

router.get("/:id", validateUserId, (req, res) => {
    res.status(200).json(req.user);
}); // RETURN THE USER OBJECT

router.post("/", validateUser, (req, res, next) => {
    Users.insert(req.body)
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            next(error);
        });
}); // RETURN THE NEWLY CREATED USER OBJECT

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
    Users.update(req.params.id, req.body)
        .then(() => {
            return Users.getById(req.params.id);
        })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            next(error);
        });
}); //RETURN THE FRESHLY UPDATED USER OBJECT

router.delete("/:id", validateUserId, (req, res, next) => {
    Users.remove(req.params.id)
        .then(() => {
            res.status(200).json({ message: "the user has been deleted" });
        })
        .catch((error) => {
            next(error);
        });
}); // RETURN THE FRESHLY DELETED USER OBJECT

router.get("/:id/posts", validateUserId, (req, res, next) => {
    Users.getUserPosts(req.params.id)
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((error) => {
            next(error);
        });
}); // RETURN THE ARRAY OF USER POSTS

router.post(
    "/:id/posts",
    validateUserId,
    validatePost,
    async (req, res, next) => {
        try {
            const newPost = await Posts.insert({
                user_id: req.params.id,
                text: req.text,
            });
            res.status(201).json(newPost);
        } catch (error) {
            next(error);
        }
    }
); // RETURN THE NEWLY CREATED USER POST

router.use((err, req, res, next) => {
    res.status(500).json({
        message: "Something broke",
        error: err.message,
    });
});

module.exports = router;
