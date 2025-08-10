const baseUrl = `http://localhost:5000/api`;


const token = localStorage.getItem('access');




const getAllExpenses = async () => {
    const response = await fetch(`${baseUrl}/list`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    const data = await response.json();
    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "failed to fetch Expenses")
    }

    return data;
};


const addExpense = async (expenseData) => {
    const response = await fetch(`${baseUrl}/add`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "Failed to add expense");
    }

    return data;
}


const updateExpense = async (id, expenseData) => {
    const response = await fetch(`${baseUrl}/update/${id}`, {
        method: "PATCH",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
        credentials: "include"
    });

    const data = await response.json();
    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "Failed to update expense");

    }

    return data;
}


const deleteExpense = async (id) => {
    const response = await fetch(`${baseUrl}/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "Failed to delete expense");
    }

    return data;
}


const setBudget = async (amount) => {
    const response = await fetch(`${baseUrl}/budget`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(amount),
        credentials: "include"
    });

    const data = await response.json();
    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "failed to set budget");
    }

    return data;
}

const getMonthlySummary = async () => {
    const response = await fetch(`${baseUrl}/get-monthly-summary`, {
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
        throw new Error(data.message || "Failed to fetch monthly expense data");
    }
    return data;
}

const exportExpenseData = async (range) => {
    const response = await fetch(`${baseUrl}//export-monthly-data`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(range),
        credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "Failed to export expense data");
    };

    return data;
}

const getDashboardSummary = async (range) => {
    const response = await fetch(`${baseUrl}/get-dashboard-summary`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(range),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "failed to fetch dashboard data");
    }

    return data;
}


export const expenseService = {
    addExpense,
    updateExpense,
    deleteExpense,
    getAllExpenses,
    getDashboardSummary,
    getMonthlySummary,
    exportExpenseData,
    setBudget

}