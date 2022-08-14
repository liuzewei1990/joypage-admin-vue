<template>
<!-- 日活管理  列表页 -->
  <div class='miniManageList'>
    <el-form :inline="true" :size='size' class='searchForm' :model='searchForm' ref='searchForm'>
      <!-- <el-form-item label='搜索' prop='appName'>
        <el-input type='text' v-model='searchForm.appName' placeholder='请输入关键字'></el-input>
      </el-form-item> -->
      <el-form-item label="生效时间" prop='time'>
        <el-date-picker
          v-model="searchForm.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format='yyyy-MM-dd HH:mm:ss'     
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间范围">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='分摊状态' prop='useStatus'>
        <el-select v-model='searchForm.useStatus'>
          <el-option v-for='(item,index) in useStatusOption' :key='index' :value='item.value' :label='item.name'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form class='btnCon'>
      <el-form-item>
        <el-button :size='size' icon='el-icon-plus' type="primary" @click="add">设置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :size='size' icon='el-icon-search' type="primary" @click="onSubmit">查询</el-button>
        <el-button :size='size' icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="contentList.data" style="width: 100%" border="true" :loading='tabLoading'>
        <el-table-column fixed prop="effectStartTime" label="生效时间" width="170" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.effectStartTime}}</span>
            <span>{{scope.row.effectEndTime}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="effectStatus" label="是否生效" width="170" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.effectStatus===0'>是</span>
            <span v-if='scope.row.effectStatus===1'>否</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="startStatus" label="分摊状态" header-align="center" align="center">
          <template slot-scope="scope">
            <!-- 1:进行中 2:待开始 3:已结束 -->
            <span v-if='scope.row.startStatus===1'>进行中</span>
            <span v-else-if='scope.row.startStatus===2'>待开始</span>
            <span v-else-if='scope.row.startStatus===3'>已结束</span>
          </template>
        </el-table-column>
        
        <el-table-column  width="360" align="center" v-for='(item,index) in retList' :key='index'>
          <template slot="header">
            <span>{{item.appName}}（ID：{{item.appId}}）</span>
          </template>
          <template prop="contentEditable" slot-scope="scope">
            <div class='listTxt'>
              <div v-for='(item1,index) in scope.row.upperLimitList' :key='index'>
                <div  v-if='item1.appId===item.appId &&item1.appUsedStatus===0'>
                  <div>
                    <span>上限：</span>
                    <input :readonly='!scope.row.contentEditable'  :class='scope.row.contentEditable?"isEdit":"noEdit"' type="text" v-model='item1.upperLimit'>
                  </div>
                  <div>
                    <span>已有</span>
                    <span>{{item1.useCount==null?"0":item1.useCount}}</span>
                  </div>
                </div>
                <div v-else-if='item1.appId===item.appId &&(item1.appUsedStatus===1||item1.appUsedStatus==null||item1.appUsedStatus==="")'>未启用</div>
                
              </div>
            </div>
              
            
          </template>
        </el-table-column>
        <el-table-column  fixed="right"  width="120" prop="updName" label="操作人" header-align="center" align="center"></el-table-column>
        <el-table-column  label="操作" width="120" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="text" @click="handleDelete(scope.row,scope.$index)">删除</el-button> -->
            <el-button :disabled='scope.row.startStatus!==2' v-if='!scope.row.isEdit' size="mini" type='text' @click="handleEdit(scope.row,scope.$index)">修改</el-button>
            <el-button  v-if='scope.row.isEdit' size="mini" type='text' @click="handleSave(scope.row,scope.$index)">确定</el-button>
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

    <add-mini :formDetail='formDetail' :status='status' @save='save' @cancle='cancle' v-if='dialogVisible'></add-mini>
  </div>
</template>
<script>
import {forDayLivePage,forDayLivePageList, updateUpperLimitSingle, updateUpperLimitBatch} from '../../../apis/index'
import addMini from '../../../components/addDAUManage'
export default {
  components:{addMini},
  data () {
    return {
      upperLimit:"",
      retList:[],
      useStatusOption:[],
      dialogVisible:false,
      size: 'small',
      tabLoading:true,
      form:Object,
      formDetail:'',
      searchForm: {
        appName:'',
        time:"",
        useStatus:''
      },
      pageParams: {
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      contentList:[],
      status: 'add', // add是新建，edit是修改
      contentEditable:false,
      editMsg:'' // 要修改的数据
    }
  },
  created() {
    this.forDayLivePageFun()
    this.forDayLivePageListFun()
  },
  methods: {
    handleSizeChange () {

    },
    // 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
      this.contentList=[]
			console.log(`当前页: ${val}`);
      this.pageParams.pageNum = val
      this.forDayLivePageListFun()
		},
    // 获取初始化数据
    forDayLivePageFun () {
      let params=''
      forDayLivePage(params).then((res) => {
        if (Number(res.code)===0) {
          this.useStatusOption=res.data
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 获取列表数据
    forDayLivePageListFun () {
      this.contentList=[]
      this.retList=[]
      let params = {
        pageSize: this.pageParams.pageSize,
        pageNum: this.pageParams.pageNum,
        useTimeStart: (this.searchForm.time===""||this.searchForm.time==null)?"":this.searchForm.time[0],
        useTimeEnd:  (this.searchForm.time===""||this.searchForm.time==null)?"":this.searchForm.time[1],
        // appName:this.searchForm.appName,
        useStatus:this.searchForm.useStatus
      }
      forDayLivePageList(params).then((res) => {
        if (Number(res.code)===0) {
          this.tabLoading=false
          this.contentList=res.data
          this.retList=res.data.retList
          this.pageParams.totalPage=res.data.totalCount
          this.$nextTick(() => {
            for(let i=0;i<document.getElementsByClassName('listTxt').length;i++) {
              console.log(document.getElementsByClassName('listTxt'))
              if (document.getElementsByClassName('listTxt')[i].innerText=='') {
                document.getElementsByClassName('listTxt')[i].innerText='未生效'
              }
            }
          })
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
      this.$set(this.contentList.data[index], 'contentEditable', true)
      this.$set(this.contentList.data[index], 'isEdit', true)
      this.$forceUpdate()
      this.editMsg=this.contentList.data[index]
    },
    // 列表修改的提交
    handleSave (row,index) {
      console.log(this.editMsg)
      this.$confirm('请选择数据更新范围。', '提示', {
          confirmButtonText: '更新当前项',
          cancelButtonText: '更新全部',
          type: 'info',
          distinguishCancelAndClose: true,
        }).then(() => {
          let pamras=this.editMsg
          // 更新单个
          updateUpperLimitSingle(pamras).then((res) => {
            if (Number(res.code)===0) {
              this.$message({type: 'success',message: '修改成功'});
              this.contentList=[]
              this.pageParams.pageNum=1
              this.forDayLivePageListFun()
            } else {
              this.$message({type: 'error',message: res.message});  
            }
          })
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch((action) => {
          if (action === 'cancel') {
            // 更新全部
            let pamras=this.editMsg
            updateUpperLimitBatch(pamras).then((res) => {
              if (Number(res.code)===0) {
                this.$message({type: 'success',message: '修改成功'});
                this.contentList=[]
                this.pageParams.pageNum=1
                this.forDayLivePageListFun()
              } else {
                this.$message({type: 'error',message: res.message});  
              }
            })  
          }
        });
    },
    // 取消
    cancle () {
      this.dialogVisible=false
    },
    // 提交
    save () {
      this.pageParams.pageNum=1
      this.dialogVisible=false
      this.forDayLivePageListFun()
    },
    // 新增
    add () {
      this.status='add'
      let form= {
        effectStatus: '',
        time: null,
        floatPercentStart: 8,
        floatPercentEnd: 14,
        autoUpdateStatus:0
      }
      this.formDetail=JSON.stringify(form)
      this.dialogVisible=true
    },
    // 查询
    onSubmit () {
      this.contentList=[]
      this.pageParams.pageNum=1
      this.forDayLivePageListFun()
    },
    // 重置
    reset () {
      this.contentList=[]
      this.$refs.searchForm.resetFields()
      this.pageParams.pageNum=1
      this.forDayLivePageListFun()
    },
  }
}
</script>
<style lang="less" scoped>
.miniManageList {
  padding: 20px;
  .btnCon {
    display: flex;
    padding-right: 50px;
    justify-content: space-between;
  }
}
.isEdit {
  border: 1px solid #333;
  height: 20px;
  min-width: 50px;
  display: inline-block;
  text-align: center;
  width: 50px;
  background: transparent;
}
.noEdit {
  border: none;
  outline: none;
  width: 50px;
  min-width: 50px;
  text-align: center;
  background: transparent;
}
</style>