<template>
    <!--用户营销配置 银行 页面中 一级条件  组件 -->
    <div>
        <div class="contentDiv">
            <div class="configMsg" :class="index1 == oneLevelUserCondition.length - 1 ? 'lastClass' : ''" v-for="(item1, index1) in oneLevelUserCondition" :key="index1">
                <div v-if="item1.dataType != '3'">
                    <div>
                        <div class="addBig" v-if="item1.buyStatus == ''">
                            <span style="cursor: pointer" @click="addConfig('oneLevelUserCondition', index1)">编辑限制条件</span>
                            <i v-if="oneLevelUserCondition.filter((i) => i.dataType != '3').length > 1" @click="deleteFun('oneLevelUserCondition', index1)" class="el-icon-delete"></i>
                        </div>
                        <div class="addBigother" v-else>
                            <div class="content">
                                <i v-if="oneLevelUserCondition.filter((i) => i.dataType != '3').length > 1" @click="deleteFun('oneLevelUserCondition', index1, item1.id)" class="el-icon-delete"></i>
                                <i @click="EditFun('oneLevelUserCondition', index1, item1)" class="el-icon-edit"></i>
                                <div class="title" :class="item1.buyStatus == '0' ? 'noVisib' : ''">{{ item1.buyStatus == "0" ? "不可购买" : "可购买" }}条件</div>
                                <ul>
                                    <!-- 注册状态 -->
                                    <div v-if="item1.userRegStatus != '' && item1.userRegStatus != null">
                                        <span>注册状态与时间：</span>
                                        <li v-if="item1.userRegStatus == '0'">未注册}</li>
                                        <!-- 注册时间 -->
                                        <li v-if="(item1.regConnectionSymbol != '' && item1.regConnectionSymbol != null) || item1.userRegStatus == 1">
                                            已注册；{{ item1.regStartSymbol }}{{ item1.regStartTime }}{{ item1.regConnectionSymbol == 1 ? "且" : "" }}{{ item1.regConnectionSymbol == 2 ? "或" : ""
                                            }}{{ item1.regEndSymbol }}{{ item1.regEndTime }}
                                        </li>
                                        <li v-else-if="(item1.regStartTime != '' && item1.regStartTime != null) || item1.userRegStatus == 1">
                                            已注册；{{ item1.regStartSymbol }}{{ item1.regStartTime }}
                                        </li>
                                        <li v-else-if="(item1.regEndTime != '' && item1.regEndTime != null) || item1.userRegStatus == 1">已注册；{{ item1.regEndSymbol }}{{ item1.regEndTime }}</li>
                                    </div>

                                    <!-- 实名状态1实名0未实名 -->
                                    <div v-if="item1.realNameStatus != '' && item1.realNameStatus != null">
                                        <span>实名状态：</span>
                                        <li v-if="item1.realNameStatus != '' && item1.realNameStatus != null">{{ item1.realNameStatus == "1" ? "实名" : "未实名" }}</li>
                                    </div>

                                    <!-- 开户状态1开户0未开户 -->
                                    <span v-if="item1.openAccountStatus != '' && item1.openAccountStatus != null">开户状态：</span>
                                    <li v-if="item1.openAccountStatus != '' && item1.openAccountStatus != null">{{ item1.openAccountStatus == "1" ? "已开户" : "未开户" }}</li>

                                    <!-- 限制地域 -->
                                    <div v-if="item1.userRegionConditionList.length > 0 && item1.userRegionConditionList[0].province != ''">
                                        <span>限制地域：</span>
                                        <li v-for="(item2, index2) in item1.userRegionConditionList" :key="index2">
                                            <span v-if="item2.city == '' || item2.city == null">{{ item2.province }}；</span>
                                            <span v-else>{{ item2.province }}-{{ item2.city }}；</span>
                                            {{ item2.regPhoneNumCheck == "1" ? "注册手机号归属地" : "  " }}
                                            <span v-if="item2.idCardAddressCheck == '1' && item2.regPhoneNumCheck == '1'">、</span>
                                            {{ item2.idCardAddressCheck == "1" ? "身份证地址" : "  " }}
                                            <span v-if="item2.gpsLocationCheck == '1' && (item2.idCardAddressCheck == '1' || item2.regPhoneNumCheck == '1')">、</span>
                                            {{ item2.gpsLocationCheck == "1" ? "GPS地理位置  " : "" }}
                                        </li>
                                    </div>

                                    <!-- 产品展示的条件配置 -->

                                    <div>
                                        <span>活动：</span>
                                        <li>{{ item1.activityNameList.toString() }}</li>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <el-radio-group v-model="item1.condConnSymbol" :disabled="oneDisableRadio" class="radioGroup">
                        <el-radio-button @click.native.prevent="changeRadio(1, 'oneLevelUserCondition', index1)" label="1" value="1">且</el-radio-button>
                        <el-radio-button @click.native.prevent="changeRadio(2, 'oneLevelUserCondition', index1)" label="2" value="2">或</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div v-for="(items, index5) in oneLevelUserCondition.filter((i) => i.dataType != '3')" :key="index5">
                <div class="addSmall" v-if="index5 == oneLevelUserCondition.filter((i) => i.dataType != '3').length - 1">
                    <span style="cursor: pointer" @click="addERJI('oneLevelUserCondition')">新增条件</span>
                </div>
            </div>
            <el-radio-group v-model="oneAndTwoLevelSymbol" :disabled="disabledRadio2" class="radioGroup2">
                <el-radio-button label="1" value="1">且</el-radio-button>
                <el-radio-button label="2" value="2">或</el-radio-button>
            </el-radio-group>
            <!-- 二级 -->
            <div style="margin-top: 20px" v-if="showtwoLevelUserCondition">
                <div class="configMsg" :class="index1 == twoLevelUserCondition.length - 1 ? 'lastClass' : ''" v-for="(item1, index1) in twoLevelUserCondition" :key="index1">
                    <div v-if="item1.dataType != '3'">
                        <div>
                            <div class="addBig" v-if="item1.buyStatus == ''">
                                <span style="cursor: pointer" @click="addConfig('twoLevelUserCondition', index1)">编辑限制条件</span>
                                <i @click="deleteFun('twoLevelUserCondition', index1)" class="el-icon-delete"></i>
                            </div>
                            <div class="addBigother" v-else>
                                <!-- <ul>-->
                                <!-- <div class='contentDiv' v-for='(item,index) in scope.row.twoLevelUserCondition' :key='index'> -->
                                <div class="content">
                                    <i @click="deleteFun('twoLevelUserCondition', index1, item1.id)" class="el-icon-delete"></i>
                                    <i @click="EditFun('twoLevelUserCondition', index1, item1)" class="el-icon-edit"></i>
                                    <div class="title" :class="item1.buyStatus == '0' ? 'noVisib' : ''">{{ item1.buyStatus == "0" ? "不可购买" : "可购买" }}条件</div>
                                    <ul>
                                        <!-- 注册状态 -->
                                        <div v-if="item1.userRegStatus != '' && item1.userRegStatus != null">
                                            <span>注册状态与时间：</span>
                                            <li v-if="item1.userRegStatus == '0'">未注册</li>
                                            <!-- 注册时间 -->
                                            <li v-if="(item1.regConnectionSymbol != '' && item1.regConnectionSymbol != null) || item1.userRegStatus == 1">
                                                已注册；{{ item1.regStartSymbol }}{{ item1.regStartTime }}{{ item1.regConnectionSymbol == 1 ? "且" : "" }}{{ item1.regConnectionSymbol == 2 ? "或" : ""
                                                }}{{ item1.regEndSymbol }}{{ item1.regEndTime }}
                                            </li>
                                            <li v-else-if="(item1.regStartTime != '' && item1.regStartTime != null) || item1.userRegStatus == 1">
                                                已注册；{{ item1.regStartSymbol }}{{ item1.regStartTime }}
                                            </li>
                                            <li v-else-if="(item1.regEndTime != '' && item1.regEndTime != null) || item1.userRegStatus == 1">已注册；{{ item1.regEndSymbol }}{{ item1.regEndTime }}</li>
                                        </div>

                                        <!-- 实名状态1实名0未实名 -->
                                        <div v-if="item1.realNameStatus != '' && item1.realNameStatus != null">
                                            <span>实名状态：</span>
                                            <li v-if="item1.realNameStatus != '' && item1.realNameStatus != null">{{ item1.realNameStatus == "1" ? "实名" : "未实名" }}</li>
                                        </div>

                                        <!-- 开户状态1开户0未开户 -->
                                        <span v-if="item1.openAccountStatus != '' && item1.openAccountStatus != null">开户状态：</span>
                                        <li v-if="item1.openAccountStatus != '' && item1.openAccountStatus != null">{{ item1.openAccountStatus == "1" ? "已开户" : "未开户" }}</li>
                                        <!-- 限制地域 -->
                                        <div v-if="item1.userRegionConditionList.length > 0 && item1.userRegionConditionList[0].province != ''">
                                            <span>限制地域：</span>
                                            <li v-for="(item2, index2) in item1.userRegionConditionList" :key="index2">
                                                <span v-if="item2.city == '' || item2.city == null">{{ item2.province }}；</span>
                                                <span v-else>{{ item2.province }}-{{ item2.city }}；</span>
                                                {{ item2.regPhoneNumCheck == "1" ? "注册手机号归属地" : "  " }}
                                                <span v-if="item2.idCardAddressCheck == '1' && item2.regPhoneNumCheck == '1'">、</span>
                                                {{ item2.idCardAddressCheck == "1" ? "身份证地址" : "  " }}
                                                <span v-if="item2.gpsLocationCheck == '1' && (item2.idCardAddressCheck == '1' || item2.regPhoneNumCheck == '1')">、</span>
                                                {{ item2.gpsLocationCheck == "1" ? "GPS地理位置  " : "" }}
                                            </li>
                                        </div>
                                        <div>
                                            <span>活动：</span>
                                            <li>{{ item1.activityNameList.toString() }}</li>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <el-radio-group v-model="item1.condConnSymbol" :disabled="twoDisableRadio" class="radioGroup">
                            <el-radio-button @click.native.prevent="changeRadio(1, 'twoLevelUserCondition', index1)" label="1" value="1">且</el-radio-button>
                            <el-radio-button @click.native.prevent="changeRadio(2, 'twoLevelUserCondition', index1)" label="2" value="2">或</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div v-for="(items, index5) in twoLevelUserCondition.filter((i) => i.dataType != '3')" :key="index5">
                    <div class="addSmall" v-if="index5 == twoLevelUserCondition.filter((i) => i.dataType != '3').length - 1">
                        <span style="cursor: pointer" @click="addERJI('twoLevelUserCondition')">新增条件</span>
                    </div>
                </div>
            </div>
            <div class="addBtn" v-if="!showtwoLevelUserCondition || twoLevelUserCondition.length == 0">
                <span style="cursor: pointer" @click="addBigFun">新增条件</span>
            </div>
        </div>

        <el-dialog title="配置条件" fullscreen modal="false" destroy-on-close width="90%" :visible.sync="dialogVisible">
            <user-marke-config @childFun="childFun" :dialogVisible="dialogVisible" :formData="form"></user-marke-config>
        </el-dialog>
    </div>
