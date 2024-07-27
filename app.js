const express = require("express");
const path = require("path");
const pool = require("./db");
const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const destinosResult = await pool.query("SELECT * FROM Destino");
    const destinos = destinosResult.rows;

    for (let destino of destinos) {
      const atrativosResult = await pool.query(
        "SELECT * FROM Atrativo WHERE destino_id = $1",
        [destino.id]
      );
      destino.atrativos = atrativosResult.rows;
    }

    res.render("index", { destinos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/en", async (req, res) => {
  try {
    const destinosResult = await pool.query("SELECT * FROM Destino");
    const destinos = destinosResult.rows;

    for (let destino of destinos) {
      const atrativosResult = await pool.query(
        "SELECT * FROM Atrativo WHERE destino_id = $1",
        [destino.id]
      );
      destino.atrativos = atrativosResult.rows;
    }

    res.render("en", { destinos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/es", async (req, res) => {
  try {
    const destinosResult = await pool.query("SELECT * FROM Destino");
    const destinos = destinosResult.rows;

    for (let destino of destinos) {
      const atrativosResult = await pool.query(
        "SELECT * FROM Atrativo WHERE destino_id = $1",
        [destino.id]
      );
      destino.atrativos = atrativosResult.rows;
    }

    res.render("es", { destinos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/search", async (req, res) => {
  const searchQuery = req.query.q;
  try {
    const destinosResult = await pool.query(
      "SELECT * FROM Destino WHERE nome ILIKE $1 OR descricao ILIKE $1",
      [`%${searchQuery}%`]
    );

    const destinos = destinosResult.rows;
    for (let destino of destinos) {
      const atrativosResult = await pool.query(
        "SELECT * FROM Atrativo WHERE destino_id = $1 AND (nome ILIKE $2 OR descricao ILIKE $2)",
        [destino.id, `%${searchQuery}%`]
      );
      destino.atrativos = atrativosResult.rows;
    }

    res.render("search", { destinos, query: searchQuery });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
