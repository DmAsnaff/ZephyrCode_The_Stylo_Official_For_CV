import axios from 'axios'

const axiosInstance = axios.create({
    // baseURL:'http://192.168.1.8:5000',
    // baseURL:'http://192.168.143.51:5000',
    baseURL:'http://172.31.98.201:5000',



})

export default axiosInstance;