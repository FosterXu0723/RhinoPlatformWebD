<template>

      <div slot="content">
      	<!--错误详细信息页面查询-->   
        <div>
          <el-form :inline="true" :model="filters" ref='filters' class="pullerrorform">
          	  <el-form-item label="错误信息ID" prop="errorID">
              	  <el-input v-model="filters.errorID" clearable placeholder="请输入错误信息ID"></el-input>
              </el-form-item>
              <el-form-item label="工程名" prop="projectName">
                <el-select v-model="filters.projectName" filterable clearable placeholder="请选择">
                  <el-option v-for="item in projectNameList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属业务" prop="belongBus">
                <el-select v-model="filters.belongBus" clearable placeholder="请选择">
                  <el-option label="车主会" value="车主会"></el-option>
                  <el-option label="司机驾到" value="司机驾到"></el-option>
                  <el-option label="企团险" value="企团险"></el-option>
                  <el-option label="供应链-寿险" value="供应链-寿险"></el-option>
                  <el-option label="供应链-车险" value="供应链-车险"></el-option>
                  <el-option label="客户" value="客户"></el-option>
                  <el-option label="公共" value="公共"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="处理状态" prop="dealStatus">
                <el-select v-model="filters.dealStatus" clearable placeholder="请选择">
                  <el-option label="未认领" value="未认领"></el-option>
                  <el-option label="已指派" value="已指派"></el-option>
                  <el-option label="解决中" value="解决中"></el-option>
                  <el-option label="已解决待发布" value="已解决待发布"></el-option>
                  <el-option label="已上线" value="已上线"></el-option>
                  <el-option label="延期解决" value="延期解决"></el-option>
                  <el-option label="险企问题未解决" value="险企问题未解决"></el-option>
                  <el-option label="险企问题已解决" value="险企问题已解决"></el-option>
                  <el-option label="非问题" value="非问题"></el-option>
                  <el-option label="渠道问题" value="渠道问题"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开发负责人" prop="developer">
                <el-select v-model="filters.developer" :disabled="developersList.length==0" filterable clearable placeholder="请选择">
                  <el-option v-for="item in developersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试负责人" prop="tester">
                <el-select v-model="filters.tester" filterable clearable placeholder="请选择">
                  <el-option v-for="item in testersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                </el-select>
              </el-form-item>
                <el-button size="medium" type="primary" @click="fetch()">查询</el-button>
                <el-button size="medium" @click="reset('filters')">重置</el-button>
                <el-button size="medium" @click="downLoad()">导出</el-button>
          </el-form>
        </div>

        <!--错误详细信息页面列表-->
        <div>
            <el-table show-overflow-tooltip :data="errorlist" v-loading="details_tableLoading" border style="width:100%">
              <el-table-column prop="errorID" label="错误ID" width="80"></el-table-column>
              <el-table-column prop="errorProject" label="工程名" width="140"></el-table-column>
              <el-table-column prop="errorBus" label="所属业务" width="120"></el-table-column>
              <el-table-column prop="errorSolver" label="开发负责人" width="100"></el-table-column>
              <el-table-column prop="errorTester" label="测试负责人" width="100"></el-table-column>
              <el-table-column prop="errorStatus" label="处理状态" width="150"></el-table-column>
			        <el-table-column prop="errorTimes" label="出现次数" width="80"></el-table-column>
              <el-table-column prop="errorDate" label="出现时间" width="200"></el-table-column>
              <el-table-column prop="errorInfo" label="报错信息" width="280" show-overflow-tooltip></el-table-column>
              <el-table-column prop="errorReason" label="失败原因" width="250" show-overflow-tooltip></el-table-column>
              <el-table-column prop="" label="操作" width="175">
                <template slot-scope="scope">
                  <el-button type='text' @click="lookDetail(scope.row.errorID)">查看</el-button>
                  <el-button type='text' @click="editDetail(scope.row.errorID)">编辑</el-button>
                  <el-button type='text' v-if="scope.row.errorStatus=='未认领'||scope.row.errorStatus=='已指派'||scope.row.errorStatus=='解决中'||scope.row.errorStatus=='延期解决'||scope.row.errorStatus=='险企问题未解决' " @click="dingTk(scope.row.errorID)">钉一下</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>



        <!--查看页面-->
        <div class="look">
            <el-dialog title="查看详情" :visible.sync="dialogFormVisible_details" width="90%" :close-on-click-modal='false'>
                <div ref="">
                	<table class="tableDetail" :model="detailForm" id="detail">
                		<tbody>
                			<tr>
	                			<td>工程名:</td>
	                			<td>{{detailForm.projectName}}</td>
                			</tr>
                			<tr>
	                			<td>所属业务:</td>
	                			<td>{{detailForm.belongBus}}</td>
                			</tr>
                			<tr>
	                			<td>报错涉及的class:</td>
	                			<td>{{detailForm.errorClass}}</td>
                			</tr>
                			<tr>
	                			<td>报错日志信息:</td>
                          <el-tooltip class="item" effect="dark" placement="bottom">
                          <div slot="content" style="width:500px;overflow-x:auto">{{detailForm.errorInfo}}</div>
                          <td>{{detailForm.errorInfo}}</td>
                          </el-tooltip>
                			</tr>
                			<tr>
	                			<td>报错次数:</td>
	                			<td>{{detailForm.errorTimes}}</td>
                			</tr>
                			<tr>
	                			<td>出现时间:</td>
	                			<td>{{detailForm.errorDate}}</td>
                			</tr>
                			<tr>
	                			<td>开发负责人:</td>
	                			<td>{{detailForm.Developer}}</td>
                			</tr>
                			<tr>
	                			<td>测试负责人:</td>
	                			<td>{{detailForm.Tester}}</td>
                			</tr>
                			<tr>
	                			<td>失败原因:</td>
	                			<td>{{detailForm.errorReason}}</td>
                			</tr>
                			<tr>
	                			<td>处理状态:</td>
	                			<td>{{detailForm.errorStatus}}</td>
                			</tr>
                			<tr>
	                			<td>上线时间:</td>
	                			<td>{{detailForm.pubDate}}</td>
                			</tr>
                			<tr>
	                			<td>备注:</td>
	                			<td>{{detailForm.errorRemarks}}</td>
                			</tr>
  
                		</tbody>
                	</table>
                </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="closeDetails()">关闭</el-button>
                    </span>
                </el-dialog>
        </div>


        <!--编辑页面-->
        <div class="edit">
            <el-dialog title="编辑详情" :visible.sync="dialogFormVisible_edit" width="90%" :close-on-click-modal='false'>
                <div ref="">
                  <table class="tableEdit" :model="editForm" id="edit">
                    <tbody>
                      <tr>
                        <td>错误ID:</td>
                        <td>{{editForm.errorID}}</td>
                      </tr>
                      <tr>
                        <td>工程名:</td>
                        <td>{{editForm.projectName}}</td>
                      </tr>
                      <tr>
                        <td>报错日志信息:</td>
                          <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content" style="width:500px;overflow-x:auto">{{editForm.errorInfo}}</div>
                          <td>{{editForm.errorInfo}}</td>
                          </el-tooltip>
                      </tr>
                      <tr>
                        <td>所属业务:</td>
                        <td>
                          <el-select v-model="editForm.belongBus" clearable placeholder="请选择">
                            <el-option label="车主会" value="车主会"></el-option>
                            <el-option label="司机驾到" value="司机驾到"></el-option>
                            <el-option label="企团险" value="企团险"></el-option>
                            <el-option label="供应链-寿险" value="供应链-寿险"></el-option>
                            <el-option label="供应链-车险" value="供应链-车险"></el-option>
                            <el-option label="客户" value="客户"></el-option>
                            <el-option label="公共" value="公共"></el-option>
                          </el-select>
                      </td>
                      </tr>
                      <tr>
                        <td>开发负责人:</td>
                        <td>
                          <el-select v-model="editForm.Developer" filterable clearable placeholder="请选择">
                            <el-option v-for="item in developersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                          </el-select>
                      </td>
                      </tr>
                      <tr>
                        <td>测试负责人:</td>
                        <td>
                          <el-select v-model="editForm.Tester" filterable clearable placeholder="请选择">
                            <el-option v-for="item in testersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                          </el-select>
                      </td>
                      </tr>
                      <tr>
                        <td>处理状态:</td>
                        <td>
                          <el-select v-model="editForm.errorStatus" clearable placeholder="请选择">
                            <el-option label="未认领" value="未认领"></el-option>
                            <el-option label="已指派" value="已指派"></el-option>
                            <el-option label="解决中" value="解决中"></el-option>
                            <el-option label="已解决待发布" value="已解决待发布"></el-option>
                            <el-option label="已上线" value="已上线"></el-option>
                            <el-option label="延期解决" value="延期解决"></el-option>
                            <el-option label="险企问题未解决" value="险企问题未解决"></el-option>
                            <el-option label="险企问题已解决" value="险企问题已解决"></el-option>
                            <el-option label="非问题" value="非问题"></el-option>
                            <el-option label="渠道问题" value="渠道问题"></el-option>
                          </el-select>
                        </td>
                      </tr>
                      <tr>
                        <td>失败原因:</td>
                        <td>
                          <el-input type="textarea" :rows="3" v-model="editForm.errorReason" placeholder="请输入内容"></el-input>
                        </td>
                      </tr>
                      <tr>
                        <td>上线时间:</td>
                        <td>
                          <el-date-picker v-model="editForm.pubDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                        </td>
                      </tr>
                      <tr>
                        <td>备注:</td>
                        <td>
                          <el-input type="textarea" :rows="3" v-model="editForm.errorRemarks" placeholder="请输入内容"></el-input>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button type="info" @click="closeEdit()">关闭</el-button>
                      <el-button type="primary" @click="saveEdit()">保存</el-button>
                    </span>
                </el-dialog>
              </div>

        <!--错误详细信息页面列表分页-->
        <div class="paging" v-if="res_total>5">
        	<el-pagination
	          @current-change="handleCurrentChange"
	          :current-page="currentPage" layout="total,prev,pager,next"
	          :total='res_total'
	          :page-size="page_size"></el-pagination>
      	</div>




      </div>

