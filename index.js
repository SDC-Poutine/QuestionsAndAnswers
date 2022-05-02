const express = require('express');
const db = require('./sql/models.js');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(`${req.method} at ${req.url}`);
  next();
});

app.get('/qa/questions/:question_id/answers',(req, res) => {
  console.log(req.params);
  db.getAnswers(req.params, req.query, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      data = data || { question_id: req.params.question_id, results: [] };
      res.send(data);
    }
  })
})

app.get('/qa/questions', (req, res) => {
  db.getQuestions(req.query, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      data = data || { product_id: req.query.product_id, results: [] };
      res.send(data);
    }

  })
})

app.post('/qa/questions', (req, res) => {
  db.addQuestions(req.body, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      res.send(data);
    }
  })
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  db.addAnswers(req.params, req.body, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      res.send(data);
    }
  })
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  db.markQuestionHelpful(req.params, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      res.send(data);
    }
  })
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  db.reportQuestion(req.params, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      res.send(data);
    }
  })
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  db.markAnswerHelpful(req.params, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      res.send(data);
    }
  })
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  db.reportAnswer(req.params, (err, data) => {
    if(err){
      res.status(500).send(data);
    } else {
      res.send(data);
    }
  })
})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

module.exports = app;