
const baseUrl = import.meta.env.VITE_BASE_URL;



const registerUser = async (userData) => {

    const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
        console.log();

        throw new Error(data.message || "Login failed");
    }

    return data;


};


const loginUser = async (useData) => {

    const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useData),
        credentials: 'include'

    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }
    return data;
}

const token = localStorage.getItem('access');


const getUser = async () => {
    const response = await fetch(`${baseUrl}/auth/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "failed to fetch user details");
    }
    return data;
}



const updateUser = async (userData) => {

    const response = await fetch(`${baseUrl}/auth/update-user`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "Failed to update user");
    }
    return data;
}


export const authService = {
    registerUser,
    loginUser,
    getUser,
    updateUser
};
