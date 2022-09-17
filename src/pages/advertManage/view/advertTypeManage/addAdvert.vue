<template>
    <!-- 添加广告 -->
    <div class="addAdvert">
        <el-page-header @back="goBack" :content="'新增' + advTypeTxt"></el-page-header>
        <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="140px">
            <!-- <div class='advTypeTxt'>新增{{advTypeTxt}}</div> -->
            <el-form-item v-if="advType == 1 || advType == 3 || advType == 4" label="广告标题：" prop="advTitle">
                <el-input v-model="form.advTitle"></el-input>
            </el-form-item>
            <el-form-item v-if="advType == 1" label="排列方式：" prop="arrangementMode">
                <el-select clearable v-model="form.arrangementMode" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.arrangementList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else label="弹框标题：" prop="advTitle">
                <el-input v-model="form.advTitle"></el-input>
            </el-form-item>
            <!-- 横幅广告 -->
            <!-- <el-form-item v-if='advType==1' label="广告图片："  prop="advImgUrl">
        <el-upload
          :model='form.advImgUrl'
          class="upload-demo"
          action="customize"
          :http-request="uploadCheckImg"
          :on-change="fileChange"
          :show-file-list="false"
          :accept='acceptType'
          >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item> -->
            <!-- 弹窗广告 -->
            <el-form-item v-if="advType == 2" label="弹框图片：" prop="advImgUrl">
                <el-upload :model="form.advImgUrl" class="upload-demo" action="customize" :http-request="uploadCheckImg" :on-change="fileChange" :show-file-list="false" :accept="acceptType">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <!-- 开屏广告，悬浮广告，横幅广告 -->
            <el-form-item v-if="advType == 1 || advType == 3 || advType == 4" label="展现形式：" prop="showType">
                <el-select @change="changeType" clearable v-model="form.showType" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.showTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="advType == 1 || advType == 3 || advType == 4" label="" prop="advImgUrl">
                <el-upload :model="form.advImgUrl" class="upload-demo" action="customize" :http-request="uploadCheckImg" :on-change="fileChange" :show-file-list="false" :accept="acceptType">
                    <img v-if="imageUrl && form.showType != 2" :src="imageUrl" class="avatar" />
                    <video v-else-if="imageUrl && form.showType == 2" width="320" height="240" controls>
                        <source :src="imageUrl" type="video/mp4" />
                        <source :src="imageUrl" type="video/ogg" />
                    </video>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item v-if="advType == 1" label="图片描述：" prop="advImgMemo">
                <el-input v-model="form.advImgMemo"></el-input>
            </el-form-item>

            <el-form-item :label="advType == 1 || advType == 3 || advType == 4 ? '广告排序：' : '弹框排序：'" prop="advOrder">
                <el-input type="number" v-model="form.advOrder"></el-input>
            </el-form-item>

            <el-form-item label="广告内容类型：" prop="contentType">
                <el-select clearable @change="changeContentType" v-model="form.contentType" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.contentTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="广告内容：" prop="content" style="position: relative">
                <el-input type="email" v-if="form.contentType == '1'" v-model="form.content"></el-input>
                <el-select
                    ref="scrollbar"
                    no-match-text=""
                    class="scrollSelect"
                    @change="changeContent"
                    clearable
                    v-else
                    v-model="form.contentName"
                    :filterable="form.contentType == 3"
                    remote
                    @blur="blurFun"
                    :remote-method="searchPro"
                    placeholder="">
                    <div v-if="form.contentType == 3">
                        <el-option v-for="(item, index) in contentList" :key="index" :label="item.name + '-' + item.value" :value="item.name"></el-option>
                    </div>
                    <div v-else>
                        <el-option v-for="(item, index) in contentList" :key="index" :label="item.name" :value="item.name"></el-option>
                    </div>
                    <div style="text-align: center">
                        <el-button :disabled="pageParams.pageNum <= 1" :size="size" type="text" @click.stop="prevPage">上一页</el-button>
                        <el-button :disabled="pageParams.pageNum >= this.pageParams.totalPage" :size="size" type="text" @click.stop="nextPage">下一页</el-button>
                        <span style="color: #ccc; font-size: 12px">当前页{{ pageParams.pageNum }}</span>
                        <span style="color: #ccc; font-size: 12px">总页数{{ pageParams.totalPage }}</span>
                    </div>
                </el-select>
            </el-form-item>

            <el-form-item v-if="advType == 1" label="广告目的：" prop="purpose">
                <el-select clearable v-model="form.purpose" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.advGoalList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="advType == 1" label="设计风格：" prop="advStyle">
                <el-select clearable v-model="form.advStyle" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.advStyleList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="advType == 1 || advType == 3" label="显示版本：" prop="ctVer">
                <el-input type="number" v-model="form.ctVer"></el-input>
            </el-form-item>

            <el-form-item label="广告系列：" prop="advSeriesId">
                <el-select clearable v-model="form.advSeriesId" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.advSeriesList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="advType == 2 || advType == 3" label="展现时间：" prop="appearPersistTime">
                <el-input type="number" v-model="form.appearPersistTime"></el-input>
            </el-form-item>

            <el-form-item v-if="advType == 2" label="弹窗频率：" prop="tipFrequency">
                <el-select clearable v-model="form.tipFrequency" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.popUpFrequencyList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="advType == 3" label="展现频率：" prop="tipFrequency">
                <el-select clearable v-model="form.tipFrequency" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.showFrequencyList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="可见用户：" prop="advVisibleUser">
                <el-select clearable v-model="form.advVisibleUser" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.availableUserList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="advType == 1 || advType == 2" label="监管沙盒：" prop="sandboxId">
                <el-input type="text" v-model="form.sandboxId"></el-input>
                <small>请输入产品ID</small>
            </el-form-item>
            <el-form-item label="显示时间：" prop="value1">
                <el-time-picker
                    @change="changeTime"
                    is-range
                    v-model="form.value1"
                    range-separator="~"
                    format="HH:mm"
                    value-format="HH:mm:ss"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
                </el-time-picker>
            </el-form-item>
            <el-form-item label="发布时间：" prop="value2">
                <el-date-picker
                    @change="changeDate"
                    v-model="form.value2"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="广告位置：" prop="advPositId">
                <el-select @change="advPositChange" clearable v-model="form.advPositId" placeholder="">
                    <el-option v-for="(item, index) in advertParamByTypeList.advPositionList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投放渠道：" prop="appFlag">
                <el-select clearable v-model="form.appFlag" multiple placeholder="请选择">
                    <el-option v-for="item in dvChannelList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投放设备：" prop="advPlatform">
                <el-select clearable v-model="form.advPlatform" multiple placeholder="请选择">
                    <el-option v-for="item in advDeviceList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btnCon">
                <el-button :size="size" type="primary" :loading="saveLoading" @click="onSubmit">提交</el-button>
                <el-button :size="size" @click="cancle()">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    // 接口函数依次：广告列表页查询
    import { addAdvert, forAdvertPage, getContentByContentType, forUpload, getFlagAndDeviceTypeByPosit } from "../../apis/index";
    export default {
        name: "addAdvert",
        components: {},
        data() {
            return {
                dvChannelList: [],
                advDeviceList: [],
                imageUrl: "",
                size: "small",
                saveLoading: false,
                proName: "",
                header: { token: sessionStorage.token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
                form: {
                    advTitle: "",
                    arrangementMode: "",
                    advImgUrl: "",
                    advImgMemo: "",
                    advOrder: "",
                    contentType: "",
                    content: "",
                    contentName: "",
                    purpose: "",
                    advStyle: "",
                    tipFrequency: "",
                    advVisibleUser: "",
                    sandboxId: "",
                    showStartTime: "",
                    showEndTime: "",
                    value1: ["00:00:00", "23:59:59"],
                    value2: "",
                    startTime: "",
                    endTime: "",
                    advertExtendList: "",
                    advPositId: "",
                    appFlag: "",
                    advPlatform: "",
                    advSeriesId: "",
                    showType: "",
                    appearPersistTime: "",
                    ctVer: ""
                },
                acceptType: "image/*",
                rules: {
                    appearPersistTime: [{ required: true, message: "请输入展现时间", trigger: "blur" }],
                    tipFrequency: [{ required: true, message: "请选择频率", trigger: "blur" }],
                    ctVer: [{ required: true, message: "请输入显示版本", trigger: "blur" }],
                    advPlatform: [{ required: true, message: "请选择投放设备", trigger: "blur" }],
                    appFlag: [{ required: true, message: "请选择投放渠道", trigger: "blur" }],
                    advTitle: [{ required: true, message: "请输入广告标题", trigger: "blur" }],
                    advImgUrl: [{ required: true, message: "请上传广告图片", trigger: "blur" }],
                    advOrder: [{ required: true, message: "请输入广告排序", trigger: "blur" }],
                    contentType: [{ required: true, message: "请选择广告内容", trigger: "blur" }],
                    showType: [{ required: true, message: "请选择展现形式", trigger: "blur" }],
                    advVisibleUser: [{ required: true, message: "请选择可见用户", trigger: "blur" }],
                    value1: [{ required: true, message: "请选择显示时间", trigger: "blur" }],
                    value2: [{ required: true, message: "请选择发布时间", trigger: "blur" }],
                    advPositId: [{ required: true, message: "请选择广告位置", trigger: "blur" }]
                },
                advertParamByTypeList: {},
                contentList: [],
                pageParams: {
                    pageSize: 10,
                    pageNum: 1,
                    totalPage: 0
                },
                contentTypeId: ""
            };
        },
        computed: {
            advType() {
                return this.$route.query.type;
            },
            advTypeTxt() {
                this.$nextTick(() => {
                    this.$refs.form.resetFields();
                    this.imageUrl = "";
                });
                let type = Number(this.$route.query.type);
                switch (type) {
                    case 1:
                        return "横幅广告";
                        break;
                    case 2:
                        return "弹窗广告";
                        break;
                    case 3:
                        return "开屏广告";
                        break;
                    case 4:
                        return "悬浮广告";
                        break;
                    default:
                        return "横幅广告";
                        break;
                }
            }
        },
        mounted() {
            // console.log(2)
        },
        created() {
            // console.log(1212)
            this.forAdvertPageFun();
            // this.$nextTick(() => {
            //   this.$refs.form.resetFields()
            // })
        },
        methods: {
            goBack() {
                history.go(-1);
            },
            changeType() {
                this.form.advImgUrl = "";
                this.imageUrl = "";
                if (this.form.showType == 2) {
                    this.acceptType = "video/*";
                } else {
                    this.acceptType = "image/*";
                }
            },
            // 搜索产品数据
            blurFun() {
                // console.log('广告内容事件')
                this.proName = "";
                this.searchPro(this.proName);
            },
            searchPro(query) {
                this.pageParams.pageNum = 1;
                console.log("searchPro", query);
                this.proName = document.getElementsByClassName("scrollSelect")[0].querySelector(".el-input__inner").value;
                let params = {
                    pageNum: 1,
                    pageSize: 10,
                    contentTypeId: this.contentTypeId,
                    name: this.proName
                };
                getContentByContentType(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.contentList = res.data.data;
                        this.pageParams.totalPage = Math.ceil(res.data.totalCount / this.pageParams.pageSize);
                        console.log("totalPage", this.pageParams.totalPage);
                        if (res.data.data.length == 0) {
                            console.log(this.$refs.scrollbar);
                            // .el-scrollbar
                            // document.getElementsByClassName('')
                        }
                    }
                });
            },
            // 广告内容上一页
            prevPage() {
                if (this.pageParams.pageNum <= 1) {
                    this.pageParams.pageNum = 1;
                } else {
                    this.pageParams.pageNum -= 1;
                }
                let params = {
                    pageNum: this.pageParams.pageNum,
                    pageSize: this.pageParams.pageSize,
                    contentTypeId: this.contentTypeId,
                    name: this.proName
                };
                getContentByContentType(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.contentList = res.data.data;
                        this.pageParams.totalPage = Math.ceil(res.data.totalCount / this.pageParams.pageSize);
                        console.log(this.pageParams.totalPage);
                    }
                });
            },
            // 广告内容下一页
            nextPage() {
                if (this.pageParams.pageNum >= this.pageParams.totalPage) {
                    this.pageParams.pageNum = this.pageParams.totalPage;
                } else {
                    this.pageParams.pageNum += 1;
                }
                let params = {
                    pageNum: this.pageParams.pageNum,
                    pageSize: this.pageParams.pageSize,
                    contentTypeId: this.contentTypeId,
                    name: this.proName
                };
                getContentByContentType(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.contentList = res.data.data;
                        this.pageParams.totalPage = Math.ceil(res.data.totalCount / this.pageParams.pageSize);
                        console.log(this.pageParams.totalPage);
                    }
                });
            },
            // 切换广告位置
            advPositChange() {
                this.form.appFlag = "";
                this.form.advPlatform = "";
                this.dvChannelList = [];
                this.advDeviceList = [];
                this.getFlagAndDeviceTypeByPositFun();
            },
            // 根据广告位置ID获取渠道和设备
            getFlagAndDeviceTypeByPositFun() {
                let params = {
                    positId: this.form.advPositId
                };
                getFlagAndDeviceTypeByPosit(params).then((res) => {
                    console.log("根据广告位置ID获取渠道和设备", res);
                    if (Number(res.code == 0)) {
                        this.dvChannelList = res.data.advChannelList;
                        this.advDeviceList = res.data.advDeviceList;
                    }
                });
            },

            changeTime(value) {
                console.log("显示时间", value);
                console.log(this.form.value1);
            },
            changeDate(value) {
                console.log("发布时间", value);
                console.log(this.form.value2);
            },
            // 初始化广告管理页面参数
            forAdvertPageFun() {
                let params = {
                    advType: this.advType
                };
                forAdvertPage(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.advertParamByTypeList = res.data;
                        let arr = [
                            {
                                name: "坚排",
                                value: "1"
                            },
                            {
                                name: "滚动排列",
                                value: "2"
                            }
                        ]; //排列方式--本地写死
                        this.advertParamByTypeList.arrangementList = arr;
                        console.log("初始化广告管理页面参数", this.advertParamByTypeList);
                    }
                });
            },
            // 广告内容切换
            changeContent(e) {
                this.contentList.forEach((i) => {
                    if (i.name == e) {
                        this.form.content = i.value;
                    }
                });
            },
            // 切换广告内容类型，广告内容变化
            changeContentType(value) {
                console.log("广告内容类型切换：", value);
                this.contentList = [];
                this.pageParams.totalPage = 0;
                this.pageParams.pageNum = 1;
                this.form.content = "";
                this.form.contentName = "";
                if (value == 1) {
                } else {
                    this.contentTypeId = value;
                    let params = {
                        pageNum: this.pageParams.pageNum,
                        pageSize: this.pageParams.pageSize,
                        contentTypeId: this.contentTypeId,
                        name: ""
                    };
                    getContentByContentType(params).then((res) => {
                        if (Number(res.code) === 0) {
                            this.contentList = res.data.data;
                            this.pageParams.totalPage = Math.ceil(res.data.totalCount / this.pageParams.pageSize);
                            console.log("totalPage", this.pageParams.totalPage);
                        }
                    });
                }
            },

            uploadCheckImg(params) {
                const _file = params.file;
                const isLt5M = _file.size / 1024 / 1024 < 30;
                if (!isLt5M) {
                    this.$message.error("请上传不能超过30M");
                    return false;
                }
                this.form.advImgUrl = "";
                this.imageUrl = "";
                this.form.advImgUrl = "";
                this.imageUrl = ``;
                var formData = new FormData();
                formData.append(params.uid, _file);
                formData.append("type", "11");
                forUpload(formData).then((res) => {
                    if (res.result) {
                        this.form.advImgUrl = res.data[0];
                        this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`;
                    } else {
                        this.$message.error(res.description);
                    }
                });
            },

            cancle() {
                this.$router.push({
                    path: `/advertList?type=${this.advType}`
                });
            },
            onSubmit() {
                this.saveLoading = true;
                let showStartTime = [];
                let showEndTime = [];
                let advertExtendList = [];
                let advImgList = [];
                showStartTime.push(`2020-07-11 ${this.form.value1[0]}`);
                showEndTime.push(`2020-07-11 ${this.form.value1[1]}`);
                advertExtendList.push({
                    advPositId: this.form.advPositId, // 广告位置
                    appFlag: this.form.appFlag.toString(), // 投放渠道
                    advPlatform: this.form.advPlatform.toString() // 投放设备
                });
                let df = {
                    advImgUrl: this.form.advImgUrl,
                    advImgMemo: this.form.advImgMemo
                };
                advImgList.push(df);

                this.$refs["form"].validate((valid) => {
                    let params = {};
                    if (valid) {
                        if (this.advType == "1") {
                            // 1:横幅 2:弹窗 3:开屏 4:悬浮
                            params = {
                                advType: this.advType, // 广告类型
                                showType: this.form.showType, // 展现形式
                                advTitle: this.form.advTitle, //广告标题
                                arrangementMode: this.form.arrangementMode, //排列方式
                                advOrder: this.form.advOrder, // 广告排序
                                contentType: this.form.contentType, // 广告内容类型
                                content: this.form.content, // 广告内容
                                purpose: this.form.purpose, // 广告目的
                                advStyle: this.form.advStyle, // 设计风格
                                advSeriesId: this.form.advSeriesId, // 广告系列
                                advVisibleUser: this.form.advVisibleUser, // 可见用户
                                sandboxId: this.form.sandboxId, //监管沙漏
                                showStartTime: showStartTime, // 显示开始时间
                                showEndTime: showEndTime, // 显示结束时间
                                startTime: this.form.value2[0], // 发布开始时间
                                endTime: this.form.value2[1], // 发布结束时间
                                advertExtendList: advertExtendList,
                                advImgList: advImgList,
                                ctVer: this.form.ctVer
                            };
                        } else if (this.advType == "2") {
                            params = {
                                advType: this.advType,
                                advTitle: this.form.advTitle, // 弹窗标题
                                contentType: this.form.contentType, // 广告内容类型
                                content: this.form.content, // 广告内容
                                advOrder: this.form.advOrder, // 弹窗排序
                                advSeriesId: this.form.advSeriesId, // 广告系列
                                appearPersistTime: this.form.appearPersistTime, // 展现时间
                                tipFrequency: this.form.tipFrequency, // 弹窗频率
                                advVisibleUser: this.form.advVisibleUser, // 可见用户
                                sandboxId: this.form.sandboxId, //监管沙漏
                                showStartTime: showStartTime, // 显示开始时间
                                showEndTime: showEndTime, // 显示结束时间
                                startTime: this.form.value2[0], // 发布开始时间
                                endTime: this.form.value2[1], // 发布结束时间
                                advertExtendList: advertExtendList,
                                advImgList: advImgList
                            };
                        } else if (this.advType == "3") {
                            params = {
                                advType: this.advType,
                                advTitle: this.form.advTitle, // 广告标题
                                showType: this.form.showType, // 展现形式
                                contentType: this.form.contentType, // 广告内容类型
                                content: this.form.content, // 广告内容
                                advSeriesId: this.form.advSeriesId, // 广告系列
                                advOrder: this.form.advOrder, // 广告排序
                                appearPersistTime: this.form.appearPersistTime, // 展现时间
                                tipFrequency: this.form.tipFrequency, // 展现频率
                                advVisibleUser: this.form.advVisibleUser, // 可见用户
                                showStartTime: showStartTime, // 显示开始时间
                                showEndTime: showEndTime, // 显示结束时间
                                startTime: this.form.value2[0], // 发布开始时间
                                endTime: this.form.value2[1], // 发布结束时间
                                advertExtendList: advertExtendList,
                                advImgList: advImgList,
                                ctVer: this.form.ctVer
                            };
                        } else if (this.advType == "4") {
                            params = {
                                advType: this.advType,
                                advTitle: this.form.advTitle, // 广告标题
                                showType: this.form.showType, // 展现形式
                                advSeriesId: this.form.advSeriesId, // 广告系列
                                contentType: this.form.contentType, // 广告内容类型
                                content: this.form.content, // 广告内容
                                advOrder: this.form.advOrder, // 广告排序
                                advVisibleUser: this.form.advVisibleUser, // 可见用户
                                showStartTime: showStartTime, // 显示开始时间
                                showEndTime: showEndTime, // 显示结束时间
                                startTime: this.form.value2[0], // 发布开始时间
                                endTime: this.form.value2[1], // 发布结束时间
                                advertExtendList: advertExtendList,
                                advImgList: advImgList
                            };
                        }
                        console.log("新增前入参", params);
                        addAdvert(params).then((res) => {
                            console.log("新增res", res);
                            if (Number(res.code) === 0) {
                                this.saveLoading = false;
                                this.$router.push({
                                    path: `/advertList?type=${this.advType}`
                                });
                            } else {
                                this.saveLoading = false;
                                this.$message.error("添加广告失败");
                            }
                        });
                    } else {
                        console.log(this.form);
                        this.saveLoading = false;
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .addAdvert {
        padding: 20px;
        .advTypeTxt {
            margin-bottom: 20px;
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
        /deep/ .el-date-editor {
            width: 400px;
        }
        /deep/ .el-form {
            width: 620px;
            margin: 0 auto;
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
        .btnCon {
            width: 400px;
            text-align: center;
        }
    }
</style>
