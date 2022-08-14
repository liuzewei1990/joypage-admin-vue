<template>
<!-- 配置管理  首页配置  综合配置 -->
  <div class="adverLocationtList">
    <el-form :size='size' :model='formSearch' ref='formSearch' :inline="true" class="searchForm demo-form-inline">
      <el-form-item label="标题" prop='title'>
        <el-input type='text' clearable v-model="formSearch.title" placeholder="请输入关键字"></el-input >
      </el-form-item>
      <el-form-item label="来源" prop='source'>
        <el-input type='text' clearable v-model="formSearch.source" placeholder="请输入关键字"></el-input >
      </el-form-item>
      <el-form-item label="时间" prop='time'>
        <el-date-picker
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="跳转类型" prop='contentType'>
        <el-select  clearable   v-model="formSearch.contentType" placeholder="">
          <el-option v-for='(item,index) in contentTypeList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户分群" prop='userGroup'>
        <el-select  clearable   v-model="formSearch.userGroup" placeholder="">
          <el-option v-for='(item,index) in UserLvList' :key='index' :label="item.DIC_NAME" :value="item.DIC_VALUE"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-inline btnCon">
      <el-form-item>
        <el-button :size='size' icon='el-icon-search' type="primary" @click="onSubmit">查询</el-button>
        <el-button :size='size' icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class='add'>
      <el-button :size='size' icon="el-icon-plus" type="primary" @click="add">新增{{advTypeTxt}}</el-button>
    </div>
    <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开--> 
    <el-table :data="contentList" style="width: 100%" border="true">
        <el-table-column type="index" :index="indexMethod" label="编号" width="100" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='180px' prop="activityName" label="活动名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="contentType" label="跳转类型" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-for='(item,index) in contentTypeList' :key='index'>
              <span v-if='scope.row.contentType==item.value'>{{item.name}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="用户分群" header-align="center" align="center"></el-table-column>
        <el-table-column prop="seqOrder" label="排序值" header-align="center" align="center"></el-table-column>
        <el-table-column prop="isTop" label="是否置顶" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.isTop==0'>否</span>
            <span v-if='scope.row.isTop==1'>是</span>
          </template>
        </el-table-column>
        <el-table-column min-width='140px' prop="lableUrl" label="角标图片" header-align="center" align="center">
          <template slot-scope="scope">
            <img style='width:50px' v-if='scope.row.lableUrl!=""&&scope.row.lableUrl!=null' :src="$Config.aliyuncHost+scope.row.lableUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column min-width="200px" prop="startTime" label="发布时间" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.startTime.split(" ")[0]}}~{{scope.row.endTime.split(" ")[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" prop="updateTime" label="修改时间" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button :size="size" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index)">修改</el-button>
          </template>
			  </el-table-column>
    </el-table>
    <!--分页栏-->
		<div class="toolbar" style="padding:10px 0;">
			<el-pagination layout="total, sizes, prev, pager, next, jumper" style="float:right;"
				:total="totalSize"
				@current-change="refreshPageRequest"  
				@size-change="handleSizeChange"
				:current-page="pageRequest.pageNum" 
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageRequest.pageSize">
			</el-pagination>
		</div>
  </div>
</template>

<script>
import { queryParameter,comprehensiveList,deleteComprehensive } from "../../apis/index"
export default {
	name: 'compositeSetting',
	components:{},
	data() {
		return {
      size: 'small',
      time:null,
      contentList:[],
      formSearch: {
        title: '',
        source: "",
        userGroup: '',
        startTime:'',
        endTime:'',
        contentType:''
      },
      totalSize: 0, //总数
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      // 用户分群  取的是会员等级列表数据
      UserLvList:[],
      contentTypeList:[],
			loading: false, //请求产品类别时loading
			// 编辑
		}
  },
  mounted() {
    sessionStorage.setItem('detailMsg',null)
    this.queryParameterFun()
    this.comprehensiveListFun()
	},
	methods: {
    // 会员等级查询
    queryParameterFun () {
      let params= {
        
      }
      queryParameter(params) .then((res) => {
        if (res.result) {
          this.UserLvList=res.data.groupList
          this.contentTypeList=res.data.contentTypeList
          console.log(this.UserLvList)
        }
      })
    },
    // 查询列表数据
    comprehensiveListFun () {
      this.contentList=[]
      let params= {
        title: this.formSearch.title,
        source: this.formSearch.source,
        userGroup: this.formSearch.userGroup,
        startTime:this.time==null?"":this.time[0],
        endTime:this.time==null?"":this.time[1],
        contentType:this.formSearch.contentType,
        pageNum: this.pageRequest.pageNum,
        pageSize: this.pageRequest.pageSize
      }
      comprehensiveList(params).then((res) => {
        if (res.result) {
          this.totalSize=res.data.totalCount
          this.contentList=res.data.data
        }
      })
    },
    // 重置
    reset () {
      this.$refs.formSearch.resetFields()
      this.pageRequest.pageNum=1
      this.time=null
      this.comprehensiveListFun() 
    },
    handleSizeChange () {

    },
    // 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.comprehensiveListFun() //调产品系列列表接口
		},
    // 删除
    handleDelete (index,row) {
      let _index=index
      this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
				let params={
          ID: row.id
        }
        deleteComprehensive(params).then((res) => {
          if (res.result) {
            this.comprehensiveListFun()
          } else {
            this.$message.error('删除失败');
          }
        })
				
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});          
			});
      
    },
    // 修改
    handleEdit (row,index) {
      this.$router.push({
        path: '/AddCompositeSetting',
        query: {
          type: '修改',
          id: row.id
        }
      })
      sessionStorage.setItem('detailMsg',JSON.stringify(row))
    },
    indexMethod (index) {
      return (this.pageRequest.pageNum-1)*this.pageRequest.pageSize+(index+1)
    },
    add () {
      this.$router.push({
        path: '/AddCompositeSetting',
        query: {
          type: '新增'
        }
      })
    },
    onSubmit () {
      this.pageRequest.pageNum=1
      this.comprehensiveListFun() 
    }
	},
	
}
</script>

<style lang="less" scoped>
.adverLocationtList{
  padding: 20px;
 
  .btnCon {
    display: flex;
    justify-content: flex-end;
  }
  .editBtn {
    margin-bottom: 20px;
  }
  .el-table thead {
    color: #909399;
    font-weight: 500;
    font-size: 14px;
  }
  .el-table--mini td, .el-table--mini th {
    padding: 10px 0;
  }
  .el-select.el-select--small {
    width: 100%;
  }
}
 /deep/ .searchForm .el-input, /deep/ .searchForm .el-select{
  width: 180px;
}
.btnCon {
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #EBEEF5;
}
.add{
  margin: 18px 0;
}
</style>
