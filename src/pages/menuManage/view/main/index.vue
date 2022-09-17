<template>
    <!-- 菜单管理 -->
    <section class="menuManage">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--工具栏-->
            <div slot="search">
                <el-form :inline="true" :model="filters" :size="size">
                    <!-- <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="findTreeData(null)">查询</el-button>
        </el-form-item> -->
                </el-form>
            </div>
            <div slot="action">
                <el-button style="float: left" :size="size" type="primary" icon="el-icon-plus" @click="handleAdd()">新增</el-button>
            </div>
            <!--表格树内容栏-->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="tableTreeDdata"
                stripe
                border
                style="width: 100%"
                v-loading="loading"
                element-loading-text="拼命加载中..."
                row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column label="名称" prop="text" header-align="center" align="center" width="150"></el-table-column>
                <el-table-column label="ID" prop="id" header-align="center" align="center" width="80"></el-table-column>
                <!-- 组件 -->
                <!-- <table-tree-column 
        prop="text" header-align="center" treeKey="id" width="150" label="名称">
      </table-tree-column> -->
                <el-table-column label="图标" prop="attributes.icon" header-align="center" align="center">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon || ''"></i>
                    </template>
                </el-table-column>
                <el-table-column label="类型" prop="isLeaf" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isLeaf === 'N'" size="small">目录</el-tag>
                        <el-tag v-else-if="scope.row.isLeaf === 'Y'" size="small" type="success">菜单</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否子叶" prop="isLeaf" header-align="center" align="center"></el-table-column>
                <el-table-column label="上级菜单" prop="parentName" header-align="center" align="center"></el-table-column>
                <el-table-column label="菜单URL" prop="attributes.url" header-align="center" align="center" width="200" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="orderCol" header-align="center" align="center" label="排序"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="190">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
        <!-- 新增修改界面 -->
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" label-width="80px" :size="size" style="text-align: left">
                <el-form-item label="菜单类型" prop="type">
                    <el-radio-group v-model="dataForm.type">
                        <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="text">
                    <el-input v-model="dataForm.text" :placeholder="menuTypeList[dataForm.type] + '名称'"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentName">
                    <!-- 上级菜单组件 -->
                    <popup-tree-input
                        :data="popupTreeData"
                        :props="popupTreeProps"
                        :prop="dataForm.parentName == null || dataForm.parentName == '' ? '顶级菜单' : dataForm.parentName"
                        :nodeKey="'' + dataForm.parentId"
                        :currentChangeHandle="handleTreeSelectChange">
                    </popup-tree-input>
                </el-form-item>
                <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="attributes.url">
                    <el-row>
                        <el-col :span="22">
                            <el-input v-model="dataForm.attributes.url" placeholder="菜单路由"></el-input>
                        </el-col>
                        <el-col :span="2" class="icon-list__tips">
                            <el-tooltip placement="top" effect="light" style="padding: 10px">
                                <div slot="content">
                                    <p>URL格式：</p>
                                    <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                                    <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                                    <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p>
                                </div>
                                <i class="el-icon-warning"></i>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="排序编号" prop="orderCol">
                    <el-input-number v-model="dataForm.orderCol" controls-position="right" :min="0" label="排序编号"></el-input-number>
                </el-form-item>
                <el-form-item label="菜单图标" prop="attributes.icon">
                    <el-row>
                        <el-col :span="22">
                            <el-input
                                v-model="dataForm.attributes.icon"
                                v-popover:iconListPopover
                                :readonly="false"
                                placeholder="菜单图标名称（如：el-icon-iconName）"
                                class="icon-list__input"></el-input>
                        </el-col>
                        <el-col :span="2" class="icon-list__tips">
                            <fa-icon-tooltip />
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :size="size" @click="dialogVisible = false">取消</el-button>
                <el-button :size="size" type="primary" v-if="!dataForm.id" @click="submitFormAdd()">确定</el-button>
                <el-button :size="size" type="primary" v-else @click="submitFormEdit()">确定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import { getMenuManages, getAddSave, getEditSave } from "../../apis/index";
    import PopupTreeInput from "./modules/PopupTreeInput"; //新增弹框中上级菜单的组件
    import TableTreeColumn from "./modules/TableTreeColumn";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        components: {
            PopupTreeInput,
            TableTreeColumn,
            CommonTable
        },
        data() {
            return {
                formInline: {
                    user: "",
                    region: ""
                },
                size: "small",
                loading: false,
                filters: {
                    name: ""
                },
                pageRequest: {
                    //内容分页
                    pageNum: "1",
                    pageSize: "10",
                    totalPage: "0"
                },
                tableTreeDdata: [], //全部数据list
                dialogVisible: false, //是否展示新增/修改的弹窗
                options: [
                    {
                        value: "0",
                        label: "N"
                    },
                    {
                        value: "1",
                        label: "Y"
                    }
                ],
                value: "",
                menuTypeList: ["目录", "菜单"], //类型
                dataForm: {
                    //当前选中的列表数据，也是新增初始化和编辑回显的数据
                    id: 0,
                    type: 1, //0目录，1菜单 isLeaf：N目录，
                    text: "",
                    parentId: 0,
                    parentName: "",
                    url: "",
                    orderCol: 0,
                    icon: "",
                    attributes: {
                        url: "",
                        icon: ""
                    }
                },
                dataRule: {
                    text: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }]
                },
                popupTreeData: [], //新增/修改弹框里上机菜单的list
                popupTreeProps: {
                    label: "text",
                    children: "children"
                }
            };
        },
        mounted() {
            this.findTreeData(); //一进页面调接口
        },
        //方法集合
        methods: {
            // 获取列表数据
            findTreeData: function () {
                this.loading = true;
                let params = "";
                getMenuManages(params)
                    .then((data) => {
                        console.log("菜单管理接口", data);
                        this.tableTreeDdata = data;
                        this.totalSize = data.length; //总条数
                        this.popupTreeData = this.getParentMenuTree(this.tableTreeDdata);
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("菜单管理接口err", err);
                    });
            },

            // 获取上级菜单树
            getParentMenuTree: function (tableTreeDdata) {
                let parent = {
                    //默认值
                    parentId: 0,
                    text: "顶级菜单",
                    children: tableTreeDdata
                };
                return [parent];
            },
            // 菜单树选中
            handleTreeSelectChange(data, node) {
                this.dataForm.parentId = data.id;
                this.dataForm.parentName = data.text; //tree结构中，选中当前点击的节点渲染到input中
            },

            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    id: 0,
                    type: 1,
                    typeList: ["目录", "菜单"],
                    text: "",
                    attributes: {
                        url: "",
                        icon: ""
                    },
                    orderCol: 0,
                    parentId: 0,
                    parentName: ""
                };
            },

            // 显示编辑界面弹框
            handleEdit: function (row) {
                console.log("编辑", row);
                this.dialogVisible = true;
                Object.assign(this.dataForm, row);
            },

            // 新增表单提交保存
            submitFormAdd() {
                this.$refs["dataForm"].validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(() => {
                            this.editLoading = true;
                            //入参key值为大写：
                            let paramsDataAdd = {
                                MENU_NAME: this.dataForm.text,
                                MENU_URL: this.dataForm.attributes.url,
                                IS_LEAF: this.dataForm.type == 1 ? "Y" : "N",
                                ORDER_COL: this.dataForm.orderCol,
                                IMG_URL: this.dataForm.attributes.icon,
                                UP_ID: this.dataForm.parentId, //上级id
                                parentName: this.dataForm.parentName
                            };
                            let params = Object.assign({}, paramsDataAdd);
                            console.log("新增保存按钮的值", paramsDataAdd);
                            //新增弹框保存按钮调接口
                            getAddSave(params)
                                .then((data) => {
                                    this.editLoading = false;
                                    this.$message({
                                        message: "新建成功",
                                        type: "success"
                                    });
                                    // this.$refs["dataForm"].dataetFields();
                                    this.dialogVisible = false;
                                    this.findTreeData(); //新建成功后刷新接口
                                })
                                .catch((err) => {
                                    console.log("新增接口err", err);
                                });
                        });
                    }
                });
            },

            // 编辑表单提交保存
            submitFormEdit() {
                this.$refs["dataForm"].validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(() => {
                            this.editLoading = true;
                            //入参key值为大写：
                            let paramsDataEdit = {
                                ID: this.dataForm.id,
                                MENU_NAME: this.dataForm.text,
                                MENU_URL: this.dataForm.attributes.url,
                                IS_LEAF: this.dataForm.type == 1 ? "Y" : "N",
                                ORDER_COL: this.dataForm.orderCol,
                                IMG_URL: this.dataForm.attributes.icon,
                                UP_ID: this.dataForm.parentId, //上级id
                                parentName: this.dataForm.parentName
                            };
                            let params = Object.assign({}, paramsDataEdit);
                            console.log("编辑保存按钮的值", params);
                            //新增弹框保存按钮调接口
                            getEditSave(params)
                                .then((data) => {
                                    this.editLoading = false;
                                    this.$message({
                                        message: "修改成功",
                                        type: "success"
                                    });
                                    // this.$refs["dataForm"].dataetFields();
                                    this.dialogVisible = false;
                                    this.findTreeData(); //修改成功后刷新接口
                                })
                                .catch((err) => {
                                    console.log("编辑接口err", err);
                                });
                        });
                    }
                });
            },

            // 删除
            handleDelete: function (row) {
                console.log("删除");
                this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    let params = this.getDeleteIds([], row);
                    //目前暂无删除接口
                    // this.$api.menu.batchDelete(params).then(data => {
                    //   this.findTreeData();
                    //   this.$message({ message: "删除成功", type: "success" });
                    // });
                });
            },

            // 获取删除的包含子菜单的id列表
            getDeleteIds(ids, row) {
                ids.push({ id: row.id });
                if (row.children != null) {
                    for (let i = 0, len = row.children.length; i < len; i++) {
                        this.getDeleteIds(ids, row.children[i]);
                    }
                }
                return ids;
            }
        }
    };
</script>
<style lang="less" scoped>
    .menuManage {
        padding: 20px;
    }
</style>
