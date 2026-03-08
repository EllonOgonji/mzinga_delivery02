import { ReturnData } from "@/types"

export interface UserInfo {
    full_name: string,
    phone_number: string,
    avatar_url: string
}

export const updateUserInfo = async function (userInfo: UserInfo): Promise<ReturnData> {
    let url = `${import.meta.env.VITE_BASE_URL}/api/auth/me`;

    return fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userInfo)
    }).then(response => {
        if (!response.ok){
            throw new Error("Information update request failed")
        }
        return response.json()
    }).then(data => {
        return {
            status: true,
            data: data.data,
            error: null
        }
    }).catch(error => {
        console.error('Error:', error);
        return {
            status: false,
            data: null,
            error: error
        }
    });
};