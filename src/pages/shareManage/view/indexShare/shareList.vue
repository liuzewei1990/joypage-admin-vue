<template>
    <!-- 分享管理 -->
    <div class="shareList">
        <el-form :inline="true" :size="size" class="searchForm" :model="searchForm" ref="searchForm">
            <el-form-item label="分享入口渠道" prop="appFlag">
                <el-select v-model="searchForm.appFlag">
                    <el-option value="" label="全部"></el-option>
                    <el-option value="1" label="比财"></el-option>
                    <el-option value="2" label="拼财"></el-option>
                    <el-option value="3" label="小程序"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分享至" prop="shareDestination">
                <el-select v-model="searchForm.shareDestination">
                    <el-option value="" label="全部"></el-option>
                    <el-option value="1" label="微信好友"></el-option>
                    <el-option value="2" label="微信朋友圈"></el-option>
                    <el-option value="5" label="短信邀请"></el-option>
                    <el-option value="3" label="QQ好友"></el-option>
                    <el-option value="4" label="QQ空间"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分享入口设备" prop="deviceType">
                <el-select v-model="searchForm.deviceType">
                    <el-option value="" label="全部"></el-option>
                    <el-option value="1" label="安卓"></el-option>
                    <el-option value="2" label="苹果"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="time">
                <el-date-picker
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
                    <el-button :size="size" icon="el-icon-plus" type="primary" @click="add">新增首页分享</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
                    <el-button :size="size" icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
            </div>
        </el-form>

        <el-table :data="contentList" style="width: 100%" border="true" :loading="tabLoading">
            <el-table-column type="index" :index="indexMethod" label="编号" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column prop="appFlagStr" label="分享入口渠道" header-align="center" align="center"> </el-table-column>
            <el-table-column prop="shareDestinationStr" label="分享至" header-align="center" align="center"></el-table-column>
            <el-table-column prop="deviceTypeStr" label="分享入口设备" header-align="center" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200" header-align="center" align="center"></el-table-column>
            <el-table-column prop="createName" label="创建人" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    // 接口函数依次：广告列表页查询
    import { forSharePageList, delShare } from "../../apis/index";
    export default {
        name: "advertListManage",
        components: {},
        data() {
            return {
                tabLoading: true,
                size: "small",
                type: 1,
                loading: false, //请求产品类别时loading
                saveLoading: false, //保存时按钮loading
                category: 1,
                searchForm: {
                    appFlag: "",
                    shareDestination: "",
                    deviceType: "",
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
            if (this.$route.query.type) {
                // this.advertListFun (this.$route.query.type)
            } else {
                // this.advertListFun ("1")
            }
            // this.advertPageListFun()
        },
        mounted() {
            this.forSharePageListFun();
            this.$nextTick(() => {
                this.fullscreenLoading = false;
            });
        },
        methods: {
            forSharePageListFun() {
                this.contentList = [];
                console.log(this.searchForm.time);
                let params = {
                    category: this.category,
                    appFlag: this.searchForm.appFlag, // 分享入口渠道 1:比财 2:拼财 3:小程序
                    shareDestination: this.searchForm.shareDestination, // 分享至 1:微信好友 2:微信朋友圈 3:QQ好友 4:QQ空间 5:短信邀请 6:扫码邀请
                    deviceType: this.searchForm.deviceType, // 设备 1:安卓 2:苹果
                    startTime: this.searchForm.time == null ? "" : this.searchForm.time[0], // 开始时间
                    endTime: this.searchForm.time == null ? "" : this.searchForm.time[1], // 结束时间
                    pageNum: this.pageParams.pageNum, //当前页数
                    pageSize: this.pageParams.pageSize
                };
                forSharePageList(params).then((res) => {
                    if (res.result) {
                        this.contentList = res.data.data;
                        this.pageParams.totalPage = res.data.totalCount;
                    }
                });
            },
            // /添加
            add() {
                this.$router.push({
                    path: "/addIndexShare",
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
                this.pageParams.pageNum = val;
                this.forSharePageListFun();
            },
            // 删除
            handleDelete(index, row) {
                let _index = index;
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        let params = {
                            id: row.id
                        };
                        delShare(params).then((res) => {
                            if (res.result) {
                                this.forSharePageListFun();
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
                this.$router.push({
                    path: "/addIndexShare",
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
                this.forSharePageListFun();
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
