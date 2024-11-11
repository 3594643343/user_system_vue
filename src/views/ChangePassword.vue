<template>

    <el-main>
        <div style="margin-bottom: 2%;">
            <span style="font-size: 18px;">修改密码</span>
        </div>

        <!-- 修改密码表单 -->
        <div class="input-password">
            <el-form :model="passwordData" label-width="100px" style="margin: auto;width: 35%;" :rules="rules"
                ref="passwordForm">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" v-model="passwordData.oldPassword" placeholder="请输入旧密码" clearable
                        show-password maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword1">
                    <el-input type="password" v-model="passwordData.newPassword1" placeholder="请输入新密码" clearable
                        show-password maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="newPassword2">
                    <el-input type="password" v-model="passwordData.newPassword2" placeholder="再次输入新密码" clearable
                        show-password maxlength="16"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 40%;" @click="handleClear">清 空</el-button>
                    <el-button type="primary" style="width: 40%;" @click="handleSubmit('passwordForm')">修
                        改</el-button>
                </el-form-item>

            </el-form>
        </div>
    </el-main>

</template>

<script>
import validateRule from '@/commen/validateRule'
// import axios from 'axios';
import { changePassword } from '@/api/user'

export default {
    data() {
        // 自定义验证规则
        var old = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入旧密码'));
            } else if (value == this.passwordData.newPassword1) {
                callback(new Error('旧密码和新密码不能相同'));
            } else {
                callback();
            }
        }
        var validateNewPassword2 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('再次输入新密码'));
            } else if (value.length < 6) {
                callback(new Error('密码长度6-16位'));
            }
            else if (value != this.passwordData.newPassword1) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        }
        return {
            passwordData: { // 密码表单数据
                oldPassword: null,
                newPassword1: null,
                newPassword2: null
            },
            rules: { // 验证规则
                oldPassword: [
                    { required: true, validator: old, trigger: 'blur' }
                ],
                newPassword1: [
                    { required: true, validator: validateRule.validatePassword, trigger: 'blur' }
                ],
                newPassword2: [
                    { required: true, validator: validateNewPassword2, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 清空已输入内容
        handleClear() {
            this.passwordData.oldPassword = '';
            this.passwordData.newPassword1 = '';
            this.passwordData.newPassword2 = '';
        },
        // 修改密码
        handleSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('是否确认修改密码？', '提 示', {
                        confirmButtonText: '确 定',
                        cancelButtonText: '取 消',
                    }).then(() => {
                        // axios({
                        //     url: '/admin/update/password',
                        //     method: 'put',
                        //     params: null,
                        //     data: {
                        //         userId: null,
                        //         oldPassword: this.passwordData.oldPassword,
                        //         newPassword: this.passwordData.newPassword1
                        //     },
                        //     headers: {
                        //         'token': sessionStorage.getItem('token'),
                        //     }
                        // })
                        changePassword(null, this.passwordData.oldPassword, this.passwordData.newPassword1).then((res) => {
                            console.log(res)
                            this.$message({
                                message: '密码已修改！',
                                type: 'success'
                            })
                            this.handleClear();
                        }).catch((error) => {
                            console.log(error)
                            if (error.response.data.msg) {
                                this.$message.error(error.response.data.msg);
                            }
                        })
                    }).catch(() => {

                    });
                }
            })
        }
    }


}
</script>

<style></style>