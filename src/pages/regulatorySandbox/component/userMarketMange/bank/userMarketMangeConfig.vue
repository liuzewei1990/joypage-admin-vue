<template>
    <!--  用户营销配置 产品   配置条件  -->
    <div class="config">
        <!-- <div class='title'>配置条件</div> -->
        <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="180px">
            <el-form-item label="配置条件可见状态：" prop="conditionVisible">
                <el-radio v-model="form.conditionVisible" label="1">可见条件</el-radio>
                <el-radio v-model="form.conditionVisible" label="0">不可见条件</el-radio>
            </el-form-item>
            <h5>用户管理配置</h5>
            <el-form-item label="年龄：" prop="age" v-if="newNeedStatus">
                <div class="ageDiv">
                    <div>
                        <el-select v-model="form.ageStartSymbol" class="fanwei" clearable>
                            <el-option value="<" label="<"></el-option>
                            <el-option value=">" label=">"></el-option>
                            <el-option value="<=" label="<="></el-option>
                            <el-option value=">=" label=">="></el-option>
                        </el-select>
                        <el-input placeholder="请输入年龄" maxlength="3" type="number" v-model="form.userStartAge"></el-input>岁
                    </div>
                    <!-- 1并且、2或者 -->
                    <el-radio-group v-model="form.ageConnSymbol" class="radioGroup">
                        <el-radio-button @click.native.prevent="radioClickage('1')" label="1" value="1">且</el-radio-button>
                        <el-radio-button @click.native.prevent="radioClickage('2')" label="2" value="2">或</el-radio-button>
                    </el-radio-group>
                    <div>
                        <el-select v-model="form.ageEndSymbol" class="fanwei" clearable>
                            <el-option value="<" label="<"></el-option>
                            <el-option value=">" label=">"></el-option>
                            <el-option value="<=" label="<="></el-option>
                            <el-option value=">=" label=">="></el-option>
                        </el-select>
                        <el-input placeholder="请输入年龄" maxlength="3" type="number" v-model="form.userEndAge"></el-input>岁
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="比财注册状态与时间：" prop="RegTime">
                <div class="staTime">
                    <div>
                        <span>状态：</span>
                        <!-- 1已经注册0注册 -->
                        <!-- @click.native.prevent="radioClickURS('1')" -->
                        <el-radio v-model="form.userRegStatus" label="1">已登陆</el-radio>
                        <el-radio v-model="form.userRegStatus" label="0">未登陆</el-radio>
                        <!-- @click.native.prevent="radioClickURS('0')" -->
                    </div>
                    <div v-if="newNeedStatus">
                        <span>配置时间：</span>
                        <!-- >,<,<=,>= -->
                        <el-select :disabled="form.userRegStatus == '' || form.userRegStatus == '0'" v-model="form.regStartSymbol" class="fanwei" clearable>
                            <el-option value="<" label="<"></el-option>
                            <el-option value=">" label=">"></el-option>
                            <el-option value="<=" label="<="></el-option>
                            <el-option value=">=" label=">="></el-option>
                        </el-select>
                        <el-date-picker
                            :disabled="form.userRegStatus == '' || form.userRegStatus == '0'"
                            v-model="form.regStartTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            :placeholder="form.userRegStatus == '' ? '请选择注册状态' : '选择日期'">
                        </el-date-picker>
                        <el-radio-group :disabled="form.userRegStatus == '' || form.userRegStatus == '0'" v-model="form.regConnectionSymbol" class="radioGroup">
                            <el-radio-button @click.native.prevent="radioClickaRS('1')" label="1" value="1">且</el-radio-button>
                            <el-radio-button @click.native.prevent="radioClickaRS('2')" label="2" value="2">或</el-radio-button>
                        </el-radio-group>
                        <el-select :disabled="form.userRegStatus == '' || form.userRegStatus == '0'" v-model="form.regEndSymbol" class="fanwei" clearable>
                            <el-option value="<" label="<"></el-option>
                            <el-option value=">" label=">"></el-option>
                            <el-option value="<=" label="<="></el-option>
                            <el-option value=">=" label=">="></el-option>
                        </el-select>
                        <el-date-picker
                            :disabled="form.userRegStatus == '' || form.userRegStatus == '0'"
                            v-model="form.regEndTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            :placeholder="form.userRegStatus == '' ? '请选择注册状态' : '选择日期'">
                        </el-date-picker>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="普惠账户是否开通：">
                <!-- @click.native.prevent="radioClickPOAS('1')" -->
                <el-radio v-model="form.puhuiOpenAccountStatus" label="1">已开户</el-radio>
                <el-radio v-model="form.puhuiOpenAccountStatus" label="0">未开户</el-radio>
                <!-- @click.native.prevent="radioClickPOAS('0')" -->
            </el-form-item>
            <template v-if="newNeedStatus">
                <el-form-item label="比财实名状态：">
                    <el-radio v-model="form.realNameStatus" @click.native.prevent="radioClickRNS('1')" label="1">已实名</el-radio>
                    <el-radio v-model="form.realNameStatus" @click.native.prevent="radioClickRNS('0')" label="0">未实名</el-radio>
                </el-form-item>
                <el-form-item label="比财开户状态：">
                    <el-radio v-model="form.openAccountStatus" @click.native.prevent="radioClickOAC('1')" label="1">已开户</el-radio>
                    <el-radio v-model="form.openAccountStatus" @click.native.prevent="radioClickOAC('0')" label="0">未开户</el-radio>
                </el-form-item>
                <el-form-item label="比财投资状态：">
                    <el-radio v-model="form.investmentStatus" @click.native.prevent="radioClickIS('1')" label="1">已投资</el-radio>
                    <el-radio v-model="form.investmentStatus" @click.native.prevent="radioClickIS('0')" label="0">未投资</el-radio>
                </el-form-item>
                <el-form-item label="比财持仓状态：">
                    <el-radio v-model="form.holdSharesStatus" @click.native.prevent="radioClickHSS('1')" label="1">有持仓</el-radio>
                    <el-radio v-model="form.holdSharesStatus" @click.native.prevent="radioClickHSS('0')" label="0">无持仓</el-radio>
                </el-form-item>
                <el-form-item label="比财持仓峰值：" prop="BCFZ">
                    <div class="chicangfengzhi">
                        <div>
                            <el-select v-model="form.holdSharesPeakValueStartSymbol" class="fanwei" clearable>
                                <el-option value="<" label="<"></el-option>
                                <el-option value=">" label=">"></el-option>
                                <el-option value="<=" label="<="></el-option>
                                <el-option value=">=" label=">="></el-option>
                            </el-select>
                            <span style="position: relative">
                                <el-input placeholder="请输入金额" slot="reference" v-model="form.holdSharesPeakValueStartAmount"></el-input>元
                                <el-popover
                                    style="position: absolute; top: 30px; right: 100px; width: max-content"
                                    v-model="showHS"
                                    placement="bottom"
                                    trigger="manual"
                                    :content="danweiholdSharesPeakValueStartAmount">
                                </el-popover>
                            </span>
                        </div>
                        <el-radio-group v-model="form.holdSharesPeakValueConnSymbol" class="radioGroup">
                            <el-radio-button @click.native.prevent="radioClickhold('1')" label="1" value="1">且</el-radio-button>
                            <el-radio-button @click.native.prevent="radioClickhold('2')" label="2" value="2">或</el-radio-button>
                        </el-radio-group>
                        <div>
                            <el-select v-model="form.holdSharesPeakValueEndSymbol" class="fanwei" clearable>
                                <el-option value="<" label="<"></el-option>
                                <el-option value=">" label=">"></el-option>
                                <el-option value="<=" label="<="></el-option>
                                <el-option value=">=" label=">="></el-option>
                            </el-select>
                            <span style="position: relative">
                                <el-input slot="reference" placeholder="请输入金额" v-model="form.holdSharesPeakValueEndAmount"></el-input>元
                                <el-popover
                                    style="position: absolute; top: 30px; right: 100px; width: max-content"
                                    v-model="showHE"
                                    placement="bottom"
                                    trigger="manual"
                                    :content="danweiholdSharesPeakValueEndAmount">
                                </el-popover>
                            </span>
                        </div>
                    </div>
                </el-form-item>
            </template>

            <el-form-item label="本银行开户状态：">
                <!--  @click.native.prevent="radioClickLOAC('1')" -->
                <el-radio v-model="form.localBankOpenAccountStatus" label="1">已开户</el-radio>
                <el-radio v-model="form.localBankOpenAccountStatus" label="0">未开户</el-radio>
                <!-- @click.native.prevent="radioClickLOAC('0')"  -->
            </el-form-item>
            <template v-if="newNeedStatus">
                <el-form-item label="本银行投资状态：">
                    <el-radio v-model="form.localBankInvestmentStatus" @click.native.prevent="radioClicLkIS('1')" label="1">已投资</el-radio>
                    <el-radio v-model="form.localBankInvestmentStatus" @click.native.prevent="radioClicLkIS('0')" label="0">未投资</el-radio>
                </el-form-item>
                <el-form-item label="本银行持仓状态：">
                    <el-radio v-model="form.localBankHoldSharsStatus" @click.native.prevent="radioClickLHSS('1')" label="1">有持仓</el-radio>
                    <el-radio v-model="form.localBankHoldSharsStatus" @click.native.prevent="radioClickLHSS('0')" label="0">无持仓</el-radio>
                </el-form-item>
                <el-form-item label="本银行持仓峰值：" prop="BYHFZ">
                    <div class="chicangfengzhi">
                        <div>
                            <el-select v-model="form.localBankHoldPeakValueStartSymbol" class="fanwei" clearable>
                                <el-option value="<" label="<"></el-option>
                                <el-option value=">" label=">"></el-option>
                                <el-option value="<=" label="<="></el-option>
                                <el-option value=">=" label=">="></el-option>
                            </el-select>

                            <span style="position: relative">
                                <el-input placeholder="请输入金额" slot="reference" v-model="form.localBankHoldPeakValueStartAmount"></el-input>元
                                <el-popover
                                    style="position: absolute; top: 30px; right: 100px; width: max-content"
                                    v-model="showLS"
                                    placement="bottom"
                                    trigger="manual"
                                    :content="danweilocalBankHoldPeakValueStartAmount">
                                </el-popover>
                            </span>
                        </div>
                        <el-radio-group v-model="form.localBankHoldPeakValueConnSymbol" class="radioGroup">
                            <el-radio-button @click.native.prevent="radioClicklocal('1')" label="1" value="1">且</el-radio-button>
                            <el-radio-button @click.native.prevent="radioClicklocal('2')" label="2" value="2">或</el-radio-button>
                        </el-radio-group>
                        <div>
                            <el-select v-model="form.localBankHoldPeakValueEndSymbol" class="fanwei" clearable>
                                <el-option value="<" label="<"></el-option>
                                <el-option value=">" label=">"></el-option>
                                <el-option value="<=" label="<="></el-option>
                                <el-option value=">=" label=">="></el-option>
                            </el-select>
                            <span style="position: relative">
                                <el-input placeholder="请输入金额" slot="reference" v-model="form.localBankHoldPeakValueEndAmount"></el-input>元
                                <el-popover
                                    style="position: absolute; top: 30px; right: 100px; width: max-content"
                                    v-model="showLE"
                                    placement="bottom"
                                    trigger="manual"
                                    :content="danweilocalBankHoldPeakValueEndAmount">
                                </el-popover>
                            </span>
                        </div>
                    </div>
                </el-form-item>
            </template>

            <el-form-item label="限制地域：" prop="eareVl">
                <div v-for="(ITEMS1, index11) in form.userRegionConditions" :key="index11">
                    <div class="area">
                        <el-select placeholder="请选择省" clearable v-model="ITEMS1.province" @change="changePrv(ITEMS1, 'prv')">
                            <el-option v-for="(item, index) in prvList" :label="item.provinceName" :value="item.provinceName" :key="index">{{ item.provinceName }}</el-option>
                        </el-select>
                        <el-select v-model="ITEMS1.city" clearable :disabled="ITEMS1.province == ''" @focus="changePrv(ITEMS1, 'city')">
                            <el-option v-for="(item, index) in cityList" :label="item.citysName" :value="item.citysName" :key="index">{{ item.citysName }}</el-option>
                        </el-select>
                        <div>
                            <span>请选择限制条件：</span>
                            <el-checkbox v-model="ITEMS1.regPhoneNumCheck">注册手机号归属地</el-checkbox>
                            <el-checkbox v-model="ITEMS1.idCardAddressCheck">身份证地址</el-checkbox>
                            <el-checkbox v-model="ITEMS1.gpsLocationCheck">GPS地理位置</el-checkbox>
                            <i @click="delArea(index11)" v-if="form.userRegionConditions.length > 1" class="el-icon-delete"></i>
                        </div>
                    </div>
                    <div>或</div>
                </div>
                <div>
                    <div class="addClass">
                        <span @click="addArea">新增限制地域</span>
                    </div>
                </div>
            </el-form-item>

            <h5>
                营销管理配置
                <small style="color: red; display: inline">(*以下条件至少配置一项)</small>
                <el-button :size="size" @click="prdShowCheckAll" type="primary">以下全选</el-button>
            </h5>
            <el-form-item class="cpzswz" label="展示位置与时间：">
                <div style="height: 30px"></div>
                <div v-for="(item, index) in form.prdShowConditons" :key="index" style="background: #f1f1f1; padding: 10px; min-height: 160px; position: relative">
                    <div>
                        <i v-if="form.prdShowConditons.length > 1" @click="deletePosition(index)" style="position: absolute; top: 10px; right: 10px; font-size: 1.6em" class="el-icon-delete"></i>
                        <span class="label">产品展示位置:</span>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">此处设置的为本银行所有产品展示位置，银行有<br />规则产品无规则时，所有产品沿用银行规则，当产品<br />有规则时不沿用银行规则。</div>
                            <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                        <el-select v-model="item.prdDisplayLocations" multiple filterable clearable placeholder="请选择产品展示位置">
                            <el-option v-for="item in prdshowList" :key="item.id" :label="item.name" :value="item.id.toString()"> </el-option>
                        </el-select>
                    </div>
                    <div style="display: flex" v-if="newNeedStatus">
                        <span>时间：</span>
                        <div>
                            <el-radio v-model="item.dateType" @click.native="clickDataType(index)" :disabled="item.prdDisplayLocations.length == 0" label="1" value="1">日期</el-radio>
                            <el-radio v-model="item.dateType" @click.native="clickDataType(index, 'zhouqi')" :disabled="item.prdDisplayLocations.length == 0" label="2" value="2">周期</el-radio>
                            <span v-if="item.prdDisplayLocations.length == 0">请选择产品展示位置</span>
                            <div v-if="item.dateType == '1'">
                                <el-date-picker
                                    @change="changeStarttime(index)"
                                    v-model="item.dateStart"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="开始时间">
                                </el-date-picker>
                                <span class="top">至</span>

                                <el-date-picker
                                    @change="changeEndtime(index)"
                                    v-model="item.dateEnd"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    placeholder="结束时间（可选）">
                                </el-date-picker>
                            </div>
                            <div v-if="item.dateType == '2'">
                                <el-select v-model="item.weekCode" filterable multiple clearable placeholder="请选择周期">
                                    <el-option label="周一" value="1"></el-option>
                                    <el-option label="周二" value="2"></el-option>
                                    <el-option label="周三" value="3"></el-option>
                                    <el-option label="周四" value="4"></el-option>
                                    <el-option label="周五" value="5"></el-option>
                                    <el-option label="周六" value="6"></el-option>
                                    <el-option label="周日" value="7"></el-option>
                                </el-select>
                                <el-time-picker v-model="item.dateStart" format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" default-value="2017-12-12 00:00:00" placeholder="开始时间">
                                </el-time-picker>
                                <el-time-picker v-model="item.dateEnd" format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" default-value="2017-12-12 23:59:59" placeholder="结束时间">
                                </el-time-picker>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="background: #f1f1f1; padding: 10px; text-align: center" v-if="newNeedStatus">
                    <span @click="addXZWZSJ" style="cursor: pointer">
                        <i class="el-icon-plus"></i>
                        新增限制位置时间</span
                    >
                </div>
            </el-form-item>
            <el-form-item prop="positionTime"></el-form-item>
            <el-form-item label="广告位：">
                <el-select v-model="form.displayConditon.advLocations" filterable multiple clearable placeholder="请选择广告位">
                    <el-option v-for="(item, index) in advList" :key="index" :label="item.name" :value="item.id.toString()"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动：">
                <el-select v-model="form.displayConditon.actLocations" filterable multiple clearable placeholder="请选择活动">
                    <el-option v-for="(item, index) in activityList" :key="index" :label="item.name" :value="item.id.toString()"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容：">
                <el-select v-model="form.displayConditon.contents" filterable multiple clearable placeholder="请选择内容">
                    <el-option v-for="(item, index) in contentsList" :key="index" :label="item.name" :value="item.id.toString()"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="positionAndTime"></el-form-item>
        </el-form>

        <div class="btnCon">
            <el-button :size="size" :loading="saveLoading" @click="save" type="primary">保存</el-button>
        </div>
    </div>
