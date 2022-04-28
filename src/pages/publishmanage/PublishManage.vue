<template>
<!--    <Menu>-->
      <div slot="content">


        <div>
          <el-tabs type="border-card" @tab-click="tabClick()">

            <!--标签页-后端发布-->
            <el-tab-pane label="后端发布">
            <!--后端查询-->
              <div>
                <el-form :inline="true" :model="filters_after" ref='filters_after' class='publishmanageform'>
                  <el-form-item label="发布任务名称" prop="taskname">
                    <el-input v-model="filters_after.taskname" clearable placeholder="请输入任务名称"></el-input>
                  </el-form-item>

                  <el-form-item label="任务创建人" prop="author">
                    <el-select v-model="filters_after.author" clearable placeholder="请选择">
                      <el-option v-for="item in testersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="任务状态" prop="status">
                    <el-select v-model="filters_after.status" clearable placeholder="请选择">
                      <el-option label="待发送" value="待发送"></el-option>
                      <el-option label="已发送" value="已发送"></el-option>
                    </el-select>
                  </el-form-item>

                  <!--<el-form-item label="发布任务时间">
                    <el-date-picker v-model="form.date1" type="daterange" range-separator='至' start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>-->

                  <el-button size="medium" type="primary" @click="fetch_after()">查询</el-button>
                  <el-button size="medium" @click="reset_after('filters_after')">重置</el-button>
                </el-form>
              </div>






              <!--后端创建任务-->
              <div class="create">
                <el-button size="medium" type="primary" @click="dialogFormVisible_afterCreate=true">初始化任务</el-button>
                <el-dialog title="初始化任务" :visible.sync="dialogFormVisible_afterCreate" width="30%" @close='closeDialog_afterCreateTask'>
                  <el-form :label-position="labelPosition" :model="uploadform_after" ref='uploadform_after' :rules='rules_after' label-width="100px">

                      <el-form-item label="发布任务时间" prop="date">
                        <el-date-picker v-model="uploadform_after.date" align="right" type="date" placeholder="选择日期" value-format="yyyyMMdd"></el-date-picker>
                      </el-form-item>

                      <el-form-item label="业务线" prop="business">
                        <el-select v-model="uploadform_after.business" placeholder="请选择">
                          <el-option label="寿险" value="寿险"></el-option>
                          <el-option label="平台" value="平台"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="任务创建人" prop="author">
                        <el-select v-model="uploadform_after.author" placeholder="请选择">
                          <el-option v-for="item in testersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="上传文件">
                        <el-upload class="upload"
                          :action='UploadUrl()'
                          :limit="1"
                          :http-request="uploadFile_after"
                          :auto-upload="true"
                          :file-list="fileList_after"
                          >
                        <el-button size="small" type="primary">点击上传测试报告</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls,xlsx文件</div>
                        </el-upload>
                      </el-form-item>

                  </el-form>
                </el-dialog>
              </div>







              <!--后端发布任务列表-->
              <div>
                <el-table show-overflow-tooltip :data="taskList_after" v-loading="tableLoading_afterList" border style="width:100%">
                  <el-table-column prop="taskBusiness" label="业务线" width="150"></el-table-column>
                  <el-table-column prop="taskName" label="发布任务名称" width="400"></el-table-column>
                  <el-table-column prop="fileName" label="文件名称" width="337"></el-table-column>
                  <el-table-column prop="taskAuthor" label="任务创建人" width="150"></el-table-column>
                  <el-table-column prop="taskDate" label="发布时间" width="150"></el-table-column>
                  <el-table-column prop="taskStatus" label="发布状态" width="150"></el-table-column>
                  <el-table-column prop="" label="操作" width="310">
                    <template slot-scope="scope">
                      <el-button slot="reference" type='text' @click="editTask_after(scope.row.taskName)">编辑</el-button>
                      <el-button type='text' @click="preViewTask_after(scope.row.taskName)">预览</el-button>
                      <el-button type='text' @click="sendMail_after(scope.row.taskName)">发送邮件</el-button>
                      <el-button type='text' @click="downloadTask_after(scope.row.fileName,scope.row.taskName)">下载</el-button>
                      <el-button type='text' @click="deleteTask_after(scope.row.taskName)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>



              <!--后端编辑任务-->
              <div class="edit">
                <el-dialog title="编辑任务" :visible.sync="dialogFormVisible_afteredit" width="90%" :close-on-click-modal='false' :lock-scroll='false'>
                <div class="addReq">
                  <el-button type="primary" size="small" @click="addRequire_after(requireList_after)">新增需求</el-button>
                </div>
                  <el-table show-overflow-tooltip :data="requireList_after" v-loading="tableLoading_afterEdit" border :header-cell-style="{background:'#f5f7fa'}" style="width:100%">


                    <el-table-column prop="requireName" label="需求名称" width="307">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.requireName" :disabled='inputRequireName' placeholder="请输入需求名称"></el-input>
                      </template>
                    </el-table-column>



                    <el-table-column prop="afterDeveloper" label="后端负责人" width="200">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.afterDeveloper" multiple filterable placeholder="请选择">
                          <el-option v-for="item in afterdevelopersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <el-table-column prop="publishProject" label="发布工程" width="250">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.publishProject" multiple filterable placeholder="请选择" size="medium">
                          <el-option v-for="item in projectNameList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <!--<el-table-column label="合计" width="200"></el-table-column>-->
                    <el-table-column prop="branch" label="分支" width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.branch" type="textarea" autosize placeholder="请输入分支"></el-input>
                      </template>
                    </el-table-column>


                    <el-table-column prop="jarPackage" label="二方包" width="250">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.jarPackage" multiple filterable placeholder="请选择">
                          <el-option v-for="item in jarPackageList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>

                    <el-table-column prop="checkSQL" label="是否有sql" width="120">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.checkSQL" placeholder="请选择" clearable>
                          <el-option label="是" value="是"></el-option>
                          <el-option label="否" value="否"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <el-table-column prop="remarks" label="其他要求" width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remarks" type="textarea" autosize placeholder="请输入其他要求,非必填"></el-input>
                      </template>
                    </el-table-column>



                    <el-table-column label="操作" width="160">
                      <template slot-scope="scope">
                        <el-button size="small" type="primary" @click.native.prevent="saveTask_after(scope.row)">保存</el-button>
                        <el-button size="small" type='danger' @click.native.prevent="deleteRequire_after(scope.$index,requireList_after,scope.row.requireName)">移除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-dialog>
              </div>



              <!--后端预览任务-->
              <div class="preview">
                <el-dialog title="预览任务" :visible.sync="dialogFormVisible_afterpreview" width="90%" :close-on-click-modal='false'>
                  <div ref="imageDom">
                    <el-table show-overflow-tooltip :data="previewList_after" v-loading="tableLoading_afterPreview" border :header-cell-style="{background:'#f5f7fa'}" style="width:100%" :span-method="objectSpanMethod_after">
                      <el-table-column prop="requireName" label="需求名称" width="287"></el-table-column>
                      <el-table-column prop="afterDeveloper" label="后端负责人" width="150"></el-table-column>
                      <el-table-column prop="publishProject" label="发布工程" width="200"></el-table-column>
                      <el-table-column prop="branch" label="分支" width="150"></el-table-column>
                      <el-table-column prop="jarPackage" label="二方包" width="200"></el-table-column>
                      <el-table-column prop="checkSQL" label="是否有sql" width="100"></el-table-column>
                      <el-table-column prop="remarks" label="其他要求" width="200"></el-table-column>
                      <el-table-column prop="projectTotal" label="发布工程合计" width="200"></el-table-column>
                      <el-table-column prop="jarTotal" label="二方包合计" width="200"></el-table-column>
                    </el-table>
                </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="clickGeneratePicture_after()">生成图片</el-button>
                    </span>
                </el-dialog>
              </div>

              <!--后端发布分页-->
              <div class="paging" v-if="res_totalafter>10">
                <el-pagination
                  @current-change="handleCurrentChange_after"
                  :current-page="currentPage_after" layout="total,prev,pager,next"
                  :total='res_totalafter'
                  :page-size="page_sizeafter"></el-pagination>
              </div>
            </el-tab-pane>



            <el-tab-pane label="前端发布">
            <!--前端查询-->
              <div>
                <el-form :inline="true" :model="filters_front" ref='filters_front' class='publishmanageform'>
                  <el-form-item label="发布任务名称" prop="taskname">
                    <el-input v-model="filters_front.taskname" clearable placeholder="请输入任务名称"></el-input>
                  </el-form-item>

                  <el-form-item label="任务创建人" prop="author">
                    <el-select v-model="filters_front.author" clearable placeholder="请选择">
                      <el-option v-for="item in testersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="任务状态" prop="status">
                    <el-select v-model="filters_front.status" clearable placeholder="请选择">
                      <el-option label="待发送" value="待发送"></el-option>
                      <el-option label="已发送" value="已发送"></el-option>
                    </el-select>
                  </el-form-item>

                  <!--<el-form-item label="发布任务时间">
                    <el-date-picker v-model="form.date1" type="daterange" range-separator='至' start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>-->

                  <el-button size="medium" type="primary" @click="fetch_front()">查询</el-button>
                  <el-button size="medium" @click="reset_front('filters_front')">重置</el-button>
                </el-form>
              </div>



              <!--前端创建任务-->
              <div class="create">
                <el-button size="medium" type="primary" @click="dialogFormVisible_frontCreate=true">初始化任务</el-button>
                <el-dialog title="初始化任务" :visible.sync="dialogFormVisible_frontCreate" width="30%" @close='closeDialog_frontCreateTask'>
                  <el-form :label-position="labelPosition" :model="uploadform_front" ref='uploadform_front' :rules='rules_front' label-width="100px">

                      <el-form-item label="发布任务时间" prop="date">
                        <el-date-picker v-model="uploadform_front.date" align="right" type="date" placeholder="选择日期" value-format="yyyyMMdd"></el-date-picker>
                      </el-form-item>

                      <el-form-item label="业务线" prop="business">
                        <el-select v-model="uploadform_front.business" placeholder="请选择">
                          <el-option label="寿险" value="寿险"></el-option>
                          <el-option label="平台" value="平台"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="任务创建人" prop="author">
                        <el-select v-model="uploadform_front.author" placeholder="请选择">
                          <el-option v-for="item in testersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="上传文件">
                        <el-upload class="upload"
                          :action='UploadUrl()'
                          :limit="1"
                          :http-request="uploadFile_front"
                          :auto-upload="true"
                          :file-list="fileList_front"
                          >
                        <el-button size="small" type="primary">点击上传测试报告</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls,xlsx文件</div>
                        </el-upload>
                      </el-form-item>

                  </el-form>
                </el-dialog>
              </div>




              <!--前端发布任务列表-->
              <div>
                <el-table show-overflow-tooltip :data="taskList_front" v-loading="tableLoading_frontList" border style="width:100%">
                  <el-table-column prop="taskBusiness" label="业务线" width="150"></el-table-column>
                  <el-table-column prop="taskName" label="发布任务名称" width="400"></el-table-column>
                  <el-table-column prop="fileName" label="文件名称" width="337"></el-table-column>
                  <el-table-column prop="taskAuthor" label="任务创建人" width="150"></el-table-column>
                  <el-table-column prop="taskDate" label="发布时间" width="150"></el-table-column>
                  <el-table-column prop="taskStatus" label="发布状态" width="150"></el-table-column>
                  <el-table-column prop="" label="操作" width="310">
                    <template slot-scope="scope">
                      <el-button slot="reference" type='text' @click="editTask_front(scope.row.taskName)">编辑</el-button>
                      <el-button type='text' @click="preViewTask_front(scope.row.taskName)">预览</el-button>
                      <el-button type='text' @click="sendMail_front(scope.row.taskName)">发送邮件</el-button>
                      <el-button type='text' @click="downloadTask_front(scope.row.fileName,scope.row.taskName)">下载</el-button>
                      <el-button type='text' @click="deleteTask_front(scope.row.taskName)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>


              <!--前端编辑任务-->
              <div class="edit">
                <el-dialog title="编辑任务" :visible.sync="dialogFormVisible_frontedit" width="90%" :close-on-click-modal='false' :lock-scroll='false'>
                <div class="addReq">
                  <el-button type="primary" size="small" @click="addRequire_front(requireList_front)">新增需求</el-button>
                </div>
                  <el-table show-overflow-tooltip :data="requireList_front" v-loading="tableLoading_frontEdit" border :header-cell-style="{background:'#f5f7fa'}" style="width:100%">


                    <el-table-column prop="requireName" label="需求名称" width="350">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.requireName" :disabled='inputRequireName' placeholder="请输入需求名称"></el-input>
                      </template>
                    </el-table-column>



                    <el-table-column prop="frontDeveloper" label="前端负责人" width="200">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.frontDeveloper" multiple filterable placeholder="请选择">
                          <el-option v-for="item in frontdevelopersList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <el-table-column prop="publishProject" label="发布工程" width="350">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.publishProject" multiple filterable placeholder="请选择" size="medium">
                          <el-option v-for="item in frontProjectNameList" :key="item.fieldValue" :label="item.fieldValue" :value="item.fieldValue"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <!--<el-table-column label="合计" width="200"></el-table-column>-->
                    <el-table-column prop="branch" label="分支" width="260">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.branch" type="textarea" autosize placeholder="请输入分支"></el-input>
                      </template>
                    </el-table-column>

                    <el-table-column prop="appRenew" label="是否需要APP更新" width="150">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.appRenew" placeholder="请选择" clearable>
                          <el-option label="是" value="是"></el-option>
                          <el-option label="否" value="否"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <el-table-column prop="remarks" label="其他要求" width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remarks" type="textarea" autosize placeholder="请输入其他要求,非必填"></el-input>
                      </template>
                    </el-table-column>



                    <el-table-column label="操作" width="177">
                      <template slot-scope="scope">
                        <el-button size="small" type="primary" @click.native.prevent="saveTask_front(scope.row)">保存</el-button>
                        <el-button size="small" type='danger' @click.native.prevent="deleteRequire_front(scope.$index,requireList_front,scope.row.requireName)">移除</el-button>
                      </template>
                    </el-table-column>



                  </el-table>
                </el-dialog>
              </div>


              <!--前端预览任务-->
              <div class="preview">
                <el-dialog  title="预览任务" :visible.sync="dialogFormVisible_frontpreview" width="90%" :close-on-click-modal='false'>
                  <div ref="imageDom2">
                    <el-table show-overflow-tooltip :data="previewList_front" v-loading="tableLoading_frontPreview" border :header-cell-style="{background:'#f5f7fa'}" style="width:100%" :span-method="objectSpanMethod_front">
                      <el-table-column prop="requireName" label="需求名称" width="300"></el-table-column>
                      <el-table-column prop="frontDeveloper" label="前端负责人" width="200"></el-table-column>
                      <el-table-column prop="publishProject" label="发布工程" width="300"></el-table-column>
                      <el-table-column prop="branch" label="分支" width="200"></el-table-column>
                      <el-table-column prop="appRenew" label="是否需要APP更新" width="150"></el-table-column>
                      <el-table-column prop="remarks" label="其他要求" width="237"></el-table-column>
                      <el-table-column prop="projectTotal" label="发布工程合计" width="300"></el-table-column>
                    </el-table>
                </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="clickGeneratePicture_front()">生成图片</el-button>
                    </span>
                </el-dialog>
              </div>

              <!--前端发布分页-->
              <div class="paging" v-if="res_totalfront>10">
                <el-pagination
                  @current-change="handleCurrentChange_front"
                  :current-page="currentPage_front" layout="total,prev,pager,next"
                  :total='res_totalfront'
                  :page-size="page_sizefront"></el-pagination>
              </div>


            </el-tab-pane>
          </el-tabs>
          <el-button type='text' @click="downloadTemplate()" style='position:absolute;right:30px;top:90px;'>下载测试报告模版</el-button>
        </div>
      </div>
