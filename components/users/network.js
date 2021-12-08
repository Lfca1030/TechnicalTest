//Se encuentran los endpoint para los datos de users

const express = require('express')
const response = require('../../networtk/response')
const controller = require('./controller')
const router = express.Router()

router.post('/register', (req,res)=>{
    controller.register(req.body)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

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

router.post('/update_PersonalData/:username', (req, res)=>{
    controller.update_PersonalData(req.params.username, req.body)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

router.post('/change_Password/:username', (req, res)=>{
    controller.change_Password(req.params.username, req.body.oldPassword, req.body.newPassword, function(obj){
        if (obj.error){
            response.error(req, res,obj, "error", 500);
        }
        else{
            response.success(req, res, "OK", obj);
        }
    })
})

router.post('/addFavouritePokemon', (req, res) => {
    controller.addFavoritePokemon(req.body.username, req.body.pokemonName)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

router.get('/favouritePokemonsData/:username', (req, res) =>{
    controller.getFavouritePokemonsData(req.params.username)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

router.get('/get_PersonalData/:username', (req, res)=>{
    controller.get_PersonalData(req.params.name, req.params.lastname, req.params.username, req.params.email, req.params.factAboutMe, req.params.favouritePokemons)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})
///:lastname/:username/:email/:factAboutMe/:favouritePokemons
module.exports = router;