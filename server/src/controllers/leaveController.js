const supabase = require('../config/database');
const CustomError = require('../utils/customError');


const createLeave = async (req, res) => {
  try {
    console.log('Received data:', req.body); 

    const { roll_number, purpose, days, from_date, to_date, address } = req.body;

    const { data: existingApplications, error: existingError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('roll_number', roll_number);

    if (existingApplications && existingApplications.length > 0) {
      throw new CustomError('LEAVE_APPLICATION_EXISTS', 405);
    }

    const startDate = new Date(from_date.replace(/th|st|nd|rd/g, '').trim()).toISOString();
    const endDate = new Date(to_date.replace(/th|st|nd|rd/g, '').trim()).toISOString();

    if (startDate > endDate) {
      throw new CustomError('INVALID_DATE_RANGE', 406); 
    }

    if (startDate < new Date().toISOString()) {
      throw new CustomError('START_DATE_CANNONT_BE_IN_PAST', 406);
    }

    console.log('Database URL:', process.env.DATABASE_URL);
    console.log('Database Key:', process.env.DATABASE_KEY ? 'Loaded' : 'Not Loaded');

    const { data: newApplicationData, error: insertError } = await supabase.from('Leave_Applications').insert([
      {
        roll_number,
        purpose,
        days,
        start: startDate,
        end: endDate,
        address,
        parent_consent: "pending",
        faculty_approval: "pending",
        warden_approval: "pending",
        academics_approval: "pending",
        status: 'Parent Consent Pending',
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(400).json({ error: 'Failed to create leave application', details: insertError });
    }

    res.status(201).json({ message: 'Leave application created successfully', data: newApplicationData });
  } catch (error) {

    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message }); 
    }

    res.status(500).json({ error: 'Failed to create leave application' });
  }
};


const deleteLeave = async (req, res) => {
  try {
    const { roll_number } = req.body;

    const { data: existingApplications, error: existingError } = await supabase
    .from('Leave_Applications')
    .select('*')
    .eq('roll_number', roll_number);

    if(!existingApplications || existingApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    if(existingApplications && existingApplications[0].status === 'active') {
      throw new CustomError('LEAVE_APPLICATION_ACTIVE', 407);
    }

    const { data: deleteData, error: deleteError } = await supabase
      .from('Leave_Applications')
      .delete()
      .eq('roll_number', roll_number);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return res.status(400).json({ error: 'Failed to delete leave application', details: deleteError });
    }

    res.status(200).json({ message: 'Leave application deleted successfully', data: deleteData });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete leave application' });
  }
};

module.exports = { createLeave, deleteLeave };
