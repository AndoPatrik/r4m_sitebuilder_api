const authMiddleware = require('./authMiddleware') ;

const express = require("express");
const cors = require("cors");
const { pool } = require("./config");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const jwt = require('jsonwebtoken');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "R4M Sitebuilder API",
      description: "Sitebuilder API",
      servers: [
        "http://localhost:3002",
        "https://r4m-sitebuilder.herokuapp.com",
      ],
    },
  },
  apis: ["index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (request, response) => {
  response.redirect(request.originalUrl.split("/")[0] + "/docs");
});

// START OF ACTIONS

/**
 * @swagger
 * /api/blocks:
 *  get:
 *    summary: Returns all the blocks
 *    description: Returns all the blocks
 *    responses:
 *      200:
 *        decription: Success
 */
app.get("/api/blocks", authMiddleware.authenticateToken ,  async (request, response) => {
  try {
    console.log('USER',request.user);
    const blocks = await pool.query("SELECT * FROM blocks");
    response.json(blocks.rows);
  } catch (error) {
    throw error;
  }
});

/**
 * @swagger
 * /api/blocks/{id}:
 *  get:
 *    summary: Returns specific block
 *    description: Returns specific block by id
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: true
 *        description: Number ID of the block to gets
 *    responses:
 *      200:
 *        decription: Success
 *        schema:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *            yaml:
 *              type: string
 *            md:
 *              type: string
 *            twig:
 *              type: string
 *            html:
 *              type: string
 *
 */
app.get("/api/blocks/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const block = await pool.query("SELECT * FROM blocks where id=$1", [id]);
    if (block.rows[0]) response.json(block.rows[0]);
    response.status(404).json({ message: "Block does not exist" });
  } catch (error) {
    throw error;
  }
});

/**
 * @swagger
 * /api/blocks:
 *  post:
 *    summary: Creates a new block
 *    consumes:
 *      application/json
 *    description: Creates a new block
 *    parameters:
 *    - in: body
 *      name: New block
 *      required: true
 *      description: New block to be created
 *      schema:
 *        type: object
 *        properties:
 *          type:
 *            type: integer
 *          md:
 *            type: string
 *          yaml:
 *            type: string
 *          twig:
 *            type: string
 *          html:
 *            type: string
 *    responses:
 *      '201':
 *        decription: Success
 */
app.post("/api/blocks/", async (request, response) => {
  try {
    let { type, md, twig, yaml, html } = request.body;

    md = md.replace(/(\r\n|\n|\r|\s)/gm, "");
    twig = twig.replace(/(\r\n|\n|\r|\s)/gm, "");
    yaml = yaml.replace(/(\r\n|\n|\r|\s)/gm, "");
    html = html.replace(/(\r\n|\n|\r|\s)/gm, "");
    
    const result = await pool.query(
      "INSERT INTO blocks (type, md, twig, yaml, html) VALUES ($1, $2, $3, $4, $5)",
      [type, md, twig, yaml, html]
    );
    response.status(201).json({ status: "success", message: "Block created." });
  } catch (error) {
    throw error;
  }
});

/**
 * @swagger
 * /api/types:
 *  get:
 *    summary: Returns all the types
 *    description: Returns all the types
 *    responses:
 *      200:
 *        decription: Success
 */
app.get("/api/types/", async (request, response) => {
  try {
    const types = await pool.query("SELECT * FROM block_types");
    response.status(200).json(types.rows);
  } catch (error) {
    throw error;
  }
});

/**
 * 
 */

app.post('/api/loginUser', (request, response) => {
  const token = generateAccessToken({ username: request.body.username });
  response.json(token);
});

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

/*
*
*/

app.post('/api/upsertUser', (request, response) => {
  const email = request.body.email;
  //TODO
  //Check if exist in db =>if so then reset token lifetime
  //IF not insert new and create renewal token
})

//END OF ACTIONS

app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`);
});
