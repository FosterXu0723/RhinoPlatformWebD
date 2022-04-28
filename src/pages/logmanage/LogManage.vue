<template>
    <!-- <Menu> -->
      <div slot="content">

        <!--查询项-->
        <div>
          <el-form :inline="true" :model="filters" ref='filters' class='logmanageform'>
            <el-form-item label="应用" prop="project">
              <el-select v-model="filters.project" filterable clearable placeholder="请选择">
                <el-option label="gateway-protal" value="gateway-protal"></el-option>
                <el-option label="customer-center" value="customer-center"></el-option>
                <el-option label="ironforge" value="ironforge"></el-option>
                <el-option label="durotar" value="durotar"></el-option>
                <el-option label="shattrath" value="shattrath"></el-option>
                <el-option label="dalaran" value="dalaran"></el-option>
                <el-option label="karazhan" value="karazhan"></el-option>
                <el-option label="mulgore" value="mulgore"></el-option>
                <el-option label="gateway-kunlai" value="gateway-kunlai"></el-option>
                <el-option label="gateway-fourwinds" value="gateway-fourwinds"></el-option>
                <el-option label="moonbrook-core" value="moonbrook-core"></el-option>
                <el-option label="felwood" value="felwood"></el-option>
                <el-option label="blackstone" value="blackstone"></el-option>
                <el-option label="maelstrom" value="maelstrom"></el-option>
                <el-option label="m44" value="m44"></el-option>
                <el-option label="zh-message-center" value="zh-message-center"></el-option>
                <el-option label="sms-center" value="sms-center"></el-option>
                <el-option label="noahark" value="noahark"></el-option>
                <el-option label="maievshadowsong" value="maievshadowsong"></el-option>
                <el-option label="storm" value="storm"></el-option>
                <el-option label="contract" value="contract"></el-option>
                <el-option label="wetlands" value="wetlands"></el-option>
                <el-option label="calypso" value="calypso"></el-option>
                <el-option label="inn" value="inn"></el-option>
                <el-option label="sentryward" value="sentryward"></el-option>
                <el-option label="data-center" value="data-center"></el-option>
                <el-option label="wakanda-home" value="wakanda-home"></el-option>
                <el-option label="wakanda-flink-statistic-core" value="wakanda-flink-statistic-core"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="关键字" prop="keywords">
              <el-input v-model="filters.keywords" clearable placeholder="输入关键字,返回关键字前后200行的数据" style="width:300px"></el-input>
            </el-form-item>-->
            <el-form-item label="命令" prop="command">
              <el-input v-model="filters.command" clearable placeholder="请输入linux命令" style="width:1000px"></el-input>
            </el-form-item>
            <!--<el-form-item label="日期" prop="date">
              <el-date-picker :picker-options="pickerOptions" v-model="filters.date" type="daterange" range-separator='至' start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>-->
            <el-button size="medium" type="primary" @click="fetch_log()">查询</el-button>
            <el-button size="medium" @click="reset('filters')">重置</el-button>

          </el-form>
        </div>

        <!--列表-->
        <div>
          <el-table show-overflow-tooltip :data="loglist" v-loading="tableLoading_list" border style="width:100%">
            <el-table-column prop="ip" label="服务器IP" width="150"></el-table-column>
            <el-table-column prop="logcontent" label="日志数据" width="1400">
              <template slot-scope="scope">
                <span v-html="showRedName(scope.row.logcontent)"></span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="125">
              <template slot-scope="scope">
                <el-button size="small" type="success" @click="copyLog(scope.row.logcontent)">复制日志</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>




      </div>

    <!-- </Menu> -->
</template>

<script>
  import Menu from 'components/common/Menu'
  import {request} from '@/network/request'
  import {formData} from '@/utils/DataResolve'

  export default {
    name: 'logmanage',
    components:{
      Menu
    },
    data(){
      return{
        filters:{project:'',command:''},
        tableLoading_list:false,
        loglist:[]
        }
      },


    created: function(){
      console.log("初始化成功")
    },

    methods:{

      //查询方法
      fetch_log(){
        this.tableLoading_list=true
        let queryParams={
          'project':this.filters.project,
          'command':this.filters.command,
        }
        request({
          url: '/log/logmanage/search',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
          if (res.code==99991){
                this.$message({
                message: '应用或者命令不能为空',
                type:'error',
                })}
          if (res.code==99992){
                this.$message({
                message: '暂不支持tail命令',
                type:'error',
                })}
            this.loglist=res.data
            this.tableLoading_list=false
          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading_list=false)
        )
      },

      //重置方法
      reset(form){
        this.$refs[form].resetFields()
      },

      //复制日志
      copyLog(LogContent){
        this.copy(LogContent)
      },

      copy(data){
        let LogContent=data
        let newInput=document.createElement('input')
        newInput.value=LogContent
        document.body.appendChild(newInput)
        newInput.select()
        document.execCommand('Copy')
        newInput.remove()
        this.$message({message:'复制成功！',type:'success'})
      },

      showRedName(val){
        let s=this.filters.command
        let tags=s.substring(s.lastIndexOf(" ")+1)
        //let tags=this.filters.command
        if (tags!==null&&tags!==""){
          let reg=new RegExp("("+tags+")","g")
          if (val!==null&&val!==""){
            return val.replace(reg,"<font style='color:red'>$1</font>")
          }else{
            return val
          }
        }else{
          return val
        }
      }


    }
    }
</script>

<style scoped>

</style>
