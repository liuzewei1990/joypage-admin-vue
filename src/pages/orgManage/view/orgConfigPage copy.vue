<template>
  <div class="prdSeries">

    <el-form :model="formData" :rules="rules" ref='formData' :inline="true">
      <CommonTable :isFluid="false" @height="tableHeight=$event">
        <div slot="search">
          <el-page-header :content="`当前位置：XXX机构展示页  当前配置数量：${orderNumber}条`" style="margin-top:20px;" @back="$router.back()"></el-page-header>
          <br>
          <el-form-item label="最大可展示数量：">
            <el-input v-model="formData.maxCount" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="是否开启：">
            <template>
              <el-radio v-model="formData.isEnabled" label="1">是</el-radio>
              <el-radio v-model="formData.isEnabled" label="0">否</el-radio>
            </template>
          </el-form-item>

          <el-button style="float:right" :size="size" type="primary" @click="addListRow()">添加</el-button>
        </div>

        <!-- table表单元素 -->
        <el-table class="table-content" :height="tableHeight" :data="formData.dataForm" :border="true">
          <el-table-column v-for="item in dataFormTitle" :key='item.key' :label="item.label" header-align="center" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'dataForm.' + scope.$index + '.'+item.name" :rules="rules[item.name]">
                <div v-if='item.label == "序号" '>
                  <span>{{scope.$index + 1}}</span>
                </div>
                <div v-if='item.label == "机构类型" '>
                  <BcSelect v-model="scope.row.orgOptValue" :list="orgOption" @change="orgSelectValue(scope.row)" placeholder="请选择机构类型" :clearable="true"></BcSelect>
                </div>
                <div v-else-if='item.label == "选择机构"'>
                  <BcSelect v-model="scope.row.orgOptSelValue" @GetApiData="getOrgSelectData($event,scope.row)" filterable placeholder="请选择机构" @change="orgChange"></BcSelect>
                </div>
                <div v-else-if='item.label == "排序值"'>
                  <el-input v-model.trim="scope.row.orderNum" class="forder-input" placeholder="请输入排序值"></el-input>
                </div>
                <div v-else-if='item.label == "操作"'>
                  <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>

        <!-- 取消提交按钮 -->
        <div slot="footer" class="footer">
          <el-button style="float:right" :size="size" @click.native="cancleFrom('formData')">取消</el-button>
          <el-button style="float:right" :size="size" type="primary" @click="submitFormEditSave('formData')" :loading="saveLoading">提交</el-button>
        </div>
      </CommonTable>
    </el-form>
  </div>
</template>
<script>
import CommonTable from "@common/finsuit-components/CommonTable"
import BcSelect from "../components/BcSelect"
import Json from "../json/select"
export default {
  components: {
    CommonTable,
    BcSelect
  },
  data () {
    return {
      total: '',
      dataParams: {
        keywords: '',
        onelevelType: '',
        currentPage: 1,
      },
      tableHeight: 0,
      size: 'small',
      orderNumber: '1',//当前配置数量

      formData: { //弹窗数据提交数据
        maxCount: '10',//最大可展示数量
        isEnabled: '0',//是否开启
        confCount: '',//选择机构输入值
        dataForm: [],
      },

      dataFormTitle: [
        {
          name: '序号',
          width: 150,
          label: '序号'
        },
        {
          name: 'orgOptValue',
          width: 350,
          label: '机构类型'
        },
        {
          name: 'orgOptSelValue',
          width: 350,
          label: '选择机构'
        },
        {
          name: 'orderNum',
          width: 350,
          label: '排序值'
        },
        {
          name: '操作',
          width: 350,
          label: '操作'
        },
      ],
      orgOption: [{
        name: '银行机构',
        id: '1'
      }, {
        name: '非银行机构',
        id: '2'
      }],
      rules: {
        orgOptSelValue: [{
          required: true, message: '请选择机构', trigger: 'change', validator: this.orgValidator
        }],
        orderNum: [{ required: true, message: '请输入排序值', trigger: 'change' }],
      }

    }
  },
  created () {
    this.getData();
  },
  methods: {
    // 列表接口
    getData () {
      this.$api.getData().then(res => {
        // 记得这里要校验接口数据
        // ...

        // 这里回显头部数据...

        // 生成新的 row formItrm list 
        this.formData.dataForm = (res.data.orgCarefullyChosenList || []).map(item => this.newFormItem(item));

      })
    },

    // 首次初始化
    initForm () {
      this.formData.dataForm.push(this.newFormItem());
    },

    // 生成新的 row formItem
    newFormItem (formItem = {}) {
      return {
        // id
        id: formItem.id,
        // 机构选型
        orgOptValue: this.orgOption.find(item => item.id == formItem.oneLevelOrgType),
        // 选择机构
        orgOptSelValue: { name: formItem.orgName, id: formItem.orgId },
        // 排序值
        orderNum: formItem.orderNum
      }
    },

    // 当获取焦点时获取机构列表
    async getOrgSelectData ($event, formItem) {
      let { query, callback } = $event;
      let params = {};
      params["onelevelType"] = formItem.orgOptValue.id;
      params["keywords"] = query.keywords;
      params["currentPage"] = query.currentPage;

      let data = await this.$api.selectData(params).then(res => res.data || {});

      callback({ list: data.list, total: data.totalRow });

    },

    // 类型变化时，机构置空
    orgSelectValue (formItem) {
      formItem.orgOptSelValue = ""
    },

    // 提交按钮
    submitFormEditSave (formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          console.log('submit--SUCCESS!');
          let paramsSave = {
            cOrgCarefullyChosenConf: {
              maxCount: this.formData.maxCount,
              confCount: this.formData.confCount,
              isEnabled: this.formData.isEnabled
            },
            orgCarefullyChosenList: [{
              orgId: '',
              orderNum: ''
            }]
          }
          paramsSave.orgCarefullyChosenList.forEach(item => {
            this.formData.dataForm.forEach(its => {
              item.orgId = its.orgOptSelValue.id
              item.orderNum = its.orderNum
            })

          });
          console.log(paramsSave)
          this.$api.orgSave(paramsSave).then(res => {
            console.log(res)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 新增
    addListRow () {
      // 使用默认值创建一条新的记录
      let formItem = this.newFormItem({
        id: "",
        oneLevelOrgType: "1",
        orderNum: "1",
        orgName: "",
        orgId: ""
      });
      this.formData.dataForm.push(formItem);
    },

    // 单个删除
    handleDelete (index, row) {
      this.formData.dataForm.splice(index, 1);
    },

    // 取消，不保存并关闭当前页
    cancleFrom (formData) {
      this.$router.back();
    },

    // 机构表单自定义校验
    orgValidator (rule, value, callback) {
      if (!value.id) {
        callback(new Error())
      } else {
        callback();
      }
    }
  }
}
</script>
<style lang="less" scoped>
.prdSeries {
  padding: 20px;
}
.footer {
  text-align: center;
}
.table-content {
  /deep/ .el-form-item__content {
    line-height: 30px;
  }
  /deep/ .el-form-item {
    margin-right: 0;
    margin-bottom: 0px;
  }
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  /deep/ .el-form-item__error {
    padding-top: 0;
  }
}
/deep/ .el-table th {
  padding: 5px 0;
}
/deep/ .el-table td {
  padding: 5px 0;
}
</style>
