const express = require("express");
const path = require("path");
const pool = require("./db");

class TourismApp {
  constructor() {
    this.app = express();
    this.port = 3000;

    this.setupViews();
    this.setupStaticFiles();
    this.setupRoutes();
  }

  setupViews() {
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "ejs");
  }

  setupStaticFiles() {
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  setupRoutes() {
    this.app.get("/", this.renderHomePage.bind(this));
    this.app.get("/search", this.search.bind(this));
    this.app.get("/sobre_ma", this.renderSobreMaPage.bind(this));
  }

  async getDestinations() {
    const destinosResult = await pool.query("SELECT * FROM Destino");
    const destinos = destinosResult.rows;

    for (let destino of destinos) {
      const atrativosResult = await pool.query(
        "SELECT * FROM Atrativo WHERE destino_id = $1",
        [destino.id]
      );
      destino.atrativos = atrativosResult.rows;
    }

    return destinos;
  }

  async renderHomePage(req, res) {
    try {
      const destinos = await this.getDestinations();
      res.render("index", { destinos });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Erro no servidor");
    }
  }

  async search(req, res) {
    const searchQuery = req.query.q;
    try {
      const destinosResult = await pool.query(
        `SELECT * FROM Destino 
         WHERE similarity(nome, $1) > 0.2 
         OR similarity(descricao, $1) > 0.2 
         OR similarity(endereco_google_maps, $1) > 0.2
         ORDER BY GREATEST(similarity(nome, $1), similarity(descricao, $1), similarity(endereco_google_maps, $1)) DESC`,
        [searchQuery]
      );

      const destinos = destinosResult.rows;
      for (let destino of destinos) {
        const atrativosResult = await pool.query(
          `SELECT * FROM Atrativo 
           WHERE destino_id = $1 
           AND (similarity(nome, $2) > 0.2 
           OR similarity(descricao, $2) > 0.2 
           OR similarity(endereco_google_maps, $2) > 0.2)
           ORDER BY GREATEST(similarity(nome, $2), similarity(descricao, $2), similarity(endereco_google_maps, $2)) DESC`,
          [destino.id, searchQuery]
        );
        destino.atrativos = atrativosResult.rows;
      }

      res.render("search", { destinos, query: searchQuery });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Erro no servidor");
    }
  }

  async renderSobreMaPage(req, res) {
    res.render("sobre_ma");
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const app = new TourismApp();
app.start();
