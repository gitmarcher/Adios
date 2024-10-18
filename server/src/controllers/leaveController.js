const supabase = require('../config/database');

const createLeave = async (req, res) => {
  try {
    console.log('Received data:', req.body); 

    const { roll_number, purpose, days, from_date, to_date, address } = req.body;

    const { data: existingApplications, error: existingError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('roll_number', roll_number);

    if (existingError) {
      console.error('Error checking existing leave applications:', existingError);
      return res.status(500).json({ error: 'Failed to check existing leave applications', details: existingError });
    }

    if (existingApplications && existingApplications.length > 0) {
      return res.status(400).json({ error: 'Leave application already exists' });
    }

    const startDate = new Date(from_date.replace(/th|st|nd|rd/g, '').trim()).toISOString();
    const endDate = new Date(to_date.replace(/th|st|nd|rd/g, '').trim()).toISOString();

    if(startDate > endDate) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    if(startDate < new Date().toISOString()) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
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
        status: 'faculty_advisor',
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(400).json({ error: 'Failed to create leave application', details: insertError });
    }

    res.status(201).json({ message: 'Leave application created successfully', data: newApplicationData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create leave application' });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existingApplications, error: existingError } = await supabase
    .from('Leave_Applications')
    .select('*')
    .eq('roll_number', id);

    if(!existingApplications || existingApplications.length === 0) {
      return res.status(404).json({ error: 'Leave application not found' });
    }

    if(existingApplications && existingApplications[0].status === 'active') {
      return res.status(400).json({ error: 'Cannot delete active leave application' });
    }

    const { data: deleteData, error: deleteError } = await supabase
      .from('Leave_Applications')
      .delete()
      .eq('roll_number', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return res.status(400).json({ error: 'Failed to delete leave application', details: deleteError });
    }

    res.status(200).json({ message: 'Leave application deleted successfully', data: deleteData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete leave application' });
  }
};

module.exports = { createLeave, deleteLeave };
