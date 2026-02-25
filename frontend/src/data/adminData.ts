export const getDashboardStats = async () => {
    return fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/dashboard/stats`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }).then(data => {
        return data.data;
    }).catch(error => {
        console.error('Error:', error);
        return null
    });
}