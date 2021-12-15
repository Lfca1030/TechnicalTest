//Se encuentran los endpoint para los datos de users

const express = require('express')
const response = require('../../networtk/response')
const controller = require('./controller')
const router = express.Router()
const verify = require('../../midleware/verify')

//Endpoin para usuarios que deseen registrarse 

router.post('/register', (req,res)=>{
    controller.register(req.body)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

//Enpoind para usuarios ya registrados

router.post('/login', (req, res)=>{
    controller.login(req.body.user, req.body.password, function(obj){
        if (obj.error){
            response.error(req, res,obj, "error", 500);
        }
        else{
            response.success(req, res, "OK", obj);
        }
      
    })
})

//Enpoind que permite a un usuario ya registrado actualizar sus datos personales

router.post('/updatePersonalData/:username',verify, (req, res)=>{
    controller.updatePersonalData(req.params.username, req.body)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

//Endpoin que permite a un usuario ya registrado hacer cambio de su contraseña

router.post('/changePassword/:username', (req, res)=>{
    controller.change_Password(req.params.username, req.body.oldPassword, req.body.newPassword, function(obj){
        if (obj.error){
            response.error(req, res,obj, "error", 500);
        }
        else{
            response.success(req, res, "OK", obj);
        }
    })
})

//Endpoin que permite agregar pokemons a nuestra lista de favoritos

router.post('/addFavouritePokemon/:username', (req, res) => {
    controller.add_FavoritePokemon(req.params.username,req.body.pokemonName)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

//Endpoin que permite ver la data de los pokemons que están en la lista de favoritos

router.get('/favouritePokemonsData/:username', (req, res) =>{
    controller.get_FavouritePokemonsData(req.params.username)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

//Endpoint que nos permite tomar un pokemon como mascota, adicional podremos cambiar el nombre de nuestra mascota

router.post(`/petPokemon`,(req,res)=>{
    controller.selecYourPet_AndPersonalizedname(req.body.username, req.body.pokemon,req.body.nickName)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

router.post('/updatePet/:username', (req, res)=>{
    controller.update_Pet(req.params.username, req.body.pokemon,req.body.nickName)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

//Endpoint que nos trae toda la información de un usuario

router.get('/personalData/:username', (req, res)=>{
    controller.get_PersonalData(req.params.username)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

module.exports = router;