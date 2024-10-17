const LeaveModel = require('../models/LeaveModel');

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveModel.findAll();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
};

const createLeave = async (req, res) => {
  try {
    const { studentId, startDate, endDate, reason } = req.body;
    const newLeave = await LeaveModel.create({ studentId, startDate, endDate, reason });
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave request' });
  }
};

module.exports = { getAllLeaves, createLeave };
