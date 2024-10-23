import axios from 'axios';
import api from "../API/index";
import { ca } from 'date-fns/locale';

const api2 = axios.create({
  baseURL: 'http://localhost:5000/api/', // Base URL
  // No need to set Content-Type for FormData
});

const ParentApproval = async (formData) => {
    try {
        const response = await api2.post("approvals/parent_consent", formData);
        console.log(response.data); // Log the response data
        return {success: true}; // Return success
    } catch (error) {
        console.error("Error during request:", error); // Detailed error logging
        throw error; // Rethrow the error
    }
};

const ParentDisapproval = async (leave_id) => {
    try{
        const response = await api.patch("/approvals/parent_disapproval",{leave_id:leave_id});
        console.log(response.data);
        return {success:true};
    }catch(error){
        console.error("Error during request:",error);
        throw error;
    }
}

const FacultyApproval = async (leave_id,faculty) => {
    try{
        const response = await api.patch("/approvals/faculty_approval",{leave_id:leave_id,faculty:faculty});
        console.log(response.data);
        return {success:true};
    }catch(error){
        console.error("Error during request:",error);
        throw error;
    }
};

const WardenApproval = async (leave_id,warden) => {
    try{
        const response = await api.patch("/approvals/warden_approval",{leave_id:leave_id,faculty:warden});
        console.log(response.data);
        return {success:true};
    }catch(error){
        console.error("Error during request:",error);
        throw error;
    }
};

const AcademicsApproval = async (leave_id) => {
    try{
        const response = await api.patch("/approvals/academics_approval",{leave_id:leave_id});
        console.log(response.data);
        return {success:true};
    }catch(error){
        console.error("Error during request:",error);
        throw error;
    }
};

export {ParentApproval,FacultyApproval,WardenApproval,AcademicsApproval,ParentDisapproval};
export default ParentApproval;