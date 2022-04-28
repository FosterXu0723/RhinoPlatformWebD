<template>
<!--    <Menu>-->
<!--      <router-view></router-view>-->
      <div slot="content">
        <el-container>
          <el-header style="display:flex;flex-wrap: wrap;height: 100px">
            <el-row >
              <el-form :inline="true" :model="searchForm" ref="searchForm" class="spHeight">
              <el-form-item label="日期 " prop="date">
                <el-date-picker
                        v-model="searchForm.date"
                        type="date"
                        placeholder="选择日期"
                        clearable>
                </el-date-picker>
              </el-form-item>
              <el-form-item label="报告名称 " prop="reportName">
                <el-input v-model="searchForm.reportName" placeholder="请输入报告名称" clearable></el-input>
              </el-form-item >
              <el-form-item label="报告状态">
                <el-select v-model="searchForm.value" placeholder="请选择" clearable>
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reportSelect">查询</el-button>
              <el-button type="primary" icon="el-icon-delete" @click="empty" >重置</el-button>

            </el-form>
            </el-row>
          </el-header>

         <el-main>
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
            >
              <el-table-column
                type="selection"
                width="70">
              </el-table-column>
              <el-table-column
                prop="creatDate"
                label="日期"
                sortable
                width="300"
                :formatter="formatTime">
              </el-table-column>
              <el-table-column
                prop="reportName"
                label="报告名称"
                sortable
                width="500">
              </el-table-column>
              <el-table-column
                prop="reportStatus"
                label="报告状态"
                sortable
                width="350"
                :formatter="showStatus">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="detailsCheck(scope.row)">查看详情</el-button>
                   <el-button
                    size="mini"
                    @click="handleDownload(scope.$index, scope.row)">下载</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination
              @current-change="handleCurrentChange"
              backgorund
              layout="total,prev, pager, next"
              :total="total">
            </el-pagination>
          </el-footer>
        </el-container>
      </div>
<!--    </Menu>-->
</template>

<script>
  import Menu from 'components/common/Menu'
  import {request} from '@/network/request'
  import {formData} from '@/utils/DataResolve'
  import * as echarts from "echarts";


  export default {
    name: 'Report',
    components:{
      Menu
    },
     data() {
      return {
        searchForm:{
          date: '',
        reportName:'',
          value:''
        },
        date: '',
        reportName:'',
        options:[{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '成功'
        }, {
          value: '选项3',
          label: '失败'
        }],
        value:'',
        tableData:[
        //   {
        //     date : '2021-04-20',
        //     name : '2020-04-20测试报告',
        //     reportstatus : '成功',
        //   }
        ],
        operation:'',
        page:1,
        per_page:10,
        total:0,
      }
    },
     methods: {
      nowDate(){
        let now = new Date()
        this.searchForm.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      },
      detailsCheck(row) {//查看详情

        // this.$router.push('/details')
        const routeData = this.$router.resolve({
          path: "/details",
          query: {
            id:row.id,
            taskId:row.taskId
            }
          });
        window.open(routeData.href, '_blank');
        },
      formatTime(row, column) {//将后端返回的时间进行格式转换
        const date = new Date(row[column.property])
        if((date.getMonth() + 1)<10){
          var resDate = date.getFullYear() + '-' + '0' + (date.getMonth() + 1) + '-' + date.getDate()
        }else{
          resDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() ;
        }
        return resDate
      },
      showStatus(row,column){//将后端返回的状态转换
        const status = (row[column.property])
        if (status === 1){
          var showStatus = '成功'
        }else if (status === 3){
          showStatus = '生成中'
        }else{
          showStatus = '失败'
        }
        return showStatus
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleDownload(index, row){
        console.log(index, row);
       },
      reportSelect(){
        if (this.searchForm.date === '' || this.searchForm.date === null){//这边一段都是为了后端查询的时候，时间格式正确做的出来
          resDate=''
        } else{
          let d = new Date(this.searchForm.date);
          if((d.getMonth() + 1)<10){
            if(d.getDate()>10){
              var resDate = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate() ;
            }else {
              resDate = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' +'0' + d.getDate()
            }
          }else {
            resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
          }
        }
        let params={
          'reportName':this.searchForm.reportName,
          'date':resDate,
          'reportStatus':this.searchForm.value,
          'page':this.page,
          'per_page':this.per_page,
        }
        request({
          url:'/testreport/list',
          method:'POST',
          data:formData(params)
        }).then(res =>{
          this.tableData=res.tableData;
          this.total=res.total
        })
      },
      jinmu(){
        let params={
          }
        request({
          url:'/testreport/jinmu',
          method:'POST',
          data:formData(params)
        }).then(res =>{

         })

       },
       empty(){//清空
        this.searchForm.date='';
        this.searchForm.reportName='';
        this.reportStatus='';
        this.searchForm.value='';
       },
       handleCurrentChange(val) {  //页面改变时
         this.page = val;
         this.reportSelect()

       },

       // change(){
       //   console.log(this.date);
       //   if (this.date === null) {
       //     this.date = '' // value = []
       //   }
       // }
    },
    mounted() {
      this.nowDate()
      this.reportSelect()

    },


  }
</script>

<style scoped>
   .spHeight{
    margin-bottom: 0px;
  }
  .el-row{

  }

</style>
