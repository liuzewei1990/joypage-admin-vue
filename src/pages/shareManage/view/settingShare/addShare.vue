<template>
    <!-- 新增/修改分享 -->
    <div class="addShare">
        <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="160px">
            <el-form-item label="分享入口渠道：" prop="appFlagList">
                <el-checkbox :indeterminate="isIndeterminate" v-model="appFlagAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="form.appFlagList" @change="handleCheckedAppFlagChange">
                    <el-checkbox v-for="(item, index) in appFlags" :label="item.value" :value="item.value" :key="index">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="分享入口设备选择：" prop="deviceTypeList">
                <el-checkbox :indeterminate="isIndeterminateSystemType" v-model="deviceTypeAll" @change="handleCheckAllChangeSystemType">全选</el-checkbox>
                <el-checkbox-group v-model="form.deviceTypeList" @change="handleCheckedSystemTypeChange">
                    <el-checkbox v-for="(item, index) in systemTypes" :label="item.value" :value="item.value" :key="index">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="分享至：" prop="shareDestination">
                <el-select @change="changeShareType" clearable v-model="form.shareDestination" placeholder="">
                    <!-- 1:微信好友 2:微信朋友圈 3:QQ好友 4:QQ空间 5:短信邀请 6:扫码邀请 -->
                    <el-option value="" label="请选择"></el-option>
                    <el-option value="1" label="微信好友"></el-option>
                    <el-option value="2" label="微信朋友圈"></el-option>
                    <el-option value="3" label="QQ好友"></el-option>
                    <el-option value="4" label="QQ空间"></el-option>
                    <el-option value="5" label="短信邀请"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="showShareMathods" label="分享方式选择：" prop="shareType">
                <el-select @change="changeShareMathods" clearable v-model="form.shareType" placeholder="">
                    <!--  1:图片 2:小程序 3:链接 -->
                    <el-option value="" label="请选择"></el-option>
                    <el-option value="1" label="图片"></el-option>
                    <el-option v-if="showWXMin" value="2" label="小程序"></el-option>
                    <el-option value="3" label="链接"></el-option>
                </el-select>
            </el-form-item>
            <!-- 分享方式  为图片 -->
            <div v-if="form.shareType == '1'">
                <el-form-item label="分享图片上传：" prop="shareImgUrl">
                    <el-upload :model="form.shareImgUrl" class="upload-demo upload-demo1" action="customize" :http-request="uploadCheckImg1" :on-change="fileChange" :show-file-list="false">
                        <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <!-- <small>建议在XXX之内</small> -->
                </el-form-item>
                <el-form-item label="链接生成地址：" prop="shareImgUrl">
                    <el-input :disabled="true" type="text" placeholder="" v-model="form.shareImgUrl" maxlength="" show-word-limit></el-input>
                </el-form-item>
            </div>
            <!-- 分享方式  为小程序 -->
            <div v-if="form.shareType == '2'">
                <el-form-item label="小程序链接：" prop="linkAddress">
                    <el-input type="text" placeholder="" v-model="form.linkAddress"></el-input>
                </el-form-item>
                <el-form-item label="小程序分享主题：" prop="appletShareTheme">
                    <el-input type="text" placeholder="" v-model="form.appletShareTheme"></el-input>
                </el-form-item>
                <el-form-item label="小程序分享内容：" prop="appletShareContent">
                    <el-input type="textarea" placeholder="" v-model="form.appletShareContent"></el-input>
                </el-form-item>
                <el-form-item label="小程序图片：" prop="appletImgUrl">
                    <el-upload :model="form.appletImgUrl" class="upload-demo upload-demo1" action="customize" :http-request="uploadCheckImgMin" :on-change="fileChange" :show-file-list="false">
                        <img v-if="imageUrlMin" :src="imageUrlMin" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <!-- <small>建议在XXX之内</small> -->
                </el-form-item>
                <div class="second">
                    <el-form-item v-if="showShareMathods" label="备用分享方式：" prop="appletSpareShareType">
                        <el-select clearable v-model="form.appletSpareShareType" placeholder="">
                            <el-option value="" label="请选择"></el-option>
                            <el-option value="1" label="链接"></el-option>
                        </el-select>
                        <small>小程序日活全满量后启用的备用链接</small>
                    </el-form-item>
                    <el-form-item v-if="showShareMathods" label="备用链接地址：" prop="appletSpareLinkAddress">
                        <el-input type="text" placeholder="" v-model="form.appletSpareLinkAddress"></el-input>
                    </el-form-item>
                    <el-form-item v-if="showShareMathods" label="备用链接分享主题：" prop="appletSpareTheme">
                        <el-input type="text" placeholder="" v-model="form.appletSpareTheme"></el-input>
                    </el-form-item>
                    <el-form-item v-if="showShareMathods" label="备用链接分享内容：" prop="appletSpareContent">
                        <el-input type="text" placeholder="" v-model="form.appletSpareContent"></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- 分享方式  为链接  已对接-->
            <div v-if="form.shareType == '3'">
                <el-form-item v-if="showShareMathods" label="链接地址：" prop="linkAddress">
                    <el-input type="text" placeholder="" v-model="form.linkAddress"></el-input>
                </el-form-item>
                <el-form-item v-if="showShareMathods" label="分享主题：" prop="theme">
                    <el-input type="text" placeholder="" v-model="form.theme"></el-input>
                </el-form-item>
                <el-form-item v-if="showShareMathods" label="分享内容：" prop="content">
                    <el-input type="text" placeholder="" v-model="form.content"></el-input>
                </el-form-item>
            </div>
            <!--  选择短信邀请下方功能为-->
            <div v-if="form.shareDestination === '5'" class="second">
                <el-form-item label="短信发送文案：" prop="messageArticle">
                    <el-input type="textarea" placeholder="" v-model="form.messageArticle" maxlength="" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="邀请间隔天数：" prop="inviteIntervalDays">
                    <el-input type="text" placeholder="" v-model="form.inviteIntervalDays"></el-input>
                </el-form-item>
            </div>
        </el-form>

        <div class="btnCon">
            <el-button :size="size" :loading="saveLoading" @click="save" type="primary">提交</el-button>
            <el-button :size="size" @click="cancle">取消</el-button>
        </div>
    </div>
