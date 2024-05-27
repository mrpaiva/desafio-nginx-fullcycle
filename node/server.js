const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
    `;

    connection.query(createTableQuery, (err, results) => {
        if (err) {
          console.error('Erro ao criar tabela:', err);
          process.exit(1);
        }
    });
});

app.get('/', (req, res) => {
    const firstNames = [
        "Gabriel", "Miguel", "Arthur", "Lucas", "Pedro", 
        "Laura", "Alice", "Maria", "Ana", "Julia"
    ];
    const lastNames = [
        "Silva", "Santos", "Oliveira", "Souza", "Pereira", 
        "Lima", "Carvalho", "Ferreira", "Almeida", "Ribeiro"
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const name = `${firstName} ${lastName}`;

    const insertQuery = `INSERT INTO people (name) VALUES ('${name}')`;

    connection.query(insertQuery, err => {
        if (err) {
            console.error('Arro ao gravar no banco:', err);
            return res.status(500).send('Erro de servidor');
        }

        const selectQuery = 'SELECT name FROM people';

        connection.query(selectQuery, (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).send('Erro de servidor');
            }

            let response = '<h1>Full Cycle Rocks!</h1><ul>';

            results.forEach(row => {
                response += `<li>${row.name}</li>`;
            });

            response += '</ul>';

            res.send(response);
        });

    });

});

app.listen(port, () => {
    console.log(`Node rodando em http://localhost:${port}`);
});
