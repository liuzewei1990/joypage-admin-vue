<template>
    <!-- 新增日活 -->
    <el-dialog title="设置每日日活上限增长率" :visible.sync="dialogVisible" :close-on-click-modal="isClose" :show-close="showClose">
        <ul>
            <li>
                <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="160px">
                    <el-form-item label="浮动百分比：" prop="floatPercentStart">
                        <div class="bili">
                            <el-input type="number" placeholder="请输入" v-model="form.floatPercentStart"> </el-input>
                            <span>至</span>
                            <el-form-item style="margin-bottom: 0" label="" prop="floatPercentEnd">
                                <el-input type="number" placeholder="请输入" v-model="form.floatPercentEnd"> </el-input>
                            </el-form-item>
                        </div>
                    </el-form-item>
                    <el-form-item label="生效时间：" prop="time">
                        <el-date-picker
                            v-model="form.time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                            placeholder="选择时间范围">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="未配置时自动更新：" prop="autoUpdateStatus">
                        <el-radio v-model="form.autoUpdateStatus" v-for="(item, index) in statusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
                    </el-form-item>

                    <el-form-item label="是否生效：" prop="effectStatus">
                        <el-radio v-model="form.effectStatus" v-for="(item, index) in isstatusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
                    </el-form-item>
                </el-form>
            </li>
        </ul>
        <div class="btnCon">
            <el-button :size="size" :loading="saveLoading" @click="save" type="primary">提交</el-button>
            <el-button :size="size" @click="cancle">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { addOrUpdateDayLive } from "../apis/index";
    export default {
        data() {
            var floatPercentStartvalidator = (rule, value, callback) => {
                if (value >= this.form.floatPercentEnd) {
                    callback(new Error("结束百分比必须大于开始百分比"));
                } else if (value <= 0) {
                    callback(new Error("开始百分比必须大于0"));
                } else {
                    callback();
                }
            };

            // var floatPercentEndvalidator =(rule, value, callback) => {
            //   if (value<this.form.floatPercentStart) {
            //     callback(new Error("结束百分比不能小于开始百分比"));
            //   } else {
            //     callback();
            //   }
            // };
            return {
                isstatusOptions: [
                    {
                        value: 0,
                        label: "是"
                    },
                    {
                        value: 1,
                        label: "否"
                    }
                ],
                statusOptions: [
                    {
                        value: 0,
                        label: "是"
                    },
                    {
                        value: 1,
                        label: "否"
                    }
                ],
                imageUrl: "",
                appOption: [],
                saveLoading: false,
                size: "small",
                dialogVisible: true,
                isClose: false,
                showClose: false,
                useStartTime: "",
                form: "",
                forDetail: "",
                rules: {
                    time: [{ required: true, message: "请选择生效时间", trigger: "blur" }],
                    floatPercentStart: [
                        { required: true, message: "请输入浮动百分比开始值", trigger: "change" },
                        { validator: floatPercentStartvalidator, trigger: "blur" }
                    ],
                    floatPercentEnd: [{ required: true, message: "请输入浮动百分比结束值", trigger: "change" }],
                    autoUpdateStatus: [{ required: true, message: "请选择是否自动更新", trigger: "blur" }],
                    effectStatus: [{ required: true, message: "请选择是否生效", trigger: "blur" }]
                },
                pickerOptions: {
                    disabledDate(time) {
                        let dateTime = new Date();
                        let startDateTime = dateTime.setDate(dateTime.getDate());
                        return time.getTime() < new Date(startDateTime).getTime();
                    }
                }
            };
        },
        mounted() {},
        created() {
            this.form = JSON.parse(this.formDetail);
            console.log(this.form);
        },
        props: ["formDetail", "status"],
        methods: {
            // 小程序修改时   获取APPName
            appIdchange(v) {
                console.log(v);
                this.appOption.forEach((i) => {
                    if (v == i.appId) {
                        this.form.appName = i.appName;
                        this.form.originalId = i.originalId;
                    }
                });
            },
            handle() {
                var startAt = (new Date(this.date) * 1000) / 1000;
                if (startAt < Date.now()) {
                    this.date = new Date();
                }
            },
            // 上传
            uploadCheckImg(params) {
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
                        this.form.imgUrl = res.data[0];
                        this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`;
                    } else {
                        this.$message.error(res.description);
                    }
                });
            },
            // 取消
            cancle() {
                this.$emit("cancle");
            },
            // 提交
            save() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        // 新建
                        if (this.status == "add") {
                            let params = {
                                effectStatus: this.form.effectStatus,
                                effectStartTime: this.form.time == null ? "" : this.form.time[0],
                                effectEndTime: this.form.time == null ? "" : this.form.time[1],
                                floatPercentStart: this.form.floatPercentStart,
                                floatPercentEnd: this.form.floatPercentEnd,
                                autoUpdateStatus: this.form.autoUpdateStatus
                            };
                            this.saveLoading = true;
                            addOrUpdateDayLive(params).then((res) => {
                                if (Number(res.code) === 0) {
                                    this.saveLoading = false;
                                    this.$emit("save");
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error(res.message);
                                }
                            });
                        }
                        // 修改
                        if (this.status == "edit") {
                            let params = {
                                appName: this.form.appName,
                                appId: this.form.appId,
                                appSecret: "",
                                id: this.form.id,
                                imgUrl: this.form.imgUrl,
                                useStatus: this.form.useStatus,
                                useStartTime: this.form.useStartTime,
                                useOrder: this.form.useOrder,
                                originalId: this.form.originalId
                            };
                            this.saveLoading = true;
                            updateApplet(params).then((res) => {
                                if (Number(res.code) === 0) {
                                    this.saveLoading = false;
                                    this.$emit("save");
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error(res.message);
                                }
                            });
                        }
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .btnCon {
        display: flex;
        justify-content: center;
    }
    /deep/ .avatar-uploader-icon {
        width: 50px;
        height: 50px;
        border: 1px dashed #666;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    /deep/ .el-input {
        width: 160px;
    }
    /deep/ .el-dialog {
        width: min-content;
    }
    /deep/ .el-range-editor--small.el-input__inner {
        width: 100%;
    }
    .bili {
        display: flex;
        span {
            margin: 0 10px;
        }
    }
</style>
