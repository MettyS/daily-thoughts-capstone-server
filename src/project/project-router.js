const path = require('path');
const express = require('express');

const ProjectService = require('./project-service');

const projectRouter = express.Router();
const jsonParser = express.json();

projectRouter.route('/')
  //get all projects
  .get((req, res, next) => {
    ProjectService.getProjects(req.app.get('db'))
      .then(projects => {
        console.log(projects);
        res.json(projects);
      })
      .catch(next);
  })
  //submit a new project folder
  .post(jsonParser, (req, res, next) => {
    const { project_name, user_id } = req.body;

    const newProject = {
      user_id,
      project_name
    };

    ProjectService.addProject(req.app.get('db'), newProject)
      .then(addedProject => {
        console.log('added project: ', addedProject);
        res.json(ProjectService.serializeProject(addedProject));
      })
      .catch(next);
  });

projectRouter.route('/:project_id')
  .all( (req, res, next) => {
    const { project_id } = req.params;
    ProjectService.getProjectById(req.app.get('db'), project_id)
      .then(projectWithId => {
        if(!projectWithId)
          return res.status(404).json({ error: {message: 'Project does not exist'}});

        res.project = projectWithId;
        console.log('setting res.project to: ', projectWithId);
        next();
      })
      .catch(next);
  })
  .get( (req, res) => {
    console.log('res.project is: ', res.project);
    res.status(200).json(ProjectService.serializeProject(res.project));
  })
  .patch( jsonParser, (req, res, next) => {
    const { project_name } = req.body;
    const projectToPatchWith = {
      project_name
    };

    ProjectService.updateProject(req.app.get('db'), res.project.id, projectToPatchWith)
      .then(updatedProject => {
        console.log('the project has been updated to: ', updatedProject);
        res.status(200).json(ProjectService.serializeProject(updatedProject));
      })
      .catch(next);

  })
  .delete( (req, res, next) => {
    const project_id = res.project.id;
    const deleteValue = {
      is_archived: Boolean(1)
    };

    ProjectService.updateProject(req.app.get('db'), project_id, deleteValue)
      .then(archivedProject => {
        console.log('the project has been archived: ', archivedProject);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = projectRouter;