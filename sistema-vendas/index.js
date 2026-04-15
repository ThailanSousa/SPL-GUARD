const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database(':memory:');

// 🚩 FALHA DE SEGURANÇA: Hardcoded Secret (Sonar vai acusar Code Smell/Security Hotspot)
const ADMIN_PASSWORD = "admin_super_secreto_123";

db.serialize(() => {
  db.run("CREATE TABLE produtos (id INT, nome TEXT, preco REAL)");
  db.run("INSERT INTO produtos VALUES (1, 'Teclado', 150.00)");
});

// 🚩 VULNERABILIDADE CRÍTICA: SQL Injection (OWASP Top 10)
app.get('/produto/:id', (req, res) => {
  const id = req.params.id;
  
  // Concatenar input direto na query é o erro clássico!
  const query = "SELECT * FROM produtos WHERE id = " + id;
  
  db.get(query, [], (err, row) => {
    if (err) res.status(500).send("Erro no servidor");
    res.json(row);
  });
});

app.listen(3000, () => {
  console.log("🚀 Sistema de Vendas rodando em http://localhost:3000");
});