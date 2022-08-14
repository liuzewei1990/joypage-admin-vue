<template>
<!-- 用户营销管理   银行管理  -->
  <div class='bankList'>
    <el-form :size='size' class='searchForm' :model='searchForm' ref='searchForm'>
      <div class='searchDiv'>
        <el-form-item label='关键字：' prop="keywords">
          <el-input :disabled='searchForm.prdIndexIds.length>0||searchForm.orgIds.length>0' v-model='searchForm.keywords' type='text' clearable placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label='银行：' prop="orgIds">
          <el-select :disabled='searchForm.keywords!=""||searchForm.prdIndexIds.length>0' v-model="searchForm.orgIds" filterable clearable multiple placeholder="请选择">
            <el-option
            v-for="item in orgs"
            :key="item.id"
            :label="item.orgName"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='银行产品：' prop="prdIndexIds">
          <el-select :disabled='searchForm.keywords!=""||searchForm.orgIds.length>0' multiple no-match-text='' class='scrollSelect'  clearable  v-model="searchForm.prdIndexIds" filterable remote :remote-method="searchPro" placeholder="">
          <div>
            <el-option
            v-for="item in prdList"
            :key="item.id"
            :label="item.prdName"
            :value="item.id">
            </el-option>
          </div>
          <div style='text-align:center'>
            <el-button :disabled='pageParams1.pageNum<=1' :size='size' type="text"  @click.stop="prevPage">上一页</el-button>
            <el-button  :disabled='pageParams1.pageNum>=pageParams1.totalPage' :size='size' type="text"  @click.stop="nextPage">下一页</el-button>
            <span style='color:#ccc;font-size:12px'>当前页{{pageParams1.pageNum}}</span>
            <span style='color:#ccc;font-size:12px'>总页数{{pageParams1.totalPage}}</span>
          </div>
        </el-select>
        </el-form-item>
        
      </div>
      

      <el-form-item style='text-align:right'>
        <el-button :size='size' icon='el-icon-search' type="primary" @click='getList'>查询</el-button>
        <el-button :size='size' icon="el-icon-refresh" @click='reset'>重置</el-button>
      </el-form-item>
    </el-form>

    <div class='addBtn'>
      <el-button :size='size' icon='el-icon-plus' type="primary" @click='add'>新增产品配置</el-button>
      <el-button :size='size' icon='el-icon-delete' v-if='multipleSelection.length>0' @click='delAll'>批量删除</el-button>
      <div class='typeClass'>
        <el-radio-group @change='changeStatus'  v-model="executionStatus">
        <el-radio-button label="-1" value='-1'>全部</el-radio-button>
        <el-radio-button label="0" value='0'>未开始</el-radio-button>
        <el-radio-button label="1" value='1'>执行中</el-radio-button>
        <el-radio-button label="2" value='2'>已结束</el-radio-button>
      </el-radio-group>
      </div>
    </div>
    <div class='tip'>
      <span>提示：若需监管比财平台外部链接，请前往外链管理配置规则。</span>
      <el-button type='primary' :size='size' @click='goto'>配置外链</el-button>
    </div>
    <el-table ref='table' :data="contentList" style="width: 100%" :loading='tabLoading' @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop=""  header-align="center" align="left">
            <template slot-scope="scope">
              <div class='itemDiv' style='position:relative'>
                <div style='display:flex;justify-content: space-between;'>
                  <div class='executionStatusClass'>
                    <b>{{scope.row.orgName}}-{{scope.row.prdIndexName}}</b>
                    <span :class='scope.row.executionStatus=="2"?"overClass":""' style='background:#'>{{scope.row.executionStatusName}}</span>
                  </div>
                  <div>
                    <el-button size="mini" type='text' @click="deletFun(scope.row,scope.$index)">删除</el-button>
                    <el-button size="mini" type='text' @click="handleEdit(scope.row,scope.$index)">修改</el-button>
                    <el-button size="mini" type='text' @click="handleCopy(scope.row,scope.$index)">复制</el-button>
                  </div>
                </div>
                <div>ID:{{scope.row.id}}</div>
                <div>生效时间：{{scope.row.effectiveStartTime}}~{{scope.row.effctiveEndTime}}</div>
                <div class='contentDiv' v-for='(item,index) in scope.row.oneLevelUserCondition' :key='index'>
                  <div class='content'>
                    <div class="title" :class='item.conditionVisible=="0"?"noVisib":""'>{{item.conditionVisible=='0'?"不可见":"可见"}}条件</div>
                    <ul>
                      <!-- 用户年龄 -->
                      <div v-if='(item.ageConnSymbol==""||item.ageConnSymbol==null)&&(item.userStartAge==""||item.userStartAge==null)&&(item.userEndAge==""||item.userEndAge==null)'></div>
                      <div v-else>
                        <span>年龄：</span>
                        <li>{{item.ageStartSymbol}}{{item.userStartAge}}{{item.userStartAge==""||item.userStartAge==null?"":"岁"}}{{item.ageConnSymbol==1?"且":""}}{{item.ageConnSymbol==2?"或":""}}{{item.ageEndSymbol}}{{item.userEndAge}}{{item.userEndAge==""||item.userEndAge==null?"":"岁"}}</li>
                      </div>
                      
                      <!-- 登陆状态 -->
                      <div v-if='(item.userRegStatus!=""&&item.userRegStatus!=null)||(item.realNameStatus!=""&&item.realNameStatus!=null)||(item.openAccountStatus!=""&&item.openAccountStatus!=null)||(item.investmentStatus!=""&&item.investmentStatus!=null)||(item.holdSharesStatus!=""&&item.holdSharesStatus!=null)'>
                        <span>比财：</span>
                        <li v-if='item.userRegStatus=="0"'>未登陆</li>
                        <!-- 登陆时间 -->
                        <li v-if='(item.regConnectionSymbol!=""&&item.regConnectionSymbol!=null)||item.userRegStatus==1'>已登陆；{{item.regStartSymbol}}{{item.regStartTime}}
                          {{item.regConnectionSymbol==1?"且":""}}{{item.regConnectionSymbol==2?"或":""}}
                          {{item.regEndSymbol}}{{item.regEndTime}}</li>
                        <li v-else-if='(item.regStartTime!=""&&item.regStartTime!=null)||item.userRegStatus==1'>已登陆；{{item.regStartSymbol}}{{item.regStartTime}}</li>
                        <li v-else-if='(item.regEndTime!=""&&item.regEndTime!=null)||item.userRegStatus==1'>已登陆；{{item.regEndSymbol}}{{item.regEndTime}}</li>
                        <!-- 实名状态1实名0未实名 -->
                        <li v-if='item.realNameStatus!=""&&item.realNameStatus!=null'>{{item.realNameStatus=='1'?"已实名":"未实名"}}</li>
                        <!-- 开户状态1开户0未开户 -->
                        <li v-if='item.openAccountStatus!=""&&item.openAccountStatus!=null'>{{item.openAccountStatus=='1'?"已开户":"未开户"}}</li>
                        <!-- 投资状态1投资0未投 -->
                        <li v-if='item.investmentStatus!=""&&item.investmentStatus!=null'>{{item.investmentStatus=='1'?"已投资":"未投资"}}</li>
                        <!-- 持仓状态1持0未 -->
                        <li v-if='item.holdSharesStatus!=""&&item.holdSharesStatus!=null'>{{item.holdSharesStatus=='1'?"已持仓":"未持仓"}}</li>
                      </div>
                      
                      
                      <div  v-if='((item.holdSharesPeakValueStartAmount!=""&&item.holdSharesPeakValueStartAmount!=null)||(item.holdSharesPeakValueEndAmount!=""&&item.holdSharesPeakValueEndAmount!=null))||((item.localBankHoldPeakValueStartAmount!=""&&item.localBankHoldPeakValueStartAmount!=null)||(item.localBankHoldPeakValueEndAmount!=""&&item.localBankHoldPeakValueEndAmount!=null))'>
                        <span>持仓峰值金额：</span>
                        <li v-if='(item.holdSharesPeakValueStartAmount!=""&&item.holdSharesPeakValueStartAmount!=null)||(item.holdSharesPeakValueEndAmount!=""&&item.holdSharesPeakValueEndAmount!=null)'>比财：{{item.holdSharesPeakValueStartSymbol}}{{item.holdSharesPeakValueStartAmount}}
                           {{item.holdSharesPeakValueConnSymbol==1?"且":""}}{{item.holdSharesPeakValueConnSymbol==2?"或":""}}
                          {{item.holdSharesPeakValueEndSymbol}}{{item.holdSharesPeakValueEndAmount}}</li>

                        <li v-if='(item.localBankHoldPeakValueStartAmount!=""&&item.localBankHoldPeakValueStartAmount!=null)||(item.localBankHoldPeakValueEndAmount!=""&&item.localBankHoldPeakValueEndAmount!=null)'>本银行：{{item.localBankHoldPeakValueStartSymbol}}{{item.localBankHoldPeakValueStartAmount}}
                          {{item.localBankHoldPeakValueConnSymbol==1?"且":""}}{{item.localBankHoldPeakValueConnSymbol==2?"或":""}}
                          {{item.localBankHoldPeakValueEndSymbol}}{{item.localBankHoldPeakValueEndAmount}}</li>
                      </div>

                      <!-- 普惠账户开户状态开1开户0未开户 -->
                      <div v-if='(item.puhuiOpenAccountStatus!=""&&item.puhuiOpenAccountStatus!=null)'>
                        <span>普惠账户：</span>
                        <li v-if='item.puhuiOpenAccountStatus!=""&&item.puhuiOpenAccountStatus!=null'>{{item.puhuiOpenAccountStatus=='1'?"已开户":"未开户"}}</li>
                      </div>

                      <!-- 本银行的开户状态开1开户0未开户 -->
                      <div v-if='(item.localBankOpenAccountStatus!=""&&item.localBankOpenAccountStatus!=null)||(item.localBankInvestmentStatus!=""&&item.localBankInvestmentStatus!=null)||(item.localBankHoldSharsStatus!=""&&item.localBankHoldSharsStatus!=null)'>
                        <span>本银行：</span>
                        <li v-if='item.localBankOpenAccountStatus!=""&&item.localBankOpenAccountStatus!=null'>{{item.localBankOpenAccountStatus=='1'?"已开户":"未开户"}}</li>
                        <!-- 本银行的投资状态1投0未投 -->
                        <li v-if='item.localBankInvestmentStatus!=""&&item.localBankInvestmentStatus!=null'>{{item.localBankInvestmentStatus=='1'?"已投资":"未投资"}}</li>
                        <!-- 本银行的持仓状态 1持仓0未持 -->
                        <li v-if='item.localBankHoldSharsStatus!=""&&item.localBankHoldSharsStatus!=null'>{{item.localBankHoldSharsStatus=='1'?"已持仓":"未持仓"}}</li>
                      </div>
                      
                      <!-- 限制地域 -->
                      <div v-if='item.userRegionConditions.length>0&&item.userRegionConditions[0].province!=""'>
                        <span>限制地域：</span>
                        <li v-for='(item2,index2) in item.userRegionConditions' :key='index2'>
                          <span v-if='item2.city==""||item2.city==null'>{{item2.province}}；</span>
                          <span v-else>{{item2.province}}-{{item2.city}}；</span>
                          {{item2.regPhoneNumCheck=="1"?"登陆手机号归属地":"  "}}
                          <span v-if='item2.idCardAddressCheck=="1"&&item2.regPhoneNumCheck=="1"'>、</span>
                          {{item2.idCardAddressCheck=="1"?"身份证地址":"  "}}
                          <span v-if='item2.gpsLocationCheck=="1"&&(item2.idCardAddressCheck=="1"||item2.regPhoneNumCheck=="1")'>、</span>
                          {{item2.gpsLocationCheck=="1"?"GPS地理位置  ":""}}
                        </li>
                      </div>
                      
                      <!-- 产品展示的条件配置 -->
                      <div v-if='item.prdShowConditons.length>0&&item.prdShowConditons[0].prdDisplayLocations!=""'>
                        <span>产品展示位置：</span>
                        <li v-for='(item2,index2) in item.prdShowConditons' :key='index2'>
                          <!-- <p>时间类型：{{item2.dateType=="1"?"日期":"周期"}}</p> -->
                          <p>
                            <!-- <span>产品展示位置：{{item2.prdDisplayLocationNameList.toString()}}</span> -->
                            <!--1140 新需求只留位置 -->
                            <span>{{item2.prdDisplayLocationNameList.toString()}}</span>
                          </p>
                          <!-- <p>
                            <span v-if='item2.dateType==1'>展示时间：{{item2.dateStart}}~{{item2.dateEnd}}</span>
                          </p>
                          <p>
                            <span v-if='item2.dateType==2'>展示周期：
                              <span v-if='item2.weekCode.toString().indexOf("1")>=0'>周一 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("2")>=0'>周二 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("3")>=0'>周三 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("4")>=0'>周四 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("5")>=0'>周五 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("6")>=0'>周六 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("7")>=0'>周日 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}</span>
                            </span>
                          </p> -->
                          
                          
                        </li>
                      </div>
                      <div v-if='item.displayConditon.advLocationNameList!=null&&item.displayConditon.advLocationNameList.length>0'>
                        <span>广告位：</span> 
                        <li>{{item.displayConditon.advLocationNameList.toString()}}</li>
                      </div>
                      <div v-if='item.displayConditon.actLocationNameList!=null&&item.displayConditon.actLocationNameList.length>0'>
                        <span>活动：</span> 
                        <li>{{item.displayConditon.actLocationNameList.toString()}}</li> 
                      </div>
                      <div v-if='item.displayConditon.contentNameList!=null&&item.displayConditon.contentNameList.length>0'>
                        <span>内容：</span> 
                        <li>{{item.displayConditon.contentNameList.toString()}}</li> 
                      </div>
                    </ul>
                  </div>
                  <div class='HUO' v-if='index!=scope.row.oneLevelUserCondition.length-1'>{{item.condConnSymbol==1?"且":""}}{{item.condConnSymbol==2?"或":""}}</div>
                </div>
                <div class='HUO huoDiv' v-if='scope.row.twoLevelUserCondition.length>=1'>
                  <span v-if='scope.row.oneAndTwoLevelSymbol==1'>且</span>
                  <span v-if='scope.row.oneAndTwoLevelSymbol==2'>或</span>
                </div>
                <div class='contentDiv' v-for='(item,index) in scope.row.twoLevelUserCondition' :key='index'>
                  <div class='content'>
                    <div class="title" :class='item.conditionVisible=="0"?"noVisib":""'>{{item.conditionVisible=='0'?"不可见":"可见"}}条件</div>
                    <ul>
                      <!-- 用户年龄 -->
                      <div v-if='(item.ageConnSymbol==""||item.ageConnSymbol==null)&&(item.userStartAge==""||item.userStartAge==null)&&(item.userEndAge==""||item.userEndAge==null)'></div>
                      <div v-else>
                        <span>年龄：</span>
                        <li>{{item.ageStartSymbol}}{{item.userStartAge}}{{item.userStartAge==""||item.userStartAge==null?"":"岁"}}{{item.ageConnSymbol==1?"且":""}}{{item.ageConnSymbol==2?"或":""}}{{item.ageEndSymbol}}{{item.userEndAge}}{{item.userEndAge==""||item.userEndAge==null?"":"岁"}}</li>
                      </div>
                      
                      <!-- 登陆状态 -->
                      <div v-if='(item.userRegStatus!=""&&item.userRegStatus!=null)||(item.realNameStatus!=""&&item.realNameStatus!=null)||(item.openAccountStatus!=""&&item.openAccountStatus!=null)||(item.investmentStatus!=""&&item.investmentStatus!=null)||(item.holdSharesStatus!=""&&item.holdSharesStatus!=null)'>
                        <span>比财：</span>
                        <li v-if='item.userRegStatus=="0"'>未登陆</li>
                        <!-- 登陆时间 -->
                        <li v-if='(item.regConnectionSymbol!=""&&item.regConnectionSymbol!=null)||item.userRegStatus==1'>已登陆；{{item.regStartSymbol}}{{item.regStartTime}}
                          {{item.regConnectionSymbol==1?"且":""}}{{item.regConnectionSymbol==2?"或":""}}
                          {{item.regEndSymbol}}{{item.regEndTime}}</li>
                        <li v-else-if='(item.regStartTime!=""&&item.regStartTime!=null)||item.userRegStatus==1'>已登陆；{{item.regStartSymbol}}{{item.regStartTime}}</li>
                        <li v-else-if='(item.regEndTime!=""&&item.regEndTime!=null)||item.userRegStatus==1'>已登陆；{{item.regEndSymbol}}{{item.regEndTime}}</li>
                        <!-- 实名状态1实名0未实名 -->
                        <li v-if='item.realNameStatus!=""&&item.realNameStatus!=null'>{{item.realNameStatus=='1'?"已实名":"未实名"}}</li>
                        <!-- 开户状态1开户0未开户 -->
                        <li v-if='item.openAccountStatus!=""&&item.openAccountStatus!=null'>{{item.openAccountStatus=='1'?"已开户":"未开户"}}</li>
                        <!-- 投资状态1投资0未投 -->
                        <li v-if='item.investmentStatus!=""&&item.investmentStatus!=null'>{{item.investmentStatus=='1'?"已投资":"未投资"}}</li>
                        <!-- 持仓状态1持0未 -->
                        <li v-if='item.holdSharesStatus!=""&&item.holdSharesStatus!=null'>{{item.holdSharesStatus=='1'?"已持仓":"未持仓"}}</li>
                      </div>
                      
                      
                      <div  v-if='((item.holdSharesPeakValueStartAmount!=""&&item.holdSharesPeakValueStartAmount!=null)||(item.holdSharesPeakValueEndAmount!=""&&item.holdSharesPeakValueEndAmount!=null))||((item.localBankHoldPeakValueStartAmount!=""&&item.localBankHoldPeakValueStartAmount!=null)||(item.localBankHoldPeakValueEndAmount!=""&&item.localBankHoldPeakValueEndAmount!=null))'>
                        <span>持仓峰值金额：</span>
                        <li v-if='(item.holdSharesPeakValueStartAmount!=""&&item.holdSharesPeakValueStartAmount!=null)||(item.holdSharesPeakValueEndAmount!=""&&item.holdSharesPeakValueEndAmount!=null)'>比财：{{item.holdSharesPeakValueStartSymbol}}{{item.holdSharesPeakValueStartAmount}}
                          {{item.holdSharesPeakValueConnSymbol==1?"且":""}}{{item.holdSharesPeakValueConnSymbol==2?"或":""}}
                          {{item.holdSharesPeakValueEndSymbol}}{{item.holdSharesPeakValueEndAmount}}</li>

                        <li v-if='(item.localBankHoldPeakValueStartAmount!=""&&item.localBankHoldPeakValueStartAmount!=null)||(item.localBankHoldPeakValueEndAmount!=""&&item.localBankHoldPeakValueEndAmount!=null)'>本银行：{{item.localBankHoldPeakValueStartSymbol}}{{item.localBankHoldPeakValueStartAmount}}
                          {{item.localBankHoldPeakValueConnSymbol==1?"且":""}}{{item.localBankHoldPeakValueConnSymbol==2?"或":""}}
                          {{item.localBankHoldPeakValueEndSymbol}}{{item.localBankHoldPeakValueEndAmount}}</li>
                      </div>

                       <!-- 普惠账户开户状态开1开户0未开户 -->
                      <div v-if='(item.puhuiOpenAccountStatus!=""&&item.puhuiOpenAccountStatus!=null)'>
                        <span>普惠账户：</span>
                        <li v-if='item.puhuiOpenAccountStatus!=""&&item.puhuiOpenAccountStatus!=null'>{{item.puhuiOpenAccountStatus=='1'?"已开户":"未开户"}}</li>
                      </div>

                      <!-- 本银行的开户状态开1开户0未开户 -->
                      <div v-if='(item.localBankOpenAccountStatus!=""&&item.localBankOpenAccountStatus!=null)||(item.localBankInvestmentStatus!=""&&item.localBankInvestmentStatus!=null)||(item.localBankHoldSharsStatus!=""&&item.localBankHoldSharsStatus!=null)'>
                        <span>本银行：</span>
                        <li v-if='item.localBankOpenAccountStatus!=""&&item.localBankOpenAccountStatus!=null'>{{item.localBankOpenAccountStatus=='1'?"本银行：已开户":"本银行：未开户"}}</li>
                        <!-- 本银行的投资状态1投0未投 -->
                        <li v-if='item.localBankInvestmentStatus!=""&&item.localBankInvestmentStatus!=null'>{{item.localBankInvestmentStatus=='1'?"本银行：已投资":"本银行：未投资"}}</li>
                        <!-- 本银行的持仓状态 1持仓0未持 -->
                        <li v-if='item.localBankHoldSharsStatus!=""&&item.localBankHoldSharsStatus!=null'>{{item.localBankHoldSharsStatus=='1'?"本银行：已持仓":"本银行：未持仓"}}</li>
                      </div>
                      
                      <!-- 限制地域 -->
                      <div v-if='item.userRegionConditions.length>0&&item.userRegionConditions[0].province!=""'>
                        <span>限制地域：</span>
                        <li v-for='(item2,index2) in item.userRegionConditions' :key='index2'>
                          <span v-if='item2.city==""||item2.city==null'>{{item2.province}}；</span>
                          <span v-else>{{item2.province}}-{{item2.city}}；</span>
                          {{item2.regPhoneNumCheck=="1"?"登陆手机号归属地":"  "}}
                          <span v-if='item2.idCardAddressCheck=="1"&&item2.regPhoneNumCheck=="1"'>、</span>
                          {{item2.idCardAddressCheck=="1"?"身份证地址":"  "}}
                          <span v-if='item2.gpsLocationCheck=="1"&&(item2.idCardAddressCheck=="1"||item2.regPhoneNumCheck=="1")'>、</span>
                          {{item2.gpsLocationCheck=="1"?"GPS地理位置  ":""}}
                        </li>
                      </div>
                      
                      <!-- 产品展示的条件配置 -->
                      <div v-if='item.prdShowConditons.length>0&&item.prdShowConditons[0].prdDisplayLocations!=""'>
                        <span>产品展示位置：</span>
                        <li v-for='(item2,index2) in item.prdShowConditons' :key='index2'>
                          <!-- <p>
                            时间类型：{{item2.dateType=="1"?"日期":"周期"}}
                          </p> -->
                          <p>
                            <!-- <span>产品展示位置：{{item2.prdDisplayLocationNameList.toString()}}</span> -->
                            <!--1140 新需求只留位置 -->
                            <span>{{item2.prdDisplayLocationNameList.toString()}}</span>
                          </p>
                          <!-- <p>
                            <span v-if='item2.dateType==1'>展示时间：{{item2.dateStart}}~{{item2.dateEnd}}</span>
                          </p>
                          <p>
                            <span v-if='item2.dateType==2'>展示周期：
                              <span v-if='item2.weekCode.toString().indexOf("1")>=0'>周一 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("2")>=0'>周二 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("3")>=0'>周三 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("4")>=0'>周四 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("5")>=0'>周五 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("6")>=0'>周六 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}<br></span>
                              <span v-if='item2.weekCode.toString().indexOf("7")>=0'>周日 {{item2.dateStart.split(" ")[1]}}~{{item2.dateEnd.split(" ")[1]}}</span>
                            </span>
                          </p> -->
                        </li>
                      </div>
                      <div v-if='item.displayConditon.advLocationNameList!=null&&item.displayConditon.advLocationNameList.length>0'>
                        <span>广告位：</span> 
                        <li>{{item.displayConditon.advLocationNameList.toString()}}</li>
                      </div>
                      <div v-if='item.displayConditon.actLocationNameList!=null&&item.displayConditon.actLocationNameList.length>0'>
                        <span>活动：</span> 
                        <li>{{item.displayConditon.actLocationNameList.toString()}}</li> 
                      </div>
                      <div v-if='item.displayConditon.contentNameList!=null&&item.displayConditon.contentNameList.length>0'>
                        <span>内容：</span> 
                        <li>{{item.displayConditon.contentNameList.toString()}}</li> 
                      </div>
                    </ul>
                  </div>
                  <div class='HUO' v-if='index!=scope.row.twoLevelUserCondition.length-1'>{{item.condConnSymbol==1?"且":""}}{{item.condConnSymbol==2?"或":""}}</div>
                </div>

                <div class='showMOre' style='display:none;position:absolute;bottom:0;right:0;left:0;z-index:10;background:rgba(255,255,255,0.8)' @click='getMore(scope.$index)'>
                  <span>更多详情>></span> 
                </div>
                <div class='hideMOre' style='display:none;' @click='closeMore(scope.$index)'>
                  <span>收起>></span>
                </div>
              </div>
            </template>
          </el-table-column>
      <!-- </el-table-column> -->
    </el-table>
    <!--分页栏-->
		<div class="toolbar" style="padding:10px 0;">
			<el-pagination layout="total,sizes, prev, pager, next, jumper" style="float:right;"
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
import {BankPrdpageQuery,BankPrdcheckExist,org,BankPrddelete,BankPrddeleteBatch,prdindexall} from '../../../apis/index'
export default {
  data () {
    return {
      contentList:[],
      prdList:[],
      pageParams: {
        totalPage:0,
        pageNum:1,
        pageSize:10
      },
      pageParams1: {
        totalPage:0,
        pageNum:1,
        pageSize:10
      },
      proName:"",
      executionStatus:'-1',
      searchForm: {
        keywords:"",
        prdIndexIds:[],
        orgIds:[],
      },
      size:'small',
      orgs: [],
      multipleSelection:[],
    }
  },
  computed: {
  },
  mounted() {
    
  },
  created () {
    this.orgFun()
    let params= {
      headerModel:{
        systemType: 'h5',
        message:'查询产品请求',
        requesttime:Date.parse(new Date()),
        version:"",
        token:"",
        deviceId:"",
        appFlag:"",
        loginUid:"",
      },
      datatypeParam:{
        currentPage: 1,
        searchName:''
      }
    }
    prdindexall(params).then((res) =>{
      if (res.headerModel.code==0) {
        this.prdList = res.datatypeParam.retList
        this.pageParams1.totalPage= res.datatypeParam.totalPage
      }
    })
    this.BankPrdpageQueryFun()
  },
  watch: {
    proName () {
      this.pageParams1.pageNum=1
    }
  },
  methods: {
    // / 跳转到外链银行  也就是外链 银行
    goto () {
       let pidNew=''
      JSON.parse(localStorage.getItem('@finsuit-admin')).finsuitStoreMenuList.menuList.forEach((i,index) => {
        if (i.id=='801') {
          pidNew=index
        }
      })
      
      let tabObj = {
        href: "/omp/static/html/regulatorySandbox/#/sandboxExternalLink/productList",
        icon: null,
        id: "806",
        pid: pidNew,
        title: "外链管理-产品"
      }
      window.parent.postMessage({ message: "addTab", data: tabObj });
    },
    // 搜索产品数据
    searchPro(query) {
      this.proName=query
      let params= {
        headerModel:{
          systemType: 'h5',
          message:'查询产品请求',
          requesttime:Date.parse(new Date()),
          version:"",
          token:"",
          deviceId:"",
          appFlag:"",
          loginUid:"",
        },
        datatypeParam:{
          currentPage: this.pageParams1.pageNum,
          searchName:query
        }
      }
      prdindexall(params).then((res) =>{
        if (res.headerModel.code==0) {
          this.prdList = res.datatypeParam.retList
          this.pageParams1.totalPage= res.datatypeParam.totalPage
        }
        // document.getElementsByClassName('scrollSelect')[0].querySelector('.el-input__inner').value=this.proName
      })
    },
    // 广告内容上一页
    prevPage () {
      if (this.pageParams1.pageNum<=1) {
        this.pageParams1.pageNum=1
      } else {
        this.pageParams1.pageNum-=1
      }
      this.searchPro(this.proName)
    },
    // 广告内容下一页
    nextPage () {
      if (this.pageParams1.pageNum>=this.pageParams1.totalPage) {
        this.pageParams1.pageNum=this.pageParams1.totalPage
      } else {
        this.pageParams1.pageNum+=1
      }
      this.searchPro(this.proName)
    },
    // 查询银行机构
    orgFun () {
      org().then((res) => {
        if (res.headerModel.code==0) {
          this.orgs=res.datatypeParam
          sessionStorage.setItem('orgs',JSON.stringify(res.datatypeParam))
        }
      })
    },
     handleSizeChange (val) {
      this.pageParams.pageSize = val
      this.BankPrdpageQueryFun()
    },
    // 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
      this.pageParams.pageNum = val
      this.BankPrdpageQueryFun()
		},
    // 查询列表数据
    BankPrdpageQueryFun () {
      this.contentList=[]
      let params= {
        headerModel:{
          systemType: 'h5',
          message:'分页查询产品和银行的配置',
          requesttime:Date.parse(new Date()),
          version:"",
          token:"",
          deviceId:"",
          appFlag:"",
          loginUid:"",
        },
        datatypeParam:{
          currentPage: this.pageParams.pageNum,
          pageSize:this.pageParams.pageSize,
          keywords: this.searchForm.keywords, //关键字查询
          orgIds: this.searchForm.orgIds.toString(), //多个银行机构id
          prdIndexIds: this.searchForm.prdIndexIds.toString(), //多个产品id
          productOrBank:'1', //1产品2银行
          executionStatus: this.executionStatus, //执行状态1全部0未开始1执行中2结束
        }
      }
      BankPrdpageQuery(params).then((res) => {
        if (res.headerModel.code==0) {
          this.contentList=res.datatypeParam.retList
          this.pageParams.totalPage=res.datatypeParam.totalCount
          this.$nextTick(() => {
            let arr = new Set(document.getElementsByClassName('itemDiv'))
            arr.forEach((i) => {
              if (i.clientHeight>260) {
                i.style.height='260px'
                i.getElementsByClassName('showMOre')[0].style.display="block"
              } else {
                i.style.height='max-content'
              }
            })
          })
        }
      })
    },
    // 切换状态
    changeStatus () {
      this.pageParams.pageNum='1'
      this.BankPrdpageQueryFun()
    },
    // 更多详情
    getMore (index) {
      document.getElementsByClassName('itemDiv')[index].style.height='max-content'
      document.getElementsByClassName('itemDiv')[index].getElementsByClassName('showMOre')[0].style.display="none"
      document.getElementsByClassName('itemDiv')[index].getElementsByClassName('hideMOre')[0].style.display="block"
    },
    // 关闭更多详情
    closeMore (index) {
      document.getElementsByClassName('itemDiv')[index].style.height='260px'
      document.getElementsByClassName('itemDiv')[index].getElementsByClassName('showMOre')[0].style.display="block"
      document.getElementsByClassName('itemDiv')[index].getElementsByClassName('hideMOre')[0].style.display="none"
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查询
    getList () {
      this.pageParams.pageNum = 1
      this.BankPrdpageQueryFun()
    },
    // /重置
    reset () {
      this.$refs.searchForm.resetFields()
      this.pageParams.pageNum=1
      this.BankPrdpageQueryFun()
    },
    // 新增
    add () {
      this.$router.push(
        {
          path: '/product/addProduct',
          query: {
            name:'新增'
          }
        }
      )
    },

    
    // /批量删除
    delAll () {
      let idArr=[]
      this.multipleSelection.forEach((i) => {
        idArr.push(i.id)
      })
      this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
        let params={
          headerModel:{
            systemType: 'h5',
            message:'删除请求',
            requesttime:Date.parse(new Date()),
            version:"",
            token:"",
            deviceId:"",
            appFlag:"",
            loginUid:"",
          },
          datatypeParam:{
            ids:idArr.toString()
          }
        }
				BankPrddeleteBatch(params).then((res) => {
          if (res.headerModel.code==0) {
            this.$message.success('删除成功')
            this.BankPrdpageQueryFun()
          } else {
            this.$message({type: 'info',message: res.headerModel.message}); 
          }
        })
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});
			});
    },
    // 删除
    deletFun (row,index) {
      let params= {
        headerModel:{
          systemType: 'h5',
          message:'删除请求',
          requesttime:Date.parse(new Date()),
          version:"",
          token:"",
          deviceId:"",
          appFlag:"",
          loginUid:"",
        },
        datatypeParam:{
          ids:row.id.toString(),
          productOrBank:'1', //1产品2银行
        }
      }
      this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
				BankPrddelete(params).then((res) => {
          if (res.headerModel.code==0) {
            this.$message.success('删除成功')
            this.BankPrdpageQueryFun()
          } else {
            this.$message({type: 'info',message: res.headerModel.message}); 
          }
        })
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});
			});
    },
    // handleEdit修改
    handleEdit (row,index) {
      this.$router.push(
        {
          path: '/product/addProduct',
          query: {
            id: row.id,
            name:'修改',
            copy: '0'
          }
        }
      )
    },
    // 复制
    handleCopy (row,index) {
      console.log('点击复制')
      this.$router.push(
        {
          path: '/product/addProduct',
          query: {
            id: row.id,
            name:'复制',
            copy: '1'
          }
        }
      )
    }
    
  }
}
</script>
<style lang="less" scoped>
.title {
  color: #409EFF;
}
.noVisib {
  color: red;
}
.tip {
  background: #f1f1f1;
  padding: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.executionStatusClass {
  >b {
    font-size: 20px;
  }
  >span {
    padding: 2px 15px;
    background: #999;
    color: #fff;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    border-radius: 8px;
  }
  .overClass {
    background: #ddd;
  }
}

.bankList {
  padding: 20px;
  /deep/ .el-table td, .el-table th {
    vertical-align: baseline;
  }
  
  .searchForm {
    border-bottom: 1px solid #ebeef5;
    .searchDiv {
      display: flex;
      flex-wrap: wrap;
      /deep/ .el-form-item {
        display: flex;
        margin-right: 20px;
      }
    }
  }
  .addBtn {
    margin: 20px 0 0;
    position: relative;
    height: 40px;
  }
  .typeClass {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // display: inline-block;
    width: max-content;
    text-align: center;
    margin: 0 auto;
  }
  .contentDiv {
    border-left: 6px solid #409EFF;
    .HUO {
      padding: 10px;
    }
  }
  .huoDiv {
    height: 60px;
    line-height: 60px;
  }
  .content {
    background: #f1f1f1;
    padding: 10px;
    ul {
      >div {
        display: flex;
        flex-wrap: wrap;
        margin-top:10px;
        span {
          width: max-content;
          margin-top:10px
        }
      }
      li {
        display: inline-block;
        width: max-content;
        padding: 5px 10px;
        border: 1px solid #333;
        margin: 10px 10px 0 0;
        border-radius: 10px;
      }
    }
  }

}
.showMOre,.hideMOre {
  overflow: hidden;
  height:30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
// .scrollSelect {
//   max-height: 100px;
//   overflow: auto;
//   padding-right: 20px;
// }
</style>