</template>
<script>
    import userMarkeConfig from "./userMarketMangeConfig";
    import { ExternalLinkBankPrdselectOne } from "../../../apis/index";
    export default {
        components: { userMarkeConfig },
        data() {
            return {
                dialogVisible: false,
                oneLevelUserCondition: [
                    {
                        ageConnSymbol: "",
                        ageEndSymbol: "",
                        ageStartSymbol: "",
                        buyStatus: "",
                        displayConditon: {},
                        holdSharesPeakValueConnSymbol: "",
                        holdSharesPeakValueEndAmount: "",
                        holdSharesPeakValueEndSymbol: "",
                        holdSharesPeakValueStartAmount: "",
                        holdSharesPeakValueStartSymbol: "",
                        holdSharesStatus: "",
                        investmentStatus: "",
                        openAccountStatus: "",
                        positionAndTime: "",
                        prdShowConditons: [],
                        realNameStatus: "",
                        regConnectionSymbol: "",
                        regEndSymbol: "",
                        regEndTime: "",
                        regStartSymbol: "",
                        regStartTime: "",
                        userEndAge: "",
                        userRegStatus: "",
                        userRegionConditionList: [],
                        userStartAge: "",
                        condConnSymbol: 1
                    }
                ],
                twoLevelUserCondition: [
                    {
                        ageConnSymbol: "",
                        ageEndSymbol: "",
                        ageStartSymbol: "",
                        buyStatus: "",
                        displayConditon: {},
                        holdSharesPeakValueConnSymbol: "",
                        holdSharesPeakValueEndAmount: "",
                        holdSharesPeakValueEndSymbol: "",
                        holdSharesPeakValueStartAmount: "",
                        holdSharesPeakValueStartSymbol: "",
                        holdSharesStatus: "",
                        investmentStatus: "",
                        openAccountStatus: "",
                        positionAndTime: "",
                        prdShowConditons: [],
                        realNameStatus: "",
                        regConnectionSymbol: "",
                        regEndSymbol: "",
                        regEndTime: "",
                        regStartSymbol: "",
                        regStartTime: "",
                        userEndAge: "",
                        userRegStatus: "",
                        userRegionConditionList: [],
                        userStartAge: "",
                        condConnSymbol: 1
                    }
                ],
                oneAndTwoLevelSymbol: 2,
                disabledRadio2: false, // 一级的逻辑关系是否是可选
                oneDisableRadio: false, // 第一个 二级逻辑关系是否是可选
                twoDisableRadio: false, // 第一个 二级逻辑关系是否是可选
                type: "", // 新增条件时一级 还是二级
                index: 0, // 当前新增条件是第几项
                showtwoLevelUserCondition: false,
                form: "" // 编辑二级时把数据带到 子组件
            };
        },
        created() {
            if (this.$route.query.id) {
                this.BankPrdselectOneFun();
            }
        },
        watch: {
            oneAndTwoLevelSymbol() {
                let obj = {
                    twoLevelUserCondition: this.twoLevelUserCondition,
                    oneLevelUserCondition: this.oneLevelUserCondition,
                    oneAndTwoLevelSymbol: this.oneAndTwoLevelSymbol
                };
                this.$emit("getconfigMsgData", obj);
            }
        },
        computed: {
            configMsgData() {
                let obj = {
                    oneLevelUserCondition: this.oneLevelUserCondition,
                    twoLevelUserCondition: this.twoLevelUserCondition
                };
                return obj;
            }
        },
        methods: {
            // 切换状态
            changeRadio(e, type, index) {
                if (type == "twoLevelUserCondition") {
                    this.twoLevelUserCondition[index].condConnSymbol = Number(e);
                }
                if (type == "oneLevelUserCondition") {
                    this.oneLevelUserCondition[index].condConnSymbol = Number(e);
                }

                let obj = {
                    twoLevelUserCondition: this.twoLevelUserCondition,
                    oneLevelUserCondition: this.oneLevelUserCondition,
                    oneAndTwoLevelSymbol: this.oneAndTwoLevelSymbol
                };
                console.log("obj", obj);
                this.$forceUpdate();
                this.$emit("getconfigMsgData", obj);
            },
            // 获取详情
            BankPrdselectOneFun() {
                let params = {
                    headerModel: {
                        systemType: "h5",
                        message: "单个查询产品或银行的配置",
                        requesttime: Date.parse(new Date()),
                        version: "",
                        token: "",
                        deviceId: "",
                        appFlag: "",
                        loginUid: ""
                    },
                    datatypeParam: {
                        id: this.$route.query.id,
                        productOrBank: "2" //1产品2银行
                    }
                };
                ExternalLinkBankPrdselectOne(params).then((res) => {
                    if (res.headerModel.code == 0) {
                        this.oneLevelUserCondition = res.datatypeParam.oneLevelUserCondition;
                        this.twoLevelUserCondition = res.datatypeParam.twoLevelUserCondition;
                        this.oneAndTwoLevelSymbol = res.datatypeParam.oneAndTwoLevelSymbol;
                        if (this.twoLevelUserCondition.length > 0 && this.twoLevelUserCondition[0].buyStatus != "") {
                            this.showtwoLevelUserCondition = true;
                        }

                        let obj = {
                            twoLevelUserCondition: this.twoLevelUserCondition,
                            oneLevelUserCondition: this.oneLevelUserCondition,
                            oneAndTwoLevelSymbol: this.oneAndTwoLevelSymbol
                        };
                        this.$emit("getconfigMsgData", obj);
                    } else {
                        this.$message.info(res.headerModel.message);
                    }
                });
            },
            // 子组件点击提交的方法
            childFun(form) {
                console.log("form", form);
                this.dialogVisible = false;
                if (this.type == "oneLevelUserCondition") {
                    this.oneLevelUserCondition[this.index] = form;
                } else if (this.type == "twoLevelUserCondition") {
                    this.twoLevelUserCondition[this.index] = form;
                }
                let obj = {
                    twoLevelUserCondition: this.twoLevelUserCondition,
                    oneLevelUserCondition: this.oneLevelUserCondition,
                    oneAndTwoLevelSymbol: this.oneAndTwoLevelSymbol
                };
                this.$emit("getconfigMsgData", obj);
            },
            // 一级 新增条件
            addBigFun() {
                (this.twoLevelUserCondition = [
                    {
                        ageConnSymbol: "",
                        ageEndSymbol: "",
                        ageStartSymbol: "",
                        buyStatus: "",
                        displayConditon: {},
                        holdSharesPeakValueConnSymbol: "",
                        holdSharesPeakValueEndAmount: "",
                        holdSharesPeakValueEndSymbol: "",
                        holdSharesPeakValueStartAmount: "",
                        holdSharesPeakValueStartSymbol: "",
                        holdSharesStatus: "",
                        investmentStatus: "",
                        openAccountStatus: "",
                        positionAndTime: "",
                        prdShowConditons: [],
                        realNameStatus: "",
                        regConnectionSymbol: "",
                        regEndSymbol: "",
                        regEndTime: "",
                        regStartSymbol: "",
                        regStartTime: "",
                        userEndAge: "",
                        userRegStatus: "",
                        userRegionConditionList: [],
                        userStartAge: "",
                        condConnSymbol: 1
                    }
                ]),
                    (this.showtwoLevelUserCondition = true);
                // this.lists.push(obj)
            },
            // 二级 新增条件
            addERJI(type) {
                console.log(type);
                let obj = {
                    condConnSymbol: 1,
                    ageConnSymbol: "",
                    ageEndSymbol: "",
                    ageStartSymbol: "",
                    buyStatus: "",
                    displayConditon: {},
                    holdSharesPeakValueConnSymbol: "",
                    holdSharesPeakValueEndAmount: "",
                    holdSharesPeakValueEndSymbol: "",
                    holdSharesPeakValueStartAmount: "",
                    holdSharesPeakValueStartSymbol: "",
                    holdSharesStatus: "",
                    investmentStatus: "",
                    openAccountStatus: "",
                    positionAndTime: "",
                    prdShowConditons: [],
                    realNameStatus: "",
                    regConnectionSymbol: "",
                    regEndSymbol: "",
                    regEndTime: "",
                    regStartSymbol: "",
                    regStartTime: "",
                    userEndAge: "",
                    userRegStatus: "",
                    userRegionConditionList: [],
                    userStartAge: ""
                };
                if (type === "oneLevelUserCondition") {
                    this.oneLevelUserCondition.push(obj);
                }
                if (type === "twoLevelUserCondition") {
                    this.twoLevelUserCondition.push(obj);
                }
            },
            // 编辑限制条件
            addConfig(type, index) {
                console.log(index);
                this.form = "";
                this.type = type;
                this.index = index;
                this.dialogVisible = true;
            },
            // 删除二级
            deleteFun(type, index, id) {
                if (type == "oneLevelUserCondition") {
                    // this.oneLevelUserCondition.splice(index,1)
                    this.oneLevelUserCondition[index].dataType = "3";
                    this.$forceUpdate();
                } else if (type == "twoLevelUserCondition") {
                    // this.twoLevelUserCondition.splice(index,1)
                    this.twoLevelUserCondition[index].dataType = "3";
                    let onlyAAarr = this.twoLevelUserCondition.filter((i) => i.dataType != "3");
                    if (onlyAAarr.length == 0) {
                        this.showtwoLevelUserCondition = false;
                    }
                    this.$forceUpdate();
                }
                let obj = {
                    twoLevelUserCondition: this.twoLevelUserCondition,
                    oneLevelUserCondition: this.oneLevelUserCondition,
                    oneAndTwoLevelSymbol: this.oneAndTwoLevelSymbol
                };
                this.$emit("getconfigMsgData", obj);
            },
            // 编辑
            EditFun(type, index, form) {
                console.log("编辑数据", form);
                this.index = index;
                this.type = type;
                this.dialogVisible = true;
                // this.form=form
                this.form = JSON.stringify(form);
            }
        }
    };