</template>

<script>
  import Menu from 'components/common/Menu'
  import {request} from '@/network/request'
  import {formData} from '@/utils/DataResolve'
  //import {getDevelopersList} from '@/commonapi/api/afterCoderList'
  export default {
    name: 'errormsgdetails',
    components:{
      Menu
    },
    data() {
      return {
        filters:{errorID:'',projectName:'',belongBus:'',dealStatus:'',developer:'',tester:''},
        details_tableLoading:false,
        errorlist:[],
        developersList:[],
        projectNameList:[],
        testersList:[],
        currentPage:1,
        page_size:5,
        res_total:'',
        dialogFormVisible_details:false,
        detailForm:{projectName:'',belongBus:'',errorClass:'',errorInfo:'',errorTimes:'',errorDate:'',Developer:'',Tester:'',errorReason:'',errorStatus:'',pubDate:'',errorRemarks:''},
        dialogFormVisible_edit:false,
        editForm:{errorID:'',projectName:'',errorInfo:'',belongBus:'',Developer:'',Tester:'',errorStatus:'',errorReason:'',pubDate:'',errorRemarks:''}
      }
    },

    created: function(){
      //this.reset('filters')
      //taskid=this.getUrlKey(id)
      this.getDevelopersList()
      this.getProjectNameList()
      this.getTestersList()
      this.fetch()
    },


    methods:{
    	//获取开发人员数据
    	getDevelopersList(){
	        request({
	          url:'/commonapi/api/developerList',
	          method:'get',
	        }).then(({data}) => {
	    		this.developersList=data;
      })},
	    //获取后端工程数据
	    getProjectNameList(){
	        request({
	          url:'/commonapi/api/projectNameList',
	          method:'get',
	        }).then(({data}) => {
	    		this.projectNameList=data;
      })},
	    //获取测试人员数据    
	    getTestersList(){
	        request({
	          url:'/commonapi/api/testerList',
	          method:'get',
	        }).then(({data}) => {
	    		this.testersList=data;
      })},


	    //错误详细信息页面列表查询
	    fetch(page){
	        if (!page){
	          page=1,
	          this.currentPage=1
	        }
	        this.details_tableLoading=true
	        let queryParams={
	          'taskID':this.$route.query.id,
	          'errorID':this.filters.errorID,
	          'projectName':this.filters.projectName,
	          'belongBus':this.filters.belongBus,
	          'dealStatus':this.filters.dealStatus,
	          'developer':this.filters.developer,
	          'tester':this.filters.tester,
	          'page':page,
	          'pageSize':this.page_size
	        }
	        request({
	          url: '/errormanage/errormsgmanage/errorInfoList',
	          method: 'post',
	          data: formData(queryParams)
	        }).then(res=>{
	            this.errorlist=res.data
	            this.res_total=res.total
	            this.details_tableLoading=false
	          },res=>this.$layer_message(res.msg).finally(()=>this.details_tableLoading=false)
	        )
	    },

	    //错误详细信息页面列表重置查询方法
	    reset(form){
	        this.$refs[form].resetFields()
	    },

	    //错误详细信息页面列表分页方法
	    handleCurrentChange(val){
	        this.currentPage=val,
	        this.fetch(this.currentPage)
	    },


	    //查看详情
      lookDetail(val){
	        this.dialogFormVisible_details=true
	        let queryParams={
	          'taskID':this.$route.query.id,
	          'errorID':val
	        }
	        request({
	          url: '/errormanage/errormsgmanage/errorInfoDetail',
	          method: 'post',
	          data: formData(queryParams)
	        }).then(res=>{
            this.detailForm=res.data
          }
        )
        },

      //关闭详情页面
      closeDetails(){
        this.dialogFormVisible_details=false
      },


      //编辑详情
      editDetail(val){
          this.dialogFormVisible_edit=true
          this.getDevelopersList()
          this.getTestersList()
          let queryParams={
            'taskID':this.$route.query.id,
            'errorID':val
          }
          request({
            url: '/errormanage/errormsgmanage/errorInfoEdit',
            method: 'post',
            data: formData(queryParams)
          }).then(res=>{
            this.editForm=res.data
          }
        )
        },

      //关闭编辑页面
      closeEdit(){
        this.dialogFormVisible_edit=false
      },


      //保存编辑信息
      saveEdit(){
        let queryParams={
          'errorID':this.editForm.errorID,
          'taskID':this.$route.query.id,
          'belongBus':this.editForm.belongBus,
          'Developer':this.editForm.Developer,
          'Tester':this.editForm.Tester,
          'errorStatus':this.editForm.errorStatus,
          //'errorReason':this.editForm.errorReason,
          //'pubDate':this.editForm.pubDate,
          //'errorRemarks':this.editForm.errorRemarks
        }
        if(this.editForm.errorReason){
          queryParams.errorReason=this.editForm.errorReason
        }
        if(this.editForm.errorRemarks){
          queryParams.errorRemarks=this.editForm.errorRemarks
        }
        if(this.editForm.pubDate){
          queryParams.pubDate=this.editForm.pubDate
        }
        request({
          url: '/errormanage/errormsgmanage/errorInfoSave',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            if (res.code==10000){
              this.$message({
                message: '保存成功!',
                type:'success',
              });
                  this.dialogFormVisible_edit=false
                  this.fetch()
                }
            if(res.code==99998){
              this.$message({
                message: '处理状态不能为未认领或空!',
                type:'error',
                })}
            if(res.code==99999){
              this.$message({
                message: '保存失败!',
                type:'error',
                })}
        })
      },

      //钉一下方法
      dingTk(val){
          let queryParams={
            'taskID':this.$route.query.id,
            'errorID':val
          }
          request({
            url: '/errormanage/errormsgmanage/dingTalk',
            method: 'post',
            data: formData(queryParams)
          }).then(res=>{
            if (res.code==10000){
              this.$message({
                message: '提醒成功!',
                type:'success',
              });
                  this.fetch()
                }
            if(res.code==99999){
                  this.$message({
                    message: '提醒失败!',
                    type:'error',
                })
                  this.fetch()
                }
        })
      },

      //导出数据方法
      downLoad(){
        let queryParams={
            'taskID':this.$route.query.id,
            'errorID':this.filters.errorID,
            'projectName':this.filters.projectName,
            'belongBus':this.filters.belongBus,
            'dealStatus':this.filters.dealStatus,
            'developer':this.filters.developer,
            'tester':this.filters.tester,
        }
        request({
            url: '/errormanage/errormsgmanage/errorInfoDown',
            method: 'post',
            data: formData(queryParams),
            responseType:'blob'
        }).then((res)=>{
            if (!res){
              return
            }
              let blob=new Blob([res],{type:'application/octet-stream'})
              if ('download' in document.createElement('a')){
                let objectUrl=window.URL.createObjectURL(blob)
                let link=document.createElement('a')
                link.setAttribute('download','错误信息统计表.xlsx')
                link.style.display='none'
                link.href=objectUrl
                document.body.appendChild(link)
                link.click()
                URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
                this.$message({
                  message: '导出成功!',
                  type:'success',
                })
              }else{
                navigator.msSaveBlob(blob.fileName)
            }
           if(res.code==99999){
            this.$message({
            message: '导出失败!',
            type:'error',
          })}
          })
    }

  }}
