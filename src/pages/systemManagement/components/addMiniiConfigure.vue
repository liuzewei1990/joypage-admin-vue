<template>
    <!-- 新增小程序  模块 -->
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="isClose" :show-close="showClose">
        <ul>
            <li>
                <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="160px">
                    <el-form-item label="选择小程序：" prop="appId">
                        <el-select v-model="form.appId" @change="appIdchange">
                            <el-option v-for="(item, index) in appOption" :key="index" :value="item.appId" :label="item.idAndName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="小程序图片预览："  prop="imgUrl">
          <el-upload
            :model='form.imgUrl'
            class="upload-demo"
            action="customize"
            :http-request="uploadCheckImg"
            :on-change="fileChange"
            :show-file-list="false"
            >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <small style='color:red'>建议在128KB以内</small>
        </el-form-item> -->
                    <el-form-item label="是否启用：" prop="useStatus">
                        <el-radio v-model="form.useStatus" v-for="(item, index) in statusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
                    </el-form-item>
                    <el-form-item label="启用日期及时间：" prop="useStartTime">
                        <el-date-picker
                            v-model="form.useStartTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="handle"
                            :picker-options="pickerOptions"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="启用顺序：" prop="useOrder">
                        <el-input type="number" placeholder="请输入" v-model="form.useOrder"> </el-input>
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
    import { getAppletList, addApplet, updateApplet, forUpload } from "../apis/index";
    export default {
        data() {
            return {
                statusOptions: [
                    {
                        value: 0,
                        label: "启用"
                    },
                    {
                        value: 1,
                        label: "不启用"
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
                rules: {
                    useStartTime: [{ required: true, message: "请选择启用时间", trigger: "blur" }],
                    useStatus: [{ required: true, message: "请选择启用状态", trigger: "change" }],
                    // imgUrl:[
                    //   { required: true, message: '请上传图片', trigger: 'change' }
                    // ],
                    appId: [{ required: true, message: "请选择小程序", trigger: "blur" }],
                    useOrder: [{ required: true, message: "请输入启用顺序", trigger: "blur" }]
                },
                defaultTime: ["00:00", "23:59"],
                pickerOptions: {
                    disabledDate(time) {
                        let dateTime = new Date();
                        let startDateTime = dateTime.setDate(dateTime.getDate());
                        return time.getTime() < new Date(startDateTime).getTime();
                    }
                    // disabledDate(time) {
                    //   let dateTime = new Date();
                    //   let startDateTime = dateTime.setDate(dateTime.getDate() - 1);
                    //   return (
                    //     time.getTime() < new Date(startDateTime).getTime()
                    //   );
                    // },
                    // selectableRange:
                    // new Date(new Date().setHours(new Date().getHours())).getHours() + ':'+new Date(new Date().setHours(new Date().getMinutes())).getMinutes()+':00 - 23:59:00'
                }
            };
        },
        watch: {
            "form.useStartTime": function (newVal, oldVal) {
                let selectDate = newVal ? newVal.split(" ")[0] : "";
                let oldDate = oldVal ? oldVal.split(" ")[0] : "";
                let month = new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : "0" + Number(new Date().getMonth() + 1);
                let data = new Date().getDate() >= 10 ? new Date().getDate() : "0" + Number(new Date().getDate());
                let data1 = new Date().getDate() + 1 >= 10 ? new Date().getDate() + 1 : "0" + Number(new Date().getDate() + 1);
                let nowDate = `${new Date().getFullYear()}-${month}-${data}`;
                if (selectDate === nowDate) {
                    this.form.useStartTime = `${new Date().getFullYear()}-${month}-${data1} 00:00:00`;
                }
                // 如果两次选择的时间不相等
                // if (oldDate !== selectDate) {
                // 如果这次选择的时间等于今天的时间就不让选当前小时之前，否则就可以选全部时间段
                // if (selectDate === nowDate) {
                // console.log(2)
                // this.form.useStartTime=`${new Date().getFullYear()}-${month}-${new Date().getDate()-(-1)} 00:00`
                //   this.pickerOptions.selectableRange =
                // new Date(new Date().setHours(new Date().getHours())).getHours() + ':'+new Date(new Date().setHours(new Date().getMinutes())).getMinutes()+':00 - 23:59:00'
                // } else {
                //   this.pickerOptions.selectableRange = '00:00:00 - 23:59:00';
                // }
                // }
            }
        },
        mounted() {},
        created() {
            this.form = JSON.parse(this.formDetail);
            console.log(this.form);
            this.getAppletListFun();
            // if (this.form.imgUrl=='') {
            //   this.imageUrl=''
            // } else {
            //   this.imageUrl=this.$Config.aliyuncHost+this.form.imgUrl
            // }
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
                        this.form.id = i.id;
                        this.form.appSecret = i.appSecret;
                    }
                });
            },
            // 获取小程序数据
            getAppletListFun() {
                let params = "";
                getAppletList(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.appOption = res.data;
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            handle() {
                var startAt = (new Date(this.date) * 1000) / 1000;
                if (startAt < Date.now()) {
                    this.form.useStartTime = new Date();
                }
            },
            // 上传
            uploadCheckImg(params) {
                const _file = params.file;
                const isLt5M = _file.size / 1024 < 128;
                if (!isLt5M) {
                    this.$message.error("请上传128KB以下的图片");
                    return false;
                } else {
                    var formData = new FormData();
                    formData.append(params.uid, _file);
                    formData.append("type", "11");
                    forUpload(formData).then((res) => {
                        if (res.result) {
                            // this.form.imgUrl=res.data[0]
                            // this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
                        } else {
                            this.$message.error(res.description);
                        }
                    });
                }
            },
            // 取消
            cancle() {
                this.$emit("cancle");
            },
            // 提交
            save() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let params = {
                            appName: this.form.appName,
                            appId: this.form.appId,
                            appSecret: this.form.appSecret,
                            id: this.form.id,
                            // imgUrl: this.form.imgUrl,
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
    /deep/ .el-input,
    img {
        width: 200px;
    }
</style>
