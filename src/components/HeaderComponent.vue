<template>
    <!-- 公共头部区域 -->
    <span style="display: flex; align-items: center;">
        <span style="font-size: 18px;">用户管理系统</span>
        <div class="person-info" style="font-size: 14px;">
            <el-avatar style="margin-right: 5px;" icon="el-icon-user" size="small"></el-avatar>
            <span style="margin-right: 5px;">{{ $store.state.nickname }}</span>
            <div class="log-out" @click="logOut">
                <i class="el-icon-switch-button"></i>
                <span>退出登录</span>
            </div>
        </div>
    </span>

</template>

<script>
// import axios from 'axios';
import { logOut } from '@/api/user'
export default {
    name: 'HeaderComponent', // 导出名称
    props: {
        // 定义传入的参数
    },
    data() {
        return {

        }
    },
    methods: {
        logOut() {
            this.$confirm('确认退出登录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                logOut().then(() => {
                    this.$message({
                        type: 'success',
                        message: '已退出登录!'
                    });
                    sessionStorage.clear(); // 清空缓存信息
                    this.$router.push('/');
                }).catch((error) => {
                    console.log(error)
                })
                
            }).catch(() => {

            });
        }
    }
}
</script>
<style></style>