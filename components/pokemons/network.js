

const express = require('express')
const response = require('../../networtk/response')
const controller = require('./controller')
const router = express.Router()
const verify = require('../../midleware/verify')

router.get('/abilities/:pokemon_Name', (req, res) => {
    controller.get_PokemonHabilities(req.params.pokemon_Name)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

router.get('/type/:pokemon_Name', (req, res) => {
    controller.get_PokemonType(req.params.pokemon_Name)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})


router.post('/get_MultiplePokemonsData',(req, res) => {
    controller.get_MultiplePokemonsTypeAndAbilities(req.body.pokemons)
    .then((obj) => {
        response.success(req, res, "OK", obj);
    })
    .catch((err) => {
        response.error(req, res, err, "error", 500);
    })
})

module.exports = router;