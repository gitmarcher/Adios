const supabase = require('../config/database');
const bcrypt = require('bcrypt');
const CustomError = require('../utils/CustomError');

const studentLogin = async (req, res) => {
    const { roll_number, password } = req.body

    try{
        const { data: users, error } = await supabase
                    .from('Students')
                    .select('roll_number, password')
                    .eq('roll_number', roll_number)
                    .single();

        if (error || !users){
            throw new CustomError("Invalid Credentials", 401);        
        }
        const isPasswordMatch = await bcrypt.compare(password, users.password);
        
        if (!isPasswordMatch){
            throw new CustomError("Invalid Credentials", 401);
        }

        res.status(200).json({ message: "Login successful", user: users.roll_number}); 
        return users;
    }
    catch(e){
        if (e instanceof CustomError) {
            return res.status(e.code).json({ error: e.message }); 
        }
        // res.status(401).send(e.message)
    }
}

const parentLogin = async (req, res) => {
    const { roll_number, password } = req.body

    try{
        const { data: users, error } = await supabase
                    .from('Parents')
                    .select('roll_number, password')
                    .eq('roll_number', roll_number)
                    .single();

        if (error || !users){
            throw new Error("Invalid Credentials");         
        }

        const isPasswordMatch = await bcrypt.compare(password, users.password);

        if (!isPasswordMatch){
            throw new Error("Invalid Credentials");
        }

        res.status(200).json({ message: "Login successful", user: users.roll_number }); 
        return users;
    }
    catch(e){
        res.status(401).send(e.message)
    }
}

const facultyLogin = async (req, res) => {
    const { name, password } = req.body

    try{
        const { data: users, error } = await supabase
                    .from('Faculties')
                    .select(', password')
                    .eq('name', name)
                    .single();

        if (error || !users){
            throw new Error("Invalid Credentials");         
        }

        const isPasswordMatch = await bcrypt.compare(password, users.password);

        if (!isPasswordMatch){
            throw new Error("Invalid Credentials");
        }

        res.status(200).json({ message: "Login successful", user: users.name }); 
        return users;
    }
    catch(e){
        res.status(401).send(e.message)
    }
}

module.exports = {studentLogin, parentLogin, facultyLogin};