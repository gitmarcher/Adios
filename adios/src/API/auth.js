import api from "../API/index";


export const login = async (username, password, role) => {
    try {
        let response;
        console.log(username, password, role);
        if (role === "Student") {
            response = await api.post("/auth/student_login", { roll_number: username, password });
            return {
                login: true,
            } 
        }if(role === "Parents"){
            response  = await api.post("/auth/parent_login",{roll_number:username,password});
            return {
                login: true,
            }
        }if(role === "Faculty"){
            response = await api.post("/auth/faculty_login",{name:username,password});
            return {
                login: true,
            }
        }if(role === "Warden"){
            response  = await api.post("/auth/faculty_login",{name:username,password});
            return {
                login: true,
            }
        }if(role === "Academics"){
            response  = await api.post("/auth/faculty_login",{name:username,password});
            return {
                login: true,
            }
        }
         else {
            throw new Error('Unsupported role');
        }
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            console.log(status);
            console.log(error.response);
            if (status === 401) {
                return {
                    login: false,
                    message: "Invalid credentials"
                };
            } else {
                return {
                    login: false,
                    message: "An error occurred. Please try again."
                };
            }
        } else {
            return {
                login: false,
                message: "Network error. Please check your connection."
            };
        }
    }
};



export default login;