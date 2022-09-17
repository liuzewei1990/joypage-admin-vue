<template>
    <!-- 分享管理 -->
    <div class="shareList">
        <el-form :inline="true" :size="size" class="searchForm" :model="searchForm" ref="searchForm">
            <el-form-item label="名称:" prop="lvName">
                <el-input type="text" v-model="searchForm.lvName" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item label="等级编号:" prop="lvCode">
                <el-input type="text" v-model="searchForm.lvCode" placeholder="请输入等级编号"></el-input>
            </el-form-item>

            <div class="btnCon">
                <el-form-item>
                    <el-button :size="size" icon="el-icon-plus" type="primary" @click="add">新增会员等级</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
                    <el-button :size="size" icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
            </div>
        </el-form>

        <el-table :data="contentList" style="width: 100%" border="true" :loading="tabLoading">
            <el-table-column type="index" :index="indexMethod" label="编号" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column prop="lvName" label="等级名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="lvLogo" label="等级图标" width="140" header-align="center" align="center">
                <template slot-scope="scope">
                    <img style="width: 80px" :src="$Config.aliyuncHost + scope.row.lvLogo" alt="" />
                </template>
            </el-table-column>
            <el-table-column prop="lvBackGround" label="等级底色" header-align="center" align="center"></el-table-column>
            <el-table-column prop="userLv" label="会员等级" header-align="center" align="center"></el-table-column>
            <el-table-column prop="lvCode" label="会员等级编号" width="140" header-align="center" align="center"></el-table-column>
            <el-table-column prop="exp" label="经验值" header-align="center" align="center"></el-table-column>
            <el-table-column prop="integralUp" label="积分加成" header-align="center" align="center"></el-table-column>
            <!-- <el-table-column prop="lvDescribe" label="等级说明" header-align="center" align="center">
        <template slot-scope="scope">
          <div v-html='scope.row.lvDescribe'></div>
        </template>
      </el-table-column> -->
            <el-table-column label="操作" width="100" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type='text' @click="getActInfoByIdFun(scope.row,scope.$index)">删除</el-button> -->
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
    import { queryUserLvList } from "../apis/index";
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
                searchForm: {
                    lvCode: "",
                    lvName: ""
                },
                contentList: [],
                fullscreenLoading: true,
                pageParams: {
                    pageSize: 10,
                    pageNum: 0,
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
            this.$nextTick(() => {
                this.fullscreenLoading = false;
            });
            this.queryUserLvListFun();
        },
        methods: {
            // 查询列表数据
            queryUserLvListFun() {
                let params = {
                    lvName: this.searchForm.lvName,
                    lvCode: this.searchForm.lvCode,
                    start: this.pageParams.pageNum,
                    length: this.pageParams.pageSize
                };
                queryUserLvList(params).then((res) => {
                    if (res.result) {
                        this.pageParams.totalPage = res.data.totalCount;
                        this.contentList = res.data.data;
                    }
                });
            },
            // /添加
            add() {
                this.$router.push({
                    path: "/addMemberLevel",
                    query: {
                        type: "add"
                    }
                });
            },
            // 重置
            reset() {
                this.contentList = [];
                this.$refs.searchForm.resetFields();
                this.pageParams.pageNum = 0;
            },
            handleSizeChange() {},
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageParams.pageNum = val;
                // this.advertPageListFun() //调产品系列列表接口
            },
            // 删除
            handleDelete(index, row) {
                let _index = index;
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        let params = {
                            id: row.id
                        };
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 修改
            handleEdit(row, index) {
                this.$router.push({
                    path: "/addMemberLevel",
                    query: {
                        type: "edit",
                        id: row.id
                    }
                });
            },

            indexMethod(index) {
                return this.pageParams.pageNum * this.pageParams.pageSize + (index + 1);
            },
            onSubmit() {
                this.pageParams.pageNum = 0;
                this.queryUserLvListFun();
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
