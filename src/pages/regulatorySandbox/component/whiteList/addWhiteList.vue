<template>
    <!-- 新增/修改 手机号白名单-->
    <div class="addShare" v-loading="loading">
        <!-- 新增 -->
        <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="170px">
            <el-form-item label="新增人员信息：" prop="phoneNums">
                <div style="height: 30px"></div>
                <!-- 手动添加手机号 -->
                <div style="max-height: 300px; overflow: auto">
                    <el-form-item label="手机号：" class="phoneNUM" v-for="(item, index) in form.phoneNums" :key="index" label-width="80px">
                        <span class="telphone" :keyid="item.phone"></span>
                        <el-input v-model="item.phone" placeholder="请输入"></el-input>
                        <i v-if="importPhoneNums.length + form.phoneNums.length > 1" @click="deleteFun(index)" class="el-icon-delete"></i>
                    </el-form-item>
                    <!-- 批量导入手机号 -->
                    <el-form-item label="手机号：" class="phoneNUM importphoneNUM" v-for="(item, index) in importPhoneNums" :key="index" label-width="80px">
                        <span class="telphone" :keyid="item.phone"></span>
                        <el-input v-model="item.phone" placeholder="请输入"></el-input>
                        <i v-if="importPhoneNums.length + form.phoneNums.length > 1" @click="deleteimportFun($event)" class="el-icon-delete"></i>
                    </el-form-item>
                </div>
                <div style="margin-top: 20px; display: flex">
                    <el-button class="addONe" :size="size" type="primary" @click="addOne">新增一个</el-button>
                    <el-upload class="upload-demo" action="" :on-change="handleChange" :show-file-list="false" :auto-upload="false">
                        <el-button :size="size">批量新增</el-button>
                    </el-upload>
                </div>
            </el-form-item>
            <el-form-item label="人员身份设置：" prop="internalOrExternalPeople">
                <el-radio v-model="form.internalOrExternalPeople" label="1">内部人员</el-radio>
                <el-radio v-model="form.internalOrExternalPeople" label="2">外部人员</el-radio>
            </el-form-item>
            <el-form-item v-if="form.internalOrExternalPeople == '2'" class="plateformSearch" label="渠道选择：" prop="platform">
                <div class="plateformClass">
                    <div>
                        <div class="label">内部渠道</div>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group v-model="form.internalAppFlags" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in cities" :label="city.value" :value="city.label" :key="city.value">{{ city.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <div>
                        <div class="label">外部渠道</div>
                        <el-checkbox disabled :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group disabled v-model="form.externalAppFlags" @change="handleCheckedCitiesChange1">
                            <el-checkbox v-for="city in cities1" :label="city.value" :value="city.label" :key="city.value">{{ city.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-form-item>
            <el-form-item v-if="form.internalOrExternalPeople == '2'" label="银行：">
                <el-select v-model="form.orgIds" class="scrollSelect" multiple filterable clearable placeholder="请选择">
                    <el-option v-for="item in orgs" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.internalOrExternalPeople == '2'" label="银行产品：">
                <el-select multiple no-match-text="" class="scrollSelect" clearable v-model="form.prdName" filterable remote :remote-method="searchPro" placeholder="请选择">
                    <div>
                        <el-option v-for="item in prdList" :key="item.id" :label="item.prdName + '-' + item.id" :value="item.prdName + '-' + item.id"> </el-option>
                    </div>
                    <div style="text-align: center">
                        <el-button :disabled="pageParams1.pageNum <= 1" :size="size" type="text" @click.stop="prevPage">上一页</el-button>
                        <el-button :disabled="pageParams1.pageNum >= pageParams1.totalPage" :size="size" type="text" @click.stop="nextPage">下一页</el-button>
                        <span style="color: #ccc; font-size: 12px">当前页{{ pageParams1.pageNum }}</span>
                        <span style="color: #ccc; font-size: 12px">总页数{{ pageParams1.totalPage }}</span>
                    </div>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button :size="size" :loading="saveLoading" @click="save" type="primary">提交</el-button>
                <el-button :size="size" @click="cancle">取消</el-button>
            </el-form-item>
        </el-form>
        <alert-pop @sureChild="sureChild" :title1="title1" :type1="type1" :content="content" v-if="popShow"></alert-pop>
    </div>
</template>
<script>
    import alertPop from "./alertPOP";
    import { Whitelistsave, BlacklistselectOne, org, prdindexall, Whitelistcheck } from "../../apis/index";
    import prvCity from "../../config/prvCity.json";
    import XLSX from "xlsx";
    const cityOptions = [
        {
            value: "BC",
            label: "比财APP"
        },
        {
            value: "PC",
            label: "拼财APP"
        },
        {
            value: "PMP",
            label: "拼财小程序"
        }
    ];
    const cityOptions1 = [
        {
            value: "YY",
            label: "异业"
        },
        {
            value: "TY",
            label: "同业"
        },
        {
            value: "ZT",
            label: "直投"
        }
    ];
    export default {
        components: { alertPop },
        data() {
            // 渠道  目前为默认值
            var platformVal = (rule, value, callback) => {
                callback();
            };
            // 手机号
            var phoneNumsVal = (rule, value, callback) => {
                let isOk = 0;
                let reg = /1(1|2|0|3|4|5|6|7|8|9)d{9}/g;
                reg.lastIndex = 0;
                console.log("13552943878", reg.test(13552943878));
                if (this.form.phoneNums.length == 0 && this.importPhoneNums.length == 0) {
                    isOk = "至少有一个手机号";
                } else {
                    this.form.phoneNums.forEach((i) => {
                        let reg = /^[1][0-9]{10}$/;
                        console.log(!reg.test(i.phone));
                        if (i.phone == "") {
                            isOk = "手机号不可为空";
                        } else if (!reg.test(i.phone)) {
                            isOk = "填写正确的手机号";
                        }
                    });
                    this.importPhoneNums.forEach((i) => {
                        let reg = /^[1][0-9]{10}$/;
                        console.log(!reg.test(i.phone));
                        if (i.phone == "") {
                            isOk = "手机号不可为空";
                        } else if (!reg.test(i.phone)) {
                            isOk = "填写正确的手机号";
                        }
                    });
                }
                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            return {
                content: "",
                title1: "",
                type1: "",
                popShow: false,
                disabledSave: true,
                loading: false,
                fileContent: "",
                prdList: [],
                proName: "",
                pageParams1: {
                    totalPage: 0,
                    pageNum: 1,
                    pageSize: 10
                },
                cityList: [],
                prvList: [],
                orgs: [], // 银行
                checkAll: true,
                cities: cityOptions,
                isIndeterminate: true,
                checkAll1: false,
                cities1: cityOptions1,
                isIndeterminate1: false,
                saveLoading: false,
                importPhoneNums: [], //批量导入手机号
                form: {
                    internalOrExternalPeople: "",
                    phoneNums: [], // 多个手机号
                    orgIds: [],
                    prdIndexIds: [],
                    prdName: [],
                    internalAppFlags: [],
                    externalAppFlags: [],
                    id: ""
                },
                rules: {
                    phoneNums: [{ required: true, validator: phoneNumsVal, trigger: "change" }],
                    platform: [{ required: true, validator: platformVal, trigger: "change" }],
                    internalOrExternalPeople: [{ required: true, message: "请选择人员身份设置", trigger: "change" }]
                },
                oldMsg: ""
            };
        },
        computed: {
            type() {
                return this.$route.query.type;
            },
            title() {
                return `${this.$route.query.name}手机号白名单`;
            },
            ids() {
                let ids = [];
                this.form.prdName.forEach((i) => {
                    ids.push(i.split("-").pop());
                });
                return ids;
            }
        },
        created() {
            this.prvList = prvCity.provinces;
            this.$route.meta.title = `${this.$route.query.name}手机号白名单`;
            if (this.$route.query.id) {
                this.selectOneFun();
            } else {
                this.form.phoneNums = [
                    {
                        phone: ""
                    }
                ];
                this.handleCheckAllChange();
                this.form.internalAppFlags = ["BC", "PC", "PMP"];
                // this.form.internalAppFlags=['PMP']
            }
            if (this.$route.query.type == "allAdd") {
                this.importPhoneNums = JSON.parse(sessionStorage.getItem("importPhoneNums"));
            } else {
                this.importPhoneNums = [];
            }
            // let orgs=
            if (JSON.parse(sessionStorage.getItem("orgs"))) {
                this.orgs = JSON.parse(sessionStorage.getItem("orgs"));
            } else {
                this.orgsFun();
            }
            let params = {
                headerModel: {
                    systemType: "h5",
                    message: "查询产品请求",
                    requesttime: Date.parse(new Date()),
                    version: "",
                    token: "",
                    deviceId: "",
                    appFlag: "",
                    loginUid: ""
                },
                datatypeParam: {
                    currentPage: 1,
                    searchName: ""
                }
            };
            prdindexall(params).then((res) => {
                if (res.headerModel.code == 0) {
                    this.prdList = res.datatypeParam.retList;
                    this.pageParams1.totalPage = res.datatypeParam.totalPage;
                }
            });

            this.oldMsg = JSON.stringify(this.form);
        },
        mounted() {},
        methods: {
            // 核心部分代码(handleChange 和 importfile)
            handleChange(file, fileList) {
                this.fileContent = file.raw;
                const fileName = file.name;
                const fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
                if (this.fileContent) {
                    if (fileType === "xlsx" || fileType === "xls") {
                        this.importfile(this.fileContent);
                    } else {
                        this.$message({
                            type: "warning",
                            message: "附件格式错误，请重新上传！"
                        });
                    }
                } else {
                    this.$message({
                        type: "warning",
                        message: "请上传附件！"
                    });
                }
            },
            importfile(obj) {
                const reader = new FileReader();
                const _this = this;
                this.loadingTbal = true;
                reader.readAsArrayBuffer(obj);
                reader.onload = function () {
                    const buffer = reader.result;
                    const bytes = new Uint8Array(buffer);
                    const length = bytes.byteLength;
                    let binary = "";
                    for (let i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    const XLSX = require("xlsx");
                    const wb = XLSX.read(binary, {
                        type: "binary"
                    });
                    let aa = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                    aa.map((v) => {
                        let obj = {};
                        obj.phone = v.手机号;
                        // obj.status='1'
                        // console.log()
                        _this.importPhoneNums = _this.importPhoneNums.concat(obj);
                    });
                    _this.$nextTick(() => {
                        _this.loadingTbal = false;
                    });
                };
            },
            // 手机号  新增一个
            addOne() {
                let obj = {
                    phone: ""
                };
                this.form.phoneNums.unshift(obj);
            },

            // 搜索产品数据
            searchPro(query) {
                this.proName = query;
                let params = {
                    headerModel: {
                        systemType: "h5",
                        message: "查询产品请求",
                        requesttime: Date.parse(new Date()),
                        version: "",
                        token: "",
                        deviceId: "",
                        appFlag: "",
                        loginUid: ""
                    },
                    datatypeParam: {
                        currentPage: this.pageParams1.pageNum,
                        searchName: query
                    }
                };
                prdindexall(params).then((res) => {
                    if (res.headerModel.code == 0) {
                        this.prdList = res.datatypeParam.retList;
                        this.pageParams1.totalPage = res.datatypeParam.totalPage;
                    }
                });
            },
            // 广告内容上一页
            prevPage() {
                if (this.pageParams1.pageNum <= 1) {
                    this.pageParams1.pageNum = 1;
                } else {
                    this.pageParams1.pageNum -= 1;
                }
                this.searchPro(this.proName);
            },
            // 广告内容下一页
            nextPage() {
                if (this.pageParams1.pageNum >= this.pageParams1.totalPage) {
                    this.pageParams1.pageNum = this.pageParams1.totalPage;
                } else {
                    this.pageParams1.pageNum += 1;
                }
                this.searchPro(this.proName);
            },
            // 获取银行数据
            orgsFun() {
                org().then((res) => {
                    if (res.headerModel.code == 0) {
                        this.orgs = res.datatypeParam;
                    }
                });
            },
            // 删除手动新加 手机号数据
            deleteFun(index) {
                this.form.phoneNums.splice(index, 1);
            },
            deleteimportFun(e) {
                e.target.parentNode.parentNode.remove();
            },
            // 查询详情
            selectOneFun() {
                let params = {
                    headerModel: {
                        systemType: "h5",
                        message: "单个白名单查询",
                        requesttime: Date.parse(new Date()),
                        version: "",
                        token: "",
                        deviceId: "",
                        appFlag: "",
                        loginUid: ""
                    },
                    datatypeParam: {
                        id: this.$route.query.id
                    }
                };
                BlacklistselectOne(params).then((res) => {
                    console.log(res);
                    if (res.headerModel.code == 0) {
                        if (res.datatypeParam.phoneNum.indexOf(",") < 0) {
                            this.form.phoneNums.push(res.datatypeParam.phoneNum);
                        } else {
                            this.form.phoneNums == res.datatypeParam.phoneNum;
                        }
                        if (res.datatypeParam.internalAppFlags.indexOf(",") < 0) {
                            this.form.internalAppFlags.push(res.datatypeParam.internalAppFlags);
                        } else {
                            this.form.internalAppFlags = res.datatypeParam.internalAppFlags.split(",");
                        }
                        if (res.datatypeParam.externalAppFlags.indexOf(",") < 0) {
                            this.form.internalAppFlags.push(res.datatypeParam.externalAppFlags);
                        } else {
                            this.form.externalAppFlags = res.datatypeParam.externalAppFlags.split(",");
                        }
                        this.form = res.datatypeParam;

                        this.oldMsg = JSON.stringify(this.form);
                    } else {
                        this.$message.error(res.headerModel.message);
                    }
                });
            },
            // 内部渠道多选
            handleCheckAllChange(val) {
                let all = [];
                if (val) {
                    cityOptions.filter((i) => {
                        all.push(i.value);
                    });
                }
                this.internalAppFlags = val ? all : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            // 外部渠道多选
            handleCheckAllChange1(val) {
                let all = [];
                if (val) {
                    cityOptions.filter((i) => {
                        all.push(i.value);
                    });
                }
                this.searchForm.externalAppFlags = val ? all : [];
                this.isIndeterminate1 = false;
            },
            handleCheckedCitiesChange1(value) {
                let checkedCount1 = value.length;
                this.checkAll1 = checkedCount1 === this.cities1.length;
                this.isIndeterminate1 = checkedCount1 > 0 && checkedCount1 < this.cities1.length;
            },
            save() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        console.log(555);
                        this.saveLoading = true;

                        let arr = [...new Set(document.getElementsByClassName("telphone"))];
                        let phoneNums = [];
                        arr.map((i) => {
                            let phone = i.getAttribute("keyid");
                            phoneNums.push(phone);
                        });
                        let params = {
                            headerModel: {
                                systemType: "h5",
                                message: "保存白名单",
                                requesttime: Date.parse(new Date()),
                                version: "",
                                token: "",
                                deviceId: "",
                                appFlag: "",
                                loginUid: ""
                            },
                            datatypeParam: {
                                phoneNums: phoneNums.toString(),
                                internalAppFlags: this.form.internalOrExternalPeople == "1" ? "" : this.form.internalAppFlags.toString(),
                                externalAppFlags: this.form.internalOrExternalPeople == "1" ? "" : this.form.externalAppFlags.toString(),
                                orgIds: this.form.internalOrExternalPeople == "1" ? "" : this.form.orgIds.toString(),
                                prdIndexIds: this.form.internalOrExternalPeople == "1" ? "" : this.ids.toString(),
                                internalOrExternalPeople: this.form.internalOrExternalPeople
                            }
                        };
                        Whitelistcheck(params)
                            .then((res) => {
                                this.loading = false;
                                if (res.datatypeParam.nonConfig.listData.length == 0 && res.datatypeParam.phone.listData.length == 0) {
                                    Whitelistsave(params).then((res) => {
                                        this.loading = false;
                                        this.saveLoading = false;
                                        if (res.headerModel.code == 0) {
                                            this.$router.push("/whiteList");
                                        } else {
                                            this.$message.error(res.headerModel.message);
                                        }
                                    });
                                } else {
                                    if (res.datatypeParam.nonConfig.listData.length > 0 && res.datatypeParam.phone.listData.length == 0) {
                                        this.popShow = true;
                                        this.content = res.datatypeParam.nonConfig.listData;
                                        this.type1 = "2";
                                        this.title1 = "选择的以下银行或产品未设置沙盒监管，请确认";
                                    }
                                    if (res.datatypeParam.phone.listData.length > 0 && res.datatypeParam.nonConfig.listData.length == 0) {
                                        this.popShow = true;
                                        this.content = res.datatypeParam.phone.listData;
                                        this.type1 = "1";
                                        this.title1 = "以下手机号白名单存在重复配置，提交成功后数据将自动合并";
                                    }
                                    if (res.datatypeParam.nonConfig.listData.length > 0 && res.datatypeParam.phone.listData.length > 0) {
                                        this.popShow = true;
                                        this.type1 = "3";
                                        this.content = [res.datatypeParam.phone.listData, res.datatypeParam.nonConfig.listData];
                                        this.title1 = "以下手机号存在重复，数据将自动合并；银行或产品未设置沙盒监管，请确认";
                                    }
                                }
                            })
                            .catch((error) => {
                                this.loading = false;
                                this.saveLoading = false;
                            });
                    } else {
                        console.log(valid);
                    }
                });
            },
            // sureChild
            sureChild() {
                let arr = [...new Set(document.getElementsByClassName("telphone"))];
                let phoneNums = [];
                arr.map((i) => {
                    let phone = i.getAttribute("keyid");
                    phoneNums.push(phone);
                });
                let params = {
                    headerModel: {
                        systemType: "h5",
                        message: "保存白名单",
                        requesttime: Date.parse(new Date()),
                        version: "",
                        token: "",
                        deviceId: "",
                        appFlag: "",
                        loginUid: ""
                    },
                    datatypeParam: {
                        phoneNums: phoneNums.toString(),
                        internalAppFlags: this.form.internalOrExternalPeople == "1" ? "" : this.form.internalAppFlags.toString(),
                        externalAppFlags: this.form.internalOrExternalPeople == "1" ? "" : this.form.externalAppFlags.toString(),
                        orgIds: this.form.internalOrExternalPeople == "1" ? "" : this.form.orgIds.toString(),
                        prdIndexIds: this.form.internalOrExternalPeople == "1" ? "" : this.ids.toString(),
                        internalOrExternalPeople: this.form.internalOrExternalPeople
                    }
                };
                Whitelistsave(params).then((res) => {
                    this.loading = false;
                    this.saveLoading = false;
                    if (res.headerModel.code == 0) {
                        this.$router.push("/whiteList");
                    } else {
                        this.$message.error(res.headerModel.message);
                    }
                });
            },
            // 取消
            cancle() {
                if (this.oldMsg != JSON.stringify(this.form)) {
                    this.$confirm("还要继续吗？", "现在取消已编辑的内容将无法保存", {
                        confirmButtonText: "继续",
                        cancelButtonText: "取消",
                        type: "warning",
                        showClose: false
                    })
                        .then(() => {
                            this.$router.push("/whiteList");
                        })
                        .catch(() => {});
                } else {
                    this.$router.push("/whiteList");
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .addONe {
        margin-right: 20px;
    }
    .phoneNUM {
        margin-bottom: 20px;
        border: 1px solid #ccc;
        padding: 20px 0;
        border-radius: 14px;
    }
    .el-icon-delete {
        font-size: 1.6em;
        margin-left: 20px;
        cursor: pointer;
    }
    .addShare {
        height: 100%;
        overflow: auto;
        padding: 40px;
        form {
            width: 800px;
            margin: 0 auto;
            /deep/ .el-input {
                width: max-content;
            }
            .scrollSelect {
                max-height: 100px;
                min-width: 400px;
                overflow-y: auto;
                /deep/ .el-input {
                    width: 100%;
                }
            }
            .area {
                display: flex;
                background: #f1f1f1;
                padding: 15px 20px;
                width: 900px;
                /deep/ .el-input {
                    width: 120px;
                }
                /deep/ .el-select {
                    width: 120px;
                    margin-right: 20px;
                }
                /deep/ .el-checkbox-group {
                    display: inline-block;
                }
                .el-icon-delete {
                    font-size: 1.6em;
                    margin-left: 20px;
                    cursor: pointer;
                }
            }
        }
        .btnCon {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
        }
        .bankClass {
            display: flex;
            > div {
                display: flex;
                margin-right: 30px;
            }
        }
        .plateformSearch {
            .plateformClass {
                > div {
                    display: flex;
                }
                .label {
                    margin-right: 15px;
                }
            }
            .btnCon {
                display: flex;
                // flex-direction: ;
            }
        }
    }
    // /deep/ .el-scrollbar__wrap {
    .ok,
    .no {
        padding: 2px 20px;
        font-size: 10px;
        width: 100%;
        display: inline-block;
        background: #ccc;
        box-sizing: border-box;
    }
    // }
</style>
