const uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('drive_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    fileUUID: DataTypes.STRING,
    fileName: DataTypes.STRING,
    fileMIME: DataTypes.STRING,
    fileExtension: DataTypes.STRING,
    date: DataTypes.DATE,
    googleId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getUniqueFiles(projectId, googleId, range) {
        const where = {};
        if (projectId) where.projectId = projectId;
        if (googleId) where.googleId = googleId;
        if (range) where.date = { $gt: range };
        return this.findAll({
          where,
          attributes: [
            [sequelize.literal('DISTINCT `fileUUID`'), 'fileUUID'], 'fileName', 'fileMIME',
            'fileExtension', 'date', 'googleId', 'projectId', 'id'
          ]
        });
      },
      getFile(fileUUID) {
        const where = { fileUUID };
        return this.findOne({
          where,
          attributes: [
            'fileUUID', 'fileName', 'fileMIME', 'fileExtension',
            'date', 'googleId', 'projectId', 'id'
          ]
        });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    },
    activityCode: {
      CREATE: 'C',
      DELETED: 'D'
    }
  });
};
