const express = require('express')
var cors = require('cors');

const app = express()
 
const userRouter = require('./userRouter');
const taskRouter = require('./taskRouter');

app.use(function (req, res, next) {
    console.log('Method:', req.method, ', ', 'URL:', req.originalUrl)
    next()
})

app.use(cors());
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(3001)