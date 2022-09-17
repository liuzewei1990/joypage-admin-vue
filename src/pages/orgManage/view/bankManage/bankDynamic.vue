<template>
    <!-- 银行动态管理 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="银行名称：" prop="orgName">
                        <el-select v-model="topCheckData.orgName" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in orglist" :key="item.commercialId" :label="item.orgName" :value="item.orgName"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题：" prop="dynamicTitle">
                        <el-input v-model="topCheckData.dynamicTitle" placeholder="请输入产品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="动态状态" prop="dynamicStatus">
                        <el-select v-model="topCheckData.dynamicStatus" placeholder="请选择" clearable>
                            <el-option v-for="item in dynamicStatusList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" style="float: left" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm('topData')">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="getbankDynamicList('chaxun')">查询</el-button>
            </div>

            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="bankDynamicList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column type="index" label="序号" width="60" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="银行名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="dynamicStatus" label="动态状态" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.dynamicStatus == 1" :size="size">已发布</p>
                        <p v-if="scope.row.dynamicStatus == 2" :size="size">待发布</p>
                        <p v-if="scope.row.dynamicStatus == 3" :size="size">已取消</p>
                    </template>
                </el-table-column>
                <el-table-column prop="dynamicTitle" label="标题" header-align="center" align="center"></el-table-column>
                <el-table-column prop="dynamicSubtitle" label="副标题" header-align="center" align="center"></el-table-column>
                <el-table-column prop="startDate" label="发布时间" header-align="center" align="center"></el-table-column>
                <el-table-column prop="endDate" label="结束时间" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div class="toolbar" slot="footer">
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
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="70%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <el-form-item label="银行名称：" prop="orgId">
                    <!-- filterable开启可搜索模式  -->
                    <el-select v-model="dataForm.orgId" placeholder="请选择" filterable clearable @change="orglistSelect">
                        <el-option v-for="item in orglist" :key="item.ID" :label="item.orgName" :value="item.commercialId"> </el-option>
                    </el-select>
                    <!-- <span class="tipText">选择产品区域后，再选择机构名称</span> -->
                </el-form-item>
                <el-form-item label="图片：" prop="dynamicPictureUrl">
                    <el-upload
                        :model="imageUrl + dataForm.dynamicPictureUrl"
                        class="upload-demo"
                        ref="upload1"
                        accept=".png"
                        action="#"
                        :limit="limitNum"
                        :on-exceed="exceedFile"
                        :http-request="uploadDynamicPictureImg"
                        :show-file-list="false">
                        <img v-if="dataForm.dynamicPictureUrl" :src="imageUrl + dataForm.dynamicPictureUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <span class="el-upload__tip" slot="tip">仅支持一张</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="标题：" prop="dynamicTitle">
                    <el-input v-model="dataForm.dynamicTitle" placeholder="请输入标题30个汉字以内(包含30个)"></el-input>
                </el-form-item>
                <el-form-item label="副标题：" prop="dynamicSubtitle">
                    <el-input v-model="dataForm.dynamicSubtitle" placeholder="请输入副标题"></el-input>
                </el-form-item>
                <el-form-item label="URL：" prop="dynamicType">
                    <template>
                        <el-radio-group v-model="dataForm.dynamicType">
                            <el-radio label="1">跳转url</el-radio>
                            <el-radio label="2">自定义</el-radio>
                        </el-radio-group>
                        <el-form-item class="url" label="跳转url：" prop="dynamicUrl" v-if="dataForm.dynamicType == 1 ? true : false" style="margin-left: 0">
                            <el-input v-model="dataForm.dynamicUrl" placeholder="请输入要跳转的url"></el-input>
                        </el-form-item>
                        <el-form-item class="details" label="详情：" prop="dynamicDetails" v-if="dataForm.dynamicType == 2 ? true : false">
                            <!-- 富文本 -->
                            <el-card style="height: 400px" v-loading="quillUpdateImg">
                                <el-upload
                                    :model="imageUrl + dataForm.dynamicDetails"
                                    class="avatar-uploader"
                                    ref="upload2"
                                    accept=".png"
                                    action="#"
                                    limit=""
                                    :http-request="quillEditorUploaderImg"
                                    :before-upload="beforeUpload"
                                    :show-file-list="false">
                                </el-upload>
                                <quill-editor v-model="dataForm.dynamicDetails" ref="myQuillEditor" style="height: 300px" :options="editorOption" @change="onEditorChangeArea($event)"> </quill-editor>
                            </el-card>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="发布时间：" prop="startDate">
                    <el-date-picker v-model="dataForm.startDate" type="date" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 28%"></el-date-picker>
                    <el-date-picker
                        v-model="dataForm.endDate"
                        type="date"
                        placeholder="结束时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 28%; margin-left: 30px"></el-date-picker>
                </el-form-item>
                <el-form-item label="紧急下架：" prop="emergencyOffline">
                    <el-select v-model="dataForm.emergencyOffline" placeholder="请选择">
                        <el-option v-for="item in isFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="cancleFrom('dataForm')">取消</el-button>
                <el-button :size="size" type="primary" v-if="!dataForm.id" @click.native="submitFormAddSave('dataForm')" :loading="saveLoading">保存</el-button>
                <el-button :size="size" type="primary" v-else @click.native="submitFormEditSave('dataForm')" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    // 接口函数依次：查询银行名称，查询列表，新增，修改，删除
    import { queryOrgNameByBankType, queryBankDynamicsList, createBankDynamics, updBankDynamics, delBankDynamics, forUpload } from "../../apis/index";
    import config from "../../config/config.index.js";
    import CommonTable from "@common/finsuit-components/CommonTable";

    import { quillEditor, Quill } from "vue-quill-editor";
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";
    import "../../assets/css/font.css";
    //富文本工具
    const toolbarOptions = [
        ["bold", "underline", "strike"], // 加粗 斜体'italic', 下划线 删除线
        // ['blockquote', 'code-block'], // 引用  代码块
        // [{ 'header': 1 }, { 'header': 2 }], // 1、2 级标题
        // [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 有序、无序列表
        // [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
        // [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
        // [{'direction': 'rtl'}],     // 文本方向
        [{ size: ["10px", false, "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "32px"] }], // 字体大小
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
        // [{ 'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
        // '宋体', '黑体'] }], // 字体种类
        [{ align: [] }], // 对齐方式
        // ['clean'], // 清除文本格式
        ["image"] // 链接、图片、视频 'link', 'image', 'video'
    ];
    // 自定义字体大小
    let Size = Quill.import("attributors/style/size");
    Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"];
    Quill.register(Size, true);

    // 自定义字体类型
    var fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong", "Arial", "Times-New-Roman", "sans-serif", "宋体", "黑体"];
    var Font = Quill.import("formats/font");
    Font.whitelist = fonts;
    Quill.register(Font, true);
    export default {
        name: "depositProduct",
        components: {
            quillEditor,
            CommonTable
        },
        data() {
            return {
                tableHeight: 0,
                imageUrl: "", //图片前面有域名的部分地址
                size: "small",
                topCheckData: {
                    //顶部搜索选择的工具内容
                    orgName: "", //银行名称
                    dynamicTitle: "", //标题
                    dynamicStatus: "" //动态状态 1.已发布，2.待发布，3.已取消
                },
                dialogUploadVisible: false, //是否显示导入的上传文件的弹框
                limitNum: 1, // 上传excell时，同时允许上传的最大数
                fileObj: {}, // 单个要上传的文件
                fileList: [], //要上传的文件列表数组--多个文件
                dynamicStatusList: [
                    {
                        name: "已发布",
                        value: 1
                    },
                    {
                        name: "待发布",
                        value: 2
                    },
                    {
                        name: "已取消",
                        value: 3
                    }
                ], //签约状态
                isFlagListStr: [
                    {
                        name: "是",
                        value: "1"
                    },
                    {
                        name: "否",
                        value: "0"
                    }
                ],
                isFlagList: [
                    {
                        name: "是",
                        value: 1
                    },
                    {
                        name: "否",
                        value: 0
                    }
                ],
                orglist: [], //银行列表
                totalSize: 0, //总条数

                pageRequest: {
                    //请求银行动态列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求银行动态时loading
                bankDynamicList: [], //请求回来的银行动态列表数据list
                saveLoading: false, //保存时按钮loading
                // 新增和编辑
                dialogVisible: false, //是否展示新增编辑弹框
                dataForm: {
                    //新增弹框数据
                    id: "", //
                    orgId: "", //机构id
                    orgName: "", //机构名称
                    dynamicPictureUrl: "", //动态图片地址
                    dynamicTitle: "", //动态标题
                    dynamicSubtitle: "", //动态副标题
                    dynamicUrl: "", //动态url
                    dynamicDetails: "", //动态详情
                    startDate: "", //发布开始时间
                    endDate: "", //发布结束时间
                    dynamicType: "", //动态类型（1站外url2站内3自定义）
                    isWithdraw: "", //是否撤回1撤回0不撤回(默认0)
                    cancelDate: "", //撤回时间(是否撤回为1撤回必填)
                    emergencyOffline: "" //紧急下线：0：否，1：是,默认否
                },
                formRules: {
                    //弹框校验规则
                    dynamicTitle: [
                        { required: true, message: "请输入标题", trigger: "blur" },
                        { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
                    ],
                    dynamicSubtitle: [{ required: true, message: "请输入副标题", trigger: "blur" }],
                    startDate: [
                        { required: true, message: "请选择开始日期", trigger: "change" } //加type：date 会报错，因为初始化的时候是字符串，校验应该是new Date()的格式
                    ],
                    endDate: [{ required: true, message: "请选择结束时间", trigger: "change" }]
                },
                //删除
                selections: [], //删除选中项
                //富文本
                quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
                serverUrl: "", // 这里写你要上传的图片服务器地址
                header: { token: sessionStorage.token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
                editorOption: {
                    placeholder: "请输入内容...",
                    theme: "snow", // or 'bubble'
                    modules: {
                        toolbar: {
                            container: toolbarOptions, //工具栏
                            handlers: {
                                image: function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector(".avatar-uploader input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                },
                                link: function (value) {
                                    // 添加链接
                                    if (value) {
                                        var href = prompt("请输入url");
                                        this.quill.format("link", href);
                                        console.log("href", href);
                                    } else {
                                        this.quill.format("link", false);
                                    }
                                }
                            }
                        }
                    }
                }
            };
        },
        mounted() {
            //图片初始化地址：
            let url = window.location.protocol + "//" + window.location.host + (window.location.host.indexOf("finsuit") != -1 ? "/finsuit" : "/omp");
            this.imageUrl = url + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);
            this.getOrgNameByBankType(); //下拉框银行名称数据
            this.getbankDynamicList(); //银行动态管理列表
        },
        methods: {
            //请求银行名称列表
            getOrgNameByBankType() {
                let params = "";
                queryOrgNameByBankType(params)
                    .then((res) => {
                        console.log("获取银行名称列表", res);
                        if (res.result == true) {
                            this.orglist = res.data; //机构列表
                        } else {
                            this.$message({ message: res.description, type: "error" });
                            console.log("银行名称列表失败");
                        }
                    })
                    .catch((err) => {
                        console.log("银行名称列表err", err);
                        this.loading = false;
                        this.$message({ message: "请求失败", type: "error" });
                    });
            },
            // 获取银行动态列表数据
            getbankDynamicList: function (type) {
                this.loading = true;
                if (type == "chaxun") {
                    console.log("chauxn");
                    this.pageRequest.pageNum = 0; //初始化--第一条开始查
                    this.pageRequest.pageSize = 10; //初始化--查询10条
                }
                let params = {
                    //查询多少页，从0开始, offset=页数乘以条数
                    start: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum - 1) * this.pageRequest.pageSize,
                    length: this.pageRequest.pageSize, //查询多少条
                    orgName: this.topCheckData.orgName, //机构名称id
                    dynamicTitle: this.topCheckData.dynamicTitle, //产品子类型编码-产品类型
                    dynamicStatus: this.topCheckData.dynamicStatus //存款系列id
                };
                console.log("银行动态数据入参", params);
                queryBankDynamicsList(params)
                    .then((res) => {
                        console.log("获取银行动态数据", res);
                        if (res.result == true) {
                            this.bankDynamicList = res.data.data;
                            this.totalSize = res.data.totalCount; //总条数
                            this.loading = false;
                        } else {
                            console.log("银行名称列表失败");
                            this.loading = false;
                            this.$message({ message: res.description, type: "error" });
                        }
                    })
                    .catch((err) => {
                        console.log("获取银行动态数据err", err);
                        this.loading = false;
                        this.$message({ message: "请求失败", type: "error" });
                    });
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getbankDynamicList(); //调银行动态列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getbankDynamicList(); //调产品系列列表接口
            },
            //机构名称
            orglistSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.orglist.find(function (item) {
                    return item.commercialId === val;
                });
                console.log(obj.orgName);
                this.dataForm.orgName = obj.orgName;
                //请求存款系列
            },
            //弹框取消按钮
            cancleFrom(dataForm) {
                this.dialogVisible = false;
                this.$refs.dataForm.resetFields(); //清空数据
            },
            //重置
            resetForm(topData) {
                console.log("重置");
                this.$refs.topData.resetFields();
            },
            //点击弹框阴影部分校验
            closeDialog(done) {
                this.$confirm("确认关闭？")
                    .then((_) => {
                        done();
                        this.$refs.dataForm.resetFields(); //清空数据
                        location.reload(); //刷新页面
                    })
                    .catch((_) => {});
            },
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    orgId: "", //机构id
                    orgName: "", //机构名称
                    dynamicPictureUrl: "", //动态图片地址
                    dynamicTitle: "", //动态标题
                    dynamicSubtitle: "", //动态副标题
                    dynamicUrl: "", //动态url
                    dynamicDetails: "", //动态详情
                    startDate: "", //发布开始时间
                    endDate: "", //发布结束时间
                    dynamicType: "", //动态类型（1站外url2站内3自定义）
                    isWithdraw: "", //是否撤回1撤回0不撤回(默认0)
                    cancelDate: "", //撤回时间(是否撤回为1撤回必填)
                    emergencyOffline: "" //紧急下线：0：否，1：是,
                };
                Object.assign(this.dataForm);
            },
            // 显示编辑界面弹框
            handleEdit: function (row) {
                this.getOrgNameByBankType(); //初始化下拉框数据
                console.log("编辑", row);
                this.dialogVisible = true;
                Object.assign(this.dataForm, row);
            },
            //新增保存提交
            submitFormAddSave: function (dataForm) {
                console.log("新增保存");
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                let params = Object.assign({}, this.dataForm);
                                console.log("新增保存入参", params);
                                createBankDynamics(params)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "success" });
                                            this.dialogVisible = false;
                                            this.getbankDynamicList();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "error" });
                                            this.dialogVisible = false;
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("新增接口err", err);
                                        this.saveLoading = false;
                                        this.$message({ message: "新增请求失败", type: "error" });
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消新增" });
                            });
                    }
                });
            },
            //编辑保存提交
            submitFormEditSave: function (dataForm) {
                console.log("编辑保存");
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                let params = Object.assign({}, this.dataForm);
                                console.log("编辑保存入参", params);
                                //请求编辑接口
                                updBankDynamics(params)
                                    .then((res) => {
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "success" });
                                            this.dialogVisible = false;
                                            this.getbankDynamicList();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "error" });
                                            this.dialogVisible = false;
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("编辑接口err", err);
                                        this.saveLoading = false;
                                        this.$message({ message: "修改请求失败", type: "error" });
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消编辑" });
                            });
                    }
                });
            },
            // 单个删除
            handleDelete(index, row) {
                console.log("单个删除", row);
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            id: row.id
                        };
                        console.log("单个删除入参", params);
                        delBankDynamics(params)
                            .then((res) => {
                                console.log("删除接口", res);
                                if (res.result == true) {
                                    this.loading = false;
                                    this.$message({ message: res.description, type: "success" });
                                    this.getbankDynamicList(); //刷新当前页
                                } else {
                                    this.loading = false;
                                    this.$message({ message: res.description, type: "error" });
                                }
                            })
                            .catch((err) => {
                                console.log("删除接口err", err);
                                this.loading = false;
                                this.$message({ message: "删除请求失败", type: "error" });
                            });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            //上传图片-------------start---------------------------------
            // 文件超出个数限制时的钩子
            exceedFile(files, fileList) {
                this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
            },
            //上传图片
            uploadDynamicPictureImg(params) {
                const _file = params.file;
                let extension = _file.name.substring(_file.name.lastIndexOf(".") + 1);
                const isLt5M = _file.size / 1024 / 1024 < 5;
                if (extension !== "png") {
                    this.$message.warning("只能上传后缀是.png的文件");
                }
                if (!isLt5M) {
                    this.$message.error("请上传5M以下的图片");
                    return false;
                }
                var formData = new FormData();
                formData.append("name", _file);
                console.log("formData", formData);
                forUpload(formData)
                    .then((res) => {
                        console.log(res);
                        if (res.result) {
                            this.dataForm.dynamicPictureUrl = res.data[0];
                            // this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
                            this.$refs.upload1.clearFiles(); //清空文件
                        } else {
                            this.$message.error(res.description);
                        }
                    })
                    .catch((err) => {
                        this.$message({ message: "上传请求失败", type: "error" });
                    });
            },
            //--------------end---------------------------
            //富文本编辑取值
            onEditorChangeArea({ quill, html, text }) {
                console.log("描述富文本", html);
                this.dataForm.dynamicDetails = html; //产品描述
            },

            // 富文本上传图片调接口
            quillEditorUploaderImg(content) {
                this.quillUpdateImg = true;
                // 获取富文本组件实例
                const _file = content.file;
                let formData = new FormData();
                formData.append("name", _file);
                console.log("formData", formData);
                forUpload(formData)
                    .then((res) => {
                        console.log(res);
                        if (res.result) {
                            //获取富文本组件实例
                            let quill = this.$refs.myQuillEditor.quill;
                            // 获取光标所在位置
                            let length = quill.getSelection().index;
                            // 插入图片  res.url为服务器返回的图片地址
                            quill.insertEmbed(length, "image", this.imageUrl + res.data[0]); //this.imageUrl为图片地址前缀域名，res.data[0]为服务器返回的图片的url
                            // 调整光标到最后
                            quill.setSelection(length + 1);
                        } else {
                            this.$message.error(res.description);
                        }
                        // loading动画消失
                        this.quillUpdateImg = false;
                        this.$refs.myQuillEditor.clearFiles(); //清空文件
                    })
                    .catch((err) => {
                        // loading动画消失
                        this.quillUpdateImg = false;
                        console.log(err);
                        // this.$message({ message: '插入图片失败', type: 'error' })
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .el-table__fixed-body-wrapper {
        top: 37px !important;
    }
    .prdSeries {
        padding: 20px;
    }
    // .topBox{
    // 	border-bottom: 1px solid #EBEEF5;
    // }
    // .addBtn{
    // 	margin: 18px 0;
    // }
    .addForm {
        .el-form-item__label-wrap {
            margin-left: 0px !important; //新增的所有label 靠左显示
        }
        .el-table::before {
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0px;
        }
        .el-input {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
        .tipText {
            padding-left: 12px;
            color: #999;
        }
        /deep/ .el-form-item .el-form-item--small {
            margin-top: 18px;
            /deep/ .el-form-item__label-wrap {
                margin-left: 10px !important;
            }
        }
        //富文本
        /deep/ .ql-container {
            height: 75% !important;
        }
        /deep/ .ql-toolbar.ql-snow .ql-picker-label {
            border: 1px solid #ccc !important;
        }
        /deep/ .ql-snow .ql-picker-label::before {
            display: inline-block;
            line-height: 22px;
            position: absolute;
            top: 0;
        }
        /deep/ .quill-editor {
            p,
            span {
                line-height: 22px !important;
            }
        }
    }
    /deep/ .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 90px;
        height: 90px;
        line-height: 90px;
        text-align: center;
    }
    /deep/ .avatar-uploader-icon:hover {
        border-color: #409eff;
    }
    .avatar {
        width: 90px;
        height: 90px;
        display: block;
    }
    .el-upload__tip {
        padding-left: 20px;
    }
</style>
