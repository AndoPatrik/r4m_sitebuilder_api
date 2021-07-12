const express = require('express')
const cors = require('cors')
const {pool} = require('./config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const getBlocks = (request, response) => {
  pool.query('SELECT * FROM blocks', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addBlock = (request, response) => {
  const {type, md, twig, yaml, html} = request.body

  pool.query(
    'INSERT INTO blocks (type, md, twig, yaml, html) VALUES ($1, $2, $3, $4, $5)',
    [type, md, twig, yaml, html],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Block added.'})
    },
  )
}

app
  .route('/blocks')
  .get(getBlocks)
  .post(addBlock)

app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})