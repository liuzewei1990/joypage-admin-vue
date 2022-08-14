<template>
<!-- 配置管理  首页配置  综合配置 -->
  <div class="adverLocationtList">
    <el-form :size='size' :model='formSearch' ref='formSearch' :inline="true" class="searchForm demo-form-inline">
      
      <el-form-item label="渠道筛选" prop='appFlag'>
        <el-select  clearable   v-model="formSearch.appFlag" placeholder="">
          <el-option  label="全选" value=""></el-option>
          <el-option  label="识贝比" value="BC"></el-option>
          <el-option  label="识贝拼" value="PC"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统筛选" prop='systemType'>
        <el-select  clearable   v-model="formSearch.systemType" placeholder="">
          <el-option label="全部" value=""></el-option>
          <el-option label="安卓" value="android"></el-option>
          <el-option label="苹果" value="ios"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form :inline="true" class="demo-form-inline btnCon">
        <el-form-item>
          <el-button :size='size' icon='el-icon-search' type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
      <div class='add'>
        <el-button :size='size' icon='el-icon-search' type="primary" @click="add">新增</el-button>
      </div>
    </el-form>
    <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开--> 
    <el-table :data="contentList" style="width: 100%" border="true">
        <el-table-column prop='id' label="ID" width="100" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='180px' prop="userName" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='180px' prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='180px' prop="activityName" label="图片预览" header-align="center" align="center">
          <template slot-scope="scope">
            <img style='width:50px' :src="$Config.aliyuncHost+scope.row.imgUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column  min-width='180px' prop="buttonName" label="按键名称" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='180px' prop="effectiveDatetime" label="生效时间" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='180px' prop="isEnable" label="是否启用" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.isEnable=="1"?"是":"否"}}
          </template>
        </el-table-column>
        <el-table-column  min-width='180px' prop="appFlag" label="渠道" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.appFlag.indexOf("BC")>-1'>识贝比</span>
            <span v-if='scope.row.appFlag.indexOf("BC")>-1&&scope.row.appFlag.indexOf("PC")>-1'>、</span>
            <span v-if='scope.row.appFlag.indexOf("PC")>-1'>识贝拼</span>
          </template>
        </el-table-column>
        <el-table-column  min-width='180px' prop="systemType" label="系统" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.systemType.indexOf("android")>-1'>安卓</span>
            <span v-if='scope.row.systemType.indexOf("android")>-1&&scope.row.systemType.indexOf("ios")>-1'>、</span>
            <span v-if='scope.row.systemType.indexOf("ios")>-1'>苹果</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="240" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button :size="size" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index)">修改</el-button>
          </template>
			  </el-table-column>
    </el-table>
    <!--分页栏-->
		<div class="toolbar" style="padding:10px 0;">
			<el-pagination layout="total, prev, pager, next, jumper" style="float:right;"
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
import { getlistWealth,deleteWealth } from "../../../apis/index"
export default {
	name: 'compositeSetting',
	components:{},
	data() {
		return {
      size: 'small',
      time:null,
      formSearch: {
        systemType: '',
        appFlag:''
      },
      contentList:[],
      totalSize: 0, //总数
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
			loading: false, //请求产品类别时loading
			// 编辑
		}
  },
  mounted() {
    sessionStorage.setItem('detailMsg',null)
    this.getlistWealthFun()
	},
	methods: {
    // 查询列表数据
    getlistWealthFun () {
      this.contentList=[]
      let params= {
        appFlag: this.formSearch.appFlag,
        systemType: this.formSearch.systemType
      }
      getlistWealth(params).then((res) => {
        if (res.result) {
          this.contentList=res.data
          this.totalSize=res.data.length
        } else {
          this.$message.error(res.description)
        }
      }).catch((error) => {
        this.$message.error('接口错误')
      })
    },
    // 重置
    reset () {
      this.$refs.formSearch.resetFields()
      this.pageRequest.pageNum=1
      this.getlistWealthFun() 
    },
    handleSizeChange () {

    },
    // 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.getlistWealthFun() //调产品系列列表接口
		},
    // 删除
    handleDelete (index,row) {
      let _index=index
      this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
				let params={
          ids: row.id
        }
        deleteWealth(params).then((res) => {
          if (Number(res.code)===0) {
            this.getlistWealthFun()
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
        path: '/wealth/addlogon',
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
        path: '/wealth/addlogon',
        query: {
          type: '新增'
        }
      })
    },
    onSubmit () {
      this.pageRequest.pageNum=1
      this.getlistWealthFun() 
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
