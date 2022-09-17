<template>
    <div class="prdSeries">
        <!-- 机构配置展示 -->
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!-- 表头查询区 -->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="listData" ref="listData">
                    <el-form-item label="位置：">
                        <el-select v-model="topCheckSelect" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in topCheckData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button icon="el-icon-refresh" :size="size" @click="resetForm('listData')">重置</el-button>
                    <el-button icon="el-icon-search" :size="size" type="primary" @click="getbankList('chaxun')">查询</el-button>
                </el-form>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                style="width: 100%"
                :data="corgCarefullyChosenConf"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="positionName" label="位置" header-align="center" align="center"></el-table-column>
                <el-table-column prop="confCountLength" label="当前配置数量" header-align="center" align="center"></el-table-column>
                <el-table-column prop="maxCount" label="最大可展示数量" header-align="center" align="center"></el-table-column>
                <el-table-column prop="isEnabled" label="是否开启" header-align="center" align="center"></el-table-column>
                <el-table-column prop="id" label="操作" fixed="right" header-align="center" align="center">
                    <template>
                        <el-button size="mini" type="text" @click="handleEdit()">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div slot="footer" style="display: none">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    style="float: right"
                    :total="20"
                    @current-change="refreshPageRequest"
                    @size-change="handleSizeChange"
                    :current-page="1"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10">
                </el-pagination>
            </div>
        </CommonTable>
    </div>
</template>
<script>
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        components: {
            CommonTable
        },
        data() {
            return {
                tableHeight: 0,
                size: "small",
                dialogVisible: true, //弹窗是否展示
                closeDialog: false,
                topCheckSelect: "",
                topCheckData: [
                    {
                        //顶部搜索选择的工具内容,位置
                        value: "1",
                        label: "全部"
                    }
                ],
                corgCarefullyChosenConf: [], //列表数据
                isEnabled: ""
            };
        },
        mounted() {
            this.getData();
            // if(this.$route.query.sign){
            //     //页面刷新
            //     this.getData()
            // }
        },
        methods: {
            // 列表接口
            getData() {
                this.$api.getData().then((res) => {
                    //   console.log(res)
                    if (res.data.corgCarefullyChosenConf.isEnabled == "0") {
                        res.data.corgCarefullyChosenConf.isEnabled = "否";
                    } else {
                        res.data.corgCarefullyChosenConf.isEnabled = "是";
                    }
                    res.data.corgCarefullyChosenConf.confCountLength = res.data.orgCarefullyChosenList.length;
                    this.corgCarefullyChosenConf.push(res.data.corgCarefullyChosenConf);
                    //   console.log(this.corgCarefullyChosenConf)
                });
            },
            //修改
            handleEdit() {
                this.$router.push({ path: "/orgConfigPage" });
            },
            //查询
            getbankList() {},
            //重置
            resetForm() {}
        }
    };
</script>
<style lang="less" scoped>
    /deep/ .el-table__fixed-body-wrapper {
        top: 36px !important;
    }
    .prdSeries {
        padding: 20px;
    }
</style>
