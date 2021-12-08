//Estructura de la colección users en la base de datos
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mySchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    factAboutMe: String,
    favouritePokemons: Array,
});

module.exports = mongoose.model("users", mySchema);