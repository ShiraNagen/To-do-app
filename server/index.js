// 1. POST /users -  create user
// 2. PUT /users/:id - update a user
// 3. GET /users/:id - returns a user
// 4. DELETE /users/:id - delete a user
// for each incoming request log to the console the URL and method


const express = require('express')
const app = express()
 
const userRouter = require('./userRouter');
const taskRouter = require('./taskRouter');

app.use(function (req, res, next) {
    console.log('Request Type:', req.method)
    console.log('Request URL:', req.originalUrl)
    next()
  })

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(3000)