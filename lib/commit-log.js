'use strict';

// import uuid from 'node-uuid';
var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('commit_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    sha: DataTypes.STRING,
    message: DataTypes.STRING,
    githubLogin: {
      type: DataTypes.STRING,
      field: 'github_login'
    },
    projectId: {
      type: DataTypes.STRING,
      field: 'project_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    underscored: true,
    timestamps: true,
    classMethods: {
      getParticipatingUsers: function getParticipatingUsers(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('github_login')), 'githubLogin']]
        });
      },
      getParticipatingProjects: function getParticipatingProjects(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('project_id')), 'projectId']]
        });
      },
      getProjectCommits: function getProjectCommits(projectId, start, end) {
        var where = { projectId: projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserCommits: function getUserCommits(githubLogin, projectId, start, end) {
        var where = { githubLogin: githubLogin };
        if (projectId) where.projectId = projectId;
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserCommitsCount: function getUserCommitsCount(githubLogin, projectId, start, end) {
        var where = { githubLogin: githubLogin };
        if (projectId) where.projectId = projectId;
        where.date = { $between: [start, end] };
        return this.count({ where: where });
      },
      getCommitsCount: function getCommitsCount(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.count({ where: where });
      },
      getCommit: function getCommit(id) {
        var where = { id: id };
        return this.findOne({ where: where });
      },
      getCommits: function getCommits(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        var where = {
          sha: logInfo.sha,
          projectId: logInfo.projectId
        };
        var commitDefault = {
          id: uuid.v4(),
          date: logInfo.date,
          message: logInfo.message,
          githubLogin: logInfo.githubLogin
        };
        return this.findOrCreate({ where: where, defaults: commitDefault });
      }
    }
  });
};