const supabase = require('../config/database');
const CustomError = require('../utils/customError');
const multer = require('multer');
const path = require('path'); // Ensure path is imported



// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const getLeaves = async (req, res) => {
  try {
    const { roll_number } = req.body;
    console.log(roll_number);
    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('roll_number', roll_number)
      .eq('status', 'Parent Consent Pending');

    if (!leaveApplications || leaveApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    return res.status(200).json({
      message: 'Leave applications retrieved successfully',
      data: leaveApplications,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const parentConsent = async (req, res) => {
  try {
    const { roll_number, leave_id } = req.body;

    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('leave_id', leave_id)
      .eq('status', 'Parent Consent Pending');

    if (!leaveApplications || leaveApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    if (!req.file) {
      throw new CustomError('FILE_REQUIRED', 400);
    }

    if (!req.file.mimetype.startsWith('image')) {
      throw new CustomError('INVALID_FILE_TYPE', 400);
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${roll_number}-${Date.now()}${path.extname(req.file.originalname)}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('Parent_Consent') // Ensure bucket name is correct
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false, // Prevent overwriting
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new CustomError('IMAGE_UPLOAD_FAILED', 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from('Parent_Consent')
      .getPublicUrl(fileName);

    const { data: updatedLeave, error: updateError } = await supabase
      .from('Leave_Applications')
      .update({ parent_consent: publicUrlData.publicUrl, status: 'Faculty Advisor' })
      .eq('leave_id', leave_id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new CustomError('LEAVE_UPDATE_FAILED', 500);
    }

    res.status(200).json({
      message: 'Parent consent uploaded successfully',
      imageUrl: publicUrlData.publicUrl,
      data: updatedLeave,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const parentDisapproval = async (req, res) => {
  try{
    const { leave_id } = req.body;
    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('leave_id', leave_id)
      .eq('status', 'Parent Consent Pending');
    
    if (!leaveApplications || leaveApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    const { data: updatedLeave, error: updateError } = await supabase
      .from('Leave_Applications')
      .update({ status: 'Parent Disapproved' })
      .eq('leave_id', leave_id);
    
    if (updateError) {
      console.error('Update error:', updateError);
      throw new CustomError('LEAVE_UPDATE_FAILED', 500);
    }

    res.status(200).json({
      message: 'Leave application disapproved successfully',
      data: updatedLeave,
    });
  }catch(error){
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
};


const facultyAdvisorApplications = async (req, res) => {
  try{
    const { faculty } = req.query;
    const { data: rollNumbers, error: rollNumbersError } = await supabase
      .from('Students')
      .select(`
        roll_number,
        faculty,
        Faculties:faculty (name)
      `)
      .eq('faculty', faculty); 

    
    if (rollNumbersError) {
      console.error('Error fetching leave applications:', leaveError);
      throw new CustomError('LEAVE_APPLICATIONS_FETCH_FAILED', 500);
    } 
    const rollNumbersArray = rollNumbers.map(app => app.roll_number);
    console.log('Roll Numbers:', rollNumbersArray);

    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .in('roll_number', rollNumbersArray)
      .eq('status', 'Faculty Advisor');
    
    if (leaveError) {
      console.error('Error fetching leave applications:', leaveError);
      throw new CustomError('LEAVE_APPLICATIONS_FETCH_FAILED', 500);
    }

    res.status(200).json({
      message: 'Leave applications retrieved successfully',
      data: leaveApplications,
    });
  }catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const facultyApproval = async (req, res) => {
  try{
    const { leave_id, faculty} = req.body;
    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('leave_id', leave_id);
    
    if (!leaveApplications || leaveApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    const { data: updatedLeave, error: updateError } = await supabase
      .from('Leave_Applications')
      .update({ faculty_approval: faculty, status: 'Warden Approval' })
      .eq('leave_id', leave_id)
      .neq('parent_consent', "pending");
    
    if (updateError) {
      console.error('Update error:', updateError);
      throw new CustomError('LEAVE_UPDATE_FAILED', 500);
    }

    res.status(200).json({
      message: 'Faculty approval uploaded successfully',
      data: updatedLeave,
    });
  }catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const wardenApplications = async (req, res) => {
  try{
    const { faculty } = req.query;
    const {data:hostel, error:hostelError} = await supabase
      .from('Faculties')
      .select('hostel')
      .eq('name', faculty);
    const {data: rollNumbers, error: rollNumbersError} = await supabase
      .from('Students')
      .select(`
        roll_number,
        hostel,
        Faculties: faculty (name, hostel)
        `)
      .eq('hostel', hostel[0].hostel);
    
    if (rollNumbersError) {
      console.error('Error fetching leave applications:', leaveError);
      throw new CustomError('LEAVE_APPLICATIONS_FETCH_FAILED', 500);
    }
    const rollNumbersArray = rollNumbers.map(app => app.roll_number);
    console.log('Roll Numbers:', rollNumbersArray);

    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .in('roll_number', rollNumbersArray)
      .eq('status', 'Warden Approval');
    
    if (leaveError) {
      console.error('Error fetching leave applications:', leaveError);
      throw new CustomError('LEAVE_APPLICATIONS_FETCH_FAILED', 500);
    }

    res.status(200).json({
      message: 'Leave applications retrieved successfully',
      data: leaveApplications,
    });
    
  }catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
};

const wardenApproval = async (req,res) =>{
  try{
    const {faculty,leave_id,roll_number} = req.body;
    console.log('Faculty:', faculty);
    console.log('Leave ID:', leave_id);
    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('leave_id', leave_id)
      .eq('status', 'Warden Approval');
    
    if (!leaveApplications || leaveApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    const { data: updatedLeave, error: updateError } = await supabase
      .from('Leave_Applications')
      .update({warden_approval : faculty ,status: 'Academics Approval' })
      .eq('leave_id', leave_id);
    
    if (updateError) {
      console.error('Update error:', updateError);
      throw new CustomError('LEAVE_UPDATE_FAILED', 500);
    }
    res.status(200).json({
      message: 'Faculty approval uploaded successfully',
      data: updatedLeave,
    });
  }catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
};

const academicsApplications = async (req, res) => {
  try{
    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('status', 'Academics Approval');
    
    if (leaveError) {
      console.error('Error fetching leave applications:', leaveError);
      throw new CustomError('LEAVE_APPLICATIONS_FETCH_FAILED', 500);
    }

    res.status(200).json({
      message: 'Leave applications retrieved successfully',
      data: leaveApplications,
    });
  }catch(error){
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
};  

const academicsApproval = async (req,res) => {
  try{
    const {leave_id} = req.body;
    const { data: leaveApplications, error: leaveError } = await supabase
      .from('Leave_Applications')
      .select('*')
      .eq('leave_id', leave_id)
      .eq('status', 'Academics Approval');
    
    if (!leaveApplications || leaveApplications.length === 0) {
      throw new CustomError('LEAVE_APPLICATION_NOT_FOUND', 404);
    }

    const { data: updatedLeave, error: updateError } = await supabase
      .from('Leave_Applications')
      .update({academics_approval:'Approved', status: 'Approved' })
      .eq('leave_id', leave_id);
    
    if (updateError) {
      console.error('Update error:', updateError);
      throw new CustomError('LEAVE_UPDATE_FAILED', 500);
    }

    res.status(200).json({
      message: 'Leave application approved successfully',
      data: updatedLeave,
    });
  }catch(error){
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
};

module.exports = {
  getLeaves,
  parentConsent,
  parentDisapproval,
  facultyApproval,
  facultyAdvisorApplications,
  wardenApplications,
  wardenApproval,
  academicsApplications,
  academicsApproval,
};
