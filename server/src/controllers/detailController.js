const supabase = require('../config/database');
const CustomError = require('../utils/CustomError');

const studentDetails = async (req, res) => {
    try {
        const { roll_number } = req.query;
        console.log(roll_number);
        
        if (!roll_number) {
            throw new CustomError("Roll number is required", 400);
        }

        const { data: user, error: userError } = await supabase
            .from('Students')
            .select('*')
            .eq('roll_number', roll_number);
        
        console.log(user);
        
        if (userError || !user || user.length === 0) {
            throw new CustomError("Student not found", 404);
        }

        const { data: leaves, error: leaveError } = await supabase
            .from('Leave_Applications')
            .select('*')
            .eq('roll_number', roll_number);

        if (leaveError) {
            throw new CustomError("Error fetching leaves", 500);
        }

        const userDetails = {
            roll_number: user[0].roll_number,
            name: user[0].name,
            email: user[0].email,
            phone: user[0].phone,
            address: user[0].address,
        };

        res.status(200).json({ message: "Student Details", userDetails, leaves });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.code).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

const parentDetails = async (req, res) => {
    try {
        const { roll_number } = req.query;
        console.log(roll_number);
        
        if (!roll_number) {
            throw new CustomError("Roll number is required", 400);
        }

        const { data: user, error: userError } = await supabase
            .from('Students')
            .select('*')
            .eq('roll_number', roll_number);
        
        console.log(user);
        
        if (userError || !user || user.length === 0) {
            throw new CustomError("Student not found", 404);
        }

        const { data: leaves, error: leaveError } = await supabase
            .from('Leave_Applications')
            .select('*')
            .eq('roll_number', roll_number)
            .eq('status', 'Parent Consent Pending');

        if (leaveError) {
            throw new CustomError("Error fetching leaves", 500);
        }

        const userDetails = {
            roll_number: user[0].roll_number,
            name: user[0].name,
            email: user[0].email,
            phone: user[0].phone,
            address: user[0].address,
        };

        res.status(200).json({ message: "Student Details", userDetails, leaves });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.code).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = { studentDetails,parentDetails };
