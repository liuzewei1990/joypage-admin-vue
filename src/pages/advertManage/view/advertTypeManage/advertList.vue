<template>
<!-- 广告类型管理 -->
<CommonTable :isFluid="false" @height="tableHeight=$event">
  <!-- 标头查询区 -->
  <div slot="search" class="advertList">
    <section class='tabCon'>
      <button class='tab' :class='advType==1?"active-tab":""' @click='advertListFun(1)'>横幅广告</button>
      <button class='tab' :class='advType==2?"active-tab":""' @click='advertListFun(2)'>弹窗广告</button>
      <button class='tab' :class='advType==3?"active-tab":""' @click='advertListFun(3)'>开屏广告</button>
      <button class='tab' :class='advType==4?"active-tab":""' @click='advertListFun(4)'>悬浮广告</button>
    </section>
    <el-form :size='size' ref='formSearch' :model='formSearch' :inline="true" class="searchForm demo-form-inline">
      <el-form-item label="标题" prop='advTitle'>
        <el-input clearable v-model="formSearch.advTitle" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item label="可见用户" prop='advVisibleUser'>
        <el-select clearable v-model="formSearch.advVisibleUser" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.availableUserList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告内容类型" prop='contentType'>
        <el-select clearable @change='changeContentType' v-model="formSearch.contentType" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.contentTypeList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告内容" prop='content'>
        <el-input  v-if='formSearch.contentType=="1"' v-model="formSearch.content"></el-input>
        <el-select clearable v-else v-model="formSearch.content" filterable  placeholder="">
          <el-option v-for='(item,index) in contentList' :key='index' :label="item.name" :value="item.value"></el-option>

          <div style='text-align:center'>
            <el-button :disabled='pageParams.pageNum<=1' :size='size' type="text"  @click.stop="prevPage">上一页</el-button>
            <el-button  :disabled='pageParams.pageNum>=this.pageParams.totalPage' :size='size' type="text"  @click.stop="nextPage">下一页</el-button>
            <span style='color:#ccc;font-size:12px'>当前页{{pageParams.pageNum}}</span>
            <span style='color:#ccc;font-size:12px'>总页数{{pageParams.totalPage}}</span>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="广告位置" prop='advPositId'>
        <el-select clearable v-model="formSearch.advPositId" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.advPositionList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
  <!-- 操作按钮区 -->
  <div slot="action" class="btn">
    <el-button :size='size' icon="el-icon-plus"  style="float:left;" type="primary" @click="add">新增{{advTypeTxt}}</el-button>
    <el-button :size='size' icon="el-icon-refresh"  style="float:right;" @click="reset">重置</el-button>
    <el-button :size='size' icon='el-icon-search'  style="float:right;" type="primary" @click="onSubmit">查询</el-button>
  </div>
  <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开--> 
  <el-table size='mini'  :height="tableHeight" :loading='tabLoading' :data="advertList" style="width: 100%" border="true">
      <el-table-column type="index" :index="indexMethod" label="编号" width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="advTitle" min-width='160px' label="标题" header-align="center" align="center"></el-table-column>
      <el-table-column min-width='140px' prop="advVisibleUserStr" label="可见用户" header-align="center" align="center"></el-table-column>
      <el-table-column min-width='180px' prop="positName" label="广告位置" header-align="center" align="center"></el-table-column>
      <el-table-column prop="advOrder" label="广告权重" width='140' sortable header-align="center" align="center"></el-table-column>
      <el-table-column prop="advStatus" min-width='130px' label="广告状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if='scope.row.advStatus==1 '>不可用</span>
          <span style="margin-left: 10px" v-if='scope.row.advStatus==0 '>可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="showTimeDesc" width="110" label="显示时间" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" width="240" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button v-if='scope.row.topStatus==0' :size="size" type="text" @click="putTopFun(scope.row,scope.$index,$event)">取消</el-button>
          <el-button v-else :size="size" type="text" @click="putTopFun(scope.row,scope.$index,$event)">置顶</el-button>
          <el-button :size="size" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button :size="size" type="text" @click="handleEdit(scope.row,scope.$index)">修改</el-button>
        </template>
      </el-table-column>
  </el-table>
  <!--分页栏-->
  <div slot="footer" class="toolbar" style="padding:10px 0;">
    <el-pagination layout="total, prev, pager, next, jumper" style="float:right;"
      :total="totalSize"
      @current-change="refreshPageRequest"  
      @size-change="handleSizeChange"
      :current-page="pageRequest.pageNum" 
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageRequest.pageSize">
    </el-pagination>
  </div>
</CommonTable>
</template>

