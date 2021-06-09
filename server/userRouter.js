const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const userAPI = require('./userAPI');
const userRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//add user
userRouter.post('/', urlencodedParser, async function (req, res) {
    const error = asgsVlidation(req.body.username, req.body.mail)
    if (error.isError)
        res.send(error.errorMessage)
    else {
        try {
            const id = await userAPI.addUser(req.body.username, req.body.mail)
            Object.keys(id).length != 0 ?
                res.send(`User with id: ${id} added`) :
                res.status(500).send(`Add user fail`)
        }
        catch (err) {
            console.log(err)
        }
    }
})

//get user
userRouter.get('/:id', async function (req, res) {
    try {
        const user = await userAPI.getUser(req.params.id)
        Object.keys(user).length != 0 ?
            res.send(user) :
            res.status(412).send(`user does not exist`)
    }
    catch (err) {
        console.log(err)
    }
})

//get all users
userRouter.get('/', async function (req, res) {
    try {
        const users = await userAPI.getUsers()

        res.send(users)
    }
    catch (err) {
        console.log(err)
    }
})

//update user
userRouter.put('/:id', urlencodedParser, async function (req, res) {
    const error = asgsVlidation(req.body.username, req.body.mail)
    if (error.isError)
        res.send(error.errorMessage)
    else {
        try {
            const id = await userAPI.updateUser(req.body.username, req.body.mail, req.params.id)

            Object.keys(id).length != 0 ?
                res.send(`User with id: ${id} updated`) :
                res.status(412).send('User does not exist')
        }
        catch (err) {
            console.log(err)
        }

    }
})

//delete user
userRouter.delete('/:id', async function (req, res) {
    try {
        const id = await userAPI.deleteUser(req.params.id)
        Object.keys(id).length != 0 ?
            res.send(`User with id: ${id} deleted`) :
            res.status(412).send('User to delete does not exist')
    }
    catch (err) {
        console.log(err)
    }
})

//validation function
function asgsVlidation(username, mail) {
    if (username == undefined)
        return { isError: true, errorMessage: "username is undefined" }
    if (mail == undefined || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
        return { isError: true, errorMessage: "mail is not valid" }
    return { isError: false }
}

module.exports = userRouter;