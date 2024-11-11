import axios from "axios";
import router from "@/router";
import { done, start } from '@/utils/nProgress'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000
})

service.interceptors.request.use(config => {
    start();
    const isToken = (config.headers || {}).isToken === false
    if (sessionStorage.getItem('token') && !isToken) {
        config.headers['token'] = sessionStorage.getItem('token');
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

service.interceptors.response.use((response) => {
    done();
    return response;
}, (error) => {
    done();
    if (error.response && error.response.status === 401) {
        // 清除会话缓存
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        // 回到登录页面
        alert('token已失效,请重新登录!')
        router.push('/');
    }
    return Promise.reject(error);
})

export default service