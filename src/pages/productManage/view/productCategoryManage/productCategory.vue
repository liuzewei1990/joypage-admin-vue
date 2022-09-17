<template>
    <!-- 产品管理-产品类别管理 -->
    <div class="productCategory">
        <el-button class="editBtn" icon="el-icon-edit" size="mini" type="primary" @click="editFormVisible = true">修改</el-button>
        <el-button class="editBtn" icon="el-icon-edit" size="mini" type="primary" @click="prdTypeTap">设置产品大类</el-button>
        <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开-->
        <el-table
            size="mini"
            :data="prdTypeList"
            style="width: 100%"
            stripe
            border="true"
            @selection-change="selectionChange"
            v-loading="loading"
            element-loading-text="loading..."
            default-expand-all
            row-key="id"
            :tree-props="{ children: 'subTypeList', hasChildren: 'hasChildren' }">
            <el-table-column type="index" label="序号" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column prop="typeName" label="产品类型" header-align="center" align="center"></el-table-column>
            <el-table-column prop="rateName" label="利率名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="updateName" label="操作人" header-align="center" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="操作时间" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.init != 0" size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 编辑弹框 -->
        <el-dialog title="修改" width="50%" :visible.sync="editFormVisible" :before-close="closeDialog">
            <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm" :size="size" label-position="right">
                <el-form-item label="产品大类" prop="parentId">
                    <el-select v-model="editForm.parentId" placeholder="请选择" clearable @change="getPrdTypeSelect">
                        <el-option v-for="item in prdTypeParentList" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品类型" prop="id">
                    <el-select v-model="editForm.id" placeholder="请选择" clearable @change="getPrdSubTypeSelect">
                        <el-option v-for="item in prdTypeSonList" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="利率名称" prop="rateName">
                    <el-input v-model="editForm.rateName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="editFormVisible = false">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitFormEditSave('editForm')" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>

        <!-- 2021-11-02新增需求 -->
        <el-dialog title="设置产品大类" width="60%" :visible.sync="prdTypeVisible" :before-close="closeDialog" center destroy-on-close>
            <el-button class="editBtn" size="mini" :type="controlAddButton ? 'primary' : 'info'" @click="addTap">新增</el-button>
            <el-form ref="addForm" :model="formData.editPrdTypeNameTable" :rules="formRules">
                <el-table :data="formData.editPrdTypeNameTable" border="true" size="mini">
                    <el-table-column prop="typeName" label="产品大类名称" align="center">
                        <template slot-scope="scope">
                            <el-form-item :prop="`${scope.$index}.typeName`" :rules="formRules.typeName">
                                <!-- <BcSelect v-model="scope.row.typeName" :disabled="scope.row.isEdit"></BcSelect> -->
                                <el-select v-model="scope.row.typeName" :disabled="scope.row.isEdit" placeholder="请选择" clearable @change="getPrdTypeSelect">
                                    <el-option v-for="item in prdTypeParentList" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column prop="typeNameAlias" label="别名" align="center">
                        <template slot-scope="scope">
                            <el-form-item prop="typeNameAlias">
                                <!-- <el-form-item :prop="`${scope.$index}.typeNameAlias`"  :rules="formRules.typeNameAlias"> -->
                                <input type="text" :disabled="scope.row.isEdit" v-model="scope.row.typeNameAlias" />
                                <!-- <input type="text" v-model="scope.row.typeNameAlias"> -->
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.isNew">
                                <el-button size="mini" type="text" @click="submit('addForm', scope.row)">新增保存</el-button>
                            </div>
                            <div v-else>
                                <div v-if="scope.row.isEdit">
                                    <el-button size="mini" v-if="scope.row.status == 1" type="text" @click="handleEditSave(scope.row)">启用</el-button>
                                    <el-button size="mini" v-else type="text" @click="handleEditSave(scope.row)">未启用</el-button>
                                    <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改别名</el-button>
                                </div>
                                <el-button v-else size="mini" type="text" @click="handleEditSave(scope.row)">修改别名保存</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="prdTypeVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    // 接口函数依次：产品类别管理列表，初始化产品主类型数据，编辑保存
    import { forPrdTypeList, forPrdCategoryPage, getPrdTypeByParentId, updatePrdType, updateStatusApi, deleteStatusApi, deleteApi } from "../../apis/index";
    import BcSelect from "@common/finsuit-components/BcSelect/index";
    export default {
        name: "productCategoryManage",
        components: {
            BcSelect
        },
        data() {
            return {
                size: "small",
                loading: false, //请求产品类别时loading
                prdTypeList: [
                    // {
                    // 	id: '1',
                    // 	typeName:'存款产品',
                    // 	rateName:'', //产品利率名称
                    // 	parentId:'', //产品父级类型ID
                    // 	parentName:'', //产品父级类型名称
                    // 	updateName: "系统管理员", //操作人姓名
                    // 	updateTime: "2017-03-09 17:09:38",
                    // 	subTypeList:[
                    // 		{
                    // 			id: '4',
                    // 			typeName:'活期存款',
                    // 			rateName:'活期', //产品利率名称
                    // 			parentId:'1', //产品父级类型ID
                    // 			parentName:'存款产品', //产品父级类型名称
                    // 			updateName: "系统管理员1", //操作人姓名
                    // 			updateTime: "2017-03-09 17:09:38",
                    // 		},
                    // 		{
                    // 			id: '5',
                    // 			typeName:'智能存款',
                    // 			rateName:'智能', //产品利率名称
                    // 			parentId:'1', //产品父级类型ID
                    // 			parentName:'存款产品', //产品父级类型名称
                    // 			updateName: "系统管理员2", //操作人姓名
                    // 			updateTime: "2017-03-09 17:09:38",
                    // 		},
                    // 	],
                    // },
                    // {
                    // 	id: '2',
                    // 	typeName:'理财产品',
                    // 	rateName:'', //产品利率名称
                    // 	parentId:'', //产品父级类型ID
                    // 	parentName:'', //产品父级类型名称
                    // 	updateName: "系统管理员", //操作人姓名
                    // 	updateTime: "2017-03-09 17:09:38",
                    // 	subTypeList:[
                    // 		{
                    // 			id: '9',
                    // 			typeName:'保险理财',
                    // 			rateName:'111', //产品利率名称
                    // 			parentId:'1', //产品父级类型ID
                    // 			parentName:'存款产品', //产品父级类型名称
                    // 			updateName: "系统管理员1", //操作人姓名
                    // 			updateTime: "2017-03-09 17:09:38",
                    // 		},
                    // 		{
                    // 			id: '10',
                    // 			typeName:'理财产品',
                    // 			rateName:'222', //产品利率名称
                    // 			parentId:'1', //产品父级类型ID
                    // 			parentName:'存款产品', //产品父级类型名称
                    // 			updateName: "系统管理员2", //操作人姓名
                    // 			updateTime: "2017-03-09 17:09:38",
                    // 		},
                    // 	],
                    // }
                ], //请求回来的产品类别列表数据list
                // 编辑
                editFormVisible: false, //是否展示编辑弹框
                editForm: {
                    //修改弹框数据
                    id: "",
                    typeName: "", //产品类型
                    rateName: "", //产品利率名称
                    parentId: "", //产品父级类型ID
                    parentName: "", //产品父级类型名称
                    level: "",
                    typeNameAlias: "" //别名  设置产品大类时用
                },
                saveLoading: false, //保存时按钮loading
                formRules: {
                    //新增弹框校验规则
                    parentId: [{ required: true, message: "请选择产品大类", trigger: "change" }],
                    id: [{ required: true, message: "请选择产品类型", trigger: "change" }],
                    rateName: [
                        { required: true, message: "请输入利率名称", trigger: "blur" },
                        { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
                    ],
                    typeName: [{ required: true, message: "请选择", trigger: "blur" }]
                    // typeNameAlias:[
                    //     { required: true, message: '请输入', trigger: 'blur' },
                    // 	{ min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
                    // ]
                },
                prdTypeParentList: [
                    // {
                    // 	id: '1',
                    // 	typeName: '理财产品'
                    // },
                    // {
                    // 	id: '2',
                    // 	typeName: '基金产品'
                    // },
                    // {
                    // 	id: '4',
                    // 	typeName: '存款产品'
                    // },
                ], //父类产品大类
                prdTypeSonList: [
                    // {
                    // 	id: '1',
                    // 	typeCode: '1001',
                    // 	typeName: '活期存款'
                    // },
                    // {
                    // 	id: '2',
                    // 	typeCode: '1002',
                    // 	typeName: '智能存款'
                    // },
                ], //子类产品类型

                prdTypeVisible: false, //设置产品大类弹窗
                controlAddButton: true, //是否能新增一行
                formData: {
                    editPrdTypeNameTable: [
                        // {
                        //  typeName:"aa",//产品大类名称
                        //  typeNameAlias:"sss",//别名
                        // }
                    ] //设置产品大类table
                }
            };
        },
        mounted() {
            this.getPrdCategoryPage(); //初始化产品大类数据
            this.getPrdTypeList(); //存款产品类别管理列表
            this.initForm(); //初始化table数据

            console.log("初始化table数据", this.formData.editPrdTypeNameTable);
        },
        methods: {
            //初始化table
            initForm: function () {
                this.formData.editPrdTypeNameTable.push(this.newFormData());
            },
            // table 每一行数据
            newFormData: function () {
                return {
                    typeName: "", //产品大类名称
                    typeNameAlias: "", //别名
                    isNew: true //是否是新增
                };
            },
            // 新增加一行
            addTap: function () {
                if (this.controlAddButton) {
                    this.initForm();
                    this.controlAddButton = false;
                }
            },
            handleEdit: function (row) {
                console.log(row);
                row.isEdit = false;
            },
            //修改别名 启用未启用切换
            handleEditSave: function (row) {
                //    console.log("修改",row)
                let params = {
                    id: row.id, //类型id
                    status: row.status == 2 ? 1 : 2, //初始化状态2,启动1,禁用2
                    typeNameAlias: row.typeNameAlias //别名
                };
                //   console.log(params)
                updateStatusApi(params).then((res) => {
                    //    console.log(res)
                    if (res.code == 0) {
                        this.forPrdTypeApi();
                        this.getPrdTypeList();
                    }
                });
            },

            // 设置产品大类
            prdTypeTap: function () {
                this.prdTypeVisible = true;
                this.controlAddButton = true;

                this.forPrdTypeApi();
            },

            //设置产品大类请求数据接口
            forPrdTypeApi: function () {
                //产品大类列表与table 用同一接口数据
                forPrdTypeList()
                    .then((res) => {
                        // console.log("获取产品类别列表",res)
                        res.data.forEach((item) => {
                            item.isNew = false; //是否是新增
                            item.isEdit = true; //是否可以编辑
                        });
                        this.formData.editPrdTypeNameTable = res.data;
                    })
                    .catch((err) => {
                        console.log("获取产品类别列表err", err);
                    });
            },

            //产品大类保存
            submit: function (formName, row) {
                // console.log(row)

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log("submit!");
                        let params = {
                            id: "",
                            typeName: this.editForm.parentName, //产品类型 (后端要求传name)
                            rateName: "", //产品利率名称
                            parentId: "", //产品父级类型ID
                            parentName: "", //产品父级类型名称
                            level: 1,
                            typeNameAlias: row.typeNameAlias //别名
                        };
                        // console.log(params)
                        //请求编辑接口
                        updatePrdType(params)
                            .then((res) => {
                                console.log("修改保存请求成功", res);
                                if (res.code == 0) {
                                    this.$message({ message: "操作成功", type: "success" });
                                    // this.prdTypeVisible = false
                                    this.controlAddButton = true;
                                    this.forPrdTypeApi();
                                }
                            })
                            .catch((err) => {
                                console.log("修改接口err", err);
                            });
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },

            //table列表删除
            handleDelete: function (index, row) {
                // console.log("删除",row)
                //请求删除状态
                deleteStatusApi({ id: row.id }).then((res) => {
                    console.log("删除状态查询", res);
                    //res.data == 0时可以删除
                    if (res.data == 0) {
                        this.$confirm("确认删除吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                //请求删除
                                deleteApi({ id: row.id })
                                    .then((res) => {
                                        console.log("删除返回", res);
                                        this.saveLoading = false;
                                        if (res.code == 0) {
                                            this.$message({ message: "删除成功", type: "success" });
                                            this.getPrdTypeList();
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("取消接口err", err);
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "取消删除" });
                            });
                    } else {
                        this.$message({ type: "info", message: "当前存在此类型产品，无法删除此类型" });
                    }
                });
            },

            // 获取产品类别列表数据
            getPrdTypeList: function () {
                this.loading = true;
                let params = "";
                forPrdTypeList(params)
                    .then((res) => {
                        console.log("获取产品类别列表", res);
                        this.prdTypeList = res.data;
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取产品类别列表err", err);
                        this.loading = false;
                    });
            },
            //初始化产品大类数据
            getPrdCategoryPage() {
                let params = "";
                forPrdCategoryPage(params)
                    .then((res) => {
                        console.log("获取产品大类", res);
                        this.prdTypeParentList = res.data.parentTypeList;
                    })
                    .catch((err) => {
                        console.log("获取产品大类err", err);
                    });
            },
            //父类选中值发生变化时触发----请求产品子类型数据
            getPrdTypeSelect(val) {
                console.log("父类id", val);
                //每次重新选择父类，请求子类时，子类的id先置空
                this.editForm.id = "";
                //获取当前select的lable值parentName
                let obj = {};
                obj = this.prdTypeParentList.find(function (item) {
                    return item.id === val;
                });
                this.editForm.parentName = obj.typeName;

                //根据产品大类id请求子类
                let params = {
                    parentId: val
                };
                console.log("产品子类-->入参", params);
                getPrdTypeByParentId(params)
                    .then((res) => {
                        console.log("获取产品子类", res);
                        this.prdTypeSonList = res.data;
                    })
                    .catch((err) => {
                        console.log("产品主类型err", err);
                    });
            },
            //子类选中值发生变化时触发
            getPrdSubTypeSelect(val) {
                console.log("子类id", val);
                //传进来的val是select组件选中的value值，也就是一个typeCode
                let obj = {};
                obj = this.prdTypeSonList.find(function (item) {
                    return item.id === val;
                });
                this.editForm.typeName = obj.typeName;
                //obj 就是被选中的那个对象，也就能拿到label值了即：obj.typeName为；lable的值；val为value的值。
            },
            //修改保存提交
            submitFormEditSave: function (editForm) {
                console.log("baocun", this.editForm);
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                console.log("修改保存入参", this.editForm);
                                //请求编辑接口
                                updatePrdType(this.editForm)
                                    .then((res) => {
                                        console.log("修改保存请求成功", res);
                                        this.saveLoading = false;
                                        this.$message({ message: "操作成功", type: "success" });
                                        this.editFormVisible = false;
                                        this.getPrdTypeList();
                                        this.$refs.editForm.resetFields(); //清空数据
                                    })
                                    .catch((err) => {
                                        console.log("修改接口err", err);
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消编辑" });
                            });
                    }
                });
            },
            //点击弹框阴影部分校验
            closeDialog(done) {
                this.$confirm("确认关闭？")
                    .then((_) => {
                        done();
                        this.$refs.editForm.resetFields(); //清空数据
                        location.reload(); //刷新页面
                    })
                    .catch((_) => {});
            }
        }
    };
</script>

<style lang="less" scoped>
    .productCategory {
        padding: 20px;
        .editBtn {
            margin-bottom: 20px;
        }
        .el-table thead {
            color: #909399;
            font-weight: 500;
            font-size: 14px;
        }
        .el-table--mini td,
        .el-table--mini th {
            padding: 10px 0;
        }
        // .el-table--mini {
        // 	font-size: 12px;
        // }

        .el-select.el-select--small {
            width: 100%;
        }
    }
    .submitBtn {
        // margin: 0 auto;
    }
</style>
