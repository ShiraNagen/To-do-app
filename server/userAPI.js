const db = require('../db/db')


async function addUser(username, mail, res) {
    return await db('users')
        .insert({ username: username, mail: mail })
        .returning('id');
}

async function getUser(id) {
    return await db('users').where('id', id);
}

async function getUsers() {
    return await db.select().table('users')
}

async function updateUser(username, mail, id) {
    return await db('users')
        .where('id', id)
        .update({
            username: username,
            mail: mail
        })
        .returning('id');
}

async function deleteUser(id) {
    await db('user_to_task').where('user_id', id).del();
    return await db('users').where('id', id).del('id');
}


module.exports = { addUser, getUser, getUsers, updateUser, deleteUser }