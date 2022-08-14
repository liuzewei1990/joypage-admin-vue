<template>
<!-- 配置管理  首页配置  综合配置 -->
  <div class="adverLocationtList">
  <CommonTable :isFluid="false" @height="tableHeight=$event">
    <!--标头查询区-->
    <div slot="search">
      <el-form :size='size' :model='formSearch' ref='formSearch' :inline="true" class="searchForm demo-form-inline">
        <el-form-item label="标题" prop='title'>
          <el-input type='text' v-model='formSearch.title' placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="选择渠道" prop='appFlags'>
          <el-select  clearable   v-model="formSearch.appFlags" placeholder="">
            <el-option  label="全选" value=""></el-option>
            <el-option  label="识贝比" value="BC"></el-option>
            <el-option  label="识贝拼" value="PC"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择系统" prop='systemTypes'>
          <el-select  clearable   v-model="formSearch.systemTypes" placeholder="">
            <el-option label="全部" value=""></el-option>
            <el-option label="安卓" value="android"></el-option>
            <el-option label="苹果" value="ios"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区 -->
		<div slot="action">
        <el-button :size='size' style="float:left" icon='el-icon-search' type="primary" @click="add">新增</el-button>
        <el-button :size='size' style="float:right" icon='el-icon-search' type="primary" @click="reset">重置</el-button>
        <el-button :size='size' style="float:right" icon='el-icon-search' type="primary" @click="onSubmit">查询</el-button>
    </div>

    <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开--> 
    <el-table :height="tableHeight" :data="contentList" style="width: 100%" border="true">
        <el-table-column prop='id' label="ID" fixed="left" width="60" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='130px' prop="title" label="标题" header-align="center" align="center"></el-table-column>
        <el-table-column  min-width='160px' prop="twoMenuImgList" label="图片预览" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.templateType=="6"'>产品推荐{{scope.row.prdindexCount}}</span>
            <el-popover v-else trigger="hover" placement="right">
              <ul  v-if='scope.row.twoMenuImgList.length>0' class='MKXZcONYL popuMKXZ'>
                <li class='MKXZ1' v-if='scope.row.templateType=="4"'>
                  <div>
                    <span class='imgCon'>
                      <img style='width:151px;height:64px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                      <small>{{scope.row.twoMenuImgList[0].remarks}}</small>
                    </span>
                    <span class='imgCon'>
                      <img style='width:151px;height:64px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[1].imgUrl" alt="">
                      <small>{{scope.row.twoMenuImgList[1].remarks}}</small>
                    </span>
                  </div>
                  <div>
                    <span class='imgCon'>
                      <img style='width:151px;height:64px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[2].imgUrl" alt="">
                      <small>{{scope.row.twoMenuImgList[2].remarks}}</small>
                    </span>
                    <span class='imgCon'>
                      <img style='width:151px;height:64px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[3].imgUrl" alt="">
                      <small>{{scope.row.twoMenuImgList[3].remarks}}</small>
                    </span>
                  </div>
                </li>
                <li class='MKXZ2' v-if='scope.row.templateType=="3"'>
                  <div>
                    <div class='span1 imgCon'>
                      <img style='width:151px;height:134px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                      <small>{{scope.row.twoMenuImgList[0].remarks}}</small>
                    </div>
                    <div class='span2'>
                      <div class='imgCon'>
                        <img style='width:151px;height:64px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[1].imgUrl" alt="">
                        <small>{{scope.row.twoMenuImgList[1].remarks}}</small>
                      </div>
                      <div class='imgCon'>
                        <img style='width:151px;height:64px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[2].imgUrl" alt="">
                        <small>{{scope.row.twoMenuImgList[2].remarks}}</small>
                      </div>
                    </div>
                  </div>
                </li>
                <li class='MKXZ3' v-if='scope.row.templateType=="2"'>
                  <div>
                    <div class='span1 imgCon'>
                      <img  style='width:151px;height:136px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                      <small>{{scope.row.twoMenuImgList[0].remarks}}</small>
                    </div>
                    <div class='span2 imgCon'>
                      <img style='width:151px;height:136px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[1].imgUrl" alt="">
                      <small>{{scope.row.twoMenuImgList[1].remarks}}</small>
                    </div>
                  </div>
                </li>
                <li class='MKXZ4' v-if='scope.row.templateType=="1"'>
                  <div class='imgCon'>
                    <img  style='width:311px;height:136px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                    <small>{{scope.row.twoMenuImgList[0].remarks}}</small>
                  </div>
                </li>
                <li class='MKXZ4' v-if='scope.row.templateType=="5"'>
                  <div class='imgCon' style='width:311px;height:75px;border:1px solid #000'>
                    <el-carousel height='75px;width:311px' interval='1000' indicator-position="none" arrow='never'>
                      <el-carousel-item v-for="(item ,index) in scope.row.twoMenuImgList" :key="index">
                        <img  style='width:311px;height:75px' :src="$Config.aliyuncHost+item.imgUrl" alt="">
                        <small>{{item.remarks}}</small>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                  <!-- <div class='imgCon'>
                    <el-carousel height='75px' interval='1500' indicator-position="outside">
                      <el-carousel-item v-for="(item ,index) in scope.row.twoMenuImgList" :key="index">
                        <img  style='width:311px;height:75px' :src="$Config.aliyuncHost+item.imgUrl" alt="">
                        <small>{{item.remarks}}</small>
                      </el-carousel-item>
                    </el-carousel>
                  </div> -->
                </li>
              </ul>
              <div  v-if='scope.row.twoMenuImgList.length>0' slot="reference" class="name-wrapper">
                <el-tag size="medium">
                  <ul class='MKXZcONYL'>
                    <li class='MKXZ1' v-if='scope.row.templateType=="4"'>
                      <div>
                        <span>
                          <img style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                        </span>
                        <span>
                          <img style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[1].imgUrl" alt="">
                        </span>
                      </div>
                      <div>
                        <span>
                          <img style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[2].imgUrl" alt="">
                        </span>
                        <span>
                          <img style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[3].imgUrl" alt="">
                        </span>
                      </div>
                    </li>
                    <li class='MKXZ2' v-if='scope.row.templateType=="3"'>
                      <div>
                        <div class='span1'>
                          <img style='width:50px;height:64px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                        </div>
                        <div class='span2'>
                          <div>
                            <img style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[1].imgUrl" alt="">
                          </div>
                          <div>
                            <img style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[2].imgUrl" alt="">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class='MKXZ3' v-if='scope.row.templateType=="2"'>
                      <div>
                        <div class='span1'>
                          <img  style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                        </div>
                        <div class='span2'>
                          <img style='width:50px;height:28px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[1].imgUrl" alt="">
                        </div>
                      </div>
                    </li>
                    <li class='MKXZ4' v-if='scope.row.templateType=="1"'>
                      <div>
                        <img  style='width:100px;height:40px' :src="$Config.aliyuncHost+scope.row.twoMenuImgList[0].imgUrl" alt="">
                      </div>
                    </li>
                    <li class='MKXZ4' v-if='scope.row.templateType=="5"'>
                      <span>轮播图</span>
                    </li>
                  </ul>
                </el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column  min-width='130px' prop="remarksStr" label="备注" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.templateType=="6"'>--</span>
            <span v-else>{{scope.row.remarksStr}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="updateUserName" width="100" label="最近操作人" header-align="center" align="center"></el-table-column>
        <el-table-column  prop="updateTime" width="160" sortable label="最近操作时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="effectiveDatetime" width="160" sortable label="生效时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="isEnable"  label="是否启用" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.isEnable==1'>是</span>
            <span v-if='scope.row.isEnable=="0"'>否</span>
            <span v-if='scope.row.isEnable==""'>--</span>
          </template>
        </el-table-column>
        <el-table-column  prop="appFlags" width="140" label="渠道" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.appFlags.indexOf("BC")>-1'>识贝比</span>
            <span v-if='scope.row.appFlags.indexOf("BC")>-1&&scope.row.appFlags.indexOf("PC")>-1'>、</span>
            <span v-if='scope.row.appFlags.indexOf("PC")>-1'>识贝拼</span>
          </template>
        </el-table-column>
        <el-table-column  prop="systemTypes" width="110" label="系统" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.systemTypes.indexOf("android")>-1'>安卓</span>
            <span v-if='scope.row.systemTypes.indexOf("android")>-1&&scope.row.systemTypes.indexOf("ios")>-1'>、</span>
            <span v-if='scope.row.systemTypes.indexOf("ios")>-1'>苹果</span>
          </template>
        </el-table-column>
         <el-table-column min-width="110px" prop="seqOrder"  label="排序" header-align="center" align="center">
          <template slot-scope="scope">
            
            <i v-if='scope.$index==0'
              style='color:#c1c1c1;font-size: 1.3rem;'
              class="el-icon-top paixu"
              title="向上移动一位"
            ></i>
            <i v-else
              @click="yiwei('up',scope.row,scope.$index)"
              class="el-icon-top paixu"
              title="向上移动一位"
              style='color:#000;font-size:1.3rem;'
            ></i>
            <span>{{scope.row.seqOrder}}</span>
            
            <i v-if='scope.$index==contentList.length-1'
              class="el-icon-bottom paixu"
              title="向下移动一位"
              style='color:#c1c1c1;font-size: 1.3rem;'
            ></i>
            <i v-else
              @click="yiwei('down',scope.row,scope.$index)"
              class="el-icon-bottom paixu"
              title="向下移动一位"
               style='color:#000;font-size:1.3rem;'
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button :size="size" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index)">修改</el-button>
          </template>
			  </el-table-column>
    </el-table>
    <!--分页栏-->
		<div slot="footer" class="toolbar" style="padding:10px 0;">
			<el-pagination layout="total" style="float:right;"
				:total="totalSize"
				@current-change="refreshPageRequest"  
				@size-change="handleSizeChange"
				:current-page="pageRequest.pageNum" 
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageRequest.pageSize">
			</el-pagination>
		</div>
    </CommonTable>
  </div>