</template>
<script>
    import { selectGet, MCsave } from "../../../apis/index";
    import prvCity from "../../../config/prvCity.json";
    import axios from "axios";
    export default {
        components: {},
        props: ["formData", "dialogVisible"],
        data() {
            // 年龄数据处理
            var ageVal = (rule, value, callback) => {
                console.log(222);
                let isOk = 0;

                this.form.ageStartSymbol = this.form.ageStartSymbol == null ? "" : this.form.ageStartSymbol;
                this.form.userStartAge = this.form.userStartAge == null ? "" : this.form.userStartAge;
                this.form.userEndAge = this.form.userEndAge == null ? "" : this.form.userEndAge;
                this.form.ageEndSymbol = this.form.ageEndSymbol == null ? "" : this.form.ageEndSymbol;

                if ((this.form.ageStartSymbol != "" && this.form.userStartAge == "") || (this.form.ageStartSymbol == "" && this.form.userStartAge != "")) {
                    isOk = "符号和年龄需要同时填写";
                }
                if ((this.form.ageEndSymbol != "" && this.form.userEndAge == "") || (this.form.ageEndSymbol == "" && this.form.userEndAge != "")) {
                    isOk = "符号和年龄需要同时填写";
                }
                if (
                    this.form.ageEndSymbol != "" &&
                    this.form.ageEndSymbol != null &&
                    this.form.userEndAge != "" &&
                    this.form.ageStartSymbol != "" &&
                    this.form.ageStartSymbol != null &&
                    this.form.userStartAge != "" &&
                    (this.form.ageConnSymbol == "" || this.form.ageConnSymbol == null)
                ) {
                    isOk = "请选择关联符号";
                }
                if (
                    this.form.ageConnSymbol != "" &&
                    this.form.ageConnSymbol != null &&
                    (this.form.ageEndSymbol == "" || this.form.userEndAge == "" || this.form.ageStartSymbol == "" || this.form.userStartAge == "")
                ) {
                    isOk = "符号和年龄不能为空";
                }
                if (this.form.userStartAge != "" && (this.form.userStartAge >= 1000 || this.form.userStartAge < 0)) {
                    isOk = "请填写正确的年龄";
                }
                if (this.form.userEndAge != "" && (this.form.userEndAge >= 1000 || this.form.userEndAge < 0)) {
                    isOk = "请填写正确的年龄";
                }
                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            // 注册时间 数据处理
            var RegTimeVal = (rule, value, callback) => {
                let isOk = 0;
                this.form.regStartSymbol = this.form.regStartSymbol == null ? "" : this.form.regStartSymbol;
                this.form.regStartTime = this.form.regStartTime == null ? "" : this.form.regStartTime;
                this.form.regEndSymbol = this.form.regEndSymbol == null ? "" : this.form.regEndSymbol;
                this.form.regEndTime = this.form.regEndTime == null ? "" : this.form.regEndTime;
                this.form.regConnectionSymbol = this.form.regConnectionSymbol == null ? "" : this.form.regConnectionSymbol;
                if ((this.form.regStartSymbol != "" && this.form.regStartTime == "") || (this.form.regStartSymbol == "" && this.form.regStartTime != "")) {
                    isOk = "符号和日期需要同时填写";
                }
                if ((this.form.regEndSymbol != "" && this.form.regEndTime == "") || (this.form.regEndSymbol == "" && this.form.regEndTime != "")) {
                    isOk = "符号和日期需要同时填写";
                }
                if (this.form.regStartSymbol != "" && this.form.regStartTime != "" && this.form.regEndSymbol != "" && this.form.regEndTime != "" && this.form.regConnectionSymbol == "") {
                    isOk = "请选择关联符号";
                }
                if (this.form.regConnectionSymbol != "" && (this.form.regStartSymbol == "" || this.form.regStartTime == "" || this.form.regEndSymbol == "" || this.form.regEndTime == "")) {
                    isOk = "符号和日期不能为空";
                }

                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            // 比财峰值处理
            var BCFZVal = (rule, value, callback) => {
                let isOk = 0;
                this.form.holdSharesPeakValueStartSymbol = this.form.holdSharesPeakValueStartSymbol == null ? "" : this.form.holdSharesPeakValueStartSymbol;
                this.form.holdSharesPeakValueStartAmount = this.form.holdSharesPeakValueStartAmount == null ? "" : this.form.holdSharesPeakValueStartAmount.toString();
                this.form.holdSharesPeakValueEndSymbol = this.form.holdSharesPeakValueEndSymbol == null ? "" : this.form.holdSharesPeakValueEndSymbol;
                this.form.holdSharesPeakValueEndAmount = this.form.holdSharesPeakValueEndAmount == null ? "" : this.form.holdSharesPeakValueEndAmount.toString();
                this.form.holdSharesPeakValueConnSymbol = this.form.holdSharesPeakValueConnSymbol == null ? "" : this.form.holdSharesPeakValueConnSymbol;

                let reg = /^(^[0]{1}\.[0][1-9])|(^[0]{1}\.[1-9])|(^[0]{1}\.[1-9]\d{1})|(^[1-9]\d{0,8}\.[1-9]\d{1})|(^[1-9]\d{0,8}\.[1-9])|(^[1-9]\d{0,8})/;
                let newStart = this.form.holdSharesPeakValueStartAmount.indexOf(".") > -1 ? this.form.holdSharesPeakValueStartAmount.split(".")[0] : this.form.holdSharesPeakValueStartAmount;
                let newEnd = this.form.holdSharesPeakValueEndAmount.indexOf(".") > -1 ? this.form.holdSharesPeakValueEndAmount.split(".")[0] : this.form.holdSharesPeakValueEndAmount;

                if (
                    (this.form.holdSharesPeakValueStartAmount != "" &&
                        this.form.holdSharesPeakValueStartAmount.indexOf(".") >= 0 &&
                        (this.form.holdSharesPeakValueStartAmount.split(".")[1].length > 2 || this.form.holdSharesPeakValueStartAmount.split(".")[1].length == 0)) ||
                    (this.form.holdSharesPeakValueEndAmount != "" &&
                        this.form.holdSharesPeakValueEndAmount.indexOf(".") >= 0 &&
                        (this.form.holdSharesPeakValueEndAmount.split(".")[1].length > 2 || this.form.holdSharesPeakValueEndAmount.split(".")[1].length == 0))
                ) {
                    isOk = "请填写正确的金额";
                } else if (
                    (this.form.holdSharesPeakValueStartAmount != "" && (isNaN(this.form.holdSharesPeakValueStartAmount) || !reg.test(this.form.holdSharesPeakValueStartAmount))) ||
                    (this.form.holdSharesPeakValueEndAmount != "" && (isNaN(this.form.holdSharesPeakValueEndAmount) || !reg.test(this.form.holdSharesPeakValueEndAmount)))
                ) {
                    isOk = "请填写正确的金额";
                } else if (newStart.length > 9 || newEnd.length > 9) {
                    isOk = "请填写正确的金额,最多9位";
                } else if (
                    (this.form.holdSharesPeakValueStartSymbol != "" && this.form.holdSharesPeakValueStartAmount == "") ||
                    (this.form.holdSharesPeakValueStartSymbol == "" && this.form.holdSharesPeakValueStartAmount != "")
                ) {
                    isOk = "符号和金额需要同时填写";
                } else if (
                    (this.form.holdSharesPeakValueEndSymbol != "" && this.form.holdSharesPeakValueEndAmount == "") ||
                    (this.form.holdSharesPeakValueEndSymbol == "" && this.form.holdSharesPeakValueEndAmount != "")
                ) {
                    isOk = "符号和金额需要同时填写";
                } else if (
                    this.form.holdSharesPeakValueStartSymbol != "" &&
                    this.form.holdSharesPeakValueStartAmount != "" &&
                    this.form.holdSharesPeakValueEndSymbol != "" &&
                    this.form.holdSharesPeakValueEndAmount != "" &&
                    this.form.holdSharesPeakValueConnSymbol == ""
                ) {
                    isOk = "请选择关联符号";
                } else if (
                    this.form.holdSharesPeakValueConnSymbol != "" &&
                    (this.form.holdSharesPeakValueStartSymbol == "" ||
                        this.form.holdSharesPeakValueStartAmount == "" ||
                        this.form.holdSharesPeakValueEndSymbol == "" ||
                        this.form.holdSharesPeakValueEndAmount == "")
                ) {
                    isOk = "符号和金额不能为空";
                }
                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            // 本银行峰值
            var BYHFZVal = (rule, value, callback) => {
                let isOk = 0;
                this.form.localBankHoldPeakValueStartSymbol = this.form.localBankHoldPeakValueStartSymbol == null ? "" : this.form.localBankHoldPeakValueStartSymbol;
                this.form.localBankHoldPeakValueStartAmount = this.form.localBankHoldPeakValueStartAmount == null ? "" : this.form.localBankHoldPeakValueStartAmount.toString();
                this.form.localBankHoldPeakValueEndSymbol = this.form.localBankHoldPeakValueEndSymbol == null ? "" : this.form.localBankHoldPeakValueEndSymbol;
                this.form.localBankHoldPeakValueEndAmount = this.form.localBankHoldPeakValueEndAmount == null ? "" : this.form.localBankHoldPeakValueEndAmount.toString();
                this.form.localBankHoldPeakValueConnSymbol = this.form.localBankHoldPeakValueConnSymbol == null ? "" : this.form.localBankHoldPeakValueConnSymbol;

                let reg = /^(^[0]{1}\.[0][1-9])|(^[0]{1}\.[1-9])|(^[0]{1}\.[1-9]\d{1})|(^[1-9]\d{0,8}\.[1-9]\d{1})|(^[1-9]\d{0,8}\.[1-9])|(^[1-9]\d{0,8})/;

                let newStart = this.form.localBankHoldPeakValueStartAmount.indexOf(".") > -1 ? this.form.localBankHoldPeakValueStartAmount.split(".")[0] : this.form.localBankHoldPeakValueStartAmount;
                let newEnd = this.form.localBankHoldPeakValueEndAmount.indexOf(".") > -1 ? this.form.localBankHoldPeakValueEndAmount.split(".")[0] : this.form.localBankHoldPeakValueEndAmount;

                if (
                    (this.form.localBankHoldPeakValueStartAmount != "" &&
                        this.form.localBankHoldPeakValueStartAmount.indexOf(".") >= 0 &&
                        (this.form.localBankHoldPeakValueStartAmount.split(".")[1].length > 2 || this.form.localBankHoldPeakValueStartAmount.split(".")[1].length == 0)) ||
                    (this.form.localBankHoldPeakValueEndAmount != "" &&
                        this.form.localBankHoldPeakValueEndAmount.indexOf(".") >= 0 &&
                        (this.form.localBankHoldPeakValueEndAmount.split(".")[1].length > 2 || this.form.localBankHoldPeakValueEndAmount.split(".")[1].length == 0))
                ) {
                    isOk = "请填写正确的金额";
                } else if (
                    (this.form.localBankHoldPeakValueStartAmount != "" && (isNaN(this.form.localBankHoldPeakValueStartAmount) || !reg.test(this.form.localBankHoldPeakValueStartAmount))) ||
                    (this.form.localBankHoldPeakValueEndAmount != "" && (isNaN(this.form.localBankHoldPeakValueEndAmount) || !reg.test(this.form.localBankHoldPeakValueEndAmount)))
                ) {
                    isOk = "请填写正确的金额";
                } else if (newStart.length > 9 || newEnd.length > 9) {
                    isOk = "请填写正确的金额,最多9位";
                } else if (
                    (this.form.localBankHoldPeakValueStartSymbol != "" && this.form.localBankHoldPeakValueStartAmount == "") ||
                    (this.form.localBankHoldPeakValueStartSymbol == "" && this.form.localBankHoldPeakValueStartAmount != "")
                ) {
                    isOk = "符号和金额需要同时填写";
                } else if (
                    (this.form.localBankHoldPeakValueEndSymbol != "" && this.form.localBankHoldPeakValueEndAmount == "") ||
                    (this.form.localBankHoldPeakValueEndSymbol == "" && this.form.localBankHoldPeakValueEndAmount != "")
                ) {
                    isOk = "符号和金额需要同时填写";
                } else if (
                    this.form.localBankHoldPeakValueStartSymbol != "" &&
                    this.form.localBankHoldPeakValueStartAmount != "" &&
                    this.form.localBankHoldPeakValueEndSymbol != "" &&
                    this.form.localBankHoldPeakValueEndAmount != "" &&
                    this.form.localBankHoldPeakValueConnSymbol == ""
                ) {
                    isOk = "请选择关联符号";
                } else if (
                    this.form.localBankHoldPeakValueConnSymbol != "" &&
                    (this.form.localBankHoldPeakValueStartSymbol == "" ||
                        this.form.localBankHoldPeakValueStartAmount == "" ||
                        this.form.localBankHoldPeakValueEndSymbol == "" ||
                        this.form.localBankHoldPeakValueEndAmount == "")
                ) {
                    isOk = "符号和金额不能为空";
                }

                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            // /省市数据处理
            var eareVlVal = (rule, value, callback) => {
                let isOk = 0;
                this.form.userRegionConditions.forEach((i) => {
                    // if (i.province=='') {
                    //   isOk='请选择省份'
                    // }
                    if (i.province != "" && i.gpsLocationCheck == "" && i.idCardAddressCheck == "" && i.regPhoneNumCheck == "") {
                        isOk = "请选择该地区限制条件";
                    }
                });
                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            // 重新处理 产品展示位置与时间
            var positionTimeVal = (rule, value, callback) => {
                let isOk = 0;
                this.form.prdShowConditons.forEach((k) => {
                    if (k.prdDisplayLocations.length > 0 && k.dateType == "") {
                        isOk = "请选择时间类型";
                    }
                    if (k.dateType == "1" && k.dateStart == null) {
                        isOk = "请选择开始时间";
                    } else if (k.dateEnd != null && Date.parse(new Date(k.dateStart)) > Date.parse(new Date(k.dateEnd))) {
                        isOk = "结束时间不可早于开始时间";
                    }

                    if (k.dateType == "2" && k.weekCode == "") {
                        isOk = "请选择周期和时间";
                    }
                });
                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            // 重新处理位置 数据
            var positionAndTimeVal = (rule, value, callback) => {
                let isOk = 0;
                let hasConditons = 0;
                this.form.prdShowConditons.forEach((k) => {
                    if (k.prdDisplayLocations.length > 0) {
                        hasConditons = 1;
                    }
                });
                if (hasConditons == 0 && this.form.displayConditon.advLocations.length == 0 && this.form.displayConditon.actLocations.length == 0 && this.form.displayConditon.contents.length == 0) {
                    isOk = "营销管理至少配置一项";
                }
                if (isOk == 0) {
                    callback();
                } else {
                    callback(new Error(isOk));
                }
            };
            return {
                newNeedStatus: false, //1140需求，需要屏蔽的功能标签
                form: {
                    conditionVisible: "1", // 条件可见性  0不可见  1可见
                    positionAndTime: "", //位置与时间
                    ageStartSymbol: "", // 年龄条件的开始 可能的值有>,<,<=,>=
                    ageEndSymbol: "", //年龄条件的结束符 可能的值有>,<,<=,>=
                    userStartAge: "", //用户年龄开始
                    userEndAge: "", // 年龄的结束
                    ageConnSymbol: "", //年龄的开始结束连接符 可能的值 1并且、2或者
                    userRegStatus: "", // 用户注册状态1已经注册0注册
                    regStartTime: "", //用户注册开始时间
                    regStartSymbol: "", //注册时间条件的开始 可能的值有>,<,<=,>=
                    regEndTime: "", //用户注册结束时间
                    regEndSymbol: "", //用户注册结束符
                    regConnectionSymbol: "", //注册开始时间连接符
                    puhuiOpenAccountStatus: "", //普惠账户是否开通  1已开户，2为开户
                    realNameStatus: "", // 实名状态
                    openAccountStatus: "", // 开户状态
                    investmentStatus: "", // 投资状态
                    holdSharesStatus: "", // 持仓状态
                    holdSharesPeakValueStartSymbol: "", // 持仓峰值开始符号
                    holdSharesPeakValueStartAmount: "", // 持仓峰值的开始金额
                    holdSharesPeakValueEndSymbol: "", // 持仓峰值的结束符
                    holdSharesPeakValueEndAmount: "", //持仓峰值结束金额
                    holdSharesPeakValueConnSymbol: "", // 持仓峰值的开始结束连接符
                    localBankOpenAccountStatus: "", //本银行的开户状态开1开户0未开户
                    localBankInvestmentStatus: "", //本银行的投资状态1投0未投
                    localBankHoldSharsStatus: "", //本银行的持仓状态 1持仓0未持
                    localBankHoldPeakValueStartSymbol: "", //本银行的持仓峰值开始符 可能的值有>,<,<=,>=
                    localBankHoldPeakValueStartAmount: "", //本银行的持仓峰值金额
                    localBankHoldPeakValueEndSymbol: "", //本银行的持仓峰值结束符 可能的值有>,<,<=,>=
                    localBankHoldPeakValueEndAmount: "", //本银行持仓峰值的结束金额
                    localBankHoldPeakValueConnSymbol: "", //本银行持仓峰值的开始结束连接符 可能的值 1并且、2或者
                    userRegionConditions: [
                        //地域限制
                        {
                            province: "",
                            city: "",
                            regPhoneNumCheck: "",
                            idCardAddressCheck: "",
                            gpsLocationCheck: ""
                        }
                    ],
                    prdShowConditons: [
                        {
                            dateStart: null,
                            dateEnd: null,
                            prdDisplayLocations: [],
                            prdDisplayLocationNameList: [],
                            dateType: "",
                            weekCode: []
                        }
                    ],
                    displayConditon: {
                        advLocations: [],
                        actLocations: [],
                        contents: [],
                        actLocationNameList: [],
                        advLocationNameList: [],
                        contentNameList: []
                    }
                },
                contentsList: [],
                advList: [],
                activityList: [],
                saveLoading: false,
                size: "small",
                prdshowList: [],
                cityList: [],
                prvList: [],
                StarttimeString: 0,
                EndtimeString: 0,
                showHS: false,
                showHE: false,
                showLS: false,
                showLE: false,
                rules: {
                    conditionVisible: [{ required: true, message: "请选择可购买状态", trigger: "change" }],
                    positionAndTime: [{ required: false, validator: positionAndTimeVal, trigger: "change" }],
                    positionTime: [
                        // { required: false, validator: positionTimeVal, trigger: 'change' }
                    ],
                    eareVl: [{ required: false, validator: eareVlVal, trigger: "change" }],
                    age: [{ required: false, validator: ageVal, trigger: "blur" }],
                    RegTime: [{ required: false, validator: RegTimeVal, trigger: "blur" }],
                    BCFZ: [{ required: false, validator: BCFZVal, trigger: "blur" }],
                    BYHFZ: [{ required: false, validator: BYHFZVal, trigger: "blur" }]
                }
            };
        },
        computed: {
            danweiholdSharesPeakValueStartAmount() {
                this.form.holdSharesPeakValueStartAmount = this.form.holdSharesPeakValueStartAmount == null ? "" : this.form.holdSharesPeakValueStartAmount.toString();
                let fdf = "";
                if (this.form.holdSharesPeakValueStartAmount.indexOf(".") > -1) {
                    fdf = this.form.holdSharesPeakValueStartAmount.split(".")[0];
                } else {
                    fdf = this.form.holdSharesPeakValueStartAmount;
                }
                if (fdf.length < 5) {
                    this.showHS = false;
                    return " ";
                }
                if (fdf.length == 5) {
                    this.showHS = true;
                    return "万";
                }
                if (fdf.length == 6) {
                    this.showHS = true;
                    return "十万";
                }
                if (fdf.length == 7) {
                    this.showHS = true;
                    return "百万";
                }
                if (fdf.length == 8) {
                    this.showHS = true;
                    return "千万";
                }
                if (fdf.length >= 9) {
                    this.showHS = true;
                    return "亿";
                }
            },
            danweiholdSharesPeakValueEndAmount() {
                this.form.holdSharesPeakValueEndAmount = this.form.holdSharesPeakValueEndAmount == null ? "" : this.form.holdSharesPeakValueEndAmount.toString();
                let fdf = "";
                if (this.form.holdSharesPeakValueEndAmount.indexOf(".") > -1) {
                    fdf = this.form.holdSharesPeakValueEndAmount.split(".")[0];
                } else {
                    fdf = this.form.holdSharesPeakValueEndAmount;
                }
                if (fdf.length < 5) {
                    this.showHE = false;
                    return " ";
                }
                if (fdf.length == 5) {
                    this.showHE = true;
                    return "万";
                }
                if (fdf.length == 6) {
                    this.showHE = true;
                    return "十万";
                }
                if (fdf.length == 7) {
                    this.showHE = true;
                    return "百万";
                }
                if (fdf.length == 8) {
                    this.showHE = true;
                    return "千万";
                }
                if (fdf.length >= 9) {
                    this.showHE = true;
                    return "亿";
                }
            },
            danweilocalBankHoldPeakValueStartAmount() {
                this.form.localBankHoldPeakValueStartAmount = this.form.localBankHoldPeakValueStartAmount == null ? "" : this.form.localBankHoldPeakValueStartAmount.toString();
                let fdf = "";
                if (this.form.localBankHoldPeakValueStartAmount.indexOf(".") > -1) {
                    fdf = this.form.localBankHoldPeakValueStartAmount.split(".")[0];
                } else {
                    fdf = this.form.localBankHoldPeakValueStartAmount;
                }
                if (fdf.length < 5) {
                    this.showLS = false;
                    return " ";
                }
                if (fdf.length == 5) {
                    this.showLS = true;
                    return "万";
                }
                if (fdf.length == 6) {
                    this.showLS = true;
                    return "十万";
                }
                if (fdf.length == 7) {
                    this.showLS = true;
                    return "百万";
                }
                if (fdf.length == 8) {
                    this.showLS = true;
                    return "千万";
                }
                if (fdf.length >= 9) {
                    this.showLS = true;
                    return "亿";
                }
            },
            danweilocalBankHoldPeakValueEndAmount() {
                this.form.localBankHoldPeakValueEndAmount = this.form.localBankHoldPeakValueEndAmount == null ? "" : this.form.localBankHoldPeakValueEndAmount.toString();
                let fdf = "";
                if (this.form.localBankHoldPeakValueEndAmount.indexOf(".") > -1) {
                    fdf = this.form.localBankHoldPeakValueEndAmount.split(".")[0];
                } else {
                    fdf = this.form.localBankHoldPeakValueEndAmount;
                }
                if (fdf.length < 5) {
                    this.showLE = false;
                    return " ";
                }
                if (fdf.length == 5) {
                    this.showLE = true;
                    return "万";
                }
                if (fdf.length == 6) {
                    this.showLE = true;
                    return "十万";
                }
                if (fdf.length == 7) {
                    this.showLE = true;
                    return "百万";
                }
                if (fdf.length == 8) {
                    this.showLE = true;
                    return "千万";
                }
                if (fdf.length >= 9) {
                    this.showLE = true;
                    return "亿";
                }
            },
            prdShowConditons() {
                return this.form.prdShowConditons;
            }
        },
        watch: {
            dialogVisible(newVl, oldVl) {
                this.selectGetFun();
                if (newVl) {
                    this.dataFun();
                } else {
                    this.formData = this.form;
                }
            },
            prdShowConditons: {
                handler(newVal, oldVal) {
                    console.log(newVal);
                    newVal.forEach((i) => {
                        if (i.prdDisplayLocations.length == 0) {
                            i.dateType = "";
                            i.dateEnd = "";
                            i.dateStart = "";
                            i.weekCode = "";
                        }
                    });
                },
                deep: true
            }
        },
        created() {
            this.prvList = prvCity.provinces;
            this.dataFun();
            this.selectGetFun();
        },
        mounted() {
            if (this.$route.query.id) {
            }
        },
        methods: {
            // 切换时间和周期时清空时间
            clickDataType(index, type) {
                this.form.prdShowConditons[index].dateStart = null;
                this.form.prdShowConditons[index].dateEnd = null;
                if (type == "zhouqi") {
                    this.form.prdShowConditons[index].dateStart = "2017-12-12 00:00:00";
                    this.form.prdShowConditons[index].dateEnd = "2017-12-12 23:59:59";
                }
                this.form.prdShowConditons[index].weekCode = [];
            },
            // 以下全选
            prdShowCheckAll() {
                let adv = [];
                this.advList.forEach((i) => {
                    adv.push(i.id.toString());
                });
                this.form.displayConditon.advLocations = adv;

                let act = [];
                this.activityList.forEach((i) => {
                    act.push(i.id.toString());
                });
                this.form.displayConditon.actLocations = act;

                let contents = [];
                this.contentsList.forEach((i) => {
                    contents.push(i.id.toString());
                });
                this.form.displayConditon.contents = contents;

                let prdDis = [];
                this.prdshowList.forEach((i) => {
                    prdDis.push(i.id.toString());
                });
                this.form.prdShowConditons.forEach((k) => {
                    k.prdDisplayLocations = prdDis;
                });
                console.log("成功后点击");
            },
            // 本银行 持仓峰值可以取消选择
            radioClicklocal(e) {
                e === this.form.localBankHoldPeakValueConnSymbol ? (this.form.localBankHoldPeakValueConnSymbol = "") : (this.form.localBankHoldPeakValueConnSymbol = e);
            },
            // 比财 持仓峰值可以取消选择
            radioClickhold(e) {
                e === this.form.holdSharesPeakValueConnSymbol ? (this.form.holdSharesPeakValueConnSymbol = "") : (this.form.holdSharesPeakValueConnSymbol = e);
            },
            // 年龄可以取消选择
            radioClickage(e) {
                e === this.form.ageConnSymbol ? (this.form.ageConnSymbol = "") : (this.form.ageConnSymbol = e);
            },
            // 注册时间 取消选择
            radioClickaRS(e) {
                e === this.form.regConnectionSymbol ? (this.form.regConnectionSymbol = "") : (this.form.regConnectionSymbol = e);
            },
            //处理数据
            dataFun() {
                if (this.formData != "") {
                    this.formData = JSON.parse(this.formData);
                    let advLocations = [];
                    let actLocations = [];
                    let contents = [];
                    this.formData.userRegionConditions.forEach((i) => {
                        if (i.regPhoneNumCheck == "1") {
                            i.regPhoneNumCheck = true;
                        } else {
                            i.regPhoneNumCheck = false;
                        }

                        if (i.idCardAddressCheck == "1") {
                            i.idCardAddressCheck = true;
                        } else {
                            i.idCardAddressCheck = false;
                        }
                        if (i.gpsLocationCheck == "1") {
                            i.gpsLocationCheck = true;
                        } else {
                            i.gpsLocationCheck = false;
                        }
                    });
                    if (this.formData.displayConditon.advLocations instanceof Array) {
                        advLocations = this.formData.displayConditon.advLocations;
                    } else if (this.formData.displayConditon.advLocations.indexOf(",") < 0 && this.formData.displayConditon.advLocations != "") {
                        advLocations.push(this.formData.displayConditon.advLocations);
                    } else if (this.formData.displayConditon.advLocations.indexOf(",") >= 0) {
                        advLocations = this.formData.displayConditon.advLocations.split(",");
                    }
                    this.formData.displayConditon.advLocations = advLocations;

                    if (this.formData.displayConditon.actLocations instanceof Array) {
                        actLocations = this.formData.displayConditon.actLocations;
                    } else if (this.formData.displayConditon.actLocations.indexOf(",") < 0 && this.formData.displayConditon.actLocations != "") {
                        actLocations.push(this.formData.displayConditon.actLocations);
                    } else if (this.formData.displayConditon.actLocations.indexOf(",") >= 0) {
                        actLocations = this.formData.displayConditon.actLocations.split(",");
                    }
                    this.formData.displayConditon.actLocations = actLocations;

                    if (this.formData.displayConditon.contents instanceof Array) {
                        contents = this.formData.displayConditon.contents;
                    } else if (this.formData.displayConditon.contents.indexOf(",") < 0 && this.formData.displayConditon.contents != "") {
                        contents.push(this.formData.displayConditon.contents);
                    } else if (this.formData.displayConditon.contents.indexOf(",") >= 0) {
                        contents = this.formData.displayConditon.contents.split(",");
                    }
                    this.formData.displayConditon.contents = contents;
                    this.formData.prdShowConditons.forEach((k) => {
                        let prdShowConditons = [];
                        let weekCode = [];
                        if (k.prdDisplayLocations instanceof Array) {
                            prdShowConditons = k.prdDisplayLocations;
                        } else if (k.prdDisplayLocations.indexOf(",") < 0 && k.prdDisplayLocations != "") {
                            prdShowConditons.push(k.prdDisplayLocations);
                        } else if (k.prdDisplayLocations.indexOf(",") >= 0) {
                            prdShowConditons = k.prdDisplayLocations.split(",");
                        }
                        if (k.weekCode == null) {
                            k.weekCode = "";
                        }
                        if (k.weekCode instanceof Array) {
                            weekCode = k.weekCode;
                        } else if (k.weekCode.indexOf(",") < 0 && k.weekCode != "") {
                            weekCode.push(k.weekCode);
                        } else if (k.weekCode.indexOf(",") >= 0) {
                            weekCode = k.weekCode.split(",");
                        }
                        k.weekCode = weekCode;
                        k.prdDisplayLocations = prdShowConditons;
                    });
                    this.form = this.formData;
                } else {
                    this.form = {
                        conditionVisible: "1", // 条件可见性  0不可见  1可见
                        positionAndTime: "", //位置与时间
                        ageStartSymbol: "", // 年龄条件的开始 可能的值有>,<,<=,>=
                        ageEndSymbol: "", //年龄条件的结束符 可能的值有>,<,<=,>=
                        userStartAge: "", //用户年龄开始
                        userEndAge: "", // 年龄的结束
                        ageConnSymbol: "", //年龄的开始结束连接符 可能的值 1并且、2或者
                        userRegStatus: "", // 用户注册状态1已经注册0注册
                        regStartTime: "", //用户注册开始时间
                        regStartSymbol: "", //注册时间条件的开始 可能的值有>,<,<=,>=
                        regEndTime: "", //用户注册结束时间
                        regEndSymbol: "", //用户注册结束符
                        regConnectionSymbol: "", //注册开始时间连接符
                        puhuiOpenAccountStatus: "", //普惠账户是否开通 1已开户，2未开户
                        realNameStatus: "", // 实名状态
                        openAccountStatus: "", // 开户状态
                        investmentStatus: "", // 投资状态
                        holdSharesStatus: "", // 持仓状态
                        holdSharesPeakValueStartSymbol: "", // 持仓峰值开始符号
                        holdSharesPeakValueStartAmount: "", // 持仓峰值的开始金额
                        holdSharesPeakValueEndSymbol: "", // 持仓峰值的结束符
                        holdSharesPeakValueEndAmount: "", //持仓峰值结束金额
                        holdSharesPeakValueConnSymbol: "", // 持仓峰值的开始结束连接符
                        localBankOpenAccountStatus: "", //本银行的开户状态开1开户0未开户
                        localBankInvestmentStatus: "", //本银行的投资状态1投0未投
                        localBankHoldSharsStatus: "", //本银行的持仓状态 1持仓0未持
                        localBankHoldPeakValueStartSymbol: "", //本银行的持仓峰值开始符 可能的值有>,<,<=,>=
                        localBankHoldPeakValueStartAmount: "", //本银行的持仓峰值金额
                        localBankHoldPeakValueEndSymbol: "", //本银行的持仓峰值结束符 可能的值有>,<,<=,>=
                        localBankHoldPeakValueEndAmount: "", //本银行持仓峰值的结束金额
                        localBankHoldPeakValueConnSymbol: "", //本银行持仓峰值的开始结束连接符 可能的值 1并且、2或者
                        userRegionConditions: [
                            //地域限制
                            {
                                province: "",
                                city: "",
                                regPhoneNumCheck: "",
                                idCardAddressCheck: "",
                                gpsLocationCheck: ""
                            }
                        ],
                        prdShowConditons: [
                            {
                                dateStart: null,
                                dateEnd: null,
                                prdDisplayLocations: [],
                                prdDisplayLocationNameList: [],
                                dateType: "",
                                weekCode: []
                            }
                        ],
                        displayConditon: {
                            advLocations: [],
                            actLocations: [],
                            contents: [],
                            actLocationNameList: [],
                            advLocationNameList: [],
                            contentNameList: []
                        }
                    };
                }
            },
            // 获取广告位，活动和内容
            selectGetFun() {
                selectGet().then((res) => {
                    if (res.headerModel.code == 0) {
                        this.contentsList = res.datatypeParam.context;
                        this.advList = res.datatypeParam.adv;
                        this.activityList = res.datatypeParam.activity;
                        this.prdshowList = res.datatypeParam.prdshow;
                    }
                });
            },
            radioClickPOAS(e) {
                e === this.form.puhuiOpenAccountStatus ? (this.form.puhuiOpenAccountStatus = "") : (this.form.puhuiOpenAccountStatus = e);
            },
            radioClickRNS(e) {
                e === this.form.realNameStatus ? (this.form.realNameStatus = "") : (this.form.realNameStatus = e);
            },
            radioClickLOAC(e) {
                e === this.form.localBankOpenAccountStatus ? (this.form.localBankOpenAccountStatus = "") : (this.form.localBankOpenAccountStatus = e);
            },
            radioClicLkIS(e) {
                e === this.form.localBankInvestmentStatus ? (this.form.localBankInvestmentStatus = "") : (this.form.localBankInvestmentStatus = e);
            },
            radioClickLHSS(e) {
                e === this.form.localBankHoldSharsStatus ? (this.form.localBankHoldSharsStatus = "") : (this.form.localBankHoldSharsStatus = e);
            },
            radioClickOAC(e) {
                e === this.form.openAccountStatus ? (this.form.openAccountStatus = "") : (this.form.openAccountStatus = e);
            },
            radioClickIS(e) {
                e === this.form.investmentStatus ? (this.form.investmentStatus = "") : (this.form.investmentStatus = e);
            },
            radioClickHSS(e) {
                e === this.form.holdSharesStatus ? (this.form.holdSharesStatus = "") : (this.form.holdSharesStatus = e);
            },
            radioClickURS(e) {
                e === this.form.userRegStatus ? (this.form.userRegStatus = "") : (this.form.userRegStatus = e);
                if (e == "0") {
                    this.form.regStartSymbol = "";
                    this.form.regStartTime = null;
                    this.form.regConnectionSymbol = "";
                    this.form.regEndSymbol = "";
                    this.form.regEndTime = null;
                }
            },
            // 删除限制位置时间
            deletePosition(index) {
                this.form.prdShowConditons.splice(index, 1);
            },
            // 新增限制位置时间
            addXZWZSJ() {
                let obj = {
                    dateStart: null,
                    dateEnd: null,
                    prdDisplayLocations: [],
                    dateType: "",
                    weekCode: ""
                };
                this.form.prdShowConditons.push(obj);
            },
            // 获取开始时间
            changeStarttime(index) {
                this.StarttimeString = Date.parse(new Date(this.form.prdShowConditons[index].dateStart));
                this.EndtimeString = Date.parse(new Date(this.form.prdShowConditons[index].dateEnd));
                // positionAndTimeVal()
            },
            // 获取结束时间
            changeEndtime(index) {
                this.StarttimeString = Date.parse(new Date(this.form.prdShowConditons[index].dateStart));
                this.EndtimeString = Date.parse(new Date(this.form.prdShowConditons[index].dateEnd));
                // positionAndTimeVal()
            },
            // 新增限制区域
            addArea() {
                let obj = {
                    province: "",
                    city: "",
                    regPhoneNumCheck: "",
                    idCardAddressCheck: "",
                    gpsLocationCheck: ""
                };
                this.form.userRegionConditions.push(obj);
            },
            // 删除限制区域
            delArea(index) {
                this.form.userRegionConditions.splice(index, 1);
            },
            // 通过省获取市
            changePrv(item, type) {
                if (type == "prv") {
                    item.city = "";
                }
                this.prvList.forEach((i) => {
                    if (item.province == i.provinceName) {
                        this.cityList = i.citys;
                    }
                });
            },
            // 提交
            save() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let prdShowConditonsString = JSON.stringify(this.form.prdShowConditons);
                        let displayConditonString = JSON.stringify(this.form.displayConditon);
                        // 重新处理 限制地域数据
                        this.form.productOrBank = "2";
                        this.form.userRegionConditions.forEach((i) => {
                            if (i.gpsLocationCheck) {
                                i.gpsLocationCheck = "1";
                            } else {
                                i.gpsLocationCheck = "0";
                            }

                            if (i.idCardAddressCheck) {
                                i.idCardAddressCheck = "1";
                            } else {
                                i.idCardAddressCheck = "0";
                            }
                            if (i.regPhoneNumCheck) {
                                i.regPhoneNumCheck = "1";
                            } else {
                                i.regPhoneNumCheck = "0";
                            }
                        });
                        // 重新处理位置 数据
                        this.form.prdShowConditons.forEach((k) => {
                            let prdDisplayLocationNameList = [];
                            let weekCode = [];
                            k.prdDisplayLocations.forEach((i) => {
                                this.prdshowList.forEach((j) => {
                                    if (i == j.id) {
                                        prdDisplayLocationNameList.push(j.name);
                                    }
                                });
                            });

                            k.prdDisplayLocationNameList = prdDisplayLocationNameList;
                            k.prdDisplayLocations = k.prdDisplayLocations.toString();
                            k.weekCode = k.weekCode.toString();
                        });
                        // 重新处理  广告位，活动和内容数据
                        // let actLocationNameList  advLocationNameList  contentNameList
                        let actLocationNameList = [],
                            advLocationNameList = [],
                            contentNameList = [];
                        this.form.displayConditon.advLocations.forEach((i) => {
                            this.advList.forEach((j) => {
                                if (i == j.id) {
                                    advLocationNameList.push(j.name);
                                }
                            });
                        });
                        this.form.displayConditon.actLocations.forEach((i) => {
                            this.activityList.forEach((j) => {
                                if (i == j.id) {
                                    actLocationNameList.push(j.name);
                                }
                            });
                        });
                        this.form.displayConditon.contents.forEach((i) => {
                            this.contentsList.forEach((j) => {
                                if (i == j.id) {
                                    contentNameList.push(j.name);
                                }
                            });
                        });
                        this.form.displayConditon.advLocations = this.form.displayConditon.advLocations.toString();
                        this.form.displayConditon.actLocations = this.form.displayConditon.actLocations.toString();
                        this.form.displayConditon.contents = this.form.displayConditon.contents.toString();

                        this.form.displayConditon.advLocationNameList = advLocationNameList;
                        this.form.displayConditon.contentNameList = contentNameList;
                        this.form.displayConditon.actLocationNameList = actLocationNameList;

                        let params = {
                            headerModel: {
                                systemType: "h5",
                                message: "保存用户配置请求",
                                requesttime: Date.parse(new Date()),
                                version: "",
                                token: "",
                                deviceId: "",
                                appFlag: "",
                                loginUid: ""
                            },
                            datatypeParam: this.form
                        };
                        console.log("接口数据入参：：", this.form);
                        MCsave(params)
                            .then((res) => {
                                console.log(res);
                                if (res.headerModel.code == 0) {
                                    this.form.id = res.datatypeParam.id;
                                    this.form.condConnSymbol = 1;
                                    this.$emit("childFun", this.form);
                                } else {
                                    //还原数据
                                    JSON.parse(prdShowConditonsString).forEach((k, index) => {
                                        this.form.prdShowConditons[index].prdDisplayLocations = k.prdDisplayLocations;
                                        this.form.prdShowConditons[index].weekCode = k.weekCode;
                                    });
                                    this.form.displayConditon.advLocations = JSON.parse(displayConditonString).advLocations;
                                    this.form.displayConditon.actLocations = JSON.parse(displayConditonString).actLocations;
                                    this.form.displayConditon.contents = JSON.parse(displayConditonString).contents;
                                }
                            })
                            .catch((error) => {
                                //还原数据
                                JSON.parse(prdShowConditonsString).forEach((k, index) => {
                                    this.form.prdShowConditons[index].prdDisplayLocations = k.prdDisplayLocations;
                                    this.form.prdShowConditons[index].weekCode = k.weekCode;
                                });
                                this.form.displayConditon.advLocations = JSON.parse(displayConditonString).advLocations;
                                this.form.displayConditon.actLocations = JSON.parse(displayConditonString).actLocations;
                                this.form.displayConditon.contents = JSON.parse(displayConditonString).contents;
                            });
                    } else {
                        this.$message.error("请完善信息");
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .config {
        padding: 20px 40px 40px;
        .title {
            padding: 20px 0;
            border-bottom: 1px solid #ccc;
        }
        form {
            margin: 20px auto 0;
        }
        h5 {
            margin-bottom: 20px;
            border-left: 6px solid #409eff;
            padding-left: 10px;
        }
        .inputClass {
            /deep/ .el-input,
            /deep/ .el-date-editor,
            /deep/ .el-textarea__inner {
                width: 400px;
            }
        }

        .area,
        .ageDiv,
        .chicangfengzhi {
            display: flex;
            background: #f1f1f1;
            padding: 15px 20px;
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
        .chicangfengzhi,
        .ageDiv {
            background: #fff;
            padding: 0;
            .fanwei {
                width: 80px !important;
                /deep/ .el-input {
                    width: 80px !important;
                    margin-right: 20px;
                }
            }
        }
        .staTime {
            background: #f1f1f1;
            padding: 15px 20px;
        }
        .addClass {
            width: 100%;
            border: 1px dashed #333;
            text-align: center;
            padding: 20px 0;
            span {
                cursor: pointer;
            }
        }
        .fanwei {
            width: 100px;
            margin-right: 10px;
        }
        .radioGroup {
            margin: 0 10px;
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
    }
    /deep/ .el-popover {
        min-width: max-content;
        line-height: 1;
    }
    /deep/ .el-popover--plain {
        padding: 5px 10px;
        font-size: 10px;
    }
</style>
