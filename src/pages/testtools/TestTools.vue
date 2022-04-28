<template>

<!--  <Menu>-->

    <div slot="content">

      <!--查询-->

      <div>

          <el-form :inline="true" :model="filters" ref='filters' class="testtoolsform">

            <el-form-item label="测试工具名称" prop="name">

              <el-input v-model="filters.name" clearable placeholder="请输入测试工具名称"></el-input>

            </el-form-item>

            <el-form-item label="测试工具创作人" prop="region">

              <el-select v-model="filters.region" clearable placeholder="请选择">

                    <el-option label="金童" value="金童"></el-option>

                    <el-option label="杨无邪" value="杨无邪"></el-option>

                    <el-option label="金木" value="金木"></el-option>

                    <el-option label="萧逸才" value="萧逸才"></el-option>

                    <el-option label="水月" value="水月"></el-option>

                    <el-option label="纪嫣然" value="纪嫣然"></el-option>

                    <el-option label="展飞" value="展飞"></el-option>

              </el-select>

            </el-form-item>

              <el-button size="medium" type="primary" @click="fetch()">查询</el-button>

              <el-button size="medium" @click="reset('filters')">重置</el-button>

          </el-form>

      </div>





      <!--上传测试工具-->

      <div class="create">

            <el-button size="medium" type="primary" @click="dialogFormVisible=true">上传测试工具</el-button>

            <el-dialog title="上传测试工具" :visible.sync="dialogFormVisible" width="30%" @close='closeDialog'>

              <el-form :label-position="labelPosition" :model="uploadform" ref='uploadform' :rules='rules'>

                <el-form-item label="测试工具名称" prop="name">

                  <el-input v-model="uploadform.name" placeholder="请输入测试工具名称" maxlength='15' show-word-limit></el-input>

                </el-form-item>

                <el-form-item label="测试工具创作人" prop="region">

                  <el-select v-model="uploadform.region" placeholder="请选择">

                    <el-option label="金童" value="金童"></el-option>

                    <el-option label="杨无邪" value="杨无邪"></el-option>

                    <el-option label="金木" value="金木"></el-option>

                    <el-option label="萧逸才" value="萧逸才"></el-option>

                    <el-option label="水月" value="水月"></el-option>

                    <el-option label="纪嫣然" value="纪嫣然"></el-option>

                    <el-option label="展飞" value="展飞"></el-option>

                  </el-select>

                </el-form-item>

                <el-form-item label="上传文件">

                  <el-upload class="upload"

                    :action="UploadUrl()"

                    :limit="1"

                    :http-request="uploadFile"

                    :auto-upload="true"

                    :file-list="fileList">

                    <el-button size="small" type="primary">点击上传测试工具</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传py,exe文件</div>
                  </el-upload>

                </el-form-item>

              </el-form>

                <!--<div slot="footer" class="dialog-footer">

                  <el-button @click="dialogFormVisible=false">取消</el-button>

                  <el-button type="primary" @click="dialogFormVisible=false">上传到服务器</el-button>

                </div>-->

            </el-dialog>

      </div>







      <!--工具列表-->

      <div>

          <el-table show-overflow-tooltip :data="res_test" v-loading="tableLoading" border style="width:100%">

            <el-table-column prop="toolName" label="测试工具名称" width="335"></el-table-column>

            <el-table-column prop="fileName" label="文件名称" width="335"></el-table-column>


            <el-table-column prop="toolAuthor" label="测试工具创作人" width="335"></el-table-column>

            <el-table-column prop="createTime" label="上传时间" width="335"></el-table-column>

            <el-table-column prop="" label="操作" width="339">

                <template slot-scope="scope">

                    <el-button type='text' @click="deleteTool(scope.row.toolName)">删除</el-button>
                    <!--<el-link :underline="false">-->
                      <el-button type='text' @click="downloadTool(scope.row.fileName,scope.row.toolName)">下载</el-button>
                    <!--</el-link>-->


                </template>

            </el-table-column>

          </el-table>

      </div>







      <!--分页-->

      <div class="paging" v-if="res_total>10">

          <el-pagination

          @current-change="handleCurrentChange"

          :current-page="currentPage" layout="total,prev,pager,next"

          :total='res_total'

          :page-size="page_size"></el-pagination>

      </div>





    </div>

<!--  </Menu>-->

</template>



<script>

  import Menu from 'components/common/Menu'

  import {request} from '@/network/request'

  import {formData} from '@/utils/DataResolve'



  export default {

    name: 'TestTools',

    components:{

      Menu

    },

    data() {

      return {

        filters:{name:'',region:''},

        labelPosition: 'top',

        dialogFormVisible: false,

        uploadform: {name: '',region: ''},

        tableLoading:true,

        currentPage:1,

        page_size:10,

        res_total:'',

        fileList:[],

        res_test:[],

        rules:{
          name:[{ required:true,message:'请输入活动名称',trigger:'blur'}],
          region:[{ required:true,message:'请选择活动区域',trigger:'change'}]
        }

      }

    },



    created: function(){

      this.fetch()

    },



    methods:{

      reset(form){

        this.$refs[form].resetFields()

      },



      UploadUrl(){

        return '';

      },

      uploadFile(val){

        const form=new FormData();

        form.set('file',val.file);

        form.set('toolName',this.uploadform.name)

        form.set('toolAuthor',this.uploadform.region)

        this.fileList=[]

        request({

          url:'/tools/testtools/uploadtools',

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

                this.dialogFormVisible=false;

                this.fetch()

              }
              else{
                if(res.code==99998) {

                console.log(res);

                this.$message({

                  message: '测试工具名称已存在!',

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



      closeDialog() {

        this.uploadform={name: '',region: ''}

          },



      handleCurrentChange(val){

        this.currentPage=val,

        this.fetch(this.currentPage)

      },





      fetch(page){

        if (!page){

          page=1,

          this.currentPage=1

        }

        this.tableLoading=true

        let queryParams={

          'toolName':this.filters.name,

          'toolAuthor':this.filters.region,

          'page':page,

          'pageSize':this.page_size

        }

        request({

          url: '/tools/testtools/toolsList',

          method: 'post',

          data: formData(queryParams)

        }).then(res=>{

            this.res_test=res.data

            this.res_total=res.total

            this.tableLoading=false

          },res=>this.$layer_message(res.msg).finally(()=>this.tableLoading=false)

        )

      },





      deleteTool(val){

        this.$confirm('此操作将删除该工具,是否继续?','提示',{

          confirmButtonText: '确定',

          cancelButtonText: '取消',

          type: 'warning'

        }).then(()=>{

           let queryParams={

          'toolName':val

        }
            request({

              url: '/tools/testtools/deleteTools',

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

                  this.fetch()

                } else {

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



      downloadTool(val1,val2){
        let queryParams={
          "fileName":val1,
          "toolName":val2,
        }
        request({
          url: '/tools/testtools/downLoadTools',
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



      }

    }

  }

</script>



<style scoped>

.create{

  height: 50px;

}

.paging{

  text-align: center;

  padding: 30px;

}

</style>

