const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveModel = sequelize.define('Leave', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = LeaveModel;
