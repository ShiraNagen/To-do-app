const express = require('express');
const bodyParser = require('body-parser');
const taskRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const taskAPI = require('./taskAPI');
const moment = require('moment');


//add task
taskRouter.post('/', urlencodedParser, async function (req, res) {
    const error = argsVlidation({ description: req.body.description, deadline: req.body.deadline }, 'task args');
    if (error.isError)
        res.status(412).send(error.errorMessage)
    else {
        try {
            const id = await taskAPI.addTask(req.body.description, req.body.deadline)
            Object.keys(id).length != 0 ?
                res.send(`Task with id: ${id} updated`) :
                res.status(412).send('Task to update does not exist')
        }
        catch (err) {
            console.log(err)
        }
    }
})

//get task
taskRouter.get('/:id', async function (req, res) {
    try {
        const task = await taskAPI.getTask(req.params.id)
        Object.keys(task).length != 0 ?
            res.send(task) :
            res.status(412).send("Task does not exist")
    }
    catch (err) {
        console.log(err)
    }
})

//get tasks
taskRouter.get('/', async function (req, res) {
    try {
        let tasks = await taskAPI.getTasks();
        //Arrange the format of the tasks to: {id, description, deadline, users<Array>}
        tasks = [...new Map(tasks.map(item => [item['id'], item])).values()]
            .map(task => ({
                id: task.id,
                description: task.description,
                deadline: task.deadline,
                users: (tasks.filter(row => row.id === task.id))
                    .map(r => r.user_id)
            }))
            res.send(tasks)
    }
    catch (err) {
        console.log(err)
    }
})

//update task
taskRouter.put('/:id', urlencodedParser, async function (req, res) {
    const error = argsVlidation({ description: req.body.description, deadline: req.body.deadline }, 'task args');
    if (error.isError)
        res.status(412).send(error.errorMessage)

    else {
        try {
            const id = await taskAPI.updateTask(req.body.description, req.body.deadline, req.params.id)
            Object.keys(id).length != 0 ?
                res.send(`Task with id: ${id} updated`) :
                res.status(412).send('Task to update does not exist')
        }
        catch (err) {
            console.log(err)
        }
    }
})

taskRouter.delete('/:id', async function (req, res) {
    try {
        const id = await taskAPI.deleteTask(req.params.id)
        Object.keys(id).length != 0 ?
            res.send(`Task with id: ${id} deleted`) :
            res.status(412).send('Task to delete does not exist')
    }
    catch (err) {
        console.log(err)
    }
})

// attach or detach a user to a task
taskRouter.patch('/:id', urlencodedParser, async function (req, res) {
    const error = argsVlidation({ userId: req.body.userId, attach: req.body.attach }, 'attach / detach args');
    if (error.isError)
        res.status(412).send(error.errorMessage)

    else {
        if (req.body.attach === 'true') {
            try {
                await taskAPI.attachUserToTask(req.body.userId, req.params.id)
                res.send('user attach to the task')
            }
            catch (err) {
                console.log(err)
            }
        }
        //detach user from task
        else {
            try {
                await taskAPI.detachUserFromTask(req.body.userId, req.params.id)
                res.send('user detach from the task')
            }
            catch (err) {
                console.log(err)
            }
        }
    }
})

taskRouter.get('/attach/:id', async function (req, res) {
    try {
        const usersId = await taskAPI.getUsersInTask(req.params.id);
        res.send(usersId)
    }
    catch (err) {
        console.log(err)
    }
})

//validation function:
function argsVlidation(args, type) {
    switch (type) {

        case 'task args':
            if (args.description === undefined)
                return { isError: true, errorMessage: 'Description is undefined' }
            if (args.deadline === undefined || !moment(args.deadline, 'DD.MM.YYYY', true).isValid())
                return { isError: true, errorMessage: 'Date is not valid' }
            return { isError: false }

        case 'attach / detach args':
            if (args.userId === undefined)
                return { isError: true, errorMessage: 'UserId is undefined' }
            if (args.attach != 'true' && args.attach != 'false')
                return { isError: true, errorMessage: 'It does not clear what to do - attach or detach, please send true or false respectively' }
            return { isError: false }
    }

}

module.exports = taskRouter;