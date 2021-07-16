const express = require("express");
const cors = require("cors");
const { pool } = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

// START OF ACTIONS
app.get("/api/blocks", async (request, response) => {
  try {
    const blocks = await pool.query("SELECT * FROM blocks");
    response.json(blocks.rows);
  } catch (error) {
    throw error;
  }
});

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

app.post("/api/blocks/", async (request, response) => {
  try {
    const { type, md, twig, yaml, html } = request.body;
    await pool.query(
      "INSERT INTO blocks (type, md, twig, yaml, html) VALUES ($1, $2, $3, $4, $5)",
      [type, md, twig, yaml, html]
    );
    response.status(201).json({ status: "success", message: "Block added." });
  } catch (error) {
    throw error;
  }
});

app.get("/api/types/", async (request, response) => {
  try {
    const types = await pool.query("SELECT * FROM block_types");
    response.status(200).json(types.rows);
  } catch (error) {
    throw error;
  }
});
// END OF ACTIONS

app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`);
});
