const users = require('../components/users/network')
const pokemons = require('../components/pokemons/network')

const routes = function (server){
    server.use('/users', users);
    server.use('/pokemons', pokemons)
}

module.exports = routes;