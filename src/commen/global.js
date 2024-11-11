import axios from "axios";
export default {
    // 获取登录用户信息
     async getInfo() {
        try {
            var res = await axios({
                url: '/admin/get/info',
                method: 'get',
                headers: {
                    'token': sessionStorage.getItem('token'),
                }
            });
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    },
    // 修改用户信息
    async changeInfo(reviseData) {
        try {
            var res = await axios({
                url: '/admin/update/info',
                method: 'put',
                data: reviseData,
                headers: {
                    'token': sessionStorage.getItem('token'),
                }
            })
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }
}