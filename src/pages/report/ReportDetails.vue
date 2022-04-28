<template>
  <div slot="content">
    <section class="report">
      <!--页面title-->
      <el-row>
        <el-col :span="24" class="title"  >
          <span style="margin-left:800px;">测试报告详情</span>
<!--          <span class="info" v-if="testReport.executionUser">执行人：以后执行人</span>-->
          <span style="margin-right:30px; font-size: 20px; float:right;">定时任务Id：{{taskId}}</span>
        </el-col>
      </el-row>
      <!--基本信息和饼图-->

      <el-row class="report-basic">
        <el-col :span="10">
          <el-col style="width:160px">
            <span style="margin-left:10px; font-size: 18px; font-weight: bold;float:left">报告汇总</span>
          </el-col>
          <table style="margin-left:100px;width:100%;font-size:14px;float:left" class="myTable">
            <tbody>
            <tr class="info">
              <td class="label">时间</td>
              <td class="text-center">{{date}}</td>
            </tr>
            <tr class="info">
              <td class="label">报告名称</td>
              <td class="text-center">{{reportData.reportName}}</td>
            </tr>
            <tr class="info">
              <td class="label">总用例数</td>
              <td class="text-center">{{reportData.totalCount}}</td>
            </tr>
            <tr class="info">
              <td class="label">通过数</td>
              <td class="text-center">{{reportData.passCount}}</td>
            </tr>
            <tr class="info">
              <td class="label">失败数</td>
              <td class="text-center">{{reportData.failCount}}</td>
            </tr>
            <tr class="info">
              <td class="label">错误数</td>
              <td class="text-center">{{reportData.errorCount}}</td>
            </tr>
            <tr class="info">
              <td class="label">通过率</td>
              <td class="text-center">{{passRate}}</td>
            </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="12">
          <div style="height:300px;width: 60%;float:right" id="report-chart"></div>
        </el-col>
      </el-row>
<!--展示所有case信息-->
      <el-row>
        <el-table
          :data="caseData"
          highlight-current-row
          style="width: 100%;"
          ref="table">
          <el-table-column
            label="序号"
            min-width="6%"
            show-overflow-tooltip>
            <template
              slot-scope="scope">
              {{ scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="caseId"
            label="用例标号"
            min-width="12%"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="caseName"
            label="用例名称"
            min-width="12%"
            show-overflow-tooltip>
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="exception"-->
<!--            label="异常信息"-->
<!--            min-width="10%"-->
<!--            show-overflow-tooltip>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="caseDescribe" label="用例描述" min-width="8%" show-overflow-tooltip>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="runTime" label="运行时长" min-width="8%" show-overflow-tooltip>-->
<!--          </el-table-column>-->
          <el-table-column
            prop="caseFlag"
            label="结果"
            min-width="8%"
            :formatter="caseResult"
            column-key="caseFlag"
            :filters="[{ text: '成功', value: true }, { text: '失败', value: false }]"
            :filter-method="filterResult">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="8%"
            show-overflow-tooltip >
            <template
              slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toogleExpand(scope.row)"
                >查看断言及异常详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            type="expand"
            width="1">
            <template
              slot-scope="props">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand">
                <el-form-item
                  label="断言信息">
                  <span>{{ props.row.assertResult }}</span>
                </el-form-item>
                <el-form-item
                  label="异常信息">
                  <span>{{ props.row.exception }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </section>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import moment from "moment";
  import {request} from '@/network/request'
  import {formData} from '@/utils/DataResolve'

  export default {
    name: "ReportDetail",
    data() {
      return {
        activeName: 1,
        reportData: {
        },
        caseData:[
        ],
        passRate:'',
        data:'',
      }
    },

    methods: {
      nowDate() {
        let now = new Date()
        this.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      },
      getReport() {
        this.id = this.$route.query.id //这边获取到list页面传过来的id
        this.taskId = this.$route.query.taskId
        let params = {
          'reportId': this.id,
          'taskId': this.taskId,
        }
        request({
          url: '/testreport/getReport',
          method: 'POST',
          data: formData(params)
        }).then(res => {
          if (res.code === '200') {
            this.reportData = res.tableData[0];
            this.setChartOptions(this.reportData.passCount, this.reportData.failCount, this.reportData.errorCount);//这边调用函数 确保reportData有数据
            this.getPassRate(this.reportData.passCount, this.reportData.totalCount)
          }
        })
      },
      getCaseDetails() {
        this.taskId = this.$route.query.taskId //这边获取到list页面传过来的taskId
        let params = {
          'taskId': this.taskId,
        }
        request({
          url: '/testreport/caseDetails',
          method: 'POST',
          data: formData(params)
        }).then(res => {
          if (res.code === '200') {
            this.caseData = res.caseData;
          }
        })
      },
      getPassRate(passCount, totalCount) {

        this.passRate = passCount / totalCount * 100 + '%'
        return this.passRate
      },
      setChartOptions(passCount, failCount, errorCount) {//画饼图
        this.reportChart.setOption({
          title: {
            text: '通过率统计'
          },
          legend: {//这边是旁边的注释的内容
            data: ['Pass', 'Fail', 'Error'],
            orient: 'vertical',
            x: 'right',
            y: 'center',
          },
          series: [
            {
              type: 'pie',
              radius: '80%',
              center: ['50%', '50%'],
              data: [
                {value: passCount, name: 'Pass', itemStyle: {color: '#54ac21'}},
                {value: failCount, name: 'Fail', itemStyle: {color: '#d6443f'}},
                {value: errorCount, name: 'Error', itemStyle: {color: '#e0aa1c'}}
              ]
            }
          ]
        })
      },
      caseResult(row, column) {
        const caseFlag = (row[column.property])
        if (caseFlag === true) {
          var caseResult = '成功'
        } else {
          caseResult = '失败'
        }
        return caseResult
      },
      toogleExpand(row) {
        let $table = this.$refs.table;
        $table.toggleRowExpansion(row)// 点击button展开
        console.log(row.caseFlag);
      },
      filterResult(value, row,column) {

        return row.caseFlag === value;
      }
    },
    mounted() {
      this.reportChart = echarts.init(document.getElementById('report-chart'));
    },
    watch: {
      testReport: {//深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.setChartOptions(val.passCount, val.failCount, val.errorCount)
        },
        deep: true
      }
    },
    beforeDestroy() {
      if (!this.reportChart) {
        return
      }
      this.reportChart.dispose()
      this.reportChart = null
    },
    created() {//创建是调用，获取到报告的数据
      this.nowDate()
      this.getReport()
      this.getCaseDetails()
    }
  }
</script>

<style lang="scss" scoped>
  .myTable {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
  }
  .myTable td,
  .myTable th {
    border: 1px solid #cad9ea;
    color: #666;
    height: 30px;
  }
  .report {
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    color: #333;
  }

  .title {
    color: #333;
    font-size: 28px;
    height: 60px;
    line-height: 39px;
    padding: 10px 5px 10px;
    border-bottom: 1px solid #ddd;

    .report-id {
      font-size: 20px;
    }
  }

  .report-basic {
    padding: 10px 5px 10px;
    margin: 0;
    font-size: 18px;
    line-height: 1.5;
    line-height: 1.5;
    border-bottom: 1px solid #ddd;

    table {
      tr {
        height: 16px;
        border-bottom: 1px solid #ddd;
      }
    }

    .align-center{
      text-align: center;
    }
  }


</style>

