<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<!--  -->
<template>
    <section class="" data="数据注水">
        <!-- {{formList}} -->
        <!-- 表单列表标题 -->
        <el-row class="row-col-box" v-if="formList.length > 0">
            <el-col :style="{ width: col.s0 }" class="row-col-title"> 活动产品类型 </el-col>
            <el-col :style="{ width: col.s1 }" class="row-col-title"> 机构名称 </el-col>
            <el-col :style="{ width: col.s2 }" class="row-col-title"> 活动产品 </el-col>
            <el-col :style="{ width: col.s2 }" class="row-col-title">
                产品cell图片<el-tooltip content="配置后，前端列表优先以图片形式展示" placement="top"><i class="el-icon-question el-icon--right"></i></el-tooltip>
            </el-col>
            <el-col :style="{ width: col.s3 }" class="row-col-title"> 最低投资金额 </el-col>
            <el-col :style="{ width: col.s4 }" class="row-col-title"> 奖励类型 </el-col>
            <el-col :style="{ width: col.s5 }" class="row-col-title"> 奖励百分比/奖品ID </el-col>
            <el-col :style="{ width: col.s6 }" class="row-col-title">
                奖励发放时间<el-tooltip content="1.直连产品进入封闭期的第N天自动发放。2.非直连产品手动执行发放。" placement="top"><i class="el-icon-question el-icon--right"></i></el-tooltip>
            </el-col>
            <el-col :style="{ width: col.s7 }" class="row-col-title"> 排序值 </el-col>
            <el-col :style="{ width: col.s8 }" class="row-col-title"> </el-col>
        </el-row>

        <!-- 表单列表内容 -->
        <el-row class="row-col-content" v-if="!isDetail" v-for="(formItem, index) in formList" :key="index">
            <el-col :style="{ width: col.s0 }">
                <!-- 活动的产品类型 -->
                <el-form-item class="spacing">
                    <BcSelect v-model="formItem.prdType" :list="selectJson.prdType" @change="formItem._prdTypeOnChange(formItem)"></BcSelect>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s1 }">
                <!-- 选择机构，查询产品，必填项 -->
                <el-form-item
                    class="spacing"
                    :prop="`prdList[${index}].org`"
                    :rules="{ required: true, message: '请选择机构', trigger: 'change', validator: $validator.bcSelect() }"
                    :show-message="true">
                    <BcSelect
                        v-model="formItem.org"
                        :key="formItem.prdType.id"
                        @GetApiData="SetOrgSelectData($event, formItem)"
                        filterable
                        @change="formItem._orgIdOnChange(formItem)"
                        placeholder="请选择机构"></BcSelect>
                </el-form-item>
            </el-col>

            <!-- 选择产品 -->
            <el-col :style="{ width: col.s2 }">
                <el-form-item class="spacing" :prop="`prdList[${index}].prd`" :rules="{ required: true, message: '请选择产品', trigger: 'change' }" :show-message="true">
                    <BcSelect
                        v-model="formItem.prd"
                        :key="formItem.org.id"
                        :disabled="!formItem.org.id"
                        @GetApiData="SetPrdSelectData($event, formItem)"
                        filterable
                        placeholder="请选择产品"></BcSelect>
                </el-form-item>
            </el-col>

            <!-- 产品cell图片 -->
            <el-col :style="{ width: col.s2 }">
                <el-form-item class="spacing center" :prop="`prdList[${index}].upload`" :rules="{ required: false, message: '' }" :show-message="true">
                    <el-image class="pre-upload" v-if="formItem.upload[0]" :src="formItem.upload[0].url" :preview-src-list="[formItem.upload[0].url]"></el-image>
                    <el-button size="mini" v-else type="primary" @click="formItem._uploadVisible = true">上传产品图片</el-button>
                    <i class="el-icon-error" v-show="formItem.upload[0]" style="color: rgb(177 177 177)" @click="deleteFormItemUpload(formItem)"></i>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s3 }" class="spacing">
                <!-- 最低投资金额 -->
                <el-form-item :prop="`prdList[${index}].amount`" :rules="{ required: true, message: '该值不能为空' }" :show-message="false">
                    <el-input type="number" v-model="formItem.amount"><template slot="append">元</template></el-input>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s4 }">
                <!-- 奖励类型 -->
                <el-form-item class="spacing">
                    <BcSelect v-model="formItem.rewardType" :list="selectJson.rewardType" @change="formItem._rewardTypeChange(formItem)"></BcSelect>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s5 }" class="spacing">
                <!-- 奖励百分比 -->
                <el-form-item v-if="formItem.rewardType.id != '3'" :prop="`prdList[${index}].rewardValue`" :rules="{ required: true, message: '该值不能为空' }" :show-message="false">
                    <el-input type="number" v-model="formItem.rewardValue" :maxlength="2"><template slot="append">%</template></el-input>
                </el-form-item>
                <!-- 权益下拉 -->
                <el-form-item v-if="formItem.rewardType.id == '3'" :prop="`prdList[${index}].rewardValue`" :rules="{ required: true, message: '该值不能为空' }" :show-message="false">
                    <!--  modelType="id"新支持的功能，默认为obj， 老代码使用的是obj模式，老代码暂且先不更新，有时间了可以同步过来 -->
                    <BcSelect
                        modelType="id"
                        :autoGetApiData="true"
                        v-model="formItem.rewardValue"
                        @clickItem="(item) => (formItem.rewardName = item.REWARD_NAME)"
                        @GetApiData="SetRewardSelectData"
                        itemNameKey="REWARD_NAME"
                        itemValueKey="ID"></BcSelect>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s6 }" class="spacing center">
                <!-- 奖励发放时间，N天控件 直连产品：在产品进入封闭期的第N天自动发放 非直连产品：运营手动发放 -->
                <el-form-item :prop="`prdList[${index}].rewardEndDay`" :rules="{ required: formItem.prdType.id == '1', message: '该值不能为空' }" :show-message="false">
                    <el-input type="number" v-model="formItem.rewardEndDay" :maxlength="3" v-if="formItem.prdType.id == '1'">
                        <template slot="prepend">第</template>
                        <template slot="append">天</template>
                        <!-- 隐藏域 -->
                        <span v-show="false">{{ (formItem.rewardSendType = "1") }}</span>
                    </el-input>
                    <el-link style="margin-top: 5px" v-else>
                        <!-- 隐藏域 -->
                        <span v-show="false">{{ (formItem.rewardSendType = "2") }}</span>
                        <span>手动发放</span>
                        <el-tooltip content="如需发放奖励请到详情中操作" placement="top"><i class="el-icon-question el-icon--right"></i></el-tooltip>
                    </el-link>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s7 }" class="spacing">
                <!-- 排序值 -->
                <el-form-item :prop="`prdList[${index}].sortNum`" :rules="{ required: true, message: '该值不能为空' }">
                    <el-input-number type="number" v-model="formItem.sortNum" :min="1" :max="100" controls-position="right"></el-input-number>
                </el-form-item>
            </el-col>

            <!-- 操作 -->
            <el-col :style="{ width: col.s8 }" class="center flex">
                <el-link icon="el-icon-remove" v-if="formList.length > 1" @click="removeFormItem(index)">删除</el-link>
                <el-link icon="el-icon-circle-plus" v-if="formList.length === index + 1" @click="addFormItem(formList.length + 1)">新增</el-link>
            </el-col>

            <!-- 图片上传 -->
            <Upload
                title="上传机构图片"
                v-model="formItem.upload"
                :limit="1"
                @onSuccess="$emit('validate', `prdList[${index}].upload`)"
                @handleExceed="$msg.fail('机构图片只能上传一张，请先删除在上传')"
                upTip="只能上传jpg/png文件，且不超过500kb，图片尺寸为宽600 x 高152"
                :visible.sync="formItem._uploadVisible"></Upload>
        </el-row>

        <!-- 表单列表内容 -->
        <el-row class="row-col-content" v-if="isDetail" v-for="(formItem, index) in formList" :key="index">
            <el-col :style="{ width: col.s0 }">
                <!-- 活动的产品类型 -->
                <el-form-item class="spacing center border-r">
                    <span class="td">{{ formItem.prdType.name }}</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s1 }">
                <!-- 选择机构，查询产品，必填项 -->
                <el-form-item class="spacing center border-r">
                    <span class="td">{{ formItem.org.name }}</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s2 }">
                <el-form-item class="spacing center border-r">
                    <span class="td">{{ formItem.prd.name || "--" }}</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s2 }">
                <el-form-item class="spacing center border-r">
                    <el-image class="pre-upload" v-if="formItem.upload[0]" :src="formItem.upload[0].url" :preview-src-list="[formItem.upload[0].url]"></el-image>
                    <span v-else>--</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s3 }" class="spacing center border-r">
                <!-- 最低投资金额 -->
                <el-form-item :prop="`prdList[${index}].amount`">
                    <span class="td">{{ formItem.amount }}元</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s4 }">
                <!-- 奖励类型 -->
                <el-form-item class="spacing center border-r">
                    <span class="td">{{ formItem.rewardType.name }}</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s5 }" class="spacing">
                <!-- 奖励百分比/奖品ID -->
                <el-form-item class="spacing center border-r">
                    <span v-if="formItem.rewardType.id == '1' || formItem.rewardType.id == '2'" class="td">{{ formItem.rewardValue }}%</span>
                    <span v-if="formItem.rewardType.id == '3'" class="td">{{ formItem.rewardName }}</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s6 }" class="spacing center border-r">
                <!-- 奖励发放时间，N天控件 直连产品：在产品进入封闭期的第N天自动发放 非直连产品：运营手动发放 -->
                <el-form-item :prop="`prdList[${index}].rewardEndDay`" :rules="{ required: formItem.prdType.id == '1', message: '该值不能为空' }" :show-message="false">
                    <span class="td" v-if="formItem.prdType.id == '1'">第{{ formItem.rewardEndDay }}天</span>
                    <span class="td" v-else>手动发放</span>
                </el-form-item>
            </el-col>

            <el-col :style="{ width: col.s7 }" class="spacing">
                <!-- 排序值 -->
                <el-form-item class="spacing center border-r">
                    <span class="td">{{ formItem.sortNum }}</span>
                </el-form-item>
            </el-col>

            <!-- 操作 -->
            <el-col :style="{ width: col.s8 }" class="center flex" v-if="formItem.prdType.id == '2' || formItem.prdType.id == '3'">
                <el-button size="mini" type="primary" icon="el-icon-user-solid" v-if="formItem.awardStatus == '2'" @click="submitUpdateFormItem(formItem)">发放奖励</el-button>
                <el-button size="mini" type="primary" icon="el-icon-user-solid" v-if="formItem.awardStatus == '1'" disabled>已发放</el-button>
            </el-col>
        </el-row>

        <!-- 无数据时新增按钮 -->
        <el-row v-if="isDetail === false && formList.length === 0">
            <el-col span="3" class="">
                <el-link icon="el-icon-circle-plus" @click="addFormItem()">添加活动产品</el-link>
            </el-col>
        </el-row>

        <!-- 无数据时占位符 -->
        <el-row class="" v-if="isDetail === true && formList.length === 0">
            未配置活动产品
            <el-tooltip content="如需添加产品请到【修改】-【产品列表】中添加" placement="top"><i class="el-icon-question el-icon--right"></i></el-tooltip>
        </el-row>
    </section>
