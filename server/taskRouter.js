const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const taskRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const db = require('./db');
const moment = require('moment')


//add task
taskRouter.post('/', urlencodedParser, function (req, res) {
    if (!descriptionValidation(req.body.description)) {
        res.send('Description is undefined')
    }
    else if (!dateValidation(req.body.deadline)) {
        res.send('Date is not valid')
    }
    else {
        db.addTask({ id: uuidv4(), description: req.body.description, deadline: req.body.deadline })
        res.send(`Task: '${req.body.description}' added`)
    }
})

//get task
taskRouter.get('/:id', function (req, res) {
    res.send(db.getTask(req.params.id))
})

//update task
taskRouter.put('/:id', urlencodedParser, function (req, res) {
    if (!descriptionValidation(req.body.description)) {
        res.send('Description is undefined')
    }
    else if (!dateValidation(req.body.deadline)) {
        res.send('Date is not valid')
    }
    else {
        db.updateTask({ id: req.params.id, description: req.body.description, deadline: req.body.deadline })
        res.send("Task updated")
    }
})

//delete task
taskRouter.delete('/:id', function (req, res) {
    db.deleteTask(req.params.id);
    res.send("Task deleted")
})

// attach or detach a user to a task
taskRouter.patch('/:id', urlencodedParser, function (req, res) {
    if (patchArgsValidation(req.body.userId, req.body.doAttach)){
        db.userToTask(req.params.id, req.body.userId, req.body.doAttach)
        req.body.doAttach === 'true' ? res.send("The user attached to the task") : res.send("The user detached from the task")
    }
    else
        res.send('Args are not valid')
})


//validation function:

function descriptionValidation(description) {
    return description != undefined
}

function dateValidation(date) {
    return (date != undefined && (moment(date, 'MM/DD/YYYY', true).isValid() || moment(date, 'MM.DD.YYYY', true).isValid()));
}

function patchArgsValidation(userId, doAttach){
    return userId != undefined && db.isUserIdExist(userId) && (doAttach === 'true' || doAttach === 'false')
}

module.exports = taskRouter;