</script>
<style lang="less" scoped>
    .contentDiv {
        margin-bottom: 20px;
    }

    .content {
        background: #f1f1f1;
        padding: 10px;
        position: relative;
        .el-icon-delete {
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 40px;
            font-size: 26px;
        }
        .el-icon-edit {
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 70px;
            font-size: 26px;
        }
        .title {
            color: #409eff;
        }
        .noVisib {
            color: red;
        }
        ul {
            > div {
                display: flex;
                flex-wrap: wrap;
                margin-top: 10px;
                span {
                    width: max-content;
                    margin-top: 10px;
                }
            }
            li {
                display: inline-block;
                width: max-content;
                padding: 0px 10px;
                border: 1px solid #333;
                margin: 10px 10px 0 0;
                border-radius: 10px;
            }
        }
    }

    .configMsg {
        border-left: 6px solid #409eff;
        > div {
            padding-bottom: 30px;
        }
        .addBig {
            position: relative;
            width: 100%;
            background: #f1f1f1;
            min-height: 80px;
            line-height: 80px;
            text-align: center;
            margin-bottom: 20px;
            .el-icon-delete {
                cursor: pointer;
                position: absolute;
                top: 10px;
                right: 40px;
                font-size: 26px;
            }
        }
        .addBigother {
            margin-bottom: 20px;
        }
        .radioGroup,
        .addSmall {
            margin-left: 10px;
        }
    }
    .addSmall {
        margin-top: 20px;
        border: 1px dashed #ccc;
        padding: 0 50px;
        width: 80px;
        text-align: center;
    }
    .lastClass {
        padding-bottom: 0;
    }
    .radioGroup2 {
        margin-top: 20px;
    }
    .addBtn {
        width: 100%;
        text-align: center;
        border: 1px dashed #ccc;
        margin-top: 20px;
    }
    /deep/ .el-dialog__header {
        border-bottom: 1px solid #ccc;
    }
</style>
