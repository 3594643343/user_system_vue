<template>
    <el-main>
        <div style="margin-bottom: 1%;">
            <span style="font-size: 18px;">用户管理</span>
        </div>

        <!-- 搜索栏 -->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" size="medium" label-width="60px">
            <el-form-item label="账户">
                <el-input v-model="searchData.account" placeholder="请输入内容" clearable @clear="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="searchData.nickname" placeholder="请输入内容" clearable @clear="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="searchData.gender" placeholder="请选择" style="width: 100px;" clearable
                    @clear="handleSearch">
                    <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="searchData.role" placeholder="请选择" clearable @clear="handleSearch">
                    <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="handleSearch">查 询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" plain @click="handleRefresh">重 置</el-button>
            </el-form-item>
        </el-form>

        <!-- 用户表格 -->
        <el-table v-loading="loading" :data="tableData" stripe style="width: 99.9%;" height="75%" border>
            <el-table-column prop="id" label="id">
            </el-table-column>
            <el-table-column prop="account" label="账户">
            </el-table-column>
            <el-table-column prop="nickname" label="昵称">
            </el-table-column>
            <el-table-column prop="gender" label="性别">
                <template slot-scope="scope">
                    <span v-if="scope.row.gender == 1">男</span>
                    <span v-if="scope.row.gender == 0">女</span>
                    <span v-if="scope.row.gender == -1">未知</span>
                </template>
            </el-table-column>
            <el-table-column prop="role" label="角色">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.role == 0" type="danger" effect="plain">超级管理员</el-tag>
                    <el-tag v-if="scope.row.role == 1" type="primary" effect="plain">管理员</el-tag>
                    <el-tag v-if="scope.row.role == 2" type="success" effect="plain">普通用户</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="small"
                        :disabled="scope.row.role == 0 || $store.state.role == scope.row.role"
                        @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="small"
                        :disabled="scope.row.role == 0 || $store.state.role == scope.row.role"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页条和新增按钮 -->
        <div style="display: flex; align-items: center; margin-top: 2%">
            <el-pagination background layout="sizes, prev, pager, next, jumper, total" :total="total"
                :page-sizes="[5, 10, 20, 50]" :current-page="currentPage" :page-size="pageSize"
                @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
            <el-button type="primary" size="medium" style="position: absolute; right: 2%;" @click="openAddDialog">新
                增</el-button>
        </div>
        <!-- 新增用户和编辑用户弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center width="40%" :before-close="handleClose">
            <el-form :model="dialogData" class="demo-form-inline" size="medium" label-width="40px" :rules="rules"
                ref="dialogForm">
                <el-form-item v-if="isEditing" label="id">
                    <el-tag type="primary">{{ dialogData.id }}</el-tag>
                </el-form-item>
                <el-form-item label="账户" prop="account">
                    <el-input v-model="dialogData.account" placeholder="请输入账户(长度4-12位)" clearable></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="dialogData.nickname" placeholder="请输入昵称(长度不超过10位)" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="!isEditing" label="密码" prop="password">
                    <el-input v-model="dialogData.password" placeholder="请输入密码(6-16位,仅能包含大小写和数字)" clearable></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="dialogData.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="-1">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-radio-group v-if="!isEditing" v-model="dialogData.role">
                        <el-radio :disabled="$store.state.role != 0" :label="1">管理员</el-radio>
                        <el-radio :label="2">普通用户</el-radio>
                    </el-radio-group>
                    <span v-else>
                        <el-tag v-if="dialogData.role == 1" type="primary">管理员</el-tag>
                        <el-tag v-if="dialogData.role == 2" type="success">普通用户</el-tag>
                        <el-button v-if="this.$store.state.role == 0" type="text" style="margin-left: 10px;"
                            @click="roleVisible = true">修改</el-button>
                    </span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="!isEditing" type="primary" @click="add">新 增</el-button>
                <el-button v-else type="primary" @click="revise">修 改</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色弹窗 -->
        <el-dialog title="修改角色" :visible.sync="roleVisible" width="35%" center>
            <el-form :model="roleData">
                <el-form-item label="角色">
                    <el-radio-group v-model="roleData.role">
                        <el-radio :label="1">管理员</el-radio>
                        <el-radio :label="2">普通用户</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeRole()">确 定</el-button>
            </div>
        </el-dialog>
    </el-main>

