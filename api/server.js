const express = require("express");
const server = express();

const { logger } = require("./middleware/middleware.js");
const userRouter = require("./users/users-router.js");

server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
        stack: err.stack,
        custom: "something broke",
    });
});

module.exports = server;
