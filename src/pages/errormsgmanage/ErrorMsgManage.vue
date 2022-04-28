<template>

      <div slot="content">

        <!--拉取页面查询-->
        <div>
          <el-form :inline="true" :model="filters" ref='filters' class="pullerrorform">
              <el-form-item label="周期编号" prop="taskid">
                  <el-input v-model="filters.taskid" clearable placeholder="请输入周期编号"></el-input>
              </el-form-item>
              <el-form-item label="周期创建日期" prop="cycledate">
                <!--<el-date-picker v-model="filters.cycledate" type="date" placeholder="选择日期"></el-date-picker>-->
                <el-date-picker v-model="filters.cycledate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item label="周期处理状态" prop="cyclestatus">
                <el-select v-model="filters.cyclestatus" clearable placeholder="请选择">
                  <el-option label="未开始" value="未开始"></el-option>
                  <el-option label="进行中" value="进行中"></el-option>
                  <el-option label="全部解决" value="全部解决"></el-option>
                </el-select>
              </el-form-item>
                <el-button size="medium" type="primary" @click="fetch()">查询</el-button>
                <el-button size="medium" @click="reset('filters')">重置</el-button>
          </el-form>
        </div>
        
        <!--拉取页面拉取操作-->
        <div class="pull">
          <el-button size="medium" type="primary" @click="pulldialog=true">拉取</el-button>
          <el-dialog title="拉取线上报错信息" :visible.sync="pulldialog" width="30%" :close-on-click-modal='false' :show-close='false'>
            <el-form :label-position="labelPosition" :model="pulldateform" ref='pulldateform'>
              <el-form-item label="拉取日期范围选择" prop="pulldatescope">
                <el-date-picker v-model="pulldateform.pulldatescope" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closepulldialog()">取消</el-button>
              <el-button type="primary" @click="pullerror()">确定</el-button>
            </span>
          </el-dialog>
        </div>
        
        <!--拉取页面拉取记录列表-->
        <div>
            <el-table show-overflow-tooltip :data="pullrecord" v-loading="pr_tableLoading" border style="width:100%">
              <el-table-column prop="cycleId" label="周期编号" width="200"></el-table-column>
              <el-table-column prop="pullDateRange" label="拉取时间范围" width="300"></el-table-column>
              <el-table-column prop="cycleCreateDate" label="周期创建日期" width="300"></el-table-column>
              <el-table-column prop="cycleStatusTable" label="周期处理状态" width="300"></el-table-column>
              <el-table-column prop="" label="操作" width="575">
                <template slot-scope="scope">
                  <!--<router-link tag="a" target="_blank" :to="{name:'ArticleDetail',params:{id:0}}">新增文章</router-link>-->
                  <el-button type='text' @click="LookOver(scope.row.cycleId)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>

              
        <!--拉取页面拉取记录列表分页-->
        <div class="paging" v-if="res_total>10">
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

  export default {
    name: 'errormsgmanage',
    components:{
      Menu
    },
    data() {
      return {
        filters:{taskid:'',cycledate:[],cyclestatus:''},
        pulldialog: false,
        labelPosition: 'top',
        pulldateform: {pulldatescope: []},
        pulldate:{pullstartdate: '',pullenddate:''},
        taskcreatedate:{createstartdate: '',createenddate:''},
        pullrecord:[], 
        pr_tableLoading:false,
        currentPage:1,
        page_size:10,
        res_total:'',

      }

    },

    created: function(){
      //this.reset('filters')
      this.fetch()
    },

    methods:{

      //拉取页面拉取记录列表重置查询方法
      reset(form){
        this.$refs[form].resetFields()
      },

      //关闭拉取选择时间页面方法
      closepulldialog(){
        this.pulldialog=false,
        this.pulldateform={pulldatescope: ''}
        this.fetch()
      },

      //拉取报错信息方法
      pullerror(val){
        //const form=new FormData();
        const loading = this.$loading({
          lock: true,
          text: '拉取错误信息中,请耐心等待!',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.pulldate.pullstartdate=this.pulldateform.pulldatescope[0];
        this.pulldate.pullenddate=this.pulldateform.pulldatescope[1];
        let queryParams={
          'pullStartDate':this.pulldate.pullstartdate,
          'pullEndDate':this.pulldate.pullenddate
        }
        //form.set('pullStartDate',this.pulldate.pullstartdate);
        //form.set('pullEndDate',this.pulldate.pullenddate);
        this.pullrecord=[]
        request({
          url:'/errormanage/errormsgmanage/pullError',
          method:'post',
          data:formData(queryParams)
        }).then((res) =>{
            console.log(res);
            if (res){
              console.log(res);
              if (res.code==10000){
                console.log(res);
                loading.close();
                this.$message({
                  message: '拉取数据成功!',
                  type:'success',
                });
                this.pulldialog=false;
                this.$refs['pulldateform'].resetFields();
                this.fetch()
              }

              if (res.code==99991){
                console.log(res);
                loading.close();
                this.$message({
                  message: '拉取时间范围可能存在重复!',
                  type:'warning',
                });
              }

              if (res.code==99992){
                console.log(res);
                loading.close();
                this.$message({
                  message: '拉取失败,请稍后再试!',
                  type:'error',
                });
              }

              if (res.code==99993){
                console.log(res);
                loading.close();
                this.$message({
                  message: '拉取时间选择有问题,请检查!',
                  type:'warning',
                });
              }

             if (res.code==99995){
                console.log(res);
                loading.close();
                this.$message({
                  message: '无错误信息!',
                  type:'success',
                });
                this.pulldialog=false;
                this.$refs['pulldateform'].resetFields();
                this.fetch()
              }

              if (res.code==99998){
                console.log(res);
                loading.close();
                this.$message({
                  message: '未找到工程对应的归属业务,请检查数据库配置!',
                  type:'error',
                });
              }

              if (res.code==99999){
                console.log(res);
                loading.close();
                this.$message({
                  message: '拉取时程序处理数据异常!',
                  type:'error',
                });
              }
            }
            else{
              console.log(res);
              loading.close();
              this.$message({
                message: '拉取异常!',
                type:'error',
              });
            }
          })
        setTimeout(() => {
            loading.close();
            this.pulldialog=false;
            this.$refs['pulldateform'].resetFields();
            this.fetch()
            },70000);
      },

      //拉取页面拉取记录列表查询
      fetch(page){
        if (!page){
          page=1,
          this.currentPage=1
        }
        this.pr_tableLoading=true
        //console.log(this.filters.cycledate)
        if(this.filters.cycledate==null){
          this.taskcreatedate.createstartdate='',
          this.taskcreatedate.createenddate=''
        }
        if(this.filters.cycledate !=null && this.filters.cycledate.length==0){
          this.taskcreatedate.createstartdate='',
          this.taskcreatedate.createenddate=''
        }
        if(this.filters.cycledate !=null && this.filters.cycledate.length>0){
          this.taskcreatedate.createstartdate=this.filters.cycledate[0],
          this.taskcreatedate.createenddate=this.filters.cycledate[1]
        }
        let queryParams={
          'taskID':this.filters.taskid,
          'createStartDate':this.taskcreatedate.createstartdate,
          'createEndDate':this.taskcreatedate.createenddate,
          'cycleStatus':this.filters.cyclestatus,
          'page':page,
          'pageSize':this.page_size
        }
        request({
          url: '/errormanage/errormsgmanage/pullRecList',
          method: 'post',
          data: formData(queryParams)
        }).then(res=>{
            this.pullrecord=res.data
            this.res_total=res.total
            this.pr_tableLoading=false
          },res=>this.$layer_message(res.msg).finally(()=>this.pr_tableLoading=false)
        )
      },

      //拉取页面拉取记录列表分页方法
      handleCurrentChange(val){
        this.currentPage=val,
        this.fetch(this.currentPage)
      },

      LookOver(val){
        let routeData = this.$router.resolve({ path: '/errormsgdetails',query:{id:val}});
        window.open(routeData.href, '_blank')
      }

    }
  }
</script>

<style scoped>
.pull{
  height: 50px;
}

.paging{
  text-align: center;
  padding: 30px;
}
</style>