</template>

<script>
// import axios from 'axios'
import validateRule from '@/commen/validateRule'
// import global from '@/commen/global'
import { add, changeRole, deleteUser } from '@/api/manageUser'
import { changeInfo, getUsers } from '@/api/user'

export default {
    created() {
        this.getUsers();
    },
    data() {
        return {
            dialogTitle: '新增用户', // 新增与编辑对话框标题
            dialogVisible: false, //  新增与编辑对话框是否可见
            roleVisible: false, // 修改角色对话框是否可见
            loading: false, // 是否在加载中
            currentPage: 1, // 当前页数
            pageSize: 10, // 页大小
            total: 0, // 数据总数
            isEditing: 'false', // 是否在编辑状态
            dialogData: { // 对话框表单数据
                id: '',
                account: '',
                nickname: '',
                password: '',
                gender: 1,
                role: 2
            },
            roleData: { // 修改角色数据
                role: '',
            },
            tableData: [], // 表格数据
            searchData: { // 搜索数据表单
                account: '',
                nickname: '',
                gender: '',
                role: ''
            },
            genders: [ // 性别数组
                {
                    value: 1,
                    label: '男'
                },
                {
                    value: 0,
                    label: '女'
                },
                {
                    value: -1,
                    label: '未知'
                }
            ],
            roles: [ // 角色数组
                {
                    value: 2,
                    label: '普通用户'
                },
                {
                    value: 1,
                    label: '管理员'
                },
                {
                    value: 0,
                    label: '超级管理员'
                }
            ],
            rules: { // 验证规则
                account: [
                    { validator: validateRule.validateAccount, trigger: 'blur' }
                ],
                nickname: [
                    { validator: validateRule.validateNickname, trigger: 'blur' }
                ],
                password: [
                    { validator: validateRule.validatePassword, trigger: 'blur' }
                ]
            }

        }
    },
    methods: {
        // 添加用户
        add() {
            this.$refs['dialogForm'].validate((valid) => {
                if (valid) {
                    // axios({
                    //     url: '/admin/add',
                    //     method: 'post',
                    //     headers: {
                    //         'token': sessionStorage.getItem('token'),
                    //     },
                    //     data: {
                    //         account: this.dialogData.account,
                    //         nickname: this.dialogData.nickname,
                    //         password: this.dialogData.password,
                    //         gender: this.dialogData.gender,
                    //         role: this.dialogData.role
                    //     }
                    // })
                    const data = {
                        account: this.dialogData.account,
                        nickname: this.dialogData.nickname,
                        password: this.dialogData.password,
                        gender: this.dialogData.gender,
                        role: this.dialogData.role
                    }
                    add(data).then((res) => {
                        console.log(res)
                        this.dialogVisible = false;
                        this.$message({
                            message: '新增用户成功！',
                            type: 'success'
                        })
                        this.getUsers();
                    }).catch((error) => {
                        if (error.response.data.msg) {
                            this.$message.error(error.response.data.msg);
                        }
                    })
                } else {
                    console.log('addForm valid error');
                }
            })
        },
        // 修改用户信息
        revise() {
            this.$refs['dialogForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('是否确认修改？', '提 示', {
                        confirmButtonText: '确 定',
                        cancelButtonText: '取 消',
                    }).then(() => {
                        var formData = {
                            id: this.dialogData.id,
                            account: this.dialogData.account,
                            nickname: this.dialogData.nickname,
                            gender: this.dialogData.gender
                        }
                        changeInfo(formData).then(() => {
                            this.$message({
                                message: '信息已修改！',
                                type: 'success'
                            })
                            this.dialogVisible = false;
                            this.getUsers();
                        }).catch((error) => {
                            this.$message.error(error.response.data.msg);
                        })
                        // var resData = await global.changeInfo(formData); // 修改用户个人信息
                        // if (resData.code == 1) {
                        //     this.$message({
                        //         message: '信息已修改！',
                        //         type: 'success'
                        //     })
                        //     this.dialogVisible = false;
                        //     this.getUsers();
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
        // 根据条件获取用户列表数据
        getUsers() {
            this.loading = true;
            // axios({
            //     url: '/admin/query',
            //     method: 'get',
            //     headers: {
            //         'token': sessionStorage.getItem('token'),
            //     },
            //     params: {
            //         page: this.currentPage,
            //         size: this.pageSize,
            //         account: this.searchData.account,
            //         nickname: this.searchData.nickname,
            //         gender: this.searchData.gender,
            //         role: this.searchData.role
            //     }
            // })
            const params = {
                page: this.currentPage,
                size: this.pageSize,
                account: this.searchData.account,
                nickname: this.searchData.nickname,
                gender: this.searchData.gender,
                role: this.searchData.role
            }
            getUsers(params).then((res) => {
                console.log(res)
                this.tableData = []
                this.tableData = res.data.data.records;
                this.total = res.data.data.total;
                setTimeout(() => {
                    this.loading = false;
                }, 300)
            }).catch((error) => {
                if (error.response.data.msg) {
                    this.$message.error(error.response.data.msg);
                }
            })
        },
        // 打开新增对话框
        openAddDialog() {
            this.isEditing = false;
            this.dialogVisible = true;
            this.dialogTitle = '新增用户';
            this.dialogData.account = '';
            this.dialogData.nickname = '';
            this.dialogData.password = '';
            this.dialogData.gender = 1;
            this.dialogData.role = 2;
        },
        // 修改用户的角色信息
        changeRole() {
            this.$confirm('确认修改？').then(() => {
                this.roleVisible = false;
                this.dialogVisible = false;
                // axios({
                //     url: '/admin/update/role',
                //     method: 'put',
                //     headers: {
                //         'token': sessionStorage.getItem('token'),
                //     },
                //     data: {
                //         userId: this.dialogData.id,
                //         roleId: this.roleData.role,
                //     }
                // })
                const data = {
                    userId: this.dialogData.id,
                    roleId: this.roleData.role,
                }
                changeRole(data).then((res) => {
                    console.log(res)
                    this.$message({
                        showClose: true,
                        message: '角色已修改',
                        type: 'success'
                    });
                    this.getUsers();
                }).catch((error) => {
                    if (error.response.data.msg) {
                        this.$message.error(error.response.data.msg);
                    }
                })
            }).catch(() => {

            })
        },
        // 搜索
        handleSearch() {
            this.currentPage = 1;
            this.getUsers();
        },
        // 重置搜索内容
        handleRefresh() {
            this.searchData.account = '';
            this.searchData.nickname = '';
            this.searchData.gender = '';
            this.searchData.role = '';
            this.getUsers();
            this.$message({
                showClose: true,
                message: '搜索内容已重置',
                type: 'success'
            });
        },
        // 点击编辑按钮
        handleEdit(data) {
            this.isEditing = true;
            this.dialogVisible = true;
            this.dialogTitle = '编辑用户';
            this.dialogData.id = data.id;
            this.dialogData.account = data.account;
            this.dialogData.nickname = data.nickname;
            this.dialogData.password = '';
            this.dialogData.gender = data.gender;
            this.dialogData.role = data.role;
            this.roleData.role = this.dialogData.role;
        },
        // 删除用户
        handleDelete(data) {
            this.$confirm('此操作将删除id为 ' + data.id + ' 的用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // axios({
                //     url: '/admin/delete',
                //     method: 'delete',
                //     headers: {
                //         'token': sessionStorage.getItem('token'),
                //     },
                //     params: {
                //         ids: data.id
                //     }
                // })
                deleteUser(data.id).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    console.log(res)
                    this.getUsers();
                }).catch((error) => {
                    if (error.response.data.msg) {
                        this.$message.error(error.response.data.msg);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 关闭对话框前调用该函数
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(() => {
                    done();
                })
                .catch(() => { });
        },
        // 页大小变化
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.getUsers();
        },
        // 当前页变化
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getUsers();
        }
    }


}
</script>

<style></style>