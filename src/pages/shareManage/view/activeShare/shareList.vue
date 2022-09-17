<template>
    <!-- 分享管理 -->
    <div class="shareList">
        <el-form :inline="true" :size="size" class="searchForm" :model="searchForm" ref="searchForm">
            <el-form-item label="搜索" prop="appName">
                <el-input clearable type="text" v-model="searchForm.activityName" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item label="活动名称" prop="activityId">
                <el-select clearable v-model="searchForm.activityId" placeholder="">
                    <el-option v-for="(item, index) in activeList" :key="index" :value="item.id" :label="item.name">{{ item.name }}</el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分享入口渠道" prop="appFlag">
                <el-select clearable v-model="searchForm.appFlag">
                    <el-option value="TY" label="全部"></el-option>
                    <el-option value="BC" label="比财"></el-option>
                    <el-option value="PC" label="拼财"></el-option>
                    <el-option value="PMP" label="小程序"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分享至" prop="sharePlace">
                <el-select clearable v-model="searchForm.sharePlace">
                    <el-option value="TY" label="全部"></el-option>
                    <el-option value="0" label="微信好友"></el-option>
                    <el-option value="1" label="微信朋友圈"></el-option>
                    <el-option value="4" label="短信邀请"></el-option>
                    <el-option value="5" label="扫码邀请"></el-option>
                    <el-option value="2" label="QQ好友"></el-option>
                    <el-option value="3" label="QQ空间"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分享入口设备" prop="deviceType">
                <el-select clearable v-model="searchForm.deviceType">
                    <el-option value="TY" label="全部"></el-option>
                    <el-option value="ANDROID" label="安卓"></el-option>
                    <el-option value="IOS" label="苹果"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="time">
                <el-date-picker
                    clearable
                    v-model="searchForm.time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择时间范围">
                </el-date-picker>
            </el-form-item>
            <div class="btnCon">
                <el-form-item>
                    <el-button :size="size" icon="el-icon-plus" type="primary" @click="add">新增活动分享</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
                    <el-button :size="size" icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
            </div>
        </el-form>

        <el-table :data="contentList" style="width: 100%" border="true" :loading="tabLoading">
            <el-table-column type="index" :index="indexMethod" label="编号" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column prop="activityName" label="活动名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="appFlag" label="分享入口渠道" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.appFlag === 'TY'">全部</span>
                    <span v-if="scope.row.appFlag.indexOf('BC') >= 0">比财 </span>
                    <span v-if="scope.row.appFlag.indexOf('PC') >= 0">拼财 </span>
                    <span v-if="scope.row.appFlag.indexOf('PMP') >= 0">小程序 </span>
                </template>
            </el-table-column>
            <el-table-column prop="sharePlace" label="分享至" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.sharePlace === 'TY'">全部</span>
                    <span v-if="scope.row.sharePlace === '0'">微信好友</span>
                    <span v-if="scope.row.sharePlace === '1'">微信朋友圈</span>
                    <span v-if="scope.row.sharePlace === '4'">短信邀请</span>
                    <span v-if="scope.row.sharePlace === '5'">扫码邀请</span>
                    <span v-if="scope.row.sharePlace === '2'">QQ好友</span>
                    <span v-if="scope.row.sharePlace === '3'">QQ空间</span>
                </template>
            </el-table-column>
            <el-table-column prop="deviceType" label="分享入口设备" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.deviceType === 'TY'">全部</span>
                    <span v-if="scope.row.deviceType === 'ANDROID'">安卓</span>
                    <span v-if="scope.row.deviceType === 'IOS'">苹果</span>
                </template>
            </el-table-column>
            <el-table-column prop="shareType" label="分享方式" header-align="center" align="center">
                <template slot-scope="scope">
                    <!-- 分享方式 0:图片 1:链接 2: 小程序 -->
                    <span v-if="scope.row.shareType === '0'">图片</span>
                    <span v-if="scope.row.shareType === '1'">链接</span>
                    <span v-if="scope.row.shareType === '2'">小程序</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" width="200" label="创建时间" header-align="center" align="center"></el-table-column>
            <el-table-column prop="adminName" label="创建人" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                    <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding: 10px 0">
            <el-pagination
                layout="total, prev, pager, next, jumper"
                style="float: right"
                :total="pageParams.totalPage"
                @current-change="refreshPageRequest"
                @size-change="handleSizeChange"
                :current-page="pageParams.pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageParams.pageSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { getActShareList, delActShare } from "../../apis/index";
    export default {
        name: "advertListManage",
        components: {},
        data() {
            return {
                activeList: JSON.parse(sessionStorage.getItem("activityList")),
                tabLoading: true,
                size: "small",
                searchForm: {
                    activityName: "",
                    appFlag: "",
                    sharePlace: "",
                    deviceType: "",
                    activityId: "",
                    time: null
                },
                contentList: [],
                fullscreenLoading: true,
                pageParams: {
                    pageSize: 10,
                    pageNum: 1,
                    totalPage: 0
                }
            };
        },
        computed: {},
        created() {
            this.getActShareListFun();
        },
        mounted() {
            this.$nextTick(() => {
                this.fullscreenLoading = false;
            });
        },
        methods: {
            getActShareListFun() {
                this.contentList = [];
                let params = {
                    activityName: this.searchForm.activityName,
                    startTime: this.searchForm.time === null ? "" : this.searchForm.time[0],
                    endTime: this.searchForm.time === null ? "" : this.searchForm.time[1],
                    appFlag: this.searchForm.appFlag,
                    sharePlace: this.searchForm.sharePlace,
                    deviceType: this.searchForm.deviceType,
                    activityId: this.searchForm.activityId,
                    pageSize: this.pageParams.pageSize,
                    currentPage: this.pageParams.pageNum
                };
                this.tabLoadin = true;
                getActShareList(params)
                    .then((res) => {
                        if (res.result) {
                            this.tabLoading = false;
                            this.contentList = res.data.retList;
                            this.pageParams.totalPage = res.data.totalCount;
                        } else {
                            this.tabLoading = false;
                            this.$message({ type: "info", message: res.description });
                        }
                    })
                    .catch((error) => {
                        this.tabLoading = false;
                    });
            },
            // /添加
            add() {
                this.$router.push({
                    path: "/addActiveShare",
                    query: {
                        type: "add"
                    }
                });
            },
            // 重置
            reset() {
                this.contentList = [];
                this.$refs.searchForm.resetFields();
                this.pageParams.pageNum = 1;
            },
            handleSizeChange() {},
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageParams.pageNum = val;
                // this.advertPageListFun() //调产品系列列表接口
            },
            // 删除
            handleDelete(row, index) {
                let _index = index;
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        let params = {
                            id: row.id
                        };
                        delActShare(params).then((res) => {
                            if (res.result) {
                                this.$message({ type: "success", message: "删除成功" });
                                this.getActShareListFun();
                            } else {
                                this.$message({ type: "info", message: res.description });
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 修改
            handleEdit(row, index) {
                console.log(row);
                this.$router.push({
                    path: "/addActiveShare",
                    query: {
                        type: "edit",
                        id: row.id
                    }
                });
            },
            indexMethod(index) {
                return (this.pageParams.pageNum - 1) * this.pageParams.pageSize + (index + 1);
            },
            onSubmit() {
                this.pageParams.pageNum = 1;
                this.getActShareListFun();
            }
        }
    };
</script>

<style lang="less" scoped>
    .shareList {
        padding: 20px;
        .btnCon {
            display: flex;
            justify-content: space-between;
        }
        .tabCon {
            margin-bottom: 20px;
            .tab {
                background: transparent;
                border: none;
                margin-right: 20px;
                outline: none;
                padding: 20px;
                padding-top: 0;
            }
            .active-tab {
                border-bottom: 1.5px solid #409eff;
                color: #409eff;
            }
        }
        .add {
            margin: 18px 0;
        }
        .editBtn {
            margin-bottom: 20px;
        }
        .el-table thead {
            color: #909399;
            font-weight: 500;
            font-size: 14px;
        }
        .el-table--mini td,
        .el-table--mini th {
            padding: 10px 0;
        }
        .el-select.el-select--small {
            width: 100%;
        }
        /deep/ .searchForm .el-input,
        /deep/ .searchForm .el-select {
            width: 180px;
        }
    }
</style>
