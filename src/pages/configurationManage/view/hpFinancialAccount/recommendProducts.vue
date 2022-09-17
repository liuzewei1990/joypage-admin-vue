<template>
    <!-- 配置管理--普惠理财账-推荐产品 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="展现形式：" prop="showType">
                        <BcSelectStr v-model="topCheckData.showType" :list="allSelectData.showTypeList" :filterable="true" :remote="true" :placeholder="'请选择'" :clearable="true"></BcSelectStr>
                    </el-form-item>
                    <el-form-item label="投放渠道：" prop="appFlag">
                        <BcSelectStr v-model="topCheckData.appFlag" :list="allSelectData.appFlagList" :filterable="true" :remote="true" :placeholder="'请选择'" :clearable="true"></BcSelectStr>
                    </el-form-item>
                    <el-form-item label="可见用户：" prop="advVisibleUesr">
                        <BcSelectStr
                            v-model="topCheckData.advVisibleUesr"
                            @GetApiData="SetAvailableUserList($event)"
                            :filterable="true"
                            :remote="true"
                            :placeholder="'请选择'"
                            :clearable="true"></BcSelectStr>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" :size="size" icon="el-icon-plus" style="float: left" type="primary" @click="handleBtn()">新增</el-button>
                <el-button icon="el-icon-refresh" :size="size" style="float: right" @click="resetForm()">重置</el-button>
                <el-button icon="el-icon-search" :size="size" style="float: right" type="primary" @click="getRecommendedList('chaxun')">查询</el-button>
                <!-- <el-button icon="el-icon-search" :size="size" style="float:right" type="primary" @click="aaa()">查询11111</el-button> -->
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
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center" fixed="left"></el-table-column>
                <el-table-column prop="showType" label="展现形式" header-align="center" align="center" width="80px">
                    <template slot-scope="scope">
                        <p v-if="scope.row.showType == 1" :size="size">产品</p>
                        <p v-if="scope.row.showType == 2" :size="size">图片</p>
                    </template>
                </el-table-column>
                <el-table-column prop="advImgUrl" label="广告图" header-align="center" align="center">
                    <template slot-scope="scope">
                        <img v-if="scope.row.showType == 2" class="table_img" :src="imageUrl + scope.row.advImgUrl" alt="" />
                    </template>
                </el-table-column>
                <el-table-column prop="orgName" :label="'所属机构'" header-align="center" align="center" width="120"></el-table-column>
                <el-table-column prop="prdIndexName" :label="'产品名称'" header-align="center" align="center" width="120"></el-table-column>
                <el-table-column prop="contentTypeName" :label="'列表跳转类型'" header-align="center" align="center" width="120">
                    <!-- 1:链接 2:活动 3:产品 4:机构 5:资讯 6:建行链接地址 7:光大银行链接地址  8:登录',\n -->
                    <!-- <template slot-scope="scope">
					<p v-if="scope.row.contentType==1" :size="size">链接</p>
					<p v-if="scope.row.contentType==2" :size="size">活动</p>
					<p v-if="scope.row.contentType==3" :size="size">产品</p>
					<p v-if="scope.row.contentType==4" :size="size">机构</p>
					<p v-if="scope.row.contentType==5" :size="size">资讯</p>
					<p v-if="scope.row.contentType==6" :size="size">建行链接地址</p>
					<p v-if="scope.row.contentType==7" :size="size">光大银行链接地址</p>
					<p v-if="scope.row.contentType==8" :size="size">登录</p>
				</template> -->
                </el-table-column>
                <el-table-column prop="contentName" :label="'列表跳转内容'" header-align="center" align="center" width="120"></el-table-column>
                <el-table-column prop="advOrder" label="排序" header-align="center" align="center" width="60"></el-table-column>
                <el-table-column prop="advVisibleUesrName" label="可见用户" header-align="center" align="center">
                    <!--  0:全部 1:登录用户 2:未登录用户 3:新用户 4:老用户 5:未注册的新设备', -->
                    <!-- <template slot-scope="scope">
					<p v-if="scope.row.advVisibleUesr==0" :size="size">全部</p>
					<p v-if="scope.row.advVisibleUesr==1" :size="size">登录用户</p>
					<p v-if="scope.row.advVisibleUesr==2" :size="size">未登录用户</p>
					<p v-if="scope.row.advVisibleUesr==3" :size="size">新用户</p>
					<p v-if="scope.row.advVisibleUesr==4" :size="size">老用户</p>
					<p v-if="scope.row.advVisibleUesr==5" :size="size">未注册的新设备</p>
				</template> -->
                </el-table-column>
                <el-table-column prop="appFlagsNames" label="投放渠道" header-align="center" align="center">
                    <!-- <template slot-scope="scope">
					<p v-if="scope.row.appFlag=='BC'" :size="size">识贝比</p>
				</template> -->
                </el-table-column>
                <el-table-column prop="systemTypeNames" label="发布设备" header-align="center" align="center">
                    <!-- <template slot-scope="scope">
					<p v-if="scope.row.advPlatform=='android'" :size="size">安卓</p>
					<p v-if="scope.row.advPlatform=='ios'" :size="size">苹果</p>
					<p v-if="scope.row.advPlatform=='android,ios'" :size="size">安卓,苹果</p>
					<p v-if="scope.row.advPlatform=='ios,android'" :size="size">苹果,安卓</p>
				</template> -->
                </el-table-column>
                <el-table-column prop="sandboxId" label="监管沙盒" header-align="center" align="center"></el-table-column>
                <el-table-column prop="advImgMemo" label="备注" header-align="center" align="center"></el-table-column>
                <el-table-column prop="state" label="是否开启" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.state == 0" :size="size">已开启</p>
                        <p v-if="scope.row.state == 1" :size="size">已停用</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUpdateState(scope.row, scope.$index, 0)" v-if="scope.row.state == 1">开启</el-button>
                        <el-button size="mini" type="text" @click="handleUpdateState(scope.row, scope.$index, 1)" v-else>停用</el-button>
                        <el-button size="mini" type="text" @click="handleBtn(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    // 接口函数依次：获取所有标签，功能开关，查询列表，新增，修改，删除
    import { getRecommendedList, getUpdateState, getRecommendedDelete } from "../../apis/index";
    import config from "../../config/config.index.js";
    import BcSelectStr from "./BcSelectStr";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "EarningsUpgrades",
        components: { CommonTable, BcSelectStr },
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
                    showType: "", //展现形式
                    appFlag: "", //投放渠道
                    advVisibleUesr: "" //可见用户
                },
                loading: false, //请求列表时loading
                proName: "", //内容-内容
                pageRequest: {
                    //内容分页
                    pageNum: "1",
                    pageSize: "10",
                    totalPage: "0"
                },
                state: 0, //是否开启  0开，1关
                current: -1,
                recommendedList: [
                    // {
                    //     id:'', //
                    //     showType: '', //'展现形式，1产品,2图片
                    //     advImgUrl:'', //广告图
                    //     contentType:'', //列表跳转类型
                    //     content:'', //列表跳转内容
                    //     advOrder: '', //排序
                    //     advVisibleUesr: '', //可见用户
                    //     appFlag: '', //投放渠道
                    //     advPlatform: [], //发布设备
                    //     sandboxId: [], //监管沙盒
                    //     advImgMemo:'', //备注
                    //     state:'', //是否开启 0开，1停
                    // }
                ], //请求回来的表格列表数据list
                allSelectData: {
                    showTypeList: [
                        {
                            name: "产品",
                            value: 1
                        },
                        {
                            name: "图片",
                            value: 2
                        }
                    ], //展示类型list
                    appFlagList: [
                        {
                            name: "识贝比",
                            value: "BC"
                        }
                    ] //渠道list
                }
            };
        },
        mounted() {
            //图片初始化地址：
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);
            this.getRecommendedList(); //列表数据
        },
        methods: {
            aaa() {
                //测试
                // this.$msg.success('success')
                // this.$msg.fail('fail')
                // this.$msg.error('error')
            },
            // 可见用户列表
            async SetAvailableUserList($event) {
                // let { query, callback } = $event;
                let data = await this.$api.getAvailableUser().then((res) => res.data || {});
                // console.log('21212',data)
                $event.callback({ list: data.availableUserList });
            },

            // 获取列表数据
            async getRecommendedList(type) {
                this.loading = true;
                if (type == "chaxun") {
                    console.log("chauxn");
                    this.pageRequest.pageNum = 1; //初始化--第一条开始查
                    this.pageRequest.pageSize = 10; //初始化--查询10条
                }
                let params = {
                    headerModel: this.headerModel, //接口固定入参,
                    datatypeParam: {
                        length: this.pageRequest.pageSize, //查询多少条
                        currentPage: this.pageRequest.pageNum, //当前页数
                        showType: this.topCheckData.showType, //展现形式
                        appFlag: this.topCheckData.appFlag, //投放渠道
                        advVisibleUesr: this.topCheckData.advVisibleUesr //可见用户
                    }
                };
                console.log("列表数据入参", params.datatypeParam);
                try {
                    let resData = await getRecommendedList(params); //接口
                    console.log("列表数据", resData);
                    this.loading = false;
                    this.recommendedList = resData.retList; //列表list
                    this.totalSize = resData.totalCount; //总条数
                } catch (error) {
                    this.$message({ message: "数据获取异常", type: "error" });
                }
                setTimeout(() => {
                    this.loading = false;
                }, 100);
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getRecommendedList(); //调基金公司列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getRecommendedList(); //调产品系列列表接口
            },
            //重置
            resetForm() {
                console.log("重置");
                this.$refs.topData.resetFields();
                this.getRecommendedList(); //调产品系列列表接口
            },

            //点击开启/停用，请求接口修改开关
            async handleUpdateState(row, index, type) {
                let params = {
                    id: row.id,
                    state: row.state == 0 ? 1 : 0 //0 、关 1、开
                };
                console.log(params);
                await getUpdateState(params); //调接口
                this.getRecommendedList(); //成功后刷新接口改变state的值
            },

            // 点击新增/修改--跳页
            handleBtn: function (row, index) {
                console.log("新增/编辑", row);
                let data = {
                    id: row ? row.id : "", //ID存在为修改，不存在为新增
                    state: row ? row.state : "" //状态
                };
                console.log("url传参", encodeURIComponent(JSON.stringify(data)));
                this.$router.push({
                    path: "/recommendAdd",
                    query: {
                        data: encodeURIComponent(JSON.stringify(data))
                    }
                });
            },

            // 点击删除
            handleDelete(index, row) {
                console.log("单个删除", row);
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            headerModel: this.headerModel,
                            datatypeParam: { ids: row.id }
                        };
                        console.log("单个删除入参", params);
                        getRecommendedDelete(params)
                            .then((resData) => {
                                console.log("删除接口", resData);
                                this.loading = false;
                                this.$message({ message: "删除成功", type: "success" });
                                this.getRecommendedList(); //刷新当前页
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
