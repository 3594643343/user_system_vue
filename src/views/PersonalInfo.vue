<template>

    <el-main>
        <div style="margin-bottom: 2%;">
            <span style="font-size: 18px;">个人信息</span>
        </div>
        <div>
            <!-- 个人信息详情与修改界面 -->
            <el-form label-position="left" :model="reviseInfoData" label-width="80px" style="margin: auto; width: 35%;"
                :rules="rules" ref="infoForm">
                <el-form-item label="账户 :" prop="account">
                    <div v-if="!isEditing">{{ info.account }}</div>
                    <el-input v-else v-model="reviseInfoData.account" maxlength="12" clearable></el-input>
                </el-form-item>
                <el-form-item label="昵称 :" prop="nickname">
                    <div v-if="!isEditing">{{ info.nickname }}</div>
                    <el-input v-else v-model="reviseInfoData.nickname" maxlength="10" clearable></el-input>
                </el-form-item>
                <el-form-item label="性别 :" prop="gender">
                    <span v-if="!isEditing">
                        <span v-if="info.gender == 1">男</span>
                        <span v-if="info.gender == 0">女</span>
                        <span v-if="info.gender == -1">未知</span>
                    </span>
                    <el-radio-group v-else v-model="reviseInfoData.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="-1">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色 :" prop="role">
                    <el-tag v-if="info.role == 0" type="danger">超级管理员</el-tag>
                    <el-tag v-if="info.role == 1" type="primary">管理员</el-tag>
                    <el-tag v-if="info.role == 2" type="success">普通用户</el-tag>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="!isEditing" type="primary" style="width: 40%;" @click="handleEdit">编
                        辑</el-button>
                    <span v-else>
                        <el-button type="info" plain style="width: 40%;" @click="isEditing = false">取
                            消</el-button>
                        <el-button type="primary" style="width: 40%;" @click="reviseInfo">修 改</el-button>
                    </span>
                </el-form-item>

            </el-form>
        </div>
    </el-main>

</template>

<script>
import validateRule from '@/commen/validateRule'
// import global from '@/commen/global'
import { changeInfo, getInfo } from '@/api/user'

export default {
    created() {
        return {
            isEditing: false, // 是否在编辑状态
            info: {}, // 用户详细信息
            reviseInfoData: { // 修改的信息内容
                id: null,
                account: '',
                nickname: '',
                gender: ''
            },
            rules: { // 验证规则
                account: [
                    { validator: validateRule.validateAccount, trigger: 'blur' }
                ],
                nickname: [
                    { validator: validateRule.validateNickname, trigger: 'blur' },
                ]
            }
        }
    },
    methods: {
        // 编辑按钮函数
        handleEdit() {
            this.reviseInfoData.account = this.info.account;
            this.reviseInfoData.nickname = this.info.nickname;
            this.reviseInfoData.gender = this.info.gender;
            this.isEditing = true;
        },
        // 修改信息函数
        reviseInfo() {
            this.$refs['infoForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('是否确认修改？', '提 示', {
                        confirmButtonText: '确 定',
                        cancelButtonText: '取 消',
                    }).then(() => {
                        changeInfo(this.reviseInfoData).then((res) => {
                            console.log(res);
                            const resData = res.data;
                            this.$message({
                                message: '个人信息已修改！',
                                type: 'success'
                            })
                            this.isEditing = false;
                            this.info.account = resData.data.account;
                            this.info.nickname = resData.data.nickname;
                            this.info.gender = resData.data.gender;
                            this.$store.commit('setNickname', this.info.nickname);
                        }).catch((error) => {
                            console.log(error)
                        })
                        // var resData = await global.changeInfo(this.reviseInfoData);
                        // // console.log(resData)
                        // if (resData.code == 1) {
                        //     this.$message({
                        //         message: '个人信息已修改！',
                        //         type: 'success'
                        //     })
                        //     this.isEditing = false;
                        //     this.info.account = resData.data.account;
                        //     this.info.nickname = resData.data.nickname;
                        //     this.info.gender = resData.data.gender;
                        //     this.$store.commit('setNickname', this.info.nickname);
                        // } else {
                        //     if (resData.msg) {
                        //         this.$message.error(resData.msg);
                        //     }
                        // }

                    }).catch(() => {

                    });
                } else {
                    console.log('valid error change info');
                    return;
                }
            })
        },
        // 获取个人信息
        getInfo() {
            getInfo().then((res) => {
                console.log(res);
                const resData = res.data;
                this.info = resData.data;
                this.$store.commit('setNickname', this.info.nickname);
            }).catch((error) => {
                this.$message.error(error.response.data.msg);
            })
            // var resData = await global.getInfo()
            // // console.log(resData)
            // if (resData.code == 1) {
            //     this.info = resData.data;
            //     this.$store.commit('setNickname', this.info.nickname);
            //     // console.log(this.info);
            // } else {
            //     if (resData) {
            //         this.$message.error(resData.msg);
            //     }
            // }
        }
    }


}
</script>

<style></style>