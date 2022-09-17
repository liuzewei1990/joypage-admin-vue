<!--  -->
<template>
    <section class="" data="数据注水">
        <!-- <el-collapse v-model="activeNames" @change="handleChange"> -->
        <!-- <el-collapse-item name="1"> -->
        <!-- 表单列表标题 -->
        <div slot="title" style="flex: 1">
            <el-row class="row-col-box">
                <el-col span="3" class="row-col-title"> 虚拟手机号 </el-col>
                <el-col span="3" class="row-col-title"> 投资金额 </el-col>
                <el-col span="3" class="row-col-title"> </el-col>
            </el-row>
        </div>

        <!-- 表单列表内容 -->
        <el-row class="row-col-content" v-for="(formItem, index) in formList" :key="index">
            <el-col span="3">
                <el-form-item class="spacing">
                    <el-input type="number" v-model="formItem.phoneNum" maxlength="11" oninput="if(value.length > 11) value=value.slice(0, 11)"></el-input>
                </el-form-item>
            </el-col>
            <el-col span="3" class="spacing">
                <el-form-item>
                    <el-input type="number" v-model="formItem.amount"><template slot="append">元</template></el-input>
                </el-form-item>
            </el-col>
            <el-col span="3" class="center flex">
                <el-link icon="el-icon-remove" v-if="formList.length > 1" @click="removeFormItem(index)">删除</el-link>
                <el-link icon="el-icon-circle-plus" v-if="formList.length !== 10 && formList.length === index + 1" @click="addFormItem(index + 1, 1)">新增</el-link>
                <el-link icon="el-icon-circle-plus" v-if="formList.length === 1" @click="addFormItem(index + 1, 9)">一键创建</el-link>
            </el-col>
        </el-row>
        <!-- </el-collapse-item> -->
        <!-- </el-collapse> -->

        <!-- 无数据时新增按钮 -->
        <el-row v-if="formList.length === 0">
            <el-col span="3" class="">
                <el-link icon="el-icon-circle-plus" @click="addFormItem(index + 1, 1)">添加注水数据</el-link>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    class FormItem {
        constructor() {
            this.phoneNum = this.getMoble();
            this.amount = 10000;
        }

        getMoble() {
            var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
            var i = parseInt(10 * Math.random());
            var prefix = prefixArray[i];
            for (var j = 0; j < 8; j++) {
                prefix = prefix + Math.floor(Math.random() * 10);
            }
            return prefix;
        }
    }

    export default {
        props: {
            value: {
                type: Array,
                default: () => {
                    return [{}];
                }
            }
        },
        components: {},
        data() {
            return {
                formList: []
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
                    return Object.assign(new FormItem(), formItem);
                });
            },

            // 新增
            addFormItem(index, num) {
                for (let i = 0; i < num; i++) {
                    let newFormItem = new FormItem();
                    this.formList.push(newFormItem);
                }
            },

            // 删除
            async removeFormItem(index) {
                this.formList.splice(index, 1);
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "./common.less";
</style>
