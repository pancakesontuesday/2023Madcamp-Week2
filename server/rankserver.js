// import { getAll, getOneByName, insertOne, deleteOneByName, updateBestScoreByName } from './api.js'
const api = require("./api.js")
const gs = require("./getSecret");
const dbName = "RankDB";
const collectionName = "users";

// const data = gs.getSecret("client_secret.json");
// const server_url = data.db;

const express = require("express"); // express 임포트
const app = express(); // app생성
const port = 3030; // 일단은 localhost:3030에서 작업

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET: /
app.get('/', async function (req, res) {
  let a = await api.getAll(dbName, collectionName);
  res.send(a);
  console.log('\n');
});

// GET: /user/score
app.get('/user/score', async function (req, res) {
  const { username } = req.body;
  var a = await api.getOneByName(username, dbName, collectionName);
  res.send(JSON.parse(a).bestScore.toString());
  console.log('\n');
});

// POST: /user/id
app.post('/user/id', async function (req, res) {
  const { id } = req.body;
  var a = await api.postOneById(id, dbName, collectionName);
  res.send(a);
  console.log('\n');
});

// POST: /user/insert
app.post('/user/insert', (req, res) => {
  const { id, username, univ, bestScore } = req.body;
  api.insertOne(id, username, univ, parseInt(bestScore), dbName, collectionName);
  let pack = {id: id}
  res.send(JSON.stringify(pack));
  console.log('\n');
});

// POST: /user/update/score (By Id)
app.post('/user/update/score', (req, res) => {
  const { id, bestScore } = req.body;
  api.updateBestScoreById(id, parseInt(bestScore), dbName, collectionName);
  res.send(`UPDATE SCORE: ${id} -> ${parseInt(bestScore)}`);
  console.log('\n');
});



app.listen(port, () => console.log(`${port}포트입니다.`));
