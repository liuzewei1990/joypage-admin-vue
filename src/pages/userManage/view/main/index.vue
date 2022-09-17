<template>
    <!-- 用户管理 -->
    <div class="userManage">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :model="filters" :size="size">
                    <el-form-item label="登录账号：">
                        <el-input v-model="filters.account" placeholder="请输入登录账号" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button icon="el-icon-plus" :size="size" style="float: left" type="primary" @click="addFormVisible = true">新增用户</el-button>
                <el-button icon="el-icon-delete" :size="size" style="float: left" type="danger" @click="handleBatchDelete()">批量删除</el-button>
                <el-button icon="el-icon-search" :size="size" style="float: right" type="primary" @click="findUserPage()">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="pageResultList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <!-- 多选type="selection" 取索引type="index"-->
                <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
                <el-table-column type="index" label="序号" width="100" header-align="center" align="center"></el-table-column>
                <el-table-column prop="account" label="登录账号" width="180" header-align="center" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="roleStatus" label="状态" header-align="center" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" width="190" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div slot="footer">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    style="float: right"
                    :total="totalSize"
                    @current-change="refreshPageRequest"
                    @size-change="handleSizeChange"
                    :current-page="pageRequest.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageRequest.pageSize">
                </el-pagination>
            </div>
        </CommonTable>
        <!--新增弹框-->
        <el-dialog title="新增用户" width="40%" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" :size="size" label-position="right">
                <el-form-item label="登录账号" prop="account">
                    <el-input v-model="addForm.account"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleName">
                    <el-select v-model="addForm.roleId" placeholder="请选择" style="width: 100%">
                        <el-option v-for="item in roleTreeOptions" :key="item.ID" :label="item.ROLE_NAME" :value="item.ID"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input v-model="addForm.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码确认" prop="repassword">
                    <el-input v-model="addForm.repassword" type="password" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="addFormVisible = false">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitFormAddSave('addForm')" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹框 -->
        <el-dialog title="编辑" width="40%" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" :size="size" label-position="right">
                <el-form-item label="登录账号" prop="account">
                    <el-input v-model="editForm.account" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleName">
                    <el-select v-model="editForm.roleId" placeholder="请选择" style="width: 100%">
                        <el-option v-for="item in roleTreeOptions" :key="item.id" :label="item.ROLE_NAME" :value="item.ID"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="editFormVisible = false">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitFormEditSave('editForm')" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getUserManages, getUserRoles, getUserAddSave, getUserEditSave, getUserDelete } from "../../apis/index";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "userManage",
        components: { CommonTable },
        data() {
            return {
                tableHeight: 0, //内容高度
                size: "small",
                filters: {
                    //
                    account: "" //搜索框账号名称
                },
                totalSize: 0, //总数
                pageRequest: {
                    //请求用户列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求用户时loading
                pageResultList: [], //请求回来的用户列表数据list
                saveLoading: false, //保存时按钮loading
                // 新增用户
                addFormVisible: false, //是否展示新增弹框
                addForm: {
                    account: "",
                    name: "",
                    roleId: "",
                    roleName: "",
                    roleStatus: 1,
                    password: "",
                    repassword: ""
                }, //新增弹框数据
                addFormRules: {
                    //新增弹框校验规则
                    account: [
                        { required: true, message: "请输入内容", trigger: "blur" },
                        { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
                    ],
                    username: [
                        { required: true, message: "请输入内容", trigger: "blur" },
                        { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
                    ],
                    password: [{ required: true, validator: this.validatePass, trigger: "blur" }],
                    repassword: [{ required: true, validator: this.validatePass2, trigger: "blur" }]
                },
                // 编辑
                editFormVisible: false, //是否展示编辑弹框
                editForm: {
                    account: "",
                    name: "",
                    roleId: "",
                    roleName: "",
                    roleStatus: 1,
                    password: ""
                }, //编辑弹框数据
                editFormRules: {
                    //编辑弹框校验规则
                    account: [
                        { required: true, message: "请输入用户名称", trigger: "blur" },
                        { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
                    ],
                    name: [
                        { required: true, message: "请输入登录帐号", trigger: "blur" },
                        { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
                    ]
                },
                // 选择角色
                roleTreeOptions: [], //请求回的角色数据
                //删除
                selections: [] //删除选中项
            };
        },
        mounted() {
            this.findUserPage(); //用户列表
        },
        methods: {
            // 获取列表数据
            findUserPage: function () {
                this.loading = true;
                let params = {
                    //查询多少页，从0开始, offset=页数乘以条数
                    offset: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum - 1) * this.pageRequest.pageSize,
                    limit: this.pageRequest.pageSize, //查询多少条
                    ACCOUNT: this.filters.account
                };
                console.log("用户数据入参", params);
                getUserManages(params)
                    .then((data) => {
                        console.log("获取用户分页数据", data);
                        this.pageResultList = data.rows;
                        this.totalSize = data.total;
                        this.findUserRoles(); //请求角色
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取用户分页数据err", err);
                    });
            },
            // 获取角色列表数据
            findUserRoles: function () {
                this.loading = true;
                let params = "";
                getUserRoles(params)
                    .then((data) => {
                        console.log("获取角色数据", data);
                        this.roleTreeOptions = data.data;
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取角色数据err", err);
                    });
            },
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                // console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.findUserPage(); //调用户列表接口
            },
            // 显示编辑界面
            handleEdit: function (row, index) {
                console.log("编辑", row);
                this.editFormVisible = true;
                this.editForm = row;
            },
            //新增保存提交
            submitFormAddSave: function (addForm) {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                let addFormData = {
                                    ACCOUNT: this.addForm.account,
                                    NAME: this.addForm.name,
                                    ROLE_ID: this.addForm.roleId,
                                    PASSWORD: this.addForm.password
                                };
                                console.log("新增保存入参", addFormData);
                                getUserAddSave(addFormData)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.code == "00000") {
                                            this.saveLoading = false;
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.addFormVisible = false;
                                            this.findUserPage();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.msg, type: "error" });
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("新增接口err", err);
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消新增" });
                            });
                    }
                });
            },
            //编辑保存提交
            submitFormEditSave: function (editForm) {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                let editFormData = {
                                    ID: this.editForm.id,
                                    ACCOUNT: this.editForm.account,
                                    NAME: this.editForm.name,
                                    ROLE_ID: this.editForm.roleId
                                };
                                console.log("编辑保存入参", editFormData);
                                //请求编辑接口
                                getUserEditSave(editFormData)
                                    .then((res) => {
                                        this.saveLoading = false;
                                        this.$message({ message: "操作成功", type: "success" });
                                        this.editFormVisible = false;
                                        this.findUserPage();
                                    })
                                    .catch((err) => {
                                        console.log("编辑接口err", err);
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消编辑" });
                            });
                    }
                });
            },
            // 选中当前行切换,值为单个对象 @current-change="handleCurrentChange"
            // handleCurrentChange: function (val) {
            // 	console.log('选中项 CurrentChange',val)
            // },
            // 单个删除
            handleDelete: function (index, row) {
                console.log("单个删除", row);
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            ID: row.id,
                            ACCOUNT: row.account
                        };
                        console.log("删除params", params);
                        getUserDelete(params).then((data) => {
                            this.$message({ message: "删除成功", type: "success" });
                            this.findUserPage(); //刷新当前页
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 选中多选框切换,值为数组
            selectionChange: function (selections) {
                this.selections = selections;
                console.log("选中项", this.selections);
            },
            // 批量删除
            handleBatchDelete: function () {
                console.log("批量删除");
                this.$confirm("确认删除选中记录吗？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let ids = [];
                        this.selections.map((item) => {
                            ids.push(item.id);
                        });
                        let params = {
                            IDS: ids.toString()
                        };
                        console.log("删除params", params);
                        getUserDelete(params).then((data) => {
                            this.$message({ message: "删除成功", type: "success" });
                            this.findUserPage(); //刷新当前页
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },

            // 验证密码
            validatePass(rule, value, callback) {
                if (value === "" || value === undefined) {
                    callback(new Error("请输入密码"));
                } else {
                    if (this.addForm.repassword !== "") {
                        this.$refs.addForm.validateField("repassword");
                    }
                    callback();
                }
            },
            // 验证密码是否一样
            validatePass2(rule, value, callback) {
                if (value === "" || value === undefined) {
                    callback(new Error("请再次输入密码"));
                } else if (value !== this.addForm.password) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            },
            // 时间格式化
            dateFormat: function (row, column, cellValue, index) {
                return format(row[column.property]);
            }
        }
    };
</script>

<style scoped>
    .userManage {
        padding: 20px;
    }
</style>
