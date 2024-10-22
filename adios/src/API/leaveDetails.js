import api from "./index";

const getLeaveDetails = async ({leave_id,roll_number}) => {
    try{
        const response = await api.get("/leaves/get_leave_details",{params:{leave_id,roll_number}});
        const {studentDetails,parentDetails,leaveDetails} = response.data;
        const [studentDetail] = studentDetails;
        const [parentDetail] = parentDetails;
        const [leaveDetail] = leaveDetails;
        return {studentDetail,parentDetail,leaveDetail};
    }catch(error){
        console.error("Error during request:",error);
        throw error;
    }
};  

export default getLeaveDetails;
export {getLeaveDetails};