<template>
    <!-- 广告位置管理--券商活动H5落地页-->
    <div class="prdSeries">
        <el-header style="padding: 0">
            <el-page-header style="line-height: 30px" content="" @back="bankPage()"></el-page-header>
        </el-header>
        <CommonTable :isFluid="false" @height="tableHeight = $event" style="top: 50px">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="所属机构：" prop="orgId">
                        <BcSelect
                            @GetApiData="orgSelectData($event)"
                            v-model="topCheckData.orgId"
                            :filterable="true"
                            placeholder="请输入/选择机构"
                            itemNameKey="org_name"
                            itemValueKey="id"
                            :clearable="true">
                        </BcSelect>
                    </el-form-item>

                    <el-form-item label="类型：" prop="showType">
                        <BcSelect
                            @GetApiData="getAvailableUser($event)"
                            v-model="topCheckData.showType"
                            itemNameKey="name"
                            itemValueKey="value"
                            :filterable="true"
                            :clearable="true"
                            placeholder="请选择机构"></BcSelect>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" :size="size" style="float: left" type="primary" @click="handleEdit()">新增投放</el-button>
                <el-button icon="el-icon-refresh" :size="size" style="float: right" @click="resetForm()">重置</el-button>
                <el-button icon="el-icon-search" :size="size" style="float: right" type="primary" @click="getPutOnList('chaxun')">查询</el-button>
            </div>

            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="recommendedList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading=""
                element-loading-text="loading...">
                <el-table-column prop="advertisingAlias" label="别名" header-align="center" align="center" width="120px"></el-table-column>
                <el-table-column prop="advImgUrl" label="广告图" header-align="center" align="center">
                    <template slot-scope="scope">
                        <img class="table_img" :src="imageUrl + scope.row.advImgUrl" alt="" />
                    </template>
                </el-table-column>
                <el-table-column prop="contentTypeName" label="类型" header-align="center" align="center"></el-table-column>
                <el-table-column prop="contentName" label="内容" header-align="center" align="center" width="200px"></el-table-column>
                <el-table-column prop="advOrder" label="排序号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="advVisibleUesrName" label="可见用户" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="所属机构" header-align="center" align="center"></el-table-column>
                <!-- <el-table-column prop="appFlagName" label="投放渠道" header-align="center" align="center"></el-table-column>
			<el-table-column prop="advPlatformName" label="发布设备" header-align="center" align="center"></el-table-column> -->
                <el-table-column prop="sandboxId" label="监管沙盒" header-align="center" align="center"></el-table-column>
                <el-table-column prop="showStartTime" label="显示时间" header-align="center" align="center"></el-table-column>
                <el-table-column prop="startTime" label="发布日期" header-align="center" align="center" width="150px"></el-table-column>
                <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div slot="footer">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    style="float: right"
                    :total="totalSize"
                    @size-change="handleSizeChange"
                    @current-change="refreshPageRequest"
                    :current-page="pageRequest.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageRequest.pageSize">
                </el-pagination>
            </div>
        </CommonTable>
    </div>
