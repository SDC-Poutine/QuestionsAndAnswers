DROP DATABASE IF EXISTS qna;
CREATE DATABASE qna;
\c qna;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS photos;

CREATE TABLE questions(
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(30) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date_written double precision,
  asker_name VARCHAR(50) NOT NULL,
  asker_email VARCHAR(50) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE answers(
  id SERIAL PRIMARY KEY,
  question_id INT,
  body VARCHAR(1000) NOT NULL,
  date_written double precision,
  answerer_name VARCHAR(50) NOT NULL,
  answerer_email VARCHAR(50) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE photos(
  id SERIAL PRIMARY KEY,
  answer_id INT,
  url VARCHAR(200) NOT NULL
);


COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/cloverhong/Documents/hackreactor/QuestionsAndAnswers/questions.csv'
DELIMITER ','
CSV HEADER;

ALTER TABLE questions ADD COLUMN temp_date TIMESTAMP WITHOUT TIME ZONE NULL;
UPDATE questions SET temp_date = to_timestamp(date_written/1000)::TIMESTAMP;
ALTER TABLE questions ALTER COLUMN date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING temp_date;
ALTER TABLE questions DROP COLUMN temp_date;

COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/Users/cloverhong/Documents/hackreactor/QuestionsAndAnswers/answers.csv'
DELIMITER ','
CSV HEADER;

ALTER TABLE answers ADD COLUMN temp_date TIMESTAMP WITHOUT TIME ZONE NULL;
UPDATE answers SET temp_date = to_timestamp(date_written/1000)::TIMESTAMP;
ALTER TABLE answers ALTER COLUMN date_written TYPE TIMESTAMP WITHOUT TIME ZONE USING temp_date;
ALTER TABLE answers DROP COLUMN temp_date;

COPY photos(id, answer_id, url)
FROM '/Users/cloverhong/Documents/hackreactor/QuestionsAndAnswers/answers_photos.csv'
DELIMITER ','
CSV HEADER;

SELECT setval('answers_id_seq', (SELECT max(id) FROM answers));
SELECT setval('photos_id_seq', (SELECT max(id) FROM photos));
SELECT setval('questions_id_seq', (SELECT max(id) FROM questions));

create index product_id_index on questions(product_id);
create index answer_id_index on photos(answer_id);
create index question_id_index on answers(question_id);
create index q_id_index on questions(id);
create index a_id_index on answers(id);
create index p_id_index on photos(id);
