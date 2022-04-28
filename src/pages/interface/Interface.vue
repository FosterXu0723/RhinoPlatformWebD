<template>
<!--    <Menu>-->
      <div >
        <el-row>
          <el-form :inline="true" :model="searchForm" ref="searchForm">
            <el-form-item label="项目:"   prop="projectId">
              <el-select v-model="searchForm.projectId" placeholder="请选择项目">
                <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口名称:" prop="interfaceName">
              <el-input v-model="searchForm.interfaceName" placeholder="请输入接口名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click.native="searchApi">搜索 🔍</el-button>
            <el-button type="primary" @click.native="resetSearch">重置</el-button>
          </el-form>
        </el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>接口列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click.native="addInterface">接口录入</el-button>
          </div>
          <common-table :tableData="interfaceList" :tableLabel="[
          {'label':'id','param': 'interfaceId'},
          {'label':'接口类型','param':'interfaceType'},
          {'label':'项目名称','param': 'project','formater':translateProject},
          {'label':'接口名称','param':'interfaceName'},
          {'label':'接口参数','param':'interfaceParams'},
          {'label':'请求类型','param':'interfaceMethdod'},
          {'label':'路径','param':'interfacePath'}]" :tableOption="{
            'label':'操作',
            'options':[
            {'icon':'el-icon-edit','type':'text','methods':'handleEdit'},
            {'icon':'el-icon-video-play','type':'text','methods':'handleRun'}]
          }" @handleButton="handleButton"></common-table>
          <table-pagination :total="interfaceTotal" :currentPage="page" :pageSize="pageSize"
          @handleNumberChange="handleSizeChange" @handlePageChange='handleCurrentChange'></table-pagination>
        </el-card>

        <!-- 新建编辑弹窗共用 -->
        <el-dialog :visible.sync="interfaceDialogVisible" :title="apiDialogTitle[dialogStatus]" width="40%" @close="dialogClose">
          <el-form :model="interfaceForm" label-width="85px" ref="interfaceForm" :rules="apiRules">
            <el-form-item v-for="(item,index) in interfaceParamArray" :key="index" :label="item.label + ':'" :prop="item.model" :rules="apiRules[item.model]">
              <el-input v-if="item.type == 'input'" v-model="interfaceForm[item.model]" :placeholder="'请输入' + item.label"></el-input>
              <el-select v-if="item.type == 'select' && item.option != 'projectList'" v-model="interfaceForm[item.model]" :placeholder="'请选择' + item.label">
                <el-option v-for="opt in item.option" :key="opt.value" :value="opt.value"></el-option>
              </el-select>
              <el-select v-if="item.type == 'select' && item.option == 'projectList'" v-model="interfaceForm[item.model]"
              :placeholder="'请选择' + item.label" :rules="apiRules[item.model]">
              <el-option v-for="project in projectList" :key="project.id" :label="project.projectName" :value="project.id"></el-option>
              </el-select>
              <el-switch v-if="item.type == 'switch'" v-model="interfaceForm[item.model]"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="cancelSubmit">取消</el-button>
            <el-button v-if="dialogStatus== 'addApi'" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            <el-button v-else @click.native="editSubmit" :loading="addLoading">提交</el-button>
          </div>
        </el-dialog>

        <!-- 定义消息通知抽屉 -->
        <el-drawer
          title="接口执行情况"
          :visible.sync="drawer"
          :direction="direction">
          <div>{{"响应码：" + statusCode}}</div>
          <span>响应码：</span>
          <div>{{response}}</div>
        </el-drawer>
      </div>
<!--    </Menu>-->
</template>

