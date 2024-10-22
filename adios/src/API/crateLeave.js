import api from "./index";

const createLeave = async (data) => {
    try{
        console.log("data",data);
        const {username,purpose,address,days,startDate,endDate} = data;
        console.log({roll_number:username,purpose,address,days,from_date:startDate,to_date:endDate});
        const response = await api.post("/leaves/create_leave",{roll_number:username,purpose,address,days,from_date:startDate,to_date:endDate});

        console.log(response.data);
        return {success:true};
    }catch(error){
        console.error("Error during request:",error);
        throw error;
    }

}

export default createLeave;
export {createLeave};