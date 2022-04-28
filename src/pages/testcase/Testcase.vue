<template>
<!--    <Menu>-->
      <div slot="content">


        <!-- <rh-card :cardName="cardName" :buttonName="buttonName" @buttonBehavior="addCase"
        :tableData="testcaseList" :tableLabel="tableLabel" :tableOption="tableOption"
        @handleButton="handleButton">
        <table-pagination :total="total" :currentPage="page" :pageSize="pageSize"
        @handleNumberChange="handleSizeChange" @handlePageChange='handleCurrentChange'></table-pagination>
        </rh-card> -->

        <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
            <el-col>

              <el-form :inline="true" :model="searchForm" ref="searchForm" :formRules="searchFormRules">
                <el-form-item label="用例名称" prop="testcasename">
                  <el-input v-model="searchForm.testcaseName" placeholder="请输入用例名称"></el-input>
                </el-form-item>
                <el-form-item label="项目" prop="project">
                  <el-select v-model="searchForm.project" placeholder="请选择">
                    <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">搜索 🔍</el-button>
                <el-button type="primary" @click="resetForm">重置</el-button>
              </el-form>

            </el-col>
          <el-tab-pane :key="item.name" v-for="item in editableTabs"
          :label="item.title"
          :name="item.name">
            <!-- name == 1的时候展示列表 -->
            <common-table v-if="item.name == '1'" :tableData="testcaseList"
            :tableLabel='[
            {label:"id", param:"id"},
            {label:"用例名称",param:"caseName"},
            {label:"所属模块", param:"module"},
            {label:"状态",param:"openStatus","formater":formateStatus},
            {label:"总执行次数",param:"caseRunTotal","formater":formaterRunTotal},
            {label:"总通过次数",param:"casePassTotal","formater":formaterPassTotal},
            {label:"执行时间",param:"caseLastRuntime","formater":formaterRuntime}]'
            :tableOption="tableOption" @handleButton="handleButton"></common-table>
            <table-pagination v-if="item.name == '1'" :total="total" :currentPage="page" :pageSize="pageSize"
            @handleNumberChange="handleSizeChange" @handlePageChange='handleCurrentChange'>
            </table-pagination>
            <div v-else>
              <!-- 新增用例 -->
                <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>基础信息</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click.native="storeCase">保存</el-button>
                </div>
                <el-form :model="form" :inline="true" ref="form">
                  <el-row>
                    <!-- 用例名称 -->
                    <el-col :span="7">
                        <el-form-item prop="caseName" label="用例名称:">
                          <el-input v-model="form.caseName" placeholder="请输入用例名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 所属项目选择 -->
                    <el-col :span="7">
                      <el-form-item prop="projectId" label="所属项目:">
                        <el-select v-model="form.projectId" @change="changeModuleList">
                          <el-option v-for="item in projectList" :key="item.projectName" :label="item.projectName" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- 用例所属模块 -->
                    <el-col>
                      <el-form-item prop="module" label="所属模块:">
                        <el-select v-model="form.module">
                          <el-option v-for="item in projectModuleList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- 运行环境选择 -->
                    <!-- <el-col :span="7">
                      <el-form-item prop="projectEnv" label="运行环境:">
                        <el-select v-model="form.projectEnv">
                          <el-option v-for="item in projectEnvList" :key="item.name" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col> -->
                  </el-row>
                  <span>用例步骤
                      <el-button icon="el-icon-circle-plus-outline" circle @click="newStep" style="float: right"></el-button>
                  </span>
                  <el-divider></el-divider>
                  <div>
                    <!-- <el-row>
                      <p v-if="!hasStep" style="text-align: center;">暂无数据</p>
                  
                      <el-row v-else> -->
                        <!-- <CommonTable :tableData="stepList" :tableLabel='[
                        {label: "id", param: "stepId"},
                        {label: "步骤名称",param: "stepName"},
                        {label: "步骤方法", param:"stepMethod"},
                        {label: "步骤header", param:"stepHeader","formater":formaterHeader},
                        {label: "步骤body",param:"stepData","formater": formaterData},
                        {label: "步骤提取", param:"stepExtract","formater":formaterExtract},
                        {label:"步骤校验",param:"stepAssert","formater":formaterAssert}]'
                        :tableOption="stepTableOption" @handleButton="handleStepEdit"></CommonTable> -->
                        <el-table :data="stepList" empty-text="暂无数据" highlight-current-row>
                          <el-table-column prop="stepId" label="id"></el-table-column>
                          <el-table-column prop="stepName" label="步骤名称"></el-table-column>
                          <el-table-column prop="stepMethod" label="步骤方法"></el-table-column>
                          <el-table-column prop="stepHeader" label="步骤header" :formatter="formaterHeader"></el-table-column>
                          <el-table-column prop="stepData" label="步骤body" :formatter="formaterData"></el-table-column>
                          <el-table-column prop="stepExtract" label="步骤提取" :formatter="formaterExtract"></el-table-column>
                          <el-table-column prop="stepAssert" label="步骤校验" :formatter="formaterAssert"></el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                              <el-button icon="el-icon-arrow-up" type="text" :disabled='scope.$index===0' @click="moveUp(scope.row)"></el-button>
                              <el-button icon="el-icon-arrow-down" type="text" :disabled='scope.$index===(stepList.length-1)' @click="moveDown(scope.row)"></el-button>
                              <el-button icon="el-icon-edit" type="text" @click="handleStepEdit('stepEdit',scope)"></el-button>
                              <el-button icon="el-icon-delete" type="text" @click="handleStepEdit('stepDel',scope)"></el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      <!-- </el-row>
                    </el-row> -->
                  </div>

                  <!-- 录入步骤dialog -->
                  <el-dialog :visible.sync="drawer" title="步骤录入" :before-close="handleClose">
                      <el-form :model="testStepForm" ref="testStepForm" :rules="stepRule" class="drawer-form" label-position="left" label-width="auto">
                          <el-form-item prop="stepName" label="步骤名称:" style="width:100%">
                              <el-input v-model="testStepForm.stepName" placeholder="请输入步骤名称" ></el-input>
                          </el-form-item>
                          <el-form-item label="请求类型:" prop="interfaceType">
                            <el-radio-group v-model="testStepForm.interfaceType">
                              <el-radio label="HTTP"></el-radio>
                              <el-radio label="DUBBO"></el-radio>
                            </el-radio-group>
                          </el-form-item>
      
                          <el-form-item label="前置依赖:" prop="dependencyCase">
                            <el-input v-model="testStepForm.dependencyCase" placeholder="请输入依赖用例id或用例名称查询" class="input-with-select">
                              <el-button slot="append" icon="el-icon-search" @click="searchDependencyCase"></el-button>
                            </el-input>
                            <el-alert v-if="dependencyCaseExtract.length > 0"
                              title="这是当前用例提取的依赖" :closable="false" :description="beautyExtract(dependencyCaseExtract)" type="info">
                            </el-alert>
                          </el-form-item>
                       
                          <el-form-item label="请求地址:" prop="stepApiPath">
                            <el-input v-model="testStepForm.stepApiPath" placeholder="请输入请求路径">
                            <el-select v-model="testStepForm.stepApiMeth" slot='prepend' style="width: 100px">
                              <el-option value="GET" label="GET"></el-option>
                              <el-option value="POST" label="POST"></el-option>
                              <el-option value="DELETE" label="DELETE"></el-option>
                              <el-option value="PUT" label="PUT"></el-option>
                              <el-option value="DELETE" label="DELETE"></el-option>
                            </el-select>
                            </el-input>
                          </el-form-item>
                          
                        <!-- 是否选择导入接口 -->
                          <el-form-item label="请 求 头:" prop="stepApiHeader">
                              <el-input v-model="testStepForm.stepApiHeader" placeholder="请输入key:value,key:value"></el-input>
                          </el-form-item>

                          <el-form-item label="请求参数:" prop="stepApiData">
                            <el-input v-model="testStepForm.stepApiData" type="textarea" placeholder="请输入key:value"></el-input>
                          </el-form-item>

                          <el-form-item label="提取参数:" prop="stepApiExtra">
                            <el-input v-model="testStepForm.stepApiExtra" type="textarea" placeholder="请输入提取参数 eg: name: $..name"></el-input>
                          </el-form-item>

                          <el-form-item label="步骤校验:" prop="stepApiAssert">
                            <el-input v-model="testStepForm.stepApiAssert" type="textarea" rows="3" placeholder="请输入步骤校验eg: assertIn/assertEquals ">
                            </el-input>
                          </el-form-item>

                        </el-form>
                        <div slot="footer" class="dialog-footer">
                          <el-button type="primary" @click="handleClose">取消</el-button>
                          <el-button type="primary" @click="submitStep">保存</el-button>
                        </div>

                  </el-dialog>
                </el-form>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