<script>
  import Menu from 'components/common/Menu'
  import {request} from "@/network/request"
  import CommonTable from '../../components/common/CommonTable.vue'
  import TablePagination from '../../components/common/TablePagination.vue'
  import {formData} from '@/utils/DataResolve'

  export default {
    name: 'Interface',
    components:{
      Menu,
        CommonTable,
        TablePagination,
    },data(){
      return {
        addLoading: false,
        interfaceDialogVisible: false,
        interfaceForm:{
          project: "",
          interfaceId: "",
          interfaceName: "",
          interfacePath: "",
          interfaceMethdod: "",
          interfaceHeader: "",
          interfaceType: "http",
          interfaceParams: "",
        },
        interfaceParamArray:[
          {label:"所属项目",model:"project",type:"select",option:"projectList"},
          {label: "接口名称", model:"interfaceName", type:"input"},
          {label:"接口路径", model:"interfacePath", type:"input"},
          {label:"接口方法", model: "interfaceMethdod", type:"input"},
          {label:"请求头", model:"interfaceHeader", type:"input"},
          {label:"接口类型", model:"interfaceType", type:"select", option:[
            {value:'http'},
            {value:'tcp'},
            {value:'dubbo'}
            ]},
          {label:"请求参数", model:"interfaceParams", type:"input"},
        ],
        apiRules:{
          project:[{required:true,message:"请选择所属项目"}],
          interfaceName: [{required:true,message:"请输入接口名称",trigger:"blur"},{max: 10,min: 2,message:"文本长度限制2-10"}],
          interfacePath:[{required:true,message:"请输入接口路径",trigger:"change"}],
          interfaceMethdod:[{required:true,message:"请输入请求方法类型",trigger:"blur"}],
          interfaceType:[{required:true,message:"请选择接口类型",trigger:"blur"}],
          interfaceParams:[{required:true,message:"请输入接口请求参数",trigger:"blur"}]
        }
        ,
        apiDialogTitle:{
          addApi: "新增接口",
          editApi: "编辑接口"
        },
        dialogStatus: "",
        interfaceList:[],
        projectList:[],
        interfaceTotal: null,
        searchForm: {
          projectId: "",
          interfaceName:""
        },
        // 执行弹窗
        executeForm:{
          projectId: "",
          interfaceId: ""
        },
        // 接口响应
        drawer: false,
        direction: "rtl",
        statusCode: "",
        response: "",
        // 分页
        page: 1,
        pageSize: 10
      }
    },
    methods:{
      addInterface(){
        this.interfaceDialogVisible = true
        this.dialogStatus = "addApi"
      },
      handleButton(value){
        switch(value.methods){
          case "handleEdit":
            console.log(value.row)
            this.interfaceDialogVisible = true
            this.dialogStatus = "editApi"
            this.interfaceForm = Object.assign({}, value.row)
            break;
          case "handleRun":
            this.executeForm.interfaceId = value.row.interfaceId
            request({
              url: "/interface/execute",
              method: "post",
              data: formData({"interfaceId":this.executeForm.interfaceId})
            }).then(res => {
              if(res.code === 10000){
                this.drawer = true
                this.statusCode = res.data.statusCode
                this.response = JSON.parse(res.data.response)
              }else{
                this.$message.error(res.msg)
              }
            })

        }
      },
      // 获取所有接口数据
      pageInterface(){
        request({
          "url": "/interface/interfaces",
          "method":"get",
          "params": {"page":this.page,"pageSize":this.pageSize}
        }).then(res =>{
          if(res.code === 10000){
            this.interfaceTotal = res.data.total
            this.interfaceList = res.data.list
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      getAllProject(){
        request({
          "url":"/projects/allProject",
          "method": "get"
        }).then(res =>{
          if(res.code ===10000){
            this.projectList = res.data.list
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      // 检索接口
      searchApi(){
        let params = Object.assign({},this.searchForm)
        request({
          url:"/interface/getApi",
          method:"get",
          params: params
        }).then(res =>{
          if(res.code == 10000){
            this.interfaceList = res.data.list
            this.$message.info(res.msg)
            this.interfaceTotal = res.data.total
          }else{
            this.interfaceList = res.data.list
            this.interfaceTotal = res.data.total == null? 0:res.data.total
            this.$message.error(res.msg)
          }
        })
      },
      // 重置接口
      resetSearch(){
        this.$refs.searchForm.resetFields()
        this.pageInterface()
      },
      addSubmit(){
        this.$refs.interfaceForm.validate((valid) => {
          if(valid){
            this.addLoading = true
            let param = Object.assign({}, this.interfaceForm)
            request({
              url:"/interface/addInterface",
              method: "post",
              data: formData(param)
            }).then(res => {
              if(res.code == 10000){
                // 重置表单
                this.$refs.interfaceForm.resetFields()
                // 获取接口列表
                this.pageInterface()
                // 关闭loadig
                this.addLoading = false
                // 关闭弹窗
                this.interfaceDialogVisible = false
                // 提示成功
                this.$message.info("提交成功")

              }else{
                // 关闭loadding
                this.addLoading = false
                // 关闭弹窗
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      // 编辑信息
      editSubmit(){
        let params = Object.assign({},this.interfaceForm)
        this.$refs.interfaceForm.validate((valid) => {
          if(valid){
            request({
              url:'/interface/editInterface',
              method:"post",
              data: formData(params)
            }).then(res =>{
              if(res.code === 10000){
                this.addLoading = false
                this.interfaceDialogVisible = false
                this.$refs.interfaceForm.resetFields()
                this.$message.info(res.msg)
                this.pageInterface()
              }else{
                this.addLoading = false
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      cancelSubmit(){
        this.interfaceDialogVisible = false
        this.interfaceForm = {
          project: "",
          interfaceId: "",
          interfaceName: "",
          interfacePath: "",
          interfaceMethdod: "",
          interfaceHeader: "",
          interfaceType: "",
          interfaceParams: "",
        }
      },
      // 根据id获取名称
      translateProject(row, column){
        const projectId = row.project
        for(let item of this.projectList){
          if(item.id == projectId){
            return item.projectName
          }
        }
      },
      // 控制显示内容
      stateFormat(row, column, cellValue){
        if (!cellValue) return "";
        if (cellValue.length > 20) {
          //最长固定显示20个字符
          return cellValue.slice(0, 20) + "...";
        }
        return cellValue;
      },
      dialogClose(){
        this.interfaceForm = {
          project: "",
          interfaceId: "",
          interfaceName: "",
          interfacePath: "",
          interfaceMethdod: "",
          interfaceHeader: "",
          interfaceType: "",
          interfaceParams: "",
        }
      },
      handleSizeChange(item){
        this.pageSize = item
        // 发起请求
        this.pageInterface()
      },
      handleCurrentChange(item){
        this.page = item
        // 请求
        this.pageInterface()
      }
    },
    mounted(){
      this.getAllProject()
      this.pageInterface()
      // this.interfaceForm.projectId = this.projectList[0].id


    },
  }
</script>

<style scoped>

</style>
