// se encuentran todas las funcion es que dan respuesta a cada uno de los endpoints

const bcrypt = require('bcryptjs')
const store = require('./store')
const axios = require('axios')

const jwt = require('jsonwebtoken')
// const config = require('../config')


async function register(userData) {
  let format = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (format.test(userData.username)) {
    return { 'Error': 'Username can not contain special characters' }
  }
  else {
    let validate_IfUsernameExists = await store.get_UserBy_Username(userData.username)
    let validate_IfEmailExists = await store.get_UserBy_Email(userData.email)

    if (validate_IfEmailExists.length == 0 && validate_IfUsernameExists.length == 0 || validate_IfUsernameExists == null && validate_IfEmailExists == null) //Validar si el usuario existe
    {
      let hash = bcrypt.hashSync(userData.password, 10)

      let newUser = {
        'name': userData.name,
        'lastname': userData.lastName,
        'email': userData.email,
        'username': userData.username,
        'password': hash,
        'factAboutMe': userData.factAboutMe,
        'favouritePokemons': [],
        'pet': {}
      }

      return await store.register(newUser)
    }
    else {
      return { "Error": "The user already exists" }
    }
  }
}


async function login(user, password, callback) {
  let userData;



  function compare_Password(userPassword, dbPassword, logCallback) {
    bcrypt.compare(userPassword, dbPassword, async (err, res) => {
      if (err) {
        logCallback({ 'error': err })
      }
      if (res) {
        logCallback({ 'result': true })
      }
      else {
        logCallback({ 'result': false })
      }
    })
  }

  if (user.includes('@')) {
    userData = await store.get_UserBy_Email(user)



    if (userData == null || userData.length == 0) {
      callback({ "error": "This user does not exists" })
    }
    else {
      userData = userData[0]
      compare_Password(password, userData.password, (element) => {
        if (element.result) {

          const token = jwt.sign({ id: userData._id }, `secretkey`, {
            expiresIn: 60 * 60
          })
          callback({ "message": "user logged in", token })
        }
        else {
          callback({ "message": "check your login data" })
        }
      })
    }
  }
  else {
    userData = await store.get_UserBy_Username(user)

    if (userData == null || userData.length == 0) {
      callback({ "error": "This user does not exists" })
    }
    else {
      userData = userData[0]
      compare_Password(password, userData.password, function (element) {
        if (element.result) {
          const token = jwt.sign({ id: userData._id }, `secretkey`, {
            expiresIn: 60 * 60
          })

          callback({ "message": "user logged in", token })
        }
        else {
          callback({ "message": "check your login data" })
        }
      })
    }
  }





}


async function updatePersonalData(username, userData) {
  return await store.updatePersonalData(username, userData)
}


async function change_Password(username, oldPassword, newPassword, callback) {
  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]
  let userPassword = userData.password

  bcrypt.compare(oldPassword, userPassword, async (err, res) => {
    if (err) {
      callback({ 'error': err.message })
    }
    if (res) {
      let newPasswordhash = bcrypt.hashSync(newPassword, 10)
      await store.updatePersonalData(username, { 'password': newPasswordhash })
      callback({ 'Message': 'password updated successfully' })
    }
    else {
      callback({ 'message': 'wrong password' })
    }

  })
}

async function add_FavoritePokemon(username, pokemonName) {
  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]
  let pokemonAlreadyAdded = false

  for (let i = 0; i < userData.favouritePokemons.length; i++) {
    if (userData.favouritePokemons[i].toLowerCase() == pokemonName.toLowerCase()) {
      pokemonAlreadyAdded = true
      break;
    }
  }

  if (pokemonAlreadyAdded) {
    return { 'message': 'You already added this pokemon to the favorites list' }
  }
  else {

    userData.favouritePokemons.push(pokemonName)
    await store.updatePersonalData(username, { 'favouritePokemons': userData.favouritePokemons })

    return { 'message': 'Pokemon successfully added' }
  }
}


async function get_FavouritePokemonsData(username) {
  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]

  let allFavPokemonsData = []
  for (let i = 0; i < userData.favouritePokemons.length; i++) {
    let pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${userData.favouritePokemons[i]}`)
    allFavPokemonsData.push({ 'pokemon': userData.favouritePokemons[i], 'data': pokemonData.data })
  }
  return { 'favouritesPokemonsData': allFavPokemonsData }
}


async function selecYourPet_AndPersonalizedname(username, pokemonName, personalizedName) {

  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]

  if (userData["pet"] == null) {

    let pokemonObject = { "pokemon": pokemonName, "nickName": personalizedName }
    userData["pet"] = pokemonObject
    await store.updatePersonalData(username, { 'pet': userData.pet })

    return { 'message': 'Pokemon is your pet' }
  }
  else {

    return { 'message': 'You already have a pet assigned, please update it' }
  }

}

async function update_Pet(username, pokemonName, personalizedName) {
  let userData = await store.get_UserBy_Username(username)
  userData = userData[0]

  if (pokemonName == userData.pet.pokemon) {
    return { 'message': 'this pokemon is already your pet' }
  }
  if (personalizedName == userData.pet.nickName) {
    return { 'message': 'this is the name of your pet' }

  } else {
    let newPetObj = { 'pokemon': pokemonName, 'nickName': personalizedName }
    await store.updatePersonalData(username, { 'pet': newPetObj })

    return { 'message': 'pet successfully update' }
  }

}


async function get_PersonalData(username) {
  let userData = await store.get_UserBy_Username(username)
  if (userData == null || userData.length == 0) {
    return ({ "error": "This user does not exists" })
  }
  else {
    return { userData }
  }
}

module.exports = {
  register,
  login,
  updatePersonalData,
  change_Password,
  add_FavoritePokemon,
  get_FavouritePokemonsData,
  selecYourPet_AndPersonalizedname,
  update_Pet,
  get_PersonalData
}