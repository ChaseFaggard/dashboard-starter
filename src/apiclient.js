const apiClient = (url) => {
    const defaultOptions = {
        baseURL: url,
        headers: {
            "Content-Type": "application/json"
        }
    }
    return axios.create(defaultOptions)
}

const apiClientWithToken = (url, token) => {
    const defaultOptions = {
        baseURL: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    }
    return axios.create(defaultOptions)
}

export { apiClient, apiClientWithToken }