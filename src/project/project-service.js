const xss = require('xss');

const ProjectService = {
  serializeProject(project) {
    return {
      id: project.id,
      user_id: project.user_id,
      project_name: xss(project.project_name),
      date_created: project.date_created,
      last_updated: project.last_updated,
      is_archived: project.is_archived
    };
  },
  getProjects(db) {
    return db('projects')
      .select('*');
  },
  getProjectById(db, project_id) {
    return db('projects')
      .select('*')
      .where( 'id', project_id)
      .first();
  },
  getProjectsByUser(db, user_id) {
    return db('projects')
      .select('*')
      .where('user_id', user_id)
      .then(projectsOfUser => {
        return projectsOfUser;
      });
  },
  addProject(db, project) {
    return db('projects')
      .insert(project)
      .returning('*')
      .then(([addedProject]) => {
        return addedProject;
      });
  },
  updateProject(db, project_id, project){
    return db('projects')
    .update(project, returning = true)
    .where({
        id: project_id
    })
    .returning('*')
    .then(rows => {
        return rows[0]
    })
  },
  };
  
  module.exports = ProjectService;