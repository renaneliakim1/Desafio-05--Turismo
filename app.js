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




// realiza bvusca na base de dados por similaridade de strings
app.get("/search", async (req, res) => {
  const searchQuery = req.query.q;
  try {
    const destinosResult = await pool.query(
      `SELECT * FROM Destino 
       WHERE similarity(nome, $1) > 0.2 OR similarity(descricao, $1) > 0.2
       ORDER BY GREATEST(similarity(nome, $1), similarity(descricao, $1)) DESC`,
      [searchQuery]
    );

    const destinos = destinosResult.rows;
    for (let destino of destinos) {
      const atrativosResult = await pool.query(
        `SELECT * FROM Atrativo 
         WHERE destino_id = $1 AND (similarity(nome, $2) > 0.2 OR similarity(descricao, $2) > 0.2)
         ORDER BY GREATEST(similarity(nome, $2), similarity(descricao, $2)) DESC`,
        [destino.id, searchQuery]
      );
      destino.atrativos = atrativosResult.rows;
    }

    res.render("search", { destinos, query: searchQuery });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});





/* app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); */



app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
