<template>
    <el-container class="container">
        <el-header height="50px">
            <header-component></header-component>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <aside-component></aside-component>
            </el-aside>
            <router-view></router-view>
        </el-container>
    </el-container>
</template>

<script>
import AsideComponent from '../components/AsideComponent.vue'
import HeaderComponent from '../components/HeaderComponent.vue'

export default {
    name: 'VueLayout',
    components: { AsideComponent, HeaderComponent },
    data() {

    },
    methods: {

    }
}
</script>

<style></style>