</template>

<script>
import { TwoMenugetlist ,TwoMenugetdelete,TwoMenugetorder} from "../../../apis/index"
import CommonTable from "@common/finsuit-components/CommonTable"
export default {
	name: 'compositeSetting',
	components:{CommonTable},
	data() {
		return {
      tableHeight:0, //内容高度
      contentList:[],
      size: 'small',
      time:null,
      formSearch: {
        title:"",
        appFlags:"",
        systemTypes:""
      },
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
    this.TwoMenugetlistFun()
	},
	methods: {
    // 排序
    yiwei (type,row,index) {
      let params ={
        order:type,
        id:row.id,
        swap: type=="up"? this.contentList[index-1].id:this.contentList[index-(-1)].id
      }
      TwoMenugetorder(params).then((res) => {
        if (res.result) {
          this.TwoMenugetlistFun()
        } else {
          this.$message.error(res.description)
        }
      }).catch((error) => {
        this.$message.error('接口错误')
      })
      console.log(index)
    },
    // 查询列表数据
    TwoMenugetlistFun () {
      this.contentList=[]
      let params= {
        title: this.formSearch.title,
        appFlags:this.formSearch.appFlags,
        systemTypes:this.formSearch.systemTypes,
        pageNum: this.pageRequest.pageNum,
        pageSize: this.pageRequest.pageSize
      }
      TwoMenugetlist(params).then((res) => {
        if (res.result) {
          this.contentList=res.data
          this.totalSize=res.data.length
        } else {
          this.$message.error(res.description)
        }
      }).catch((error) =>{
        this.$message.error('接口错误')
      })
    },
    // 重置
    reset () {
      this.$refs.formSearch.resetFields()
      this.pageRequest.pageNum=1
      this.TwoMenugetlistFun() 
    },
    handleSizeChange (val) {
			this.pageRequest.pageSize = val
			this.TwoMenugetlistFun() 
    },
    // 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.TwoMenugetlistFun() 
		},
    // 删除
    handleDelete (index,row) {
      let _index=index
      this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
				let params={
          ids: row.id
        }
        TwoMenugetdelete(params).then((res) => {
          if (Number(res.code)===0) {
            this.TwoMenugetlistFun()
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
        path: '/wealth/addSecond',
        query: {
          type: '修改',
          id: row.id
        }
      })
    },
    indexMethod (index) {
      return (this.pageRequest.pageNum-1)*this.pageRequest.pageSize+(index+1)
    },
    add () {
      this.$router.push({
        path: '/wealth/addSecond',
        query: {
          type: '新增'
        }
      })
    },
    onSubmit () {
      this.pageRequest.pageNum=1
      this.TwoMenugetlistFun() 
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

  .MKXZcONYL {
    .MKXZ1 {
      >div {
        display: flex;
        margin-bottom: 4px;
        span {
          display: inline-block;
          border: 1px solid #000;
          margin-right: 2px;
        }

      }
    }
    .MKXZ2{
      >div {
        display: flex;
        .span1 {
          border: 1px solid #000;
          margin-right: 2px;
          height: max-content;
        }
        .span2 {
          div {
            height: max-content;
            border: 1px solid #000;
            margin-bottom: 4px;
          }
        }
      }
    }
    .MKXZ3 {
      >div {
        display: flex;
        .span1 {
          border: 1px solid #000;
          margin-right: 2px;
        }
        .span2 {
          border: 1px solid #000;
          margin-right: 2px;
        }
      }
    }
    .MKXZ4 {
      >div {
        border: 1px solid #000;
        max-width: max-content;
        margin-right: 2px;
      }
    }
  }
  .imgCon {
    position: relative;
    small {
      position: absolute;
      top: 5px;
      right: 8px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      padding: 5px;
      border-radius: 4px;
    }
  }
  /deep/ .el-tag--medium {
    height: max-content;
  }
  /deep/ .el-tag {
    background: transparent;
    border: none;
    color: #000;
    cursor:pointer;
  }
  /deep/ .el-carousel {
    width: 311px;
  }
</style>