</template>
<script>
    // 接口函数依次：所属银行，投放列表，删除，类型
    import { selectOrgData, getPutOnLists, getBrokesDelete, getAvailableUser } from "../../apis/index"; // 最新公共select组件
    import BcSelect from "@common/finsuit-components/BcSelect";
    import config from "../../config/config.index.js";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "EarningsUpgrades",
        components: { CommonTable, BcSelect },
        data() {
            return {
                tableHeight: 0, //内容高度
                headerModel: {
                    systemType: "h5",
                    appFlag: "BC"
                }, //接口入参
                imageUrl: "", //图片前面有域名的部分地址
                size: "small",
                topCheckData: {
                    //顶部搜索选择的工具内容
                    orgId: "", //机构ID
                    orgName: "",
                    showType: "" //类型
                },
                // loading:false, //请求列表时loading
                pageRequest: {
                    //内容分页
                    pageNum: "1",
                    pageSize: "10",
                    totalPage: "0"
                },
                dataPositionId: "", //位置id，请求回来的
                queryPositionId: "", //上一个页面传回来的，地址上的位置id
                recommendedList: [], //表格中的,请求回来的列表数据
                allSelectData: {
                    appFlagList: [
                        {
                            name: "产品",
                            id: "1"
                        },
                        {
                            name: "图片",
                            id: "2"
                        }
                    ],
                    appFlagList: [
                        {
                            name: "识贝比",
                            id: "BC"
                        },
                        {
                            name: "识贝拼",
                            id: "PC"
                        },
                        {
                            name: "小程序",
                            id: "PMP"
                        },
                        {
                            name: "异业",
                            id: "YIYE"
                        }
                    ], //投放渠道list
                    advPlatformList: [
                        {
                            name: "安卓",
                            id: "android"
                        },
                        {
                            name: "苹果",
                            id: "ios"
                        }
                    ]
                } //所有下拉框的数组集合
            };
        },
        watch: {},
        created() {
            //图片初始化地址：
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);

            this.queryPositionId = this.$route.query.positionId;
            console.log("queryPositionId", this.queryPositionId);
            this.getPutOnList(); //投放列表数据
        },
        methods: {
            //获取机构下拉框数据
            async orgSelectData($event) {
                let { query, callback } = $event;
                let params = {
                    orgName: query.keywords
                };
                let dataArray = await this.$api.selectOrgData(params).then((res) => res.datatypeParam.success || {});
                // console.log(dataArray)
                callback({ list: dataArray, total: 0 });
            },
            //获类型下拉框数据
            async getAvailableUser($event) {
                let { query, callback } = $event;
                let params = {
                    orgName: query.keywords
                };
                let dataArray = await this.$api.getAvailableUser(params).then((res) => res.data.contentTypeList || {});
                console.log(dataArray);
                callback({ list: dataArray, total: 0 });
            },

            // 获取列表数据
            async getPutOnList(type) {
                this.loading = true;
                if (type == "chaxun") {
                    this.pageRequest.pageNum = "1"; //初始化--第一条开始查
                    this.pageRequest.pageSize = "10"; //初始化--查询10条
                }
                let params = {
                    headerModel: this.headerModel,
                    datatypeParam: {
                        length: this.pageRequest.pageSize, //查询多少条
                        currentPage: this.pageRequest.pageNum, //当前页数
                        id: this.queryPositionId, //位置id,有缓存的先用缓存，没有用地址上的
                        showType: this.topCheckData.showType.value, //列表
                        orgId: this.topCheckData.orgId.id
                    }
                };
                console.log("列表数据入参", params);
                try {
                    let resData = await getPutOnLists(params); //接口
                    console.log("投放列表数据", resData);
                    this.loading = false;
                    this.recommendedList = resData.retList; //列表list
                    this.dataPositionId = resData.retList ? resData.retList[0].positionId : []; //数组中每个对象的positionId都一样，所以取第一个即可
                    this.totalSize = resData.totalCount; //总条数
                } catch (error) {
                    if (this.recommendedList.length == 0) {
                        this.$message({ message: "列表为空，请新增投放列表！", type: "info" });
                    }
                }
                setTimeout(() => {
                    this.loading = false;
                }, 100);
            },

            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getPutOnList(); //调基金公司列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getPutOnList(); //调产品系列列表接口
            },
            //重置
            resetForm() {
                console.log("重置");
                this.$refs.topData.resetFields();
                this.getPutOnList(); //调产品系列列表接口
            },

            //返回上一页
            bankPage() {
                this.$router.push({
                    path: "/brokersLocationList"
                });
            },

            // 点击新增/修改--跳页
            handleEdit: function (row, index) {
                console.log("编辑", row);
                this.$router.push({
                    path: "/brokersAdvertAdd",
                    query: {
                        id: row ? row.id : "", //ID存在为修改，不存在为新增
                        positionId: this.dataPositionId ? this.dataPositionId : this.queryPositionId //位置id
                    }
                });
            },

            // 点击删除
            handleDelete(row, index) {
                console.log("单个删除", row);
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            id: row.id
                        };
                        console.log("单个删除入参", params);
                        getBrokesDelete(params)
                            .then((resData) => {
                                console.log("删除接口", resData);
                                this.loading = false;
                                this.$message({ message: "删除成功", type: "success" });
                                this.getPutOnList(); //刷新当前页
                            })
                            .catch((err) => {
                                console.log("删除接口err", err);
                                this.loading = false;
                                this.$message({ message: err, type: "error" });
                            });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                        this.loading = false;
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .el-table__fixed-body-wrapper {
        top: 37px !important;
    }
    .prdSeries {
        padding: 20px;
    }
    // .topBox{
    // 	border-bottom: 1px solid #EBEEF5;
    // }
    // .action{
    // 	padding: 10px 0;
    // 	height: 32px;
    // }

    .table_img {
        width: 50px;
        height: 50px;
    }
    .table {
        .table_img {
            width: 50px;
            height: 50px;
        }
    }

    .addForm {
        .el-form-item__label-wrap {
            margin-left: 0px !important; //新增的所有label 靠左显示
        }
        .el-table::before {
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0px;
        }
        .el-input {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
        .tipText {
            padding-left: 12px;
            color: #999;
        }
    }
    //图片上传
    // /deep/ .avatar-uploader{
    // 	border: 1px dashed #d9d9d9;
    // 	border-radius: 6px;
    // 	cursor: pointer;
    // 	position: relative;
    // 	overflow: hidden;
    // }
    // /deep/ .avatar-uploader .el-upload:hover {
    // 	border-color: #409EFF;
    // }
    /deep/ .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 90px;
        height: 90px;
        line-height: 90px;
        text-align: center;
    }
    /deep/ .avatar-uploader-icon:hover {
        border-color: #409eff;
    }
    .avatar {
        width: 90px;
        height: 90px;
        display: block;
    }
    .el-upload__tip {
        padding-left: 20px;
    }

    // /deep/ .switch .el-form-item__content{
    // 	padding-top: 6px;
    // }

    .uploadDialog {
        /deep/ .el-dialog__body {
            padding: 30px 20px 60px;
            // .el-upload-dragger{
            // 	width: 632px;
            // }
            .el-upload__tip {
                padding-left: 20px;
            }
            .uploadBTtn {
                float: right;
            }
        }
    }
</style>
