<template>
    <!-- 权限管理 -->
    <div class="rightsManage">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :model="filters" :size="size">
                    <el-form-item label="角色名：">
                        <el-input v-model="filters.roleName" placeholder="请输入角色名"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button icon="el-icon-plus" :size="size" style="float: left" type="primary" @click="addFormVisible = true">新增</el-button>
                <el-button icon="el-icon-delete" :size="size" style="float: left" type="danger" @click="handleBatchDelete()">批量删除</el-button>
                <el-button icon="el-icon-search" :size="size" style="float: right" type="primary" @click="findRolePage()">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="pageRoletList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <!-- 多选type="selection" 取索引type="index"-->
                <el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
                <el-table-column prop="ID" label="ID" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="ROLE_NAME" label="角色名" header-align="center" align="center"></el-table-column>
                <el-table-column prop="CREATE_ID" label="创建人" header-align="center" align="center"></el-table-column>
                <el-table-column prop="CREATE_TIME" label="创建时间" header-align="center" align="center"></el-table-column>
                <el-table-column prop="UPD_TIME" label="更新时间" header-align="center" align="center"></el-table-column>

                <el-table-column label="操作" width="270" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
                        <el-button size="mini" type="text" @click="handleRoleAction(scope.row, scope.$index)">授权</el-button>
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
        <!-- 新增弹框 -->
        <el-dialog title="新增角色" width="40%" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm" :size="size" label-position="right">
                <el-form-item label="角色名称" prop="ROLE_NAME">
                    <el-input v-model="addForm.ROLE_NAME"></el-input>
                </el-form-item>
                <!-- <el-form-item label="备注" prop="ID">
				<el-input v-model="addForm.ID"></el-input>
			</el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="addFormVisible = false">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitFormAddSave('addForm')" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹框 -->
        <el-dialog :title="'编辑角色：' + currentRoleName" width="40%" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm" :size="size" label-position="right">
                <el-form-item label="ID" prop="ID">
                    <el-input v-model="editForm.ID" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="ROLE_NAME">
                    <el-input v-model="editForm.ROLE_NAME" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="备注" prop="ROLE_NAME">
				<el-input v-model="editForm.name" auto-complete="off"></el-input>
			</el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="editFormVisible = false">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitFormEditSave('editForm')" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
        <!-- 授权弹框 -->
        <el-dialog :title="'授权角色：' + currentRoleName" width="40%" :visible.sync="roleListVisible">
            <!-- default-expanded-keys 默认展开节点  default-checked-keys默认选中节点-->
            <el-tree
                :data="roleTreeData"
                :props="defaultProps"
                node-key="id"
                ref="elTree"
                :default-checked-keys="defaultCheckedKeys"
                @check-change="checkChange"
                :load="loadNode"
                show-checkbox
                empty-text=""
                v-loading="roleListLoading"
                element-loading-text="拼命加载中...">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="roleListVisible = false">取消</el-button>
                <el-button :size="size" type="primary" :disabled="roleSaveBtnDisabled" @click.native="submitFormRoleSaveBtn()" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // 接口函数依次：角色管理列表，角色tree,新增保存，编辑保存，授权保存，单个删除，批量删除
    import { getRoleManages, getRolesTree, getRoleAddSave, getRoleEditSave, getRoleGrantSave, getRoleDelete, getRoleDeletes } from "../../apis/index";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "roleManage",
        components: { CommonTable },
        data() {
            return {
                tableHeight: 0, //内容高度
                size: "small",
                filters: {
                    //
                    roleName: "" //搜索框账号名称
                },
                totalSize: 0, //总数
                pageRequest: {
                    //请求角色列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求角色时loading
                pageRoletList: [
                    // {
                    // 	CREATE_ID: 1,
                    // 	CREATE_TIME: "2017-03-09 17:09:38",
                    // 	ID: 1,
                    // 	ROLE_NAME: "系统管理员",
                    // 	ROLE_STATUS: "1",
                    // 	UPD_ID: 1,
                    // 	UPD_TIME: "2017-03-23 16:00:01",
                    // }
                ], //请求回来的角色列表数据list
                saveLoading: false, //保存时按钮loading
                // 新增角色
                addFormVisible: false, //是否展示新增弹框
                addForm: {
                    //新增弹框数据
                    ROLE_NAME: ""
                },
                formRules: {
                    //新增弹框校验规则
                    ROLE_NAME: [
                        { required: true, message: "请输入内容", trigger: "blur" },
                        { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
                    ]
                },
                // 编辑
                editFormVisible: false, //是否展示编辑弹框
                editForm: {
                    //编辑弹框数据
                    ID: "",
                    ROLE_NAME: "",
                    UPD_ID: ""
                },
                // 角色授权
                roleListVisible: false, //是否展示角色授权弹框
                roleListLoading: false,
                roleTreeData: [], //请求回来的授权菜单列表
                defaultProps: {
                    //角色tree要展示的内容
                    id: "id", //必传，不然节点打不开
                    label: "text",
                    children: "children"
                },
                defaultCheckedKeys: [], //授权菜单中默认选中的tree的ID
                roleSaveBtnDisabled: true, //提交按钮禁用
                currentRoleName: "", //点击授权,和编辑按钮当前行的角色名
                currentRoleId: "", //当前角色ID
                roleCheckedNodes: [], //所有选中的项的数组
                //删除
                selections: [] //删除选中项
            };
        },
        mounted() {
            this.findRolePage(); //角色列表
        },
        methods: {
            // 获取角色列表数据
            findRolePage: function () {
                this.loading = true;
                let params = {
                    //查询多少页，从0开始, offset=页数乘以条数
                    start: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum - 1) * this.pageRequest.pageSize,
                    length: this.pageRequest.pageSize, //查询多少条
                    ROLE_NAME: this.filters.roleName
                };
                console.log("获取角色数据入参", params);
                getRoleManages(params)
                    .then((data) => {
                        console.log("获取角色数据", data);
                        this.pageRoletList = data.data;
                        this.totalSize = data.totalCount;
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取角色数据err", err);
                        this.loading = false;
                    });
            },
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.findRolePage(); //调角色列表接口
            },
            // 获取授权角色的菜单列表数据
            findMenuManage: function () {
                this.loading = true;
                let params = "";
                //调用角色tree接口
                getRolesTree(params)
                    .then((data) => {
                        console.log("获取角色分页数据", data);
                        this.roleTreeData = data;
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取角色分页数据err", err);
                        this.loading = false;
                    });
            },
            // 点击编辑弹框
            handleEdit: function (row, index) {
                console.log("编辑", row);
                this.currentRoleName = row.ROLE_NAME; //点击授权,和编辑按钮当前行的角色名
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
                                    ROLE_NAME: this.addForm.ROLE_NAME
                                };
                                console.log("新增保存入参", addFormData);
                                getRoleAddSave(addFormData)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.code == "00000") {
                                            this.saveLoading = false;
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.addFormVisible = false;
                                            this.findRolePage();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.msg, type: "error" });
                                            this.addFormVisible = false;
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
                                    ID: this.editForm.ID,
                                    ROLE_NAME: this.editForm.ROLE_NAME,
                                    UPD_ID: this.editForm.UPD_ID
                                };
                                console.log("编辑保存入参", editFormData);
                                //请求编辑接口
                                getRoleEditSave(editFormData)
                                    .then((res) => {
                                        this.saveLoading = false;
                                        this.$message({ message: "操作成功", type: "success" });
                                        this.editFormVisible = false;
                                        this.findRolePage();
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

            // 点击表格授权按钮
            async handleRoleAction(rowData) {
                console.log("授权", rowData);
                this.currentRoleName = rowData.ROLE_NAME; //点击授权,和编辑按钮当前行的角色名
                this.currentRoleId = rowData.ID; //当前角色ID
                this.roleListVisible = true;
                this.roleListLoading = true;
                this.roleTreeData = [];
                this.defaultCheckedKeys = [];
                let params = {
                    ROLE_ID: this.currentRoleId //当前角色ID
                };
                getRolesTree(params)
                    .then((data) => {
                        console.log("角色tree接口", data);
                        this.roleListLoading = false;
                        this.roleTreeData = data;
                        //调用递归遍历方法，来找出roleTreeData中默认选中的tree,然后追加到defaultCheckedKeys这个默认数组中
                        // this.treeForeach(this.roleTreeData, node => {
                        // 	if(node.checked === true){
                        // 		this.defaultCheckedKeys.push(node.id)
                        // 	}
                        // })
                        this.getDefaultCheckedKeys(this.roleTreeData);
                        console.log("默认选中的节点id", this.defaultCheckedKeys);
                        // this.$nextTick(this.checkChange());
                    })
                    .catch((err) => {
                        console.log("角色tree接口err", err);
                    });
            },

            //用深度优先遍历的递归方法：先序遍历（从外层逐渐往里层遍历）
            treeForeach(tree, func) {
                tree.forEach((data) => {
                    func(data);
                    data.children && this.treeForeach(data.children, func); // 遍历子树
                });
            },

            // 找出roleTreeData中默认选中的tree,并返回defaultCheckedKeys数组
            getDefaultCheckedKeys(arr) {
                arr.forEach((item) => {
                    if (item.checked == true) {
                        this.defaultCheckedKeys.push(item.id);
                    }
                    if (item.children && item.children.length > 0) {
                        this.getDefaultCheckedKeys(item.children);
                    }
                });
            },

            // 监听节点checkd change事件,获取最新选中的keys 与 defaultCheckedKeys 对比是否有变化，决定保存按钮是否可点击
            checkChange() {
                //改功能目前没实现，currCheckedKeys是所有子元素id,defaultCheckedKeys只有父元素，所以无法对比
                let currCheckedKeys = this.$refs.elTree.getCheckedKeys();
                // console.log('checkChangeKey---->', currCheckedKeys)
                if (currCheckedKeys.join("") === this.defaultCheckedKeys.join("")) {
                    this.roleSaveBtnDisabled = true; //提交按钮禁用
                } else {
                    this.roleSaveBtnDisabled = false; //取消提交按钮禁用
                }
            },

            //选中的所有的项的数组，传给后台
            submitFormRoleSaveBtn() {
                console.log("授权提交");
                this.$confirm("确认提交选中记录吗？", "提示", {})
                    .then(() => {
                        this.saveLoading = true;
                        this.roleCheckedNodes = this.$refs.elTree.getCheckedNodes();
                        console.log("checkChangeNode---->", this.roleCheckedNodes);
                        let GRANT_FLAG = [];
                        this.roleCheckedNodes.map((item) => {
                            GRANT_FLAG.push({ ROLE_ID: this.currentRoleId, MENU_ID: item.id });
                        });
                        let params = {
                            GRANT_FLAG: GRANT_FLAG
                        };
                        console.log("提交时选中的入参", params);
                        //调授权保存的接口
                        getRoleGrantSave(params)
                            .then((res) => {
                                console.log("授权保存", res);
                                this.saveLoading = false;
                                this.$message({ message: "角色授权成功", type: "success" });
                                this.roleListVisible = false;
                                this.findRolePage();
                            })
                            .catch((err) => {
                                console.log("授权保存err", err);
                            });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消提交" });
                    });
            },

            //--------------------------------下面这部分是前端做了筛选后，再给后端传参start------------------------------------------------
            // 点击保存修改role
            async handleClickRoleSaveBtn() {
                let _currCheckedKeys = this.$refs.elTree.getCheckedKeys();
                let addRoleCodes = this.getAddRoleCodes(_currCheckedKeys, this.defaultCheckedKeys);
                let deleteRoleCodes = this.getDeleteRoleCodes(_currCheckedKeys, this.defaultCheckedKeys);
                // 注1：此处的接口提交是 addRoleCodes 为新选中的节点，不可以包含默认选中的节点,例如：原 [1,2,3] addRoleCodes 为[4]
                // 注2：此处的接口提交是 deleteRoleCodes 为默认选中的节点移除掉的节点, 例如：原 [1,2,3], deleteRoleCodes 为 [2]
                let data = getRoleGrantSave({
                    username: this._cacheUsername,
                    addRoleCodes: addRoleCodes.join(","),
                    deleteRoleCodes: deleteRoleCodes.join(",")
                });
                if (data.code == "00") {
                    this.$message.success("角色配置成功");
                    this.roleListVisible = false;
                } else {
                    this.$message.error(data.msg);
                }
            },

            // 找出新增的keys
            getAddRoleCodes(_currCheckedKeys, defaultCheckedKeys) {
                let _tmp = [];
                for (let index = 0; index < _currCheckedKeys.length; index++) {
                    const curKey = _currCheckedKeys[index];
                    // 如果defaultCheckedKeys 数组中有 curKey 的话返回true
                    if (!defaultCheckedKeys.some((x) => x === curKey)) {
                        _tmp.push(curKey);
                    }
                }
                return _tmp;
            },

            // 找出移除的keys
            getDeleteRoleCodes(_currCheckedKeys, defaultCheckedKeys) {
                let _tmp = [];
                for (let index = 0; index < defaultCheckedKeys.length; index++) {
                    const curKey = defaultCheckedKeys[index];
                    // 如果defaultCheckedKeys 数组中有 curKey 的话返回true
                    if (!_currCheckedKeys.some((x) => x === curKey)) {
                        _tmp.push(curKey);
                    }
                }
                return _tmp;
            },

            //--------------------------------------上面这部分是前端做了筛选后，再给后端传参end-------------------------------------

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
                            ID: row.ID
                        };
                        console.log("单个删除入参", params);
                        getRoleDelete(params).then((data) => {
                            this.$message({ message: "删除成功", type: "success" });
                            this.findRolePage(); //刷新当前页
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
                            ids.push(item.ID);
                        });
                        let params = {
                            IDS: ids.toString()
                        };
                        console.log("删除params", params);
                        getRoleDeletes(params).then((data) => {
                            this.$message({ message: "删除成功", type: "success" });
                            this.findRolePage(); //刷新当前页
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            }
        }
    };
</script>

<style scoped>
    .rightsManage {
        padding: 20px;
    }
</style>