<script>
import CommonTable from "@common/finsuit-components/CommonTable"
// 接口函数依次：广告列表页查询
import { advertPageList, forAdvertPage, getContentByContentType, putTop,deleteAdvert } from "../../apis/index"
export default {
	name: 'advertListManage',
	components:{ CommonTable },
	data() {
		return {
      tableHeight: 0,
      tabLoading:true,
      size: 'small',
      totalSize: 0,
      pageRequest: {
        pageNum: 1,
        pageSize: 10
			},
      advTypeTxt: '',
      advType: 1,
			loading: false, //请求产品类别时loading
			advertList: [], //请求回来的产品类别列表数据list
			// 编辑
			editFormVisible: false,  //是否展示编辑弹框
      saveLoading: false,  //保存时按钮loading
      formSearch: {
        advTitle: '',
        advVisibleUser: '',
        contentType: '',
        content: '',
        advPositId: '',
      },
      contentList:[],
      advertParamByTypeList: {},
      fullscreenLoading: true,
      pageParams: {
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      contentTypeId: ''
		}
  },
  created () {
    if (this.$route.query.type) {
      this.advertListFun (this.$route.query.type)
    } else {
      this.advertListFun ("1")
    }
    // this.advertPageListFun()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullscreenLoading = false;
    })
    
	},
	methods: {
    // 置顶
    putTopFun (row,index,e) {
      let params=''
      console.log(e)
      console.log(e.currentTarget)
      putTop(params,row.id).then((res) => {
        console.log(res)
        if (Number(res.code)===0) {
          this.advertPageListFun()
        }
      })
    },
    // 重置
    reset () {
      this.contentList=[]
      this.$refs.formSearch.resetFields()
      this.pageRequest.pageNum=1
      this.advertPageListFun()
    },
    handleSizeChange () {

    },
    // 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.advertPageListFun() //调产品系列列表接口
		},
    // 广告列表查询
    advertPageListFun () {
      let params={
        advType: this.advType,
        advTitle: this.formSearch.advTitle,
        advVisibleUser: this.formSearch.advVisibleUser,
        contentType: this.formSearch.contentType,
        content:  this.formSearch.content,
        advPositId: this.formSearch.advPositId,
        pageNum: this.pageRequest.pageNum,
        pageSize: this.pageRequest.pageSize
      }
      advertPageList(params).then((res) => {
        console.log('广告列表查询',res.data)
        if (Number(res.code)===0) {
          this.tabLoading=false
          this.totalSize=res.data.totalCount
          this.advertList=res.data.data
        } else {
          this.tabLoading=false
          this.$message.error('获取数据失败');
        }
      }).catch((err) => {
        this.tabLoading=false
      })
    },
    // 初始化广告管理页面参数
    forAdvertPageFun () {
      let params={
        advType: this.advType
      }
      forAdvertPage(params).then((res) => {
        if (Number(res.code)===0) {
          this.advertParamByTypeList=res.data
          // localStorage.setItem('advertParamByTypeList',JSON.stringify(this.advertParamByTypeList))
          console.log('列表页初始化list',this.advertParamByTypeList)
        }
      })
    },
    // 广告内容上一页
    prevPage () {
      if (this.pageParams.pageNum<=1) {
        this.pageParams.pageNum=1
      } else {
        this.pageParams.pageNum-=1
      }
      let params={
        pageNum: this.pageParams.pageNum,
        pageSize:this.pageParams.pageSize,
        contentTypeId: this.contentTypeId
      }
      getContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          console.log( this.pageParams.totalPage)
        }
      })
    },
    // 广告内容下一页
    nextPage () {
      if (this.pageParams.pageNum>=this.pageParams.totalPage) {
        this.pageParams.pageNum=this.pageParams.totalPage
      } else {
        this.pageParams.pageNum+=1
      }
      let params={
        pageNum: this.pageParams.pageNum,
        pageSize:this.pageParams.pageSize,
        contentTypeId: this.contentTypeId
      }
      getContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          console.log( this.pageParams.totalPage)
        }
      })
    },
    // 切换广告内容类型，广告内容变化
    changeContentType (value) {
      this.contentList = []
      this.pageParams.totalPage= 0
      this.pageParams.pageNum=1
      this.formSearch.content=''
      this.formSearch.contentName=''
      if (value==1) {} else {
        this.contentTypeId=value
        let params={
          pageNum: this.pageParams.pageNum,
          pageSize:this.pageParams.pageSize,
          contentTypeId: this.contentTypeId
        }
        getContentByContentType(params).then((res) =>{
          if (Number(res.code)===0) {
            this.contentList = res.data.data
            this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
            console.log( this.pageParams.totalPage)
          }
        })
      }
    },
    // 删除
    handleDelete (index,row) {
      let _index=index
      this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
				let params={
          id: row.id
        }
        deleteAdvert(params).then((res) => {
          if (Number(res.code)===0) {
            this.advertPageListFun()
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
      console.log('修改',row)
      // return
      this.$router.push({
        path: '/editAdvert',
        query: {
          type: this.advType,
          id: row.id
        }
      })
    },
    // 新增广告跳转
    add () {
      this.$router.push({
        path: '/addAdvert',
        query: {
          type: this.advType
        }
      })
    },
    advertListFun (type) {
      this.pageRequest.pageNum=1
      this.advType=type
      if(this.$route.query.type) {
        this.$route.query.type=type
      } else {
      }
      switch (Number(type)) {
        case 1:
          this.advTypeTxt = '横幅广告';
          break;
        case 2:
          this.advTypeTxt = '弹窗广告';
          break;
        case 3:
          this.advTypeTxt = '开屏广告';
          break;
        case 4:
          this.advTypeTxt = '悬浮广告';
          break;
        default:
          this.advTypeTxt = '横幅广告';
          break;
      }
      this.$nextTick(() =>{
        this.reset()
        this.formSearch.advPositId=''
        this.formSearch.advPositId=''
        this.advertPageListFun()
        this.forAdvertPageFun()
      })
      
    },
    indexMethod (index) {
      return (this.pageRequest.pageNum-1)*this.pageRequest.pageSize+(index+1)
    },
    onSubmit () {
      this.pageRequest.pageNum=1
      this.advertPageListFun()
    }
	},
	
}
</script>

<style lang="less" scoped>
.advertList{
  padding-top: 10px;
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
       border-bottom: 1.5px solid #409EFF;
       color: #409EFF;
     }
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
   /deep/ .searchForm .el-input, /deep/ .searchForm .el-select{
    width: 180px;
  }
  /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 10px;
  }
}
</style>
