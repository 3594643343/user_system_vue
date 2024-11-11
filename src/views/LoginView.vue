<template>
    <div class="container">
        <div class="login">
            <div class="login-content">
                <!-- 标题 -->
                <div style="text-align: center;">
                    <h2>用户管理系统</h2>
                </div>
                <!-- 登录表单 -->
                <div>
                    <el-form :model="loginData" :rules="rules" ref="loginForm">
                        <el-form-item prop="account">
                            <el-input v-model="loginData.account" placeholder="请输入账户" prefix-icon="el-icon-user"
                                clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="loginData.password" placeholder="请输入密码"
                                prefix-icon="el-icon-lock" clearable show-password></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button style="width: 100%;" type="primary" @click="login()">登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import axios from 'axios';
// import global from '@/commen/global'
import { login, getInfo } from '@/api/user'

export default {
    data() {
        return {
            loginData: { // 登录数据
                account: '',
                password: ''
            },
            rules: { // 验证规则
                account: [
                    { required: true, message: '请输入账户', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 登录
        login() {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    login(this.loginData.account, this.loginData.password).then((res) => {
                        console.log(res)
                        if (res.data.code == 1) {
                            sessionStorage.setItem('token', res.data.data.token);
                            this.$message({
                                message: '登录成功！',
                                type: 'success',
                                duration: 1000
                            })
                            getInfo().then(res => {
                                console.log(res);
                                const loginUser = res.data;
                                this.$store.commit('setNickname', loginUser.data.nickname);
                                this.$store.commit('setRole', loginUser.data.role);
                                setTimeout(() => {
                                    this.$router.push("/manage")
                                }, 1000)
                            })
                        }
                    }).catch((error) => {
                        console.log(error);
                        alert(error.response.data.msg)
                    });
                    // axios({
                    //     url: '/admin/login',
                    //     method: 'post',
                    //     data: {
                    //         account: this.loginData.account,
                    //         password: this.loginData.password
                    //     }
                    // })
                    // .then(async (res) => {
                    //     console.log(res)
                    //     if (res.data.code == 1) {
                    //         sessionStorage.setItem('token', res.data.data.token);
                    //         this.$message({
                    //             message: '登录成功！',
                    //             type: 'success',
                    //             duration: 1000
                    //         })

                    //         getInfo().then(res => {
                    //             console.log(res);
                    //             const loginUser = res.data;
                    //             this.$store.commit('setNickname', loginUser.data.nickname);
                    //             this.$store.commit('setRole', loginUser.data.role);
                    //             setTimeout(() => {
                    //                 this.$router.push("/manage")
                    //             }, 1000)
                    //         })

                    //         var loginUser = await global.getInfo();
                    //         // console.log(loginUser)
                    //         if (loginUser.code == 1) {
                    //             this.$store.commit('setNickname', loginUser.data.nickname);
                    //             this.$store.commit('setRole', loginUser.data.role);
                    //             setTimeout(() => {
                    //                 this.$router.push("/manage")
                    //             }, 1000)
                    //         }
                    //     }
                    // }).catch((error) => {
                    //     console.log(error);
                    //     alert(error.response.data.msg)
                    // });
                } else {
                    console.log('valid error login');
                    return;
                }
            })
        }
    }
}
</script>

<style></style>