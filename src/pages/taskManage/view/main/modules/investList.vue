<!--  -->
<template>
    <section class="">
        <common-table ref="commonTable" :api="tableApi" :query="query">
            <!-- 查询表单 -->
            <el-form ref="ruleForm" :model="query" :inline="true" slot="search">
                <el-form-item label="名称" prop="formCustomerNo" v-mar-b="0">
                    <el-input size="small" v-model="query.realname" placeholder="请输入关键字"></el-input>
                </el-form-item>

                <el-form-item label="类型" v-mar-b="0">
                    <el-select size="small" v-model="query.status" placeholder="请选择类型">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.label" v-for="(item, key) in userStatus" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="奖励" v-mar-b="0">
                    <el-select size="small" v-model="query.status" placeholder="请选择奖励">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.label" v-for="(item, key) in userStatus" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="渠道" v-mar-b="0">
                    <el-select size="small" v-model="query.status" placeholder="请选择渠道">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.label" v-for="(item, key) in userStatus" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <!-- 操作按钮 -->
            <el-button slot="action" style="border-radius: 0" size="small" type="primary" icon="el-icon-plus" @click="toUrl">新增循环任务</el-button>
            <el-button slot="action" style="float: right" size="small" type="" icon="">重置</el-button>
            <el-button slot="action" style="float: right" size="small" type="primary" icon="">查询</el-button>

            <!-- 表格项 -->
            <el-table-column class-name="_common_" prop="realname" label="编号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="排序" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="奖励" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="可见用户" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="任务状态" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="渠道" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="设备" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column class-name="_common_" prop="username" label="操作" :show-overflow-tooltip="true"></el-table-column>
        </common-table>
    </section>
</template>

<script>
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        components: { CommonTable },
        data() {
            return {
                query: {
                    page: 1,
                    limit: 20,
                    status: "TRUE"
                }
            };
        },
        created() {},
        mounted() {},
        //方法集合
        methods: {
            // 点击新增循环任务
            toUrl() {
                this.$router.push({ path: "/addInvestItem" });
            }
        }
    };
</script>
<style lang="less" scoped></style>
