//Se encuentran los modelos para hacer la conexión con la base de datos

const Model = require('./model')

async function register(userData){
    return await Model.create(userData)
}

async function get_UserBy_Username(username){
    return await Model.find({'username':username})
}

async function get_UserBy_Email(email){
    return await Model.find({'email':email})
}

async function update_PersonalData(username,newUserData){
    return await Model.updateOne({'username':username}, newUserData)
}


module.exports = {
    register, 
    get_UserBy_Username,
    get_UserBy_Email,
    update_PersonalData
}