</template>

<script>
    /**
     * 表单实体
     */
    class FormItem {
        constructor() {
            // 产品类型 直连 | 非直连
            this.prdType = { name: "直连产品", id: "1" };
            // 产品
            this.prd = "";
            // 机构
            this.org = {};
            // 最低投资金额
            this.amount = 10000;
            // 奖励类型
            this.rewardType = { name: "红包", id: "1" };
            // 奖励百分比/奖品ID
            this.rewardValue = "";
            // 奖励名称 后台想要
            this.rewardName = "";
            // 奖励发放类型 1 自动发放,2 手动发放
            this.rewardSendType = 1;
            // 奖励发放时间
            this.rewardEndDay = 0;
            // 排序值
            this.sortNum = 0;
            // 图片上传
            this.upload = [];
            // 私有上传图片弹框显示状态
            this._uploadVisible = false;
        }
        // 当产品类型变化时需要重置表单的个别字段
        _prdTypeOnChange() {
            // 重置机构
            this.org = {};
            // 重置产品
            this.prd = "";
        }
        _orgIdOnChange() {
            this.prd = "";
        }
        // 当奖励类型变化时，清空奖励值
        _rewardTypeChange() {
            this.rewardValue = "";
            this.rewardName = "";
        }
    }

    import Upload from "../../../components/Upload/index.vue";
    export default {
        inject: ["selectJson"],
        props: {
            value: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            form: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        components: { Upload },
        data() {
            return {
                formList: [],
                col: {
                    s0: "100px",
                    s1: "130px",
                    s2: "130px",
                    s3: "110px",
                    s4: "80px",
                    s5: "125px",
                    s6: "100px",
                    s7: "70px",
                    s8: "110px"
                }
            };
        },
        watch: {
            formList: {
                handler: function (newVal, oldVal) {
                    this.$emit("input", newVal);
                }
            }
        },
        created() {
            this.initFormList();
        },
        mounted() {},
        //方法集合
        methods: {
            // 注入实体方法
            initFormList() {
                this.formList = this.value.map((formItem) => {
                    // 实体合并 为了继承实体方法
                    if (this.isDetail) {
                        return formItem;
                    } else {
                        return Object.assign(new FormItem(), formItem);
                    }
                });
            },

            // 新增
            addFormItem(index = 1) {
                let newFormItem = new FormItem();
                newFormItem.sortNum = index;
                this.formList.push(newFormItem);
            },

            // 删除
            async removeFormItem(index) {
                let res = await this.$confirm("确定删除吗？", "提示", { type: "warning" });
                this.formList.splice(index, 1);
            },

            // 设置机构列表
            async SetOrgSelectData($event, formItem) {
                let params = { orgType: formItem.prdType.id };
                let data = await this.$api.getOrgList(params);
                // 0 不展示分页
                $event.callback({ list: data, total: 0 });
            },

            // 设置产品列表
            async SetPrdSelectData($event, formItem) {
                let orgId = formItem.org.id;
                let data = await this.$api.getPrdListByOrgId({ orgId });
                // 0 不展示分页
                $event.callback({ list: data, total: 0 });
            },

            // 设置权益列表
            async SetRewardSelectData($event) {
                let params = { activityCode: "INVEST_GIFTS", rewardType: "2" };
                let data = await this.$api.getRewardInfoList(params);
                // 0 不展示分页
                $event.callback({ list: data, total: 0 });
            },

            // 用户手动删除图片，重新上传
            async deleteFormItemUpload(formItem) {
                await this.$confirm("确定删除该图片吗？", "提示", { type: "info" });
                formItem.upload = [];
                //   this.$set(formItem, "upload", [])
            },

            // 手动发放奖励
            async submitUpdateFormItem(formItem) {
                await this.$confirm("确定发放所有用户奖励吗？", "提示", { type: "info" });
                let params = {
                    id: this.form.id,
                    prdIndexId: formItem.prd.id
                };
                let data = await this.$api.investPostReward(params);
                this.$msg.success("操作成功");
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "./common.less";

    .pre-upload {
        display: inline-block;
        width: 50px;
        height: 23px;
        overflow: inherit;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
