//configuracion del servidor, no require rutas ya que los modulos se exportan de la carpeta principal

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DBUrl: process.env.urlDB,
    port: process.env.PORT || 3000
}