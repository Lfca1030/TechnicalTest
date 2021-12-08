

const bcrypt = require('bcryptjs')
const store = require('./store')
const axios = require('axios')


async function register(userData){
  let format = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;

  if(format.test(userData.username)){
    return {'Error':'Username can not contain special characters'}
  }
  else
  {
    let validate_IfUsernameExists = await store.get_UserBy_Username(userData.username)
    let validate_IfEmailExists = await store.get_UserBy_Email(userData.email)

    if(validate_IfEmailExists.length == 0 && validate_IfUsernameExists.length == 0 || validate_IfUsernameExists == null && validate_IfEmailExists == null) //Validar si el usuario existe
    { 
      let hash = bcrypt.hashSync(userData.password, 10)
      
      let newUser = {
        'name': userData.name,
        'lastname': userData.lastName,
        'email': userData.email,
        'username': userData.username,
        'password':hash,
        'factAboutMe': userData.factAboutMe,
        'favouritePokemons':[]
      }

      return await store.register(newUser)
    }
    else
    {
      return {"Error": "The user already exists"}
    }
  }
}


async function login(user, password, callback){
  let userData;
  
  function compare_Password(userPassword,dbPassword, logCallback){
    bcrypt.compare(userPassword,dbPassword, async (err, res) => {
      if (err){
        logCallback({'error':err})
      }
      if(res)
      {
        logCallback({'result':true})
      }
      else
      {
        logCallback({'result':false})
      }
    })
  }

  if (user.includes('@')){
    userData = await store.get_UserBy_Email(user)
    
    if(userData == null || userData.length == 0)
    {
      callback({"error": "This user does not exists"})
    }
    else
    {
      userData = userData[0]
      compare_Password(password, userData.password,(element)=>{
        if (element.result){
          callback({"message":"user logged in"})
        }
        else
        {
          callback({"message": "check your login data"})
        }
      })
    }
  }
  else
  {
    userData = await store.get_UserBy_Username(user)

    if(userData == null || userData.length == 0)
    {
      callback({"error": "This user does not exists"})
    }
    else
    {
      userData = userData[0]
      compare_Password(password,userData.password,function (element){
        if (element.result){
          callback({"message":"user logged in"})
        }
        else
        {
          callback({"message": "check your login data"})
        }
      })
    }
  }
}


async function update_PersonalData(username, userData){
  return await store.update_PersonalData(username, userData)
}


async function change_Password(username, oldPassword, newPassword, callback){
  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]
  let userPassword = userData.password

  bcrypt.compare(oldPassword, userPassword, async (err,res)=>{
    if(err)
    {
      callback({'error': err.message})
    }
    if(res)
    {
      let newPasswordhash = bcrypt.hashSync(newPassword, 10)
      await store.update_PersonalData(username, {'password':newPasswordhash})
      callback({'Message':'password updated successfully'})
    }
    else
    {
      callback({'message':'wrong password'})
    }

  })
}

async function addFavoritePokemon(username,pokemonName){
  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]
  let pokemonAlreadyAdded = false

  for(let i = 0; i < userData.favouritePokemons.length; i++)
  {
    if(userData.favouritePokemons[i].toLowerCase() == pokemonName.toLowerCase())
    {
      pokemonAlreadyAdded = true
      break;
    }
  }

  if(pokemonAlreadyAdded)
  {
    return {'message':'You already added this pokemon to the favorites list'}
  }
  else
  {
    userData.favouritePokemons.push(pokemonName)
    await store.update_PersonalData(username, {'favouritePokemons': userData.favouritePokemons})
    
    return {'message':'Pokemon successfully added'}
  }
}

async function getFavouritePokemonsData(username){
  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]

  let allFavPokemonsData = []
  for(let i = 0; i < userData.favouritePokemons.length; i++) {
    let pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${userData.favouritePokemons[i]}`)
    allFavPokemonsData.push({'pokemon':userData.favouritePokemons[i], 'data':pokemonData.data})
  }
  return {'favouritesPokemonsData': allFavPokemonsData}
}

module.exports = {
  register,
  login,
  update_PersonalData,
  change_Password,
  addFavoritePokemon,
  getFavouritePokemonsData,
}