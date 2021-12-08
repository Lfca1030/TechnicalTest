const express = require('express')
const app = express()
const router = require('./networtk/routes')
const config = require('./config')
const database = require('mongoose')
const cors = require('cors')
app.use(express.json())
app.use(cors())

database.connect(config.DBUrl)
.then(()=>{
  console.log('The database is ready')
})
.catch((err) => {
  console.log('Error connectig to the DB', err)
})

router(app)
app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})

// module.exports = {
//   database
// }