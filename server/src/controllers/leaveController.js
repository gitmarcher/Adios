const supabase = require('../config/database');
const CustomError = require('../utils/customError');


const createLeave = async (req, res) => {
  try {
    console.log('Received data:', req.body); 

    const { roll_number, purpose, days, from_date, to_date, address } = req.body;

    const startDate = new Date(from_date.replace(/th|st|nd|rd/g, '').trim()).toISOString();
    const endDate = new Date(to_date.replace(/th|st|nd|rd/g, '').trim()).toISOString();
    console.log(startDate, endDate);

    // if (startDate > endDate) {
    //   throw new CustomError('INVALID_DATE_RANGE', 406); 
    // }

    // if (startDate < new Date().toISOString()) {
    //   throw new CustomError('START_DATE_CANNONT_BE_IN_PAST', 406);
    // }

    const { data: existingApplications, error: existingError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('roll_number', roll_number);

    if (existingApplications && existingApplications.length > 0) {
      throw new CustomError('LEAVE_APPLICATION_EXISTS', 405);
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

    res.status(500).json({ error: error });
  }
};


const deleteLeave = async (req, res) => {
  try {
    const { leave_id } = req.query;

    const { data: existingApplications, error: existingError } = await supabase
    .from('Leave_Applications')
    .select('*')
    .eq('leave_id', leave_id);

    if(!existingApplications || existingApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    if(existingApplications && existingApplications[0].status === 'active') {
      throw new CustomError('LEAVE_APPLICATION_ACTIVE', 407);
    }

    const { data: deleteData, error: deleteError } = await supabase
      .from('Leave_Applications')
      .delete()
      .eq('leave_id', leave_id);

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

const getLeaveDetails = async (req, res) => {
  try {
    const { roll_number, leave_id } = req.query;

    const { data: studentDetails, error: studentError } = await supabase
      .from('Students')
      .select('*')
      .eq('roll_number', roll_number);

    const { data: parentDetails, error: parentError } = await supabase
      .from('Parents')
      .select('*')
      .eq('roll_number', roll_number);

    const { data: leaveDetails, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('leave_id', leave_id);

    console.log(leaveDetails);

    if (!leaveDetails || leaveDetails.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    const parentConsentPath = leaveDetails[0].parent_consent;
    const lastPart = parentConsentPath.split("/")[parentConsentPath.split("/").length - 1];
    console.log('Last part:', lastPart);
    // Generate signed URL if `parent_consent` has a valid path
    if (leaveDetails[0].parent_consent && leaveDetails[0].parent_consent !== "pending") {
      console.log('Attempting to generate signed URL for:', leaveDetails[0].parent_consent);
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('Parent_Consent')
        .createSignedUrl(lastPart, 60 * 60); // 1-hour expiration

      if (signedUrlError) {
        console.error('Signed URL Error:', signedUrlError);
        throw new Error('Failed to generate signed URL');
      }

      leaveDetails[0].parent_consent = signedUrlData.signedUrl;
    }

    res.status(200).json({ studentDetails, parentDetails, leaveDetails });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get leave details' });
  }
};




module.exports = { createLeave, deleteLeave,getLeaveDetails };
