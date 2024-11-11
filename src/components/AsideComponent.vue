<template>
    <!-- 公共菜单栏 -->
    <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router>
        <el-menu-item index="/manage">
            <i class="el-icon-menu"></i>
            <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/info">
            <i class="el-icon-document"></i>
            <span slot="title">个人信息</span>
        </el-menu-item>
        <el-menu-item index="/changePassword">
            <i class="el-icon-setting"></i>
            <span slot="title">修改密码</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
export default {
    name: 'AsideComponent', // 导出名称
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>
<style></style>