<!--    </Menu>-->
</template>

<script>
  import Menu from 'components/common/Menu'
  import {request} from '@/network/request'
  import {formData} from '@/utils/DataResolve'
  import html2canvas from "html2canvas"


  export default {
    name: 'publishmanage',
    components:{
      Menu
    },
    data(){
      return {
        labelPosition: 'top',
        dialogFormVisible_afterCreate: false,
        dialogFormVisible_afteredit: false,
        dialogFormVisible_afterpreview: false,
        dialogFormVisible_frontCreate: false,
        dialogFormVisible_frontedit: false,
        dialogFormVisible_frontpreview: false,
        //dialogFormVisible_sendMail:false,
        uploadform_after: {date:'',business:'',author:''},
        uploadform_front: {date:'',business:'',author:''},
        rules_after:{
          date:[{required:true,message:'请选择发布日期',trigger:'change'}],
          business:[{ required:true,message:'请选择业务线',trigger:'change'}],
          author:[{ required:true,message:'请选择创建人',trigger:'change'}]
        },
        rules_front:{
          date:[{required:true,message:'请选择发布日期',trigger:'change'}],
          business:[{ required:true,message:'请选择业务线',trigger:'change'}],
          author:[{ required:true,message:'请选择创建人',trigger:'change'}]
        },
        fileList_after: [],
        fileList_front: [],
        taskList_after: [],
        taskList_front: [],
        requireList_after: [{requireId:'',requireName:'',afterDeveloper:[],publishProject:[],branch:'',jarPackage:[],checkSQL:'',remarks:''}],
        previewList_after: [{requireName:'',afterDeveloper:'',publishProject:'',branch:'',jarPackage:'',checkSQL:'',remarks:'',projectTotal:'',jarTotal:''}],
        requireList_front: [{requireId:'',requireName:'',frontDeveloper:[],publishProject:[],branch:'',appRenew:'',remarks:''}],
        previewList_front: [{requireName:'',frontDeveloper:'',publishProject:'',branch:'',appRenew:'',remarks:'',projectTotal:''}],
        filters_after:{taskname:'',author:'',status:''},
        filters_front:{taskname:'',author:'',status:''},
        tableLoading_afterList:true,
        tableLoading_afterEdit:false,
        tableLoading_afterPreview:false,
        tableLoading_frontList:true,
        tableLoading_frontEdit:false,
        tableLoading_frontPreview:false,
        currentPage_after:1,
        currentPage_front:1,
        page_sizeafter:10,
        page_sizefront:10,
        res_totalafter:'',
        res_totalfront:'',
        taskNameEdit_after:'',
        taskNameEdit_front:'',
        taskNamePreview_after:'',
        taskNamePreview_front:'',
        spanArr_after:[],
        spanArr_front:[],
        pos_after:0,
        pos_front:0,
        imgUrl_after:'',
        imgUrl_front:'',
        testersList:[],
        afterdevelopersList:[],
        projectNameList:[],
        frontdevelopersList:[],
        frontProjectNameList:[],
        jarPackageList:[]

      }

    },

    created: function(){
      this.tabClick()
    },


    methods:{
      tabClick(){
        this.fetch_after()
        this.fetch_front()
      },

      UploadUrl(){
        return '';
      },

      //获取测试人员数据    
      getTestersList(){
          request({
            url:'/commonapi/api/testerList',
            method:'get',
          }).then(({data}) => {
          this.testersList=data;
      })},


      //获取后端开发人员数据
      getAfterDevelopersList(){
          request({
            url:'/commonapi/api/afterdeveloperList',
            method:'get',
          }).then(({data}) => {
          this.afterdevelopersList=data;
      })},

      //获取前端开发人员数据
      getFrontDevelopersList(){
          request({
            url:'/commonapi/api/frontdeveloperList',
            method:'get',
          }).then(({data}) => {
          this.frontdevelopersList=data;
      })},

      //获取后端工程数据
      getProjectNameList(){
          request({
            url:'/commonapi/api/projectNameList',
            method:'get',
          }).then(({data}) => {
          this.projectNameList=data;
      })},

      //获取前端工程数据
      getFrontProjectNameList(){
          request({
            url:'/commonapi/api/frontProjectNameList',
            method:'get',
          }).then(({data}) => {
          this.frontProjectNameList=data;
      })},

      //获取二方包工程数据
      getJarPackageList(){
          request({
            url:'/commonapi/api/jarPackageList',
            method:'get',
          }).then(({data}) => {
          this.jarPackageList=data;
      })},


      //添加后端发布任务并上传测试报告
      uploadFile_after(val){
        const form=new FormData();
        form.set('file',val.file);
        form.set('publishDate',this.uploadform_after.date);
        form.set('taskDevelopment','后端');
        form.set('taskBusiness',this.uploadform_after.business);
        form.set('taskAuthor',this.uploadform_after.author);
        form.set('taskStatus','待发送');
        this.fileList_after=[]
        request({
          url:'/publish/publishmanage/afterEnd/uploadreport',
          method:'post',
          data:form
        }).then((res) =>{
            console.log(res);
            if (res){
              console.log(res);
              if (res.code==10000){
                console.log(res);
                this.$message({
                  message: '上传成功',
                  type:'success',
                });
                this.dialogFormVisible_afterCreate=false;
                this.$refs['uploadform_after'].resetFields();
                this.fetch_after()
              }
              else{
                if(res.code==99998) {
                console.log(res);
                this.$message({
                  message: '发布任务名称已存在!',
                  type:'warning',
                });
                }
                else{
                  console.log(res);
                  this.$message({
                  message: '上传失败',
                  type:'error',
                });
                }
              }
            }
          })
          .catch((res) => {
            console.log(res);
          });
      },


      //添加前端发布任务并上传测试报告
      uploadFile_front(val){
        const form=new FormData();
        form.set('file',val.file);
        form.set('publishDate',this.uploadform_front.date);
        form.set('taskDevelopment','前端');
        form.set('taskBusiness',this.uploadform_front.business);
        form.set('taskAuthor',this.uploadform_front.author);
        form.set('taskStatus','待发送');
        this.fileList_front=[]
        request({
          url:'/publish/publishmanage/frontEnd/uploadreport',
          method:'post',
          data:form
        }).then((res) =>{
            console.log(res);
            if (res){
              console.log(res);
              if (res.code==10000){
                console.log(res);
                this.$message({
                  message: '上传成功',
                  type:'success',
                });
                this.dialogFormVisible_frontCreate=false;
                this.$refs['uploadform_front'].resetFields();
                this.fetch_front()
              }
              else{
                if(res.code==99998) {
                console.log(res);
                this.$message({
                  message: '发布任务名称已存在!',
                  type:'warning',
                });
                }
                else{
                  console.log(res);
                  this.$message({
                  message: '上传失败',
                  type:'error',
                });
                }
              }
            }
          })
          .catch((res) => {
            console.log(res);
          });
      },




      closeDialog_afterCreateTask() {
        this.uploadform_after={date:'',business:'',author:''}
        this.$refs['uploadform_after'].resetFields()
          },

      closeDialog_frontCreateTask() {
        this.uploadform_front={date:'',business:'',author:''}
        this.$refs['uploadform_front'].resetFields()
          },

      //后端列表查询
      fetch_after(page){
        if (!page){
          page=1,
          this.currentPage_after=1
        }
        this.getTestersList()
        this.tableLoading_afterList=true
        let queryParams={
          'taskName':this.filters_after.taskname,
          'taskAuthor':this.filters_after.author,
          'taskStatus':this.filters_after.status,
          'page':page,
          'pageSize':this.page_sizeafter
        }
        request({
          url: '/publish/publishmanage/afterEnd/tasksList',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            this.taskList_after=res.data
            this.res_totalafter=res.total
            this.tableLoading_afterList=false
          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading_afterList=false)
        )
      },



      //前端列表查询
      fetch_front(page){
        if (!page){
          page=1,
          this.currentPage_front=1
        }
        this.getTestersList()
        this.tableLoading_frontList=true
        let queryParams={
          'taskName':this.filters_front.taskname,
          'taskAuthor':this.filters_front.author,
          'taskStatus':this.filters_front.status,
          'page':page,
          'pageSize':this.page_sizefront
        }
        request({
          url: '/publish/publishmanage/frontEnd/tasksList',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            this.taskList_front=res.data
            this.res_totalfront=res.total
            this.tableLoading_frontList=false
          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading_frontList=false)
        )
      },



      //后端发布删除任务
      deleteTask_after(val){
        this.$confirm('此操作将删除该数据,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
           let queryParams={
          'taskName':val
        }
            request({
              url: '/publish/publishmanage/afterEnd/deleteTask',
              method: 'post',
              data: formData(queryParams)
            }).then((res) =>{
              console.log(res);
              if (res){
                console.log(res);
                if (res.code==10000){
                  console.log(res);
                  this.$message({
                    message: '删除成功',
                    type:'success',
                  });
                  this.fetch_after()
                }else{
                  console.log(res);
                  this.$message({
                    message: '删除失败',
                    type:'error',
                });
              }
            }
          }).catch((res) => {
            console.log(res);
            });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },



      //前端发布删除任务
      deleteTask_front(val){
        this.$confirm('此操作将删除该数据,是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
           let queryParams={
          'taskName':val
        }
            request({
              url: '/publish/publishmanage/frontEnd/deleteTask',
              method: 'post',
              data: formData(queryParams)
            }).then((res) =>{
              console.log(res);
              if (res){
                console.log(res);
                if (res.code==10000){
                  console.log(res);
                  this.$message({
                    message: '删除成功',
                    type:'success',
                  });
                  this.fetch_front()
                }else{
                  console.log(res);
                  this.$message({
                    message: '删除失败',
                    type:'error',
                });
              }
            }
          }).catch((res) => {
            console.log(res);
            });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },


      //后端下载任务
      downloadTask_after(val1,val2){
        let queryParams={
          "fileName":val1,
          "taskName":val2,
        }
        request({
          url: '/publish/publishmanage/afterEnd/downLoadTask',
          method: 'post',
          data: formData(queryParams),
          responseType:'blob'
        }).then((res)=>{
            console.log(res)
            console.log(res.headers)
          if (!res){
            return
          }
            let blob=new Blob([res],{type:'application/octet-stream'})
            if ('download' in document.createElement('a')){
              let objectUrl=window.URL.createObjectURL(blob)
              let link=document.createElement('a')
              link.setAttribute('download',val1)
              link.style.display='none'
              link.href=objectUrl
              document.body.appendChild(link)
              link.click()
              URL.revokeObjectURL(link.href)
              document.body.removeChild(link)
            }else{
              navigator.msSaveBlob(blob.fileName)
            }

        })
      },


      //前端下载任务
      downloadTask_front(val1,val2){
        let queryParams={
          "fileName":val1,
          "taskName":val2,
        }
        request({
          url: '/publish/publishmanage/frontEnd/downLoadTask',
          method: 'post',
          data: formData(queryParams),
          responseType:'blob'
        }).then((res)=>{
            console.log(res)
            console.log(res.headers)
          if (!res){
            return
          }
            let blob=new Blob([res],{type:'application/octet-stream'})
            if ('download' in document.createElement('a')){
              let objectUrl=window.URL.createObjectURL(blob)
              let link=document.createElement('a')
              link.setAttribute('download',val1)
              link.style.display='none'
              link.href=objectUrl
              document.body.appendChild(link)
              link.click()
              URL.revokeObjectURL(link.href)
              document.body.removeChild(link)
            }else{
              navigator.msSaveBlob(blob.fileName)
            }

        })
      },






      //后端查询重置
      reset_after(form){
        this.$refs[form].resetFields()
      },

      //前端查询重置
      reset_front(form){
        this.$refs[form].resetFields()
      },



      //后端发布分页
      handleCurrentChange_after(val){
        this.currentPage_after=val,
        this.fetch_after(this.currentPage_after)
      },

      //前端发布分页
      handleCurrentChange_front(val){
        this.currentPage_front=val,
        this.fetch_front(this.currentPage_front)
      },

      //打开编辑后端任务页面,获取任务详情
      editTask_after(val){
        this.dialogFormVisible_afteredit=true
        this.inputRequireName=false
        this.tableLoading_afterEdit=true
        this.taskNameEdit_after=val
        this.getAfterDevelopersList()
        this.getProjectNameList()
        this.getJarPackageList()
        let queryParams={
          'taskName':val,
        }
        request({
          url: '/publish/publishmanage/afterEnd/taskDetails',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            this.requireList_after=res.data
            this.tableLoading_afterEdit=false
          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading_afterEdit=false)
        )
      },



      //打开编辑前端任务页面,获取任务详情
      editTask_front(val){
        this.dialogFormVisible_frontedit=true
        this.inputRequireName=false
        this.tableLoading_frontEdit=true
        this.taskNameEdit_front=val
        this.getFrontDevelopersList()
        this.getFrontProjectNameList()
        let queryParams={
          'taskName':val,
        }
        request({
          url: '/publish/publishmanage/frontEnd/taskDetails',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            this.requireList_front=res.data
            this.tableLoading_frontEdit=false
          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading_frontEdit=false)
        )
      },




      //后端任务编辑页面,需求移除
      deleteRequire_after(index,rows,val){
      let queryParams={
        'taskName':this.taskNameEdit_after,
        'requireName':val,
        'requireId':this.requireList_after[index]['requireId']
        }
      if (val==''){
        rows.splice(index,1)
      }
      else{
        request({
        url: '/publish/publishmanage/afterEnd/removeReq',
        method: 'post',
        data: formData(queryParams)
      }).then(res=>{
          if(res.code==10000){
            this.$message({
              message: '移除成功!',
              type:'success',
            });
              rows.splice(index,1)
            }
          else{
            this.$message({
              message: '移除失败',
              type:'error',
            });
            }
          })

      }
      },




      //前端任务编辑页面,需求移除
      deleteRequire_front(index,rows,val){
      let queryParams={
        'taskName':this.taskNameEdit_front,
        'requireName':val,
        'requireId':this.requireList_front[index]['requireId']
        }
      if (val==''){
        rows.splice(index,1)
      }
      else{
        request({
        url: '/publish/publishmanage/frontEnd/removeReq',
        method: 'post',
        data: formData(queryParams)
      }).then(res=>{
          if(res.code==10000){
            this.$message({
              message: '移除成功!',
              type:'success',
            });
              rows.splice(index,1)
            }
          else{
            this.$message({
              message: '移除失败',
              type:'error',
            });
            }
          })

      }
      },




      //后端发布编辑页面,新增需求
      addRequire_after(tableData,event){
        this.inputRequireName=false
        tableData.push({requireId:'',requireName:'',afterDeveloper:[],publishProject:[],branch:'',jarPackage:[],checkSQL:'',remarks:''})
      },

      //前端发布编辑页面,新增需求
      addRequire_front(tableData,event){
        this.inputRequireName=false
        tableData.push({requireId:'',requireName:'',frontDeveloper:[],publishProject:[],branch:'',appRenew:'',remarks:''})
      },



      //保存后端任务详情
      saveTask_after(val){
      let queryParams={
          'detailsData':val,
          'taskName':this.taskNameEdit_after,
        }
        request({
          url: '/publish/publishmanage/afterEnd/saveTask',
          method: 'post',
          data: queryParams
        }).then(res=>{
            if (res.code==10000){
              this.$message({
                message: '保存成功!',
                type:'success',
              });
                  this.dialogFormVisible_afteredit=true
                }
            if(res.code==99998){
                  this.$message({
                    message: '有字段未填写,请检查!',
                    type:'error',
                })}
        })

      },





      //保存前端任务详情
      saveTask_front(val){
      let queryParams={
          'detailsData':val,
          'taskName':this.taskNameEdit_front
        }
        request({
          url: '/publish/publishmanage/frontEnd/saveTask',
          method: 'post',
          data: queryParams
        }).then(res=>{
            if (res.code==10000){
              this.$message({
                message: '保存成功!',
                type:'success',
              });
                  this.dialogFormVisible_frontedit=true
                }
            if(res.code==99998){
                  this.$message({
                    message: '有字段未填写,请检查!',
                    type:'error',
                })}
        })

      },





      //后端预览任务详情
      preViewTask_after(val){
        this.dialogFormVisible_afterpreview=true
        this.tableLoading_afterPreview=true
        this.imgUrl_after=''
        this.taskNamePreview_after=val
        let queryParams={
          'taskName':val,
        }
        request({
          url: '/publish/publishmanage/afterEnd/previewTask',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            this.previewList_after=res.data
            this.getSpanArr_after()
            this.tableLoading_afterPreview=false
            //this.clickGeneratePicture_after()
          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading_afterPreview=false)
        )


      },






      //前端预览任务详情
      preViewTask_front(val){
        this.dialogFormVisible_frontpreview=true
        this.tableLoading_frontPreview=true
        this.imgUrl_front=''
        this.taskNamePreview_front=val
        let queryParams={
          'taskName':val,
        }
        request({
          url: '/publish/publishmanage/frontEnd/previewTask',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            this.previewList_front=res.data
            this.getSpanArr_front()
            this.tableLoading_frontPreview=false
            //this.clickGeneratePicture_front()
          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading_frontPreview=false)
        )
      },





      //后端发布任务预览合并的数组方法
      getSpanArr_after(){
        this.spanArr_after=[]
        this.pos_after=0
        this.previewList_after.forEach((item,index)=>{
          if (index===0){
            this.spanArr_after.push(1)
            this.pos_after=0
          }else{
            if(this.previewList_after[index].projectTotal===this.previewList_after[index-1].projectTotal){
              this.spanArr_after[this.pos_after]+=1
              this.spanArr_after.push(0)
            }else{
              this.spanArr_after.push(1)
              this.pos_after=i
            }
          }
          })

      },


      //前端发布任务预览合并的数组方法
      getSpanArr_front(){
        this.spanArr_front=[]
        this.pos_front=0
        this.previewList_front.forEach((item,index)=>{
          if (index===0){
            this.spanArr_front.push(1)
            this.pos_front=0
          }else{
            if(this.previewList_front[index].projectTotal===this.previewList_front[index-1].projectTotal){
              this.spanArr_front[this.pos_front]+=1
              this.spanArr_front.push(0)
            }else{
              this.spanArr_front.push(1)
              this.pos_front=i
            }
          }
          })

      },




      //后端发布任务预览页面合并发布工程合计,二方包合计列
      objectSpanMethod_after({row,column,rowIndex,columnIndex}){
        if(columnIndex===7||columnIndex===8){
          const _row=this.spanArr_after[rowIndex]
          const _col=_row>0?1:0
          return{
            rowspan:_row,
            colspan:_col
          }
        }

      },

      //前端发布任务预览页面合并发布工程合计包合计列
      objectSpanMethod_front({row,column,rowIndex,columnIndex}){
        if(columnIndex===6){
          const _row=this.spanArr_front[rowIndex]
          const _col=_row>0?1:0
          return{
            rowspan:_row,
            colspan:_col
          }
        }

      },

      //把后端发布任务预览页面生成图片
     clickGeneratePicture_after(){
        html2canvas(this.$refs.imageDom).then(canvas=>{
          let dataUrl=canvas.toDataURL("image/jpg")
          this.imgUrl_after=dataUrl
          console.log(dataUrl)
          if (this.imgUrl_after !==""){
            this.sendImgUrl_after()
          }
        })
      },


      //把前端发布任务预览页面生成图片
      clickGeneratePicture_front(){
        html2canvas(this.$refs.imageDom2).then(canvas=>{
          let dataUrl=canvas.toDataURL("image/jpg")
          this.imgUrl_front=dataUrl
          console.log(dataUrl)
          if (this.imgUrl_front !==""){
            this.sendImgUrl_front()
          }
        })
      },


      //后端发布任务把生成的图片发送到服务器
      sendImgUrl_after(){
        let queryParams={
          'image':this.imgUrl_after,
          'taskName':this.taskNamePreview_after
        }
        request({
          url: '/publish/publishmanage/afterEnd/uploadImage',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
          if(res.code=10000){
            //console.log('生成图片成功!')
            this.$message({
                message: '生成图片成功!',
                type:'success',
              })
            this.dialogFormVisible_afterpreview=false

          }else{
            //console.log('生成图片失败!')
            this.$message({
              message: '生成图片失败!',
              type:'error',
                })
            this.dialogFormVisible_afterpreview=false
          }
          })
      },



      //前端发布任务把生成的图片发送到服务器
      sendImgUrl_front(){
        let queryParams={
          'image':this.imgUrl_front,
          'taskName':this.taskNamePreview_front
        }
        request({
          url: '/publish/publishmanage/frontEnd/uploadImage',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
          if(res.code=10000){
            //console.log('生成图片成功!')
            this.$message({
                message: '生成图片成功!',
                type:'success',
              })
            this.dialogFormVisible_frontpreview=false

          }else{
            //console.log('生成图片失败!')
            this.$message({
              message: '生成图片失败!',
              type:'error',
                })
            this.dialogFormVisible_frontpreview=false
          }
          })
      },




      //后端发布任务发送邮件操作
      sendMail_after(val){
        this.$confirm('是否已点击预览生成图片,如已生成,是否发送邮件?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
           let queryParams={
          'taskName':val
        }
            request({
              url: '/publish/publishmanage/afterEnd/sendMail',
              method: 'post',
              data: formData(queryParams)
            }).then((res) =>{
              console.log(res);
              if (res){
                console.log(res);
                if (res.code==10000){
                  console.log(res);
                  this.$message({
                    message: '发送邮件成功!',
                    type:'success',
                  });
                  this.fetch_after()
                }else{
                  console.log(res);
                  this.$message({
                    message: '发送邮件失败!',
                    type:'error',
                });
              }
            }
          }).catch((res) => {
            console.log(res);
            });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消发送'
          })
        })
      },









      //前端发布任务发送邮件操作
      sendMail_front(val){
        this.$confirm('是否已点击预览生成图片,如已生成,是否发送邮件?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
           let queryParams={
          'taskName':val
        }
            request({
              url: '/publish/publishmanage/frontEnd/sendMail',
              method: 'post',
              data: formData(queryParams)
            }).then((res) =>{
              console.log(res);
              if (res){
                console.log(res);
                if (res.code==10000){
                  console.log(res);
                  this.$message({
                    message: '发送邮件成功!',
                    type:'success',
                  });
                  this.fetch_front()
                }else{
                  console.log(res);
                  this.$message({
                    message: '发送邮件失败!',
                    type:'error',
                });
              }
            }
          }).catch((res) => {
            console.log(res);
            });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消发送'
          })
        })
      },



      //下载测试报告模版
      downloadTemplate(){
        request({
          url: '/publish/publishmanage/downLoadTemplate',
          method: 'get',
          //data: formData(queryParams),
          responseType:'blob'
        }).then((res)=>{
            console.log(res)
            console.log(res.headers)
          if (!res){
            return
          }
            let blob=new Blob([res],{type:'application/octet-stream'})
            if ('download' in document.createElement('a')){
              let objectUrl=window.URL.createObjectURL(blob)
              let link=document.createElement('a')
              link.setAttribute('download','测试报告模版.xlsx')
              link.style.display='none'
              link.href=objectUrl
              document.body.appendChild(link)
              link.click()
              URL.revokeObjectURL(link.href)
              document.body.removeChild(link)
            }else{
              navigator.msSaveBlob(blob.fileName)
            }

        })
      },





    }
  }
</script>

<style scoped>

.create{
  height: 50px;
}

.addReq
{
  height: 50px;
}

.paging{
  text-align: center;
  padding: 30px;
}


</style>
