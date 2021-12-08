const store = require('./store')
const axios = require('axios')
const pokeApiUrl = 'https://pokeapi.co/api/v2/'

async function get_AllPokemonData_Byname(pokemon_Name){ //Función para obtener todos los datos de un pokemon y no hacer peticiones por cada funcion
    let pokemonData = await axios.get(`${pokeApiUrl}/pokemon/${pokemon_Name}`)

    return await pokemonData.data
}

async function get_PokemonHabilities(pokemon_Name){
    let pokemonData = await get_AllPokemonData_Byname(pokemon_Name)
    
    return {'Abilities':pokemonData.abilities}
}

async function get_PokemonType(pokemon_Name){
    let pokemonData = await get_AllPokemonData_Byname(pokemon_Name)
    return {'Types': pokemonData.types}
}

async function get_MultiplePokemonsTypeAndAbilities(pokemons){
    let allPokemonsData = []
    
    for(let i = 0; i < pokemons.length; i++){
        let pokemonData =  await get_AllPokemonData_Byname(pokemons[i])
        allPokemonsData.push({'pokemon_Name': pokemons[i], 'abilities': pokemonData.abilities, 'types': pokemonData.types})
    }

    return {'pokemonsData':allPokemonsData}
}



module.exports = {
    get_PokemonHabilities,
    get_PokemonType,
    get_MultiplePokemonsTypeAndAbilities,

}