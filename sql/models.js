const pool = require('./index.js');

module.exports = {
//need to add pagination
  getQuestions: (query, callback) => {
    console.log(query.product_id);
    pool.query(
      `SELECT
        product_id,
        (
          SELECT json_agg(
            json_build_object(
              'question_id', questions.id,
              'question_body', questions.body,
              'question_date', questions.date_written,
              'asker_name', questions.asker_name,
              'question_helpfulness', questions.helpful,
              'reported', questions.reported,
              'answers', (
                SELECT
                  coalesce(
                    json_object_agg(
                      id,
                      (
                        SELECT json_build_object(
                          'id', answers.id,
                          'body', answers.body,
                          'date', answers.date_written,
                          'answerer_name', answers.answerer_name,
                          'helpfulness', answers.helpful,
                          'photos', (
                            SELECT coalesce(json_agg(row_to_json(photo)), '[]'::json)
                            FROM (
                              SELECT
                                id, url
                              FROM photos
                              WHERE photos.answer_id = answers.id
                            ) AS photo
                          )
                      )
                    )
                  ),
                  '{}'::json
                )
                FROM (
                  SELECT *
                  FROM answers
                  WHERE answers.question_id = questions.id
                  AND answers.reported = 'false'
                  ORDER BY helpful
                  LIMIT 2
                ) AS answers
              )
            ) ORDER BY id ASC
          )
        ) AS results
      FROM
        questions
      WHERE
        questions.product_id = '${query.product_id}'
      AND
        questions.reported = 'false'
      GROUP BY
        product_id;
      `,
      (err, data) => {
        console.log(err);
        if(err){
          callback(err);
        } else {
          callback(null, data.rows[0]);
        }
      });
  },

  getAnswers: (params, query, callback) => {
    pool.query(
      `SELECT
        answers.question_id AS question,
        (
          SELECT(
            json_agg(
              json_build_object(
                'answer_id', answers.id,
                'body', answers.body,
                'date', answers.date_written,
                'answerer_name', answers.answerer_name,
                'helpfulness', answers.helpful,
                'photos', (
                  SELECT coalesce(json_agg(row_to_json(photo)), '[]'::json)
                  FROM (
                    SELECT
                      id, url
                    FROM photos
                    WHERE photos.answer_id = answers.id
                  ) AS photo
                )
              ) ORDER BY id ASC
            )
          )
        ) AS results
      FROM
        answers
      WHERE
        answers.question_id = '${params.question_id}'
      AND
        answers.reported = 'false'
      GROUP BY
        question_id;`,
      (err, data) => {
        if(err) {
          callback(err);
        } else {
          callback(null, data.rows[0]);
        }
      })
  },
  addQuestions: (content, callback) => {
    pool.query(`
    INSERT INTO
      questions(product_id, body, askerName, askerEmail)
    VALUES
      (${content.product_id}, '${content.body}', '${content.name}', ${content.email})`, (err, data) => {
        if(err) {
          callback(err);
        } else {
          callback(null, data);
        }
      })
  },
  addAnswers: (params, content, callback) => {
    console.log(params.question_id, content.photos);
    pool.query(
      `WITH new_answer AS (
        INSERT INTO
          answers(question_id, body, answerer_name, answerer_email)
        VALUES
          (
            ${params.question_id},
            '${content.body}',
            '${content.name}',
            '${content.email}'
          ) RETURNING id
      )
      INSERT INTO
        photos (url, answer_id)
      VALUES
        (
          unnest(ARRAY['${content.photos.toString()}']),
          (
            SELECT
              id
            FROM
              new_answer
          )
        );`,
      (err, data) => {
        if(err) {
          callback(err);
        } else {
          callback(null, data);
        }
      })
  },
  markQuestionHelpful: (params, callback) => {
    pool.query(`UPDATE questions SET helpful = helpful + 1 WHERE id = ${params.question_id};`, (err, data) => {
      if(err) {
        callback(err);
      } else {
        callback(null, data);
      }
    })
  },
  reportQuestion: (params, callback) => {
    pool.query(`UPDATE questions SET reported = 'true' WHERE id = ${params.question_id};`, (err, data) => {
      if(err) {
        callback(err);
      } else {
        callback(null, data);
      }
    })
  },

  markAnswerHelpful: (params, callback) => {
    pool.query(`UPDATE answers SET helpful = helpful + 1 WHERE id = ${params.answer_id};`, (err, data) => {
      if(err) {
        callback(err);
      } else {
        callback(null, data);
      }
    })
  },

  reportAnswer: (params, callback) => {
    pool.query(`UPDATE answer SET reported = 'true' WHERE id = ${params.answer_id};`, (err, data) => {
      if(err) {
        callback(err);
      } else {
        callback(null, data);
      }
    })
  }

};