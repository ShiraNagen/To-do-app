const DB = {
    users: [],
    tasks: [],
    whoIsInCharge: []
}


//user functions:

function createUser () {
    DB.users.push(user)
    console.log(DB)
}

function addUser (user) {
    DB.users.push(user)
    console.log(DB)
}


function getUser (id) {
    return DB.users.find(user => user.id === id)
}

function updateUser (userToUpdate) {
    DB.users = DB.users.map(user => user.id === userToUpdate.id? userToUpdate: user)
}

function deleteUser (id) {
    DB.users = DB.users.filter(user => user.id != id)
}


//task functions:

function addTask (task) {
    DB.tasks.push(task)
    console.log(DB)
}

function getTask (id) {
    return DB.tasks.find(task => task.id === id)
}

function updateTask (taskToUpdate) {
    const taskIndex = DB.tasks.findIndex(task => task.id === taskToUpdate.id)
    DB.tasks[taskIndex] = taskToUpdate
}

function deleteTask (id) {
    DB.tasks = DB.tasks.filter(task => task.id != id)
}


// attach or detach a user to a task

function userToTask (taskId, userId, doAttach) {
    if(doAttach === 'true'){
        DB.whoIsInCharge.push({taskId: taskId, userId: userId})
    }
    else{
        const indexToRemove = DB.whoIsInCharge.findIndex(taskAndUserIds => taskAndUserIds.taskId === taskId && taskAndUserIds.userId === userId);
        if (indexToRemove > -1) {
            DB.whoIsInCharge.splice(indexToRemove, 1);
        }
    }
}

function isUserIdExist (userId){
    return DB.users.reduce((acc, user) => (acc || user.id === userId), false)
}

module.exports = {createUser, addUser, getUser, updateUser, deleteUser, addTask, getTask, updateTask, deleteTask, userToTask, isUserIdExist};




//curl -X PATCH -d "userId=&doAttach=true" http://localhost:3000/tasks/



