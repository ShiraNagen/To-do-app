const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const userRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//add user
userRouter.post('/', urlencodedParser, function (req, res) {
    if (!usernameVlidation(req.body.username))
        res.send("Username is undefined")
    else if (!mailValidation(req.body.mail))
        res.send('Mail is not vaild')
    else {
        db.addUser({ id: uuidv4(), usrename: req.body.username, mail: req.body.mail })
        res.send(`User ${req.body.username} added`)
    }
})

//get user
userRouter.get('/:id', function (req, res) {
    res.send(createUser(req.params.id))
})

//update user
userRouter.put('/:id', urlencodedParser, function (req, res) {
    if (!usernameVlidation(req.body.username))
        res.send("Username is undefined")
    else if (!mailValidation(req.body.mail))
        res.send('Mail is not vaild')
    else {
        db.updateUser({ id: req.params.id, username: req.body.username, mail: req.body.mail })
        res.send("User updated")
    }
})

//delete user
userRouter.delete('/:id', function (req, res) {
    db.deleteUser(req.params.id);
    res.send("User deleted")
})



//validation function

function usernameVlidation(username) {
    return username != undefined
}

function mailValidation(mail) {
    return mail != undefined && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)
}

module.exports = userRouter;