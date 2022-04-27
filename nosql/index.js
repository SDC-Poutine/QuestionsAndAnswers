
/* const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:3000', (err)=>{
  if(err) {
    console.log(err);
    return;
  }
  console.log('connected to mongo')
});

const questionsSchema = new mongoose.Schema({
  product_id: String,
  question_body: String,
  asker_name: String,
  email: String,
  question_helpfulness: {type: Number, default: 0}
  question_reported: Boolean,
}, {
  timestamps: true
});

module.exports.questions = mongoose.model('questions', questionsSchema);

const answersSchema = new mongoose.Schema({
  question_id: String,
  answer_body: String,
  answerer_name: String,
  helpfulness: {type: Number, default: 0},
  reported: Boolean,
}, {
  timestamps: true
});

module.exports.answers = mongoose.model('answers', answersSchema);

const photosSchema = new mongoose.Schema({
  answer_id: String,
  url: String
}, {
  timestamps: true
});

module.exports.photos = mongoose.model('photos', photosSchema); */