</template>
<script>
    import { forUpload, forSharePage, getShareTypeByDestination, addShare, updateShare, forShareDetail } from "../../apis/index";
    const appFlagOptions = [
        {
            name: "比财",
            value: 1
        },
        {
            name: "拼财",
            value: 2
        },
        {
            name: "小程序",
            value: 3
        }
    ];
    const systemTypeOptions = [
        {
            name: "安卓",
            value: 1
        },
        {
            name: "苹果",
            value: 2
        }
    ];

    export default {
        data() {
            var checkappFlag = (rule, value, callback) => {
                if (this.form.appFlagList.length == 0) {
                    callback(new Error("请选择分享入口渠道"));
                } else {
                    callback();
                }
            };
            var checksystemType = (rule, value, callback) => {
                if (this.form.deviceTypeList.length == 0) {
                    callback(new Error("请选择分享入口设备"));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    category: "2",
                    shareDestination: "",
                    shareType: "",
                    appFlagList: [],
                    deviceTypeList: [],
                    entranceImgUrl: "",
                    shareImgUrl: "",
                    appletImgUrl: "",
                    inviteIntervalDays: "",
                    appletSpareShareType: "",
                    messageArticle: "",
                    appletShareTheme: "",
                    appletShareContent: "",
                    appletSpareLinkAddress: "",
                    appletSpareTheme: "",
                    appletSpareContent: "",
                    linkAddress: "",
                    theme: "",
                    content: ""
                },
                imageUrl1: "",
                imageUrlMin: "",
                saveLoading: false,
                size: "small",
                dialogVisible: true,
                // 渠道
                appFlagAll: false,
                appFlags: appFlagOptions,
                isIndeterminate: true,
                // 设备
                systemTypes: systemTypeOptions,
                isIndeterminateSystemType: true,
                deviceTypeAll: false,
                isClose: false,
                showClose: false,
                rules: {
                    appFlagList: [{ required: true, validator: checkappFlag, trigger: "blur" }],
                    deviceTypeList: [{ required: true, validator: checksystemType, trigger: "blur" }],
                    entranceImgUrl: [{ required: true, message: "请上传分享入口图片", trigger: "blur" }],
                    shareDestination: [{ required: true, message: "请选择分享至", trigger: "change" }],
                    activityId: [{ required: true, message: "请选择活动", trigger: "blur" }],
                    shareType: [{ required: true, message: "请选择分享方式", trigger: "blur" }],
                    linkAddress: [{ required: true, message: "请输入链接地址", trigger: "blur" }],
                    inviteIntervalDays: [{ required: true, message: "请输入邀请间隔天数", trigger: "blur" }],
                    messageArticle: [{ required: true, message: "请输入短信发送文案", trigger: "blur" }],
                    shareImgUrl: [{ required: true, message: "请上传分享图片", trigger: "blur" }],
                    appletShareTheme: [{ required: true, message: "请输入小程序分享主题", trigger: "blur" }],
                    appletShareContent: [{ required: true, message: "请输入小程序分享内容", trigger: "blur" }],
                    appletSpareShareType: [{ required: true, message: "请选择备用分享方式", trigger: "blur" }],
                    appletImgUrl: [{ required: true, message: "请上传小程序图片", trigger: "blur" }],
                    appletSpareLinkAddress: [{ required: true, message: "请输入备用链接地址", trigger: "blur" }],
                    appletSpareTheme: [{ required: true, message: "请输入备用链接分享主题", trigger: "blur" }],
                    appletSpareContent: [{ required: true, message: "请输入备用链接分享内容", trigger: "blur" }],
                    theme: [{ required: true, message: "请输入分享主题", trigger: "blur" }],
                    content: [{ required: true, message: "请输入分享内容", trigger: "blur" }]
                }
            };
        },
        computed: {
            type() {
                return this.$route.query.type;
            },
            // 选择微信好友、QQ好友、QQ空间任一项：显示"分享方式”的配置功能
            showShareMathods() {
                if (this.form.shareDestination == "1" || this.form.shareDestination == "3" || this.form.shareDestination == "4" || this.form.shareDestination == "2") {
                    return true;
                } else {
                    return false;
                }
            },
            // 选择朋友圈分享，NO.2“分享方式选择”下拉框仅有图片、链接，其他的与4.1.1相同
            showWXMin() {
                if (this.form.shareDestination == "1" || this.form.shareDestination == "3" || this.form.shareDestination == "4") {
                    return true;
                } else {
                    return false;
                }
            }
        },
        mounted() {
            console.log(this.form);
            console.log(this.systemTypes);
        },
        created() {
            if (this.$route.query.id) {
                let params = {};
                forShareDetail(params, this.$route.query.id).then((res) => {
                    console.log("res", res);
                    this.form = res;
                    // this.form.shareImgUrl=`${this.$Config.aliyuncHost}${res.shareImgUrl}`
                    this.imageUrl1 = `${this.$Config.aliyuncHost}${res.shareImgUrl}`;
                    this.imageUrlMin = `${this.$Config.aliyuncHost}${res.appletImgUrl}`;
                    this.form.appletSpareShareType = res.appletSpareShareType == null ? "" : res.appletSpareShareType.toString();
                    this.form.shareType = res.shareType == null ? "" : res.shareType.toString();
                    this.form.shareDestination = res.shareDestination == null ? "" : res.shareDestination.toString();
                });
            }
        },
        methods: {
            // 分享方式切换时
            changeShareMathods() {
                this.imageUrlMin = "";
                this.imageUrl1 = "";
                this.form.shareImgUrl = "";
                this.form.appletImgUrl = "";
                this.form.inviteIntervalDays = "";
                this.form.messageArticle = "";
                this.form.appletShareTheme = "";
                this.form.appletShareContent = "";
                this.form.appletSpareShareType = "";
                this.form.appletSpareLinkAddress = "";
                this.form.appletSpareTheme = "";
                this.form.appletSpareContent = "";
                this.form.linkAddress = "";
                this.form.theme = "";
                this.form.content = "";
            },
            // 分享至 change时
            changeShareType() {
                this.changeShareMathods();
                this.imageUrlMin = "";
                this.imageUrl1 = "";
                this.form.shareType = "";
                this.form.shareImgUrl = "";
                this.form.appletImgUrl = "";
                this.form.inviteIntervalDays = "";
                this.form.messageArticle = "";
                this.form.appletShareTheme = "";
                this.form.appletShareContent = "";
                this.form.appletSpareShareType = "";
                this.form.appletSpareLinkAddress = "";
                this.form.appletSpareTheme = "";
                this.form.appletSpareContent = "";
                this.form.linkAddress = "";
                this.form.theme = "";
                this.form.content = "";
            },

            // 分享 上传图片
            uploadCheckImg1(params) {
                const _file = params.file;
                const isLt5M = _file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    this.$message.error("请上传5M以下的图片");
                    return false;
                }
                var formData = new FormData();
                formData.append(params.uid, _file);
                formData.append("type", "11");
                forUpload(formData).then((res) => {
                    if (res.result) {
                        this.form.shareImgUrl = res.data[0];
                        this.imageUrl1 = `${this.$Config.aliyuncHost}${res.data[0]}`;
                        this.form.linkAddress = `${this.$Config.aliyuncHost}${res.data[0]}`;
                    } else {
                        this.$message.error(res.description);
                    }
                });
            },
            // 小程序 图片 上传图片
            uploadCheckImgMin(params) {
                const _file = params.file;
                var formData = new FormData();
                formData.append(params.uid, _file);
                formData.append("type", "11");
                forUpload(formData).then((res) => {
                    if (res.result) {
                        this.form.appletImgUrl = res.data[0];
                        this.imageUrlMin = `${this.$Config.aliyuncHost}${res.data[0]}`;
                    } else {
                        this.$message.error(res.description);
                    }
                });
            },
            // 渠道
            handleCheckAllChange(val) {
                let all = [];
                if (val) {
                    appFlagOptions.filter((i) => {
                        all.push(i.value);
                    });
                }
                this.form.appFlagList = val ? all : [];
                this.isIndeterminate = false;
            },
            handleCheckedAppFlagChange(value) {
                let checkedCount = value.length;
                this.appFlagAll = checkedCount === this.appFlags.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.appFlags.length;
            },
            // 设备
            handleCheckAllChangeSystemType(val) {
                let all = [];
                if (val) {
                    systemTypeOptions.filter((i) => {
                        all.push(i.value);
                    });
                }
                this.form.deviceTypeList = val ? all : [];
                this.isIndeterminateSystemType = false;
            },
            handleCheckedSystemTypeChange(value) {
                let checkedCount = value.length;
                this.deviceTypeAll = checkedCount === this.systemTypes.length;
                this.isIndeterminateSystemType = checkedCount > 0 && checkedCount < this.systemTypes.length;
            },

            // 取消
            cancle() {
                this.$router.back(1);
            },
            // 提交
            save() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        // 新建
                        if (this.type == "add") {
                            console.log(this.form);

                            let params = this.form;
                            this.saveLoading = true;
                            addShare(params).then((res) => {
                                if (res.result) {
                                    this.saveLoading = false;
                                    this.$router.push("/shareList/settingShareList");
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error(res.description);
                                }
                            });
                        }
                        // 修改
                        if (this.type == "edit") {
                            let params = {
                                category: "1",
                                id: this.form.id,
                                shareDestination: this.form.shareDestination,
                                shareType: this.form.shareType,
                                appFlagList: this.form.appFlagList,
                                deviceTypeList: this.form.deviceTypeList,
                                entranceImgUrl: this.form.entranceImgUrl,
                                shareImgUrl: this.form.shareImgUrl,
                                appletImgUrl: this.form.appletImgUrl,
                                inviteIntervalDays: this.form.inviteIntervalDays,
                                appletSpareShareType: this.form.appletSpareShareType,
                                messageArticle: this.form.messageArticle,
                                appletShareTheme: this.form.appletShareTheme,
                                appletShareContent: this.form.appletShareContent,
                                appletSpareLinkAddress: this.form.appletSpareLinkAddress,
                                appletSpareTheme: this.form.appletSpareTheme,
                                appletSpareContent: this.form.appletSpareContent,
                                linkAddress: this.form.linkAddress,
                                theme: this.form.theme,
                                content: this.form.content
                            };
                            this.saveLoading = true;
                            updateShare(params).then((res) => {
                                if (res.result) {
                                    this.saveLoading = false;
                                    this.$router.push("/shareList/settingShareList");
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error(res.description);
                                }
                            });
                        }
                    } else {
                        console.log(this.form);
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .addShare {
        height: 100%;
        overflow: auto;
        padding: 40px;
        form {
            width: 800px;
            margin: 0 auto;
        }
        small {
            display: block;
            color: #999;
            font-size: 12px;
        }
        .btnCon {
            display: flex;
            justify-content: center;
        }
        /deep/ .el-checkbox-group {
            display: inline-block;
            margin-left: 20px;
        }
        /deep/ .el-dialog {
            min-width: 600px;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409eff;
        }
        /deep/ .el-upload {
            border: 1px dashed #dcdfe6;
        }
        /deep/ .el-input,
        /deep/ .el-date-editor,
        /deep/ .el-textarea__inner {
            width: 400px;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
        .second {
            margin-left: 140px;
            /deep/ .el-form-item__label {
                width: 200px !important;
            }
            /deep/ .el-form-item__content {
                margin-left: 200px !important;
            }
        }
        .upload-demo1 {
            display: inline-block;
        }
    }
</style>
