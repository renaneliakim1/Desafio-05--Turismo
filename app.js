const express = require('express');
const path = require('path');
const pool = require('./db');
const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views')); // Diretório de visualizações
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'))); // Diretório de arquivos estáticos (CSS, imagens, etc.)

// Rota principal
app.get('/', async (req, res) => {
    try {
        const destinosResult = await pool.query('SELECT * FROM Destino');
        const destinos = destinosResult.rows;

        for (let destino of destinos) {
            const atrativosResult = await pool.query('SELECT * FROM Atrativo WHERE destino_id = $1', [destino.id]);
            destino.atrativos = atrativosResult.rows;
        }

        res.render('index', { destinos: destinos });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para inglês
/* app.get('/en', async (req, res) => {
    try {
        const destinosResult = await pool.query('SELECT * FROM Destino');
        const destinos = destinosResult.rows;

        for (let destino of destinos) {
            const atrativosResult = await pool.query('SELECT * FROM Atrativo WHERE destino_id = $1', [destino.id]);
            destino.atrativos = atrativosResult.rows;
        }

        res.render('en', { destinos: destinos }); // Certifique-se de que este arquivo está na pasta 'views'
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
}); */


app.get('/en', async (req, res) => {
    try {
        const destinosResult = await pool.query('SELECT * FROM Destino');
        const destinos = destinosResult.rows;

        for (let destino of destinos) {
            const atrativosResult = await pool.query('SELECT * FROM Atrativo WHERE destino_id = $1', [destino.id]);
            destino.atrativos = atrativosResult.rows;
        }

        res.render('en', { destinos: destinos });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});





// Rota para espanhol
app.get('/es', async (req, res) => {
    try {
        const destinosResult = await pool.query('SELECT * FROM Destino');
        const destinos = destinosResult.rows;

        for (let destino of destinos) {
            const atrativosResult = await pool.query('SELECT * FROM Atrativo WHERE destino_id = $1', [destino.id]);
            destino.atrativos = atrativosResult.rows;
        }

        res.render('es', { destinos: destinos }); // Certifique-se de que este arquivo está na pasta 'views'
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