</script>

<style scoped>
.paging{
  text-align: center;
  padding: 30px;
}

.tableDetail {
    line-height: 24px;
    border: 0;
    background: #fff;
    margin: 15px auto 38px;
    width: 100%;
    color: #666;
    border-top: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    table-layout:fixed;
    word-wrap:break-word;
}
.tableDetail.border {
    border: 1px solid #ebeef5;
    border-bottom: 0;
    border-right: 0;
}
.tableDetail td,.tableDetail th {
    border-right: 1px solid #ebeef5;
}
.tableDetail td,.tableDetail th {
    vertical-align: middle;
    box-sizing: border-box;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
    padding: 10px 8px;
    font-size: 13px;
    word-break: break-all;
    overflow:hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}

.tableEdit {
    line-height: 24px;
    border: 0;
    background: #fff;
    margin: 15px auto 38px;
    width: 100%;
    color: #666;
    border-top: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    table-layout:fixed;
    word-wrap:break-word;
}
.tableEdit.border {
    border: 1px solid #ebeef5;
    border-bottom: 0;
    border-right: 0;
}
.tableEdit td,.tableEdit th {
    border-right: 1px solid #ebeef5;
}
.tableEdit td,.tableEdit th {
    vertical-align: middle;
    box-sizing: border-box;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
    padding: 10px 8px;
    font-size: 13px;
    word-break: break-all;
    overflow:hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}
.tableEdit td:nth-child(2),.tableEdit th {
    text-align:left;
}
</style>
