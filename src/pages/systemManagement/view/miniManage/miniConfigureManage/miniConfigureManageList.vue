<template>
<!-- 小程序管理 列表页 -->
  <div class='miniConfigureManageList'>
    <el-form :inline="true" :size='size' class='searchForm' :model='searchForm' ref='searchForm'>
      <el-form-item label='是否启用' prop='useStatus'>
        <el-select v-model='searchForm.useStatus'>
          <el-option v-for='(item,index) in useStatusOption' :key='index' :value='item.value' :label='item.label'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :size='size' icon='el-icon-search' type="primary" @click="onSubmit">查询</el-button>
        <el-button :size='size' icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item class='addBtn'>
        <el-button :size='size' icon='el-icon-plus' type="primary" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-form class='btnCon'>
      
    </el-form>

    <el-table :data="contentList" style="width: 100%" border="true" :loading='tabLoading'>
        <el-table-column prop="appId" label="appId" width="240" header-align="center" align="center"></el-table-column>
        <el-table-column prop="appName" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="useOrder"  label="启动顺序" header-align="center" align="center"></el-table-column>
        <el-table-column prop="useStatus" width="140" label="是否启用" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='Number(scope.row.useStatus)===0'>是</span>
            <span v-if='Number(scope.row.useStatus)===1'>否</span>
          </template>  
        </el-table-column>
        <!-- <el-table-column prop="imgUrl" label="图片预览" header-align="center" align="center">
          <template slot-scope="scope">
            <img style='width:100px' :src="$Config.aliyuncHost+scope.row.imgUrl" alt="">
          </template>
        </el-table-column> -->
        <el-table-column prop="useStartTime" sortable label="启用时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updName"   label="操作人" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDelete(scope.row,scope.$index)">删除</el-button>
            <el-button size="mini" type='text' @click="handleEdit(scope.row,scope.$index)">修改</el-button>
            <!-- <el-button size="mini" type='text' @click="handleCopy(scope.row,scope.$index)">复制</el-button> -->
          </template>
			  </el-table-column>
    </el-table>
    <!--分页栏-->
		<div class="toolbar" style="padding:10px 0;">
			<el-pagination layout="total, prev, pager, next, jumper" style="float:right;"
				:total="pageParams.totalPage"
				@current-change="refreshPageRequest"  
				@size-change="handleSizeChange"
				:current-page="pageParams.pageNum" 
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageParams.pageSize">
			</el-pagination>
		</div>

    <add-mini-configure :formDetail='formDetail' :status='status' @save='save' @cancle='cancle' v-if='dialogVisible'></add-mini-configure>
  </div>
</template>
<script>
import {forAppletPageList,delApplet} from '../../../apis/index'
import addMiniConfigure from '../../../components/addMiniiConfigure'
export default {
  components:{addMiniConfigure},
  data () {
    return {
      formDetail:'', // 弹框使用详情数据
      imageUrl:'',
      dialogVisible:false,
      size: 'small',
      tabLoading:true,
      form:Object,
      searchForm: {
        useStatus:'', //是否启用 0:是 1:否
      },
      useStatusOption: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        }
      ],
      pageParams: {
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      contentList:[],
      status: 'add', // add是新建，edit是修改
    }
  },
  created() {
    this.forAppletPageListFun()
  },
  methods: {
    handleSizeChange () {

    },
    // 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
      this.pageParams.pageNum = val
      this.forAppletPageListFun()
		},
    // 获取列表数据
    forAppletPageListFun () {
      let params = {
        pageSize: this.pageParams.pageSize,
        pageNum: this.pageParams.pageNum,
        useTimeStart:'',
        useTimeEnd: '',
        appName:'',
        useStatus: this.searchForm.useStatus
      }
      forAppletPageList(params).then((res) => {
        if (Number(res.code)===0) {
          this.tabLoading=false
          this.contentList=res.data.data
          this.pageParams.totalPage=res.data.totalCount
        } else {
          this.tabLoading=false
          this.$message.error(res.message);
        }
      })
    },
    // 删除
    handleDelete (row,index) {
      this.$confirm('确定删除此条数据吗？', '提示', {type: 'warning'}).then(() => {
				let params=''
        let data={
          id: row.id
        }
        delApplet(params,data).then((res) => {
          if (Number(res.code)===0) {
            this.forAppletPageListFun()
          } else {
            this.$message({type: 'error',message: res.message}); 
          }
        })
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});          
			});
    },
    // 修改
    handleEdit (row,index) {
      this.status='edit'
      this.formDetail= JSON.stringify(row) 
      this.$nextTick(()=>{
        this.dialogVisible=true
      })
    },
    // 复制功能
    // handleCopy (row,index) {
    //   this.status='add'
    //   row.appId=''
    //   row.appName=''
    //   row.useOrder=''
    //   this.formDetail= JSON.stringify(row) 
    //   this.$nextTick(()=>{
    //     this.dialogVisible=true
    //   })
    // },
    // 取消
    cancle () {
      this.dialogVisible=false
    },
    // 提交
    save () {
       this.pageParams.pageNum=1
      this.dialogVisible=false
      this.forAppletPageListFun()
    },
    // 新增
    add () {
      this.status='add'
      let form= {
        appName: '',
        appId: '',
        appSecret: '',
        // imgUrl:'',
        useStatus: 0,
        useStartTime:'',
        useOrder:'',
        originalId:''
      }
      this.formDetail= JSON.stringify(form) 
      this.dialogVisible=true
    },
    // 查询
    onSubmit () {
      this.pageParams.pageNum=1
      this.forAppletPageListFun()
    },
    // 重置
    reset () {
      this.contentList=[]
      this.$refs.searchForm.resetFields()
      this.pageParams.pageNum=1
      this.forAppletPageListFun()
    },
  }
}
</script>
<style lang="less" scoped>
.miniConfigureManageList {
  padding: 20px;
  .addBtn {
    margin-left: 50px;
  }
}

</style>