const path = require('path');
const express = require('express');

const SentenceService = require('./sentence-service');
const ProjectService = require('../project/project-service');

const sentenceRouter = express.Router();
const jsonParser = express.json();

const updateProject = (project_id) => {
  console.log('updating project >>>> ', project_id)
  const projectToPatchWith = {
    last_updated: now()
  }

  ProjectService.updateProject(req.app.get('db'), project_id, projectToPatchWith)
    .then(updatedProject => {
      console.log('the project has been updated to: ', updatedProject);
      res.status(201).json(ProjectService.serializeProject(updatedProject));
    })
    .catch(next);
}

sentenceRouter.route(':sentence_id')
  .all( (req, res, next) => {

    const { sentence_id } = req.params;
    SentenceService.getSentenceById(req.app.get('db'), sentence_id)
      .then(sentenceWithId => {
        if(!sentenceWithId)
          return res.status(404).json({ error: {message: `Sentence does not exist`}})

        res.sentence = sentenceWithId;
        console.log('setting res.sentence to: ', sentenceWithId);
        next();
      })
      .catch(next)
  })
  .get( (req, res) => {
    res.status(200).json(SentenceService.serializeSentence(res.sentence));
  })
  .patch( jsonParser, (req, res, next) => {
    const {content, project_id} = req.body;
    const sentenceToPatchWith = {
      content,
      last_updated: now()
    };

    let erObj = SentenceService.validateContent(sentenceToPatchWith.content);
      if(erObj)
        return res.status(400).json(erObj);

    SentenceService.updateSentence(req.app.get('db'), res.sentence.id, sentenceToPatchWith)
      .then(updatedSentence => {
        console.log('the sentence has been updated to: ', updatedSentence);
        res.json(SentenceService.serializeSentence(updatedSentence))

        updateProject(project_id);
      })
      .catch(next);


      
    
  })
  .delete( (req, res, next) => {
    const deleteValue = {
      archived: Boolean(1)
    };

    SentenceService.updateSentence(req.app.get('db'), res.sentence.id, deleteValue)
      .then(archivedSentence => {
        console.log('the sentence has been archived: ', archivedSentence);
        res.status(204).end();
      })
      .catch(next);

  });

sentenceRouter.route('/')
  // the sentences within a particular project
  .get( (req, res, next) => {
    SentenceService.getSentences(req.app.get('db'))
      .then(sentences => {
        res.status(200).json(sentences.map(sentence => SentenceService.serializeSentence(sentence)))
      })
      .catch(next)
  })
  // add a sentence to a particular project
  .post( jsonParser, (req, res, next) => {
    const { content, project_id } = req.body;
    const sentenceToAdd = {
      project_id,
      content
    };

      let erObj = SentenceService.validateContent(sentenceToAdd.content);
      if(erObj)
        return res.status(400).json(erObj);


    SentenceService.addSentence(req.app.get('db'), sentenceToAdd)
      .then(addedSentence => {
        console.log(SentenceService.serializeSentence(addedSentence));
        res.json(SentenceService.serializeSentence(addedSentence))

        updateProject(project_id);
      })
      .catch(next);

    

  })

module.exports = sentenceRouter;