<!--    </Menu>-->
</template>

<script>
  import Menu from 'components/common/Menu'
  import RhForm from 'components/common/CommonForm'
  import RhCard from 'components/common/RhCard'
  import {request} from "@/network/request"
  import TablePagination from '../../components/common/TablePagination.vue'
  import CommonTable from '../../components/common/CommonTable.vue'
  import {formData} from "@/utils/DataResolve"
  import {DateFormat} from "@/utils/DatetimeUtils"
import { get } from '../../network/axios_request'

  export default {
    name: 'Report',
    components:{
      Menu,
      RhForm,
      RhCard,
      TablePagination,
        CommonTable,
    },
    data(){
      return {
        searchForm:{
          testcaseName: "",
          project:""
        },
        searchFormRules:{
          testcaseName: [{min: 2, max: 10, message:"长度限制2-10",trigger:"blur"}],
          project:[{required:false, message:"test"}]
        },
        projectList:[],
        cardName: "用例列表",
        buttonName: "新增用例",
        testcaseList:[],
        tableLabel:[
          {label:"id", param:"id"},
          {label:"用例名称",param:"caseName"},
          {label:"状态",param:"openStatus",},
          {label:"总执行次数",param:"caseRunTotal"},
          {label:"总通过次数",param:"casePassTotal"},
          {label:"执行时间",param:"caseLastRuntime"}
        ],
        tableOption:{
          "label": "操作",
          "options":[
            {'icon':"el-icon-edit","type":"text","methods":"handleEdit"},
            {"icon":"el-icon-video-play",'type':"text","methods":"handleRun"},
            {"icon":"el-icon-circle-close", 'type':"text","methods":"closeCase"}
          ]
        },
        page: 1,
        pageSize: 10,
        total: null,
        // tabs默认值
        editableTabsValue: '1',
        editableTabs: [{
          title: '用例列表',
          name: '1',
        }],
        tabIndex: 1,
        // case
        projectList: [],
        projectEnvList: [],
        drawer: false,
        // 用例是否存在的flag
        hasCase: false,
        hasStep: false,
        form:{
          caseId: "",
          caseName: "",
          projectId: "",
          module: ""
        },
        // 项目模块列表
        projectModuleList: [],
        testStepForm: {
          stepId: "",
          stepName: "",
          interfaceId: "",
          stepIndex: 1,
          testcaseId: "",
          dependencyCase: "",
          interfaceType: "HTTP",
          stepApiPath: "",
          stepApiMeth: "GET",
          stepApiHeader: "",
          stepApiData:"",
          stepApiExtra:"",
          stepApiAssert:""
        },
        stepRule: {
          stepName: [
            {required: true, message: "请输入步骤名称",trigger:"blur"}
          ],
          stepApiPath: [
            {required: true, message: "请输入接口请求路径", trigger:"blur"}
          ],
          stepApiHeader: [
            {required:true, message:"请输入接口请求头",trigger:"blur"}
          ],

        },
        // 初始索引值
        initStepIndex: 0,
        stepList: [],
        stepTableOption:{
          label:"操作",
          options:[
            {'icon':'el-icon-arrow-up','type':'text','methods':'moveUp','disabled':'scope.$index===0'},
            {'icon':'el-icon-arrow-down','type':'text','methods':'moveDown','disabled':'scope.$index===(stepList.length-1)'},
            {"icon":"el-icon-edit","type":"text","methods":"stepEdit"},
            {"icon":"el-icon-delete", "type":"text","methods":"stepDel"}
            ]
        },
        // 依赖case的提取参数
        dependencyCaseExtract: [],
      }
    },
    methods:{
      // 搜索case
      handleSearch(){
        this.pageCase()
      },
      // 重置搜索框
      resetForm(){
        // this.searchForm.testcaseName = "",
        // this.searchForm.project = "",
        this.$refs.searchForm.resetFields()
        this.pageCase()
      },
      // 新增用例
      addCase(){},
      // 格式化时间
      formatTime(){

      },
      /**
       * case列表页面的两按钮
       */
      handleButton(value){
        switch(value.methods){
          // 编辑
          case "handleEdit":
            this.handleTabsEdit(value.row.caseName, "add", value)
            this.hasCase = true
            console.log(value.row);
            // 编辑用例的时候将caseid赋值给caseForm.caseId
            this.form.caseId = value.row.id
            this.testStepForm.testcaseId = value.row.id
            // 重新编辑的时候需要给index赋值
            this.initStepIndex = this.caseStep(value.row.id)
            if(this.initStepIndex != 0){
              this.hasStep = true
            }
            for(let _ in this.form){
              if(value.row[_]){
                this.form[_] = value.row[_]
              }
            }
            break
          // 执行
          case "handleRun":
            request({
              url: "/testcase/execute",
              method: "post",
              data: formData({"caseId": value.row.id})
            }).then(res =>{
              if(res.code === 10000){
                var logMsg = ""
                this.$message.info(res.msg)
                // 请求执行成功之后刷新状态
                this.pageCase()
                for (let i = 0; i < res.log.length; i++) {
                    logMsg += '<p>' + res.log[i] + '</p>';
                };
                this.$alert(
                  logMsg,'请求日志',{
                  dangerouslyUseHTMLString: true,
                });
              }else{
                this.$message.error(res.msg)
                // 请求失败刷新状态
                this.pageCase()
              }
            }).catch( err=>{

            })
            break
          default: // 将用例修改成关闭状态
            request({
              url: "/testcase/close",
              method: "post",
              data: formData({"caseId": value.row.id})
            }).then(res => {
              if (res.code == 10000){
                this.$message.info("禁用成功")
                this.pageCase()
              }else{
                this.$message.error(res.msg)
              }
            })

        }
      },
      handleCurrentChange(item){
        this.page = item
        // 发起请求
        this.pageCase()
      },
      handleSizeChange(item){
        this.pageSize = item
        // 发起请求
        this.pageCase()
      },
      // 获取当页数据
      pageCase(){
        request({
          url: "/testcase/pageCase",
          method: "get",
          params: {
            "page":this.page,
            "pageSize":this.pageSize,
            "caseName": this.searchForm.testcaseName,
            "projectId": this.searchForm.project}
        }).then(res =>{
          if(res.code === 10000){
            this.total = res.data.total
            this.testcaseList = res.data.list
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      /**
       * 控制el-tabs新增删除
       */
      handleTabsEdit(targetName, action, personDefine=null) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          if(personDefine){
            this.editableTabs.push({
              title: personDefine.row.caseName,
              name: newTabName
            })
            this.hasCase = true
          }else{
            this.editableTabs.push({
            title: '用例录入',
            name: newTabName,
            });
            this.hasCase = false
            // 新增初始化list
            this.stepList = []
          }
          this.editableTabsValue = newTabName;
          // 新增用例的时候重置
          this.dependencyCaseExtract = []
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if(targetName == "1"){
            this.$message.warning("不能删除用例列表");
            return
          }
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
            // 删除el-tabs时重置表单字段
            this.form.caseId = "",
            this.form.caseName = "",
            this.form.projectId = "",
            this.form.module = ""
          }
          // 关闭的时候清除testcaseId
          this.testStepForm.testcaseId = ""
          // 复原hasCase
          this.hasCase = false
          this.initStepIndex = 0
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
      // 全部项目列表
      getAllProject(){
        request({
          "url":"/projects/allProject",
          "method": "get"
        }).then(res =>{
          if(res.code ===10000){
            this.projectList = res.data.list
            console.log(this.projectList);
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      // 保存步骤
      submitStep(){
        let params = Object.assign({}, this.testStepForm)
        console.log(params)
        if(!this.testStepForm.stepId){
          // 新增
          // params.stepIndex = this.initStepIndex + 1
          request({
            url: '/teststep/add',
            method: 'post',
            data: formData(params)
          }).then(res =>{
            if(res.code === 10000){
              this.$message.info("新建成功")
              this.initStepIndex = this.caseStep(params.testcaseId)
              this.hasStep = true
              this.drawer = false
              this.$refs.testStepForm.resetFields()
              // 请求成功之后再次初始化
              this.dependencyCaseExtract = []
            }else{
              this.$message.error(res.msg);
            }
          })
        }else{
          let params = Object.assign({}, this.testStepForm)
          // 编辑
          console.log(params)
          request({
            url: "/teststep/edit",
            method: "post",
            data: formData(params)
          }).then(res =>{
            if(res.code === 10000){
              this.drawer = false
              this.caseStep(this.testStepForm.testcaseId)
              this.$refs.testStepForm.resetFields()
            }else{
              this.$message.error(res.msg)
            }
          })
        }

      },
      // 保存case
      storeCase(){
        // 如果存在case，表示是编辑
        if(this.hasCase){
          request({
            'url': "/testcase/editCase",
            "method": "post",
            "data": formData(this.form)
          }).then(res =>{
            // 编辑成功
            if(res.code == 10000){
              this.testStepForm.testcaseId = res.data.list.id
              this.$refs.testStepForm.resetFields()
              this.$message.success(res.msg)
            }else{
              this.$message.error(res.msg)
            }
          }).catch(err =>{
            console.log(err);
          })
        }else{
          // 否则就是新增
          request({
          'url':'/testcase/add',
          'method':"post",
          "data":formData(this.form)
        }).then(res =>{
          if(res.code == 10000){
            this.hasCase = true
            // 新建完成，给testcaseid赋值
            this.testStepForm.testcaseId = res.data.list.id
            this.$message.info("新建成功")
          }else{
            this.message.error(res.msg)
          }
        })
        }

      },
      /**
       * 关闭drawer
       */
      handleClose(){
        this.$confirm('还有未保存的工作哦确定关闭吗？')
            .then(_ => {
              this.drawer = false
              // 关闭drawer，清空数据内容
              this.testStepForm.stepId = "",
              this.testStepForm.stepName = "",
              this.testStepForm.interfaceType = "",
              this.testStepForm.interfaceType = "HTTP",
              this.testStepForm.stepApiPath = "",
              this.testStepForm.stepApiMeth = "GET",
              this.testStepForm.stepApiHeader = "",
              this.testStepForm.stepApiData = "",
              this.testStepForm.stepApiExtra = "",
              this.testStepForm.stepApiAssert = ""
              this.testStepForm.dependencyCase = ""
              // this.$refs.testStepForm.resetFields()
              // 关闭drawer，重置dependency extract
              this.dependencyCaseExtract = []
              done();
            })
            .catch(_ => {});
      },
      // 新增step按钮
      newStep(){
        if(!this.hasCase){
          this.$message.error("请先保存用例信息！")
        }
        else{
          if(this.stepList != null){
            this.testStepForm.stepIndex = this.stepList.length + 1
          }else{
            this.testStepForm.stepIndex = 1
          }
          console.log(this.testStepForm.stepIndex);
          this.drawer = true
        }
      },
      // 获取当前case的step数
      caseStep(caseId){
        request({
          url: "/teststep/caseStep",
          method: "get",
          params: {"caseId": caseId}
        }).then(res =>{
          if(res.code === 10000){
            this.stepList = res.data.list
            return res.data.total
          }else{
            // 请求失败，将stepList重置
            this.stepList = []
            this.$message.error(res.msg)
          }
        })
      },
      // 格式化table内容
      formateStatus(row, colloum, cellValue, index){
        return row.openStatus === true ? "启用":"禁用"
      },
      formaterRunTotal(row,colloum){
        return !row.caseRunTotal? 0:row.caseRunTotal
      },
      formaterPassTotal(row, colloum){
        return !row.casePassTotal? 0:row.casePassTotal
      },
      formaterRuntime(row,colloum){
        return !row.caseLastRuntime? '-':DateFormat(row.caseLastRuntime)
      },
      formaterHeader(row,colloum){
        try{
          return row.stepHeader? JSON.stringify(row.stepHeader): "-"
        }
        catch(err){
          return row.stepHeader
        }
      },
      formaterData(row, colloum){
        try{
          return row.stepData? JSON.stringify(row.stepData): "-"
        }catch(err){
          return row.stepData
        }
      },
      formaterExtract(row, collumn){
        try{
          return row.stepExtract? JSON.stringify(row.stepExtract):"-"
        }catch(err){
          return row.stepExtract
        }
      },
      formaterAssert(row,collumn){
        try{
          return row.stepAssert? JSON.stringify(row.stepAssert):"-"
        }catch(err){
          return row.stepAssert
        }
      },
      // end
      // 编辑step按钮，弹出页面
      handleStepEdit(methods,value){
        // 编辑step
        if(methods == "stepEdit"){
          this.drawer = true
          this.testStepForm.stepName = value.row.stepName
          this.testStepForm.testcaseId = value.row.caseId
          this.testStepForm.interfaceType = "HTTP"
          this.testStepForm.stepApiPath = value.row.stepPath
          this.testStepForm.stepApiMeth = value.row.stepMethod.toUpperCase()
          this.testStepForm.stepApiHeader = value.row.stepHeader===null?"":JSON.stringify(value.row.stepHeader)
          this.testStepForm.stepApiData = value.row.stepData === null? "":JSON.stringify(value.row.stepData)
          this.testStepForm.stepApiAssert = value.row.stepAssert === null? "":JSON.stringify(value.row.stepAssert)
          this.testStepForm.stepApiExtra = value.row.stepExtract === null? value.row.stepExtract:JSON.stringify(value.row.stepExtract)
          this.testStepForm.stepId = value.row.stepId
          this.testStepForm.dependencyCase = value.row.setUpCase == null? "":value.row.setUpCase
          this.testStepForm.stepIndex = value.row.stepIndex
        }
        // 删除step
        else{
          let params = {"stepId": value.row.stepId}
          request({
            "url": "/teststep/deleteStep",
            "method": "post",
            "data": formData(params)
          }).then(res => {
            if(res.code === 10000){
              this.$message.info("删除成功")
              this.caseStep(value.row.caseId)
            }else{
              this.$message.error(res.msg)
            }
          }).catch(err=>{
            console.log(err);
          })

        }

      },
      /**
       * 查询依赖用例
       */
      searchDependencyCase(){
        let params = {"params": this.testStepForm.dependencyCase}
        request({
          "url": "/testcase/query",
          "method": "post",
          "data": formData(params)
        }).then(res =>{
          if(res.code == 10000){
            this.dependencyCaseExtract = res.data
          }else{
            // 查询失败之后也需要重置extractList
            this.$message.error(res.msg)
            this.dependencyCaseExtract = []
          }
        }).catch(err =>{
          console.log(err);
        })
      },
      /**
       * 格式化extract内容
       */
      beautyExtract(extarct){
        return JSON.stringify(extarct)
      },
      /**
       * 当project选定之后，需要更新projectmoduleList参数
       * @param value: 选定的projectId
       */
      changeModuleList(value){
        request({
          url: "/projects/getModules",
          method: "get",
          params: {"projectId": value}
        }).then(res =>{
          if(res.code == 10000){
            this.projectModuleList = res.data
          }else{
            
          }
        })
      },
      /**
       * 
       */
      moveUp(scope){
        let reqParams = {}
        reqParams["caseId"] = scope.caseId
        reqParams['stepId'] = scope.stepId
        reqParams['beh'] = "up"
        request({
          url: '/teststep/exchange',
          method: "post",
          data: formData(reqParams)
        }).then(res =>{
          if(res.code == 10000){
            this.$message.success("交换成功")
            this.caseStep(scope.caseId)
          }else{
            this.$message.error("交换失败")
          }
        })
      },
      moveDown(scope){
        let reqParams = {}
        reqParams["caseId"] = scope.caseId
        reqParams['stepId'] = scope.stepId
        reqParams['beh'] = "down"
        request({
          url: '/teststep/exchange',
          method: "post",
          data: formData(reqParams)
        }).then(res =>{
          if(res.code == 10000){
            this.$message.success("交换成功")
            this.caseStep(scope.caseId)
          }else{
            this.$message.error("交换失败")
          }
        })
      }
    },
    mounted(){
      this.pageCase()
      this.getAllProject()
    }
  }
</script>

<style scoped>

</style>
