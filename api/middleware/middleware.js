const Users = require("../users/users-model");

function logger(req, res, next) {
    const time = new Date().toString();
    console.log("logger middleware");
    console.log("the method is", req.method);
    console.log("the url is", req.url);
    console.log(time);
    next();
}

async function validateUserId(req, res, next) {
    try {
        const user = await Users.getById(req.params.id);
        if (!user) {
            res.status(404).json(`No user with id: ${req.params.id}`);
        } else {
            req.user = user;
            next();
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

function validateUser(req, res, next) {
    const newUser = req.body;
    if (!newUser.name) {
        res.status(400).json({ message: "missing required name field" });
    } else {
        next();
    }
}

function validatePost(req, res, next) {
    const newUser = req.body;
    if (!newUser.text) {
        res.status(400).json({ message: "missing required text field" });
    } else {
        next();
    }
}

module.exports = { validateUserId, validateUser, validatePost, logger };
