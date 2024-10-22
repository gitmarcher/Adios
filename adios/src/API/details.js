import api from "../API/index";

const StudentDetails = async (roll_number) => {
    try {
        console.log(roll_number);
        const response = await api.get("/details/student_details", {
            params: { roll_number: roll_number }
        });
        const {message,userDetails,leaves} =  response.data;

        return {userDetails:userDetails,leaves:leaves};
    } catch (error) {
        console.error("Error fetching student details:", error);
        throw error;
    }
};

const DeleteLeaveStudent = async (leave_id) => {
    try {
        const response = await api.delete("/leaves/delete_leave", {
            params: { leave_id: leave_id }
        });
        console.log(response.data);
        return {success:true};
    } catch (error) {
        console.error("Error deleting leave:", error);
        throw error;
    }
};

const ParentDetails = async (roll_number) => {
    try {
        console.log(roll_number);
        const response = await api.get("/details/parent_details", {
            params: { roll_number: roll_number }
        });
        const {message,userDetails,leaves} =  response.data;

        return {userDetails:userDetails,leaves:leaves};
    } catch (error) {
        console.error("Error fetching student details:", error);
        throw error;
    }
};

const FacultyDetails = async (faculty) => {
    try {
        console.log(faculty);
        const response = await api.get("/approvals/faculty_approval", {
            params: { faculty: faculty }
        });
        console.log(response);
        const {message,data} = response.data;
        console.log({success:true,leaves:data});
        return {success:true,leaves:data};
    } catch (error) {
        console.error("Error fetching student details:", error);
        throw error;
    }
};

const WardenDetails = async (warden) => {
    try {
        console.log(warden);
        const response = await api.get("/approvals/warden_approval", {
            params: { faculty: warden }
        });
        console.log(response);
        const {message,data} = response.data;
        console.log({success:true,leaves:data});
        return {success:true,leaves:data};
    } catch (error) {
        console.error("Error fetching student details:", error);
        throw error;
    }
};

const AcademicsDetails = async () => {
    try {
        const response = await api.get("/approvals/academics_approval");
        console.log(response);
        const {message,data} = response.data;
        return {success:true,leaves:data};
    }catch(error){
        console.error("Error fetching student details:", error);
        throw error;
    }
}



// const FacultyDetails = async (name) =>{
//     try{
//         const response = await api.get("/approvals/faculty_approval",{
//             params : {username:name}
//         });

//         const {message,leaves} = response.data;
//     }
// }

export default StudentDetails;
export {StudentDetails,ParentDetails,DeleteLeaveStudent,FacultyDetails,WardenDetails,AcademicsDetails};