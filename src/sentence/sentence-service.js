const xss = require("xss");

const SentenceService = {
serializeSentence(sentence) {
  return{
    id: sentence.id,
    project_id: sentence.project_id,
    content: xss(sentence.content),
    date_created: sentence.date_created,
    last_updated: sentence.last_updated,
    is_archived: sentence.is_archived
  };
},

getSentences(db) {
  return db('sentences')
    .select('*');
},
getSentenceById(db, sentence_id) {
  return db('sentences')
    .select('*')
    .where('id', sentence_id)
    .first();
},
getSentencesByProject(db, project_id) {
  return db('sentences')
    .select('*')
    .where( 'project_id', project_id )
    .then(sentences => sentences);
},
getSentencesByRange(db, {startDate, endDate}) {
  return db('sentences')
    .select('*')
    .where('date_created', '>=', startDate)
    .where('date_created', '<', endDate)
    .then(sentencesFromRange => sentencesFromRange)
},
addSentence(db, sentence) {
  return db('sentences')
    .insert(sentence)
    .returning('*')
    .then(([addedSentence]) => {
      return addedSentence;
    });
},
updateSentence(db, sentence_id, sentence){
  return db('sentences')
  .update(sentence, returning = true)
  .where({
      id: sentence_id
  })
  .returning('*')
  .then(rows => {
      return rows[0];
  })
},
validateContent(content) {
  let erObj = null;
      if(content == null){
        erObj = {error: {message: `missing 'content'`}};
      }
      else if(typeof(content) != 'string'){
        erObj = {error: {message: `'content' should be a string`}};
      }
      else if(content == ""){
        erObj = {error: {message: `'content' cannot be empty`}};
      }

      return erObj;
}
};

module.exports = SentenceService;