const db = require('../db/db')

// tasks
async function getTasks() {
    return await db('tasks')
    .leftJoin('user_to_task', 'tasks.id', '=', 'user_to_task.task_id')
    .select('tasks.*', 'user_to_task.user_id')
}

async function addTask(description, deadline) {
    return await db('tasks')
        .insert({ description: description, deadline: deadline })
        .returning('id');
}

async function getTask(id, res) {
    return await db('tasks')
        .where('id', id)
}

async function updateTask(description, deadline, id) {
    return await db('tasks')
        .where('id', id)
        .update({
            description: description,
            deadline: deadline
        })
        .returning('id');

}

async function deleteTask(id) {
    await db('user_to_task').where('task_id', id).del();
    return await db('tasks')
        .where('id', id)
        .del('id');
}

async function attachUserToTask(userId, taskId) {
    return await db('user_to_task')
        .insert({ user_id: userId, task_id: taskId })
        .returning('id')

}

async function detachUserFromTask(userId, taskId) {
    return await db('user_to_task')
        .where({ user_id: userId, task_id: taskId })
        .del('id')
}

module.exports = { addTask, getTask, getTasks, updateTask, deleteTask, attachUserToTask, detachUserFromTask }