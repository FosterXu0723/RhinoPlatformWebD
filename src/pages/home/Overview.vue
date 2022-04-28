<template>
<!--  <Menu>-->
  <div class="container" slot="content">
     <el-row :gutter="20">
       <el-col :span="8">
         <div style="height: 10vh;" class="box">
           <div class="title">工程</div>
<!--           <div class="data">15</div>-->
           <div class="data">{{ this.total.project }}</div>

         </div>
       </el-col>
       <el-col :span="8">
         <div style="height: 10vh;" class="box">
           <div class="title">定时任务</div>
           <div class="data">{{ this.total.scheduler }}</div>

         </div>
       </el-col>

       <el-col :span="8">
         <div style="height: 10vh;" class="box">
           <div class="title">用例</div>
<!--                <div class="data">150</div>-->
           <div class="data">{{ this.total.case }}</div>
         </div>
       </el-col>
     </el-row>
     <el-row :gutter="20" style="margin-top:2vh">

       <el-col :span="16">
         <el-row>
          <div style="height: 60vh;" class="box">
            <el-row>
              <el-col :span="8">
                <div class="project-header">
                  <el-select size="small" v-model="currentProject" filterable placeholder="请输入工程名称查询" style="width: 91%">
<!--                    <el-option label="全部" value="全部"></el-option>-->
                    <el-option
                      v-for="item in projects"
                      :key="item.id"
                      :label="item.project_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="project-header">
                  <span class="project-header-title">项目近7天新增用例</span>
<!--                  <div class="data">{{ this.projectData.sevenCases }}</div>-->

                </div>
              </el-col>
              <el-col :span="8">
                <div class="project-header">
                  <span class="project-header-title">最新task通过率</span>

                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="8">
                <div id="result-circle"  style="height: 18vh;"></div>
              </el-col>
              <el-col :span="8">
                <div class="data" style="height: 19vh;line-height: 19vh" text-align="center">{{ this.projectData.sevenCases }}</div>
              </el-col>
              <el-col :span="8">
                <div id="result-circle_" style="height: 18vh;"></div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div id="result-bar" style="height: 33vh;"></div>
              </el-col>
            </el-row>
          </div>
         </el-row>
         <el-row style="margin-top:2vh">
          <div style="height: 10vh;" class="box">
            <el-row>
              <el-col :span="8">
                <div class="tody">
                  <div class="tody-title">今日执行测试</div>
                  <div class="tody-data">{{ today.testCount }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="tody">
                  <div class="tody-title">今日测试工程</div>
                  <div class="tody-data">{{ today.testProjectCount }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="tody">
                  <div class="tody-title">今日新增用例</div>
                  <div class="tody-data">{{ today.caseAddCount }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
         </el-row>
       </el-col>
       <el-col :span="8">
         <div style="height: 72vh;" class="box">
           <div class="box-title">用例 TOP10</div>
            <el-tabs v-model="caseActiveModel">
              <el-tab-pane label="通过率" name="first">
                <transition-group type="transition" :name="'flip-list'"  class="list-group" tag="ul" element-loading-background="rgba(236, 245, 255, 0.5" style="height: 59vh"
                v-loading="caseLoading">
                  <li class="list-group-item item-color-normal" v-for="element in passRateTop" :key="element.case_name">
                    <span class="name">{{element.case_name}}</span>
                    <span class="rate" v-if="element.passrate > 80">{{element.passrate}}%</span>
                    <span class="rate red" v-else>{{element.passrate}}%</span>
                  </li>
                </transition-group>
              </el-tab-pane>
              <el-tab-pane label="执行数" name="second">
                <transition-group type="transition" :name="'flip-list'" class="list-group" tag="ul" element-loading-background="rgba(236, 245, 255, 0.5" style="height: 59vh"
                v-loading="caseLoading">
                  <li class="list-group-item item-color-normal" v-for="element in caseTotalTop" :key="element.case_name">
                    <span class="name">{{element.case_name}}</span>
                    <span class="rate">{{element.count}}次</span>
                  </li>
                </transition-group>
              </el-tab-pane>
            </el-tabs>
          </div>
       </el-col>
     </el-row>
  </div>
<!--    </Menu>-->
</template>

<script>
import { get } from '../../network/axios_request'
import {request} from '../../network/request'
import Vue from 'vue'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
import Menu from '../../components/common/Menu'
import ECharts from "vue-echarts";

export default {
  name: 'Overview',
  components: {
      Menu
      // chart : ECharts
    },

  data() {
    return {
      projectActiveModel: 'first',
      userActiveModel: 'first',
      caseActiveModel: 'first',
      showTeam: false,
      total: {
        project: 0,
        case: 0,
        scheduler: 0,
        // mock: 0
      },
      projectSuccessRate: [],
      projectFailRate: [],
      userTop: [],
      caseTotalTop: [],
      passRateTop: [],
      today: {
        caseAddCount: 0,
        testCount: 0,
        testProjectCount: 0
      },
      projectLoading: false,
      userLoading: false,
      caseLoading: false,
      projects: [],
      currentProject: null,
      projectData: {
        // 近7天新增用例
        sevenCases: 0,


        successTotal: 0,
        executeTotal: 0,
        failTotal: 0,
        successRate: 0,


        currentSuccessTotal:0,
        currentExecuteTotal:0,
        currentFailTotal:0,
        currentSuccessRate: 0,

        yoyGrowth: 0,
        dayExecute: [],


      },
      barData: {
        xAxis: [],
        success: [],
        fail: [],
        total: []
      }
    }
  },
  async created() {
    await this.getAllProjects()
    await this.getTotal()
    await this.getCaseTop()
    await this.getToday()
  },
  watch: {
    currentProject() {
      this.getProjectData()

    }
  },
  computed:{
    objData() {
      return this.projectData;
    }

  },
  mounted() {
    //圆形图
    // setTimeout(()=> {
    //   console.log(this.$refs["result-circle"])
    // },2000);
    this.circle = this.$echarts.init(document.getElementById('result-circle'))
    this.circle.setOption(this.circle_option)
    // table
    this.bar = this.$echarts.init(document.getElementById('result-bar'))
    this.bar.setOption(this.bar_option)

    this.circle_ = this.$echarts.init(document.getElementById('result-circle_'))
    this.circle_.setOption(this.circle_option_)



    window.onresize = () => {
      this.circle.resize()
      this.circle_.resize()
      this.bar.resize()
    }

    if (document.body.clientWidth > 1000 && document.body.clientWidth < 1130) {
      this.showTeam = true
    }
  },
  methods: {
    async getProjectData() {
      let res
      try {
        res = await get(`/about/project/${this.currentProject}`, { showBackend: true })
        res = res.data.data.items

        this.projectData.successTotal = res.success_total
        this.projectData.currentSuccessTotal = res.current_success_rate.successTotal
        this.projectData.executeTotal = res.execute_total
        this.projectData.currentExecuteTotal = res.current_success_rate.total

        this.projectData.dayExecute = res.day_execute

        // 近7天新增的用例
        this.projectData.sevenCases = res.sevenCases

        this.projectData.failTotal = this.projectData.executeTotal - this.projectData.successTotal
        this.projectData.currentFailTotal = this.projectData.currentExecuteTotal - this.projectData.currentSuccessTotal
        if (res.execute_total === 0) {
          this.projectData.successRate = 0
        } else {
          this.projectData.successRate = (this.projectData.successTotal / this.projectData.executeTotal * 100).toFixed(2)
        }


        if (res.current_success_rate.total === 0) {
          this.projectData.currentSuccessRate = 0
        } else {
          this.projectData.currentSuccessRate = (this.projectData.currentSuccessTotal / this.projectData.currentExecuteTotal * 100).toFixed(2)
        }

        this.barDataDeal(this.projectData.dayExecute)
        this.circle.setOption(this.circle_option)
        this.circle_.setOption(this.circle_option_)
        this.bar.setOption(this.bar_option)

      } catch (error) {
        if (error.error_code !== 0) {
          // this.$message.error(`${res.msg}`)
        }
      }
    },

    async getTotal() {
      let res
      try {
        res = await get('/about/total', { showBackend: true })
        res = res.data.items
        console.log(res)
        this.total = res
      } catch (error) {
        if (error.error_code !== 0) {
          // this.$message.error(`${res.msg}`)
        }
      }
    },


    async getCaseTop() {
      this.caseLoading = true
      let res
      try {
        res = await get('/about/caseTop', { showBackend: true })
        res = res.data.data

        this.caseTotalTop = res.run_top
        this.passRateTop = res.pass_rate_top
        this.caseLoading = false
      } catch (error) {
        if (error.error_code !== 0) {
          // this.$message.error(`${res.msg}`)
        }
        this.caseLoading = false
      }
    },
    async getToday() {
      let res
      try {
        res = await get('/about/today', { showBackend: true })
        res = res.data.data.items
        console.log(res)

        this.today.caseAddCount = res.case_add_tody
        this.today.testCount = res.case_run_tody
        this.today.testProjectCount = res.project_run_tody
        console.log(this.today)

      } catch (error) {
        if (error.error_code !== 0) {
          // this.$message.error(`${res.msg}`)
        }
      }
    },
    async getAllProjects() {
      let res
      try {
        res = await get('/about/options', { showBackend: true })
        res = res.data.items
        this.projects = res
        console.log('%o',this.projects)
        if (this.projects.length > 0) {
          this.currentProject = res[0].id
          console.log('默认工程为'+this.currentProject)
        }
      } catch (e) {
        this.projects = []
      }
    },
    timestampToTime(timestamp) {
      // 过滤时间戳，返回值mm-dd
      if (!timestamp) {
        return timestamp
      }
      const date = new Date(timestamp * 1000)
      const m = `0${date.getMonth() + 1}`
      const d = `0${date.getDate()}`
      const val = `${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
      return val
    },
    barDataDeal(data) {
      this.barData.xAxis = []
      this.barData.success = []
      this.barData.fail = []
      this.barData.total = []
      for (let index = 0; index < data.length; index++) {
        this.barData.xAxis.push(this.timestampToTime(data[index].create_time / 1000))
        this.barData.success.push(data[index].success)
        this.barData.fail.push(data[index].fail)
        this.barData.total.push(data[index].total)
      }
    }
  },
  async activated() {
    await this.getAllProjects()
    await this.getTotal()
    await this.getCaseTop()
    await this.getToday()
    await this.getProjectData()
  },
  computed: {
    bar_option() {
      const that = this
      const option = {
        title: {
          text: '近7次执行情况（天）',
          textStyle: {
            fontSize: 12,
            color: '#4577ff'
          }
        },

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['成功数', '失败数', '总用例数']
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: that.barData.xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '成功数',
            itemStyle: {
              color: '#00C292'
            },
            type: 'bar',
            data: that.barData.success,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '失败数',
            itemStyle: {
              color: '#E46A76'
            },
            type: 'bar',
            data: that.barData.fail,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '总用例数',
            itemStyle: {
              color: '#4577ff'
            },
            type: 'bar',
            data: that.barData.total,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
        ]
      }
      return option
    },
    circle_option() {
      const that = this
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['成功', '失败']
        },
        graphic: [{
          type: 'text',
          left: 'center',
          top: '45%',
          style: {
            text: `总成功率\n${that.projectData.successRate}%`,
            textAlign: 'center',
            fill: '#4577ff',
            width: 30,
            height: 30,
            fontSize: 15,
            fontWeight: 'bold'
          }
        }],
        series: [
          {
            name: '测试结果占比',
            type: 'pie',
            radius: ['50%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: [
              { value: that.projectData.successTotal, name: '成功', itemStyle: { color: '#00C292' } },
              { value: that.projectData.failTotal, name: '失败', itemStyle: { color: '#E46A76' } },
            ],
            emphasis: {
              // label: {
              //   show: true,
              //   fontSize: '30',
              //   fontWeight: 'bold'
              // },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      return option
    },
    circle_option_(){
      const that = this
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['成功', '失败']
        },
        graphic: [{
          type: 'text',
          left: 'center',
          top: '45%',
          style: {
            text: `当前成功率\n${that.projectData.currentSuccessRate}%`,
            textAlign: 'center',
            fill: '#4577ff',
            width: 30,
            height: 30,
            fontSize: 15,
            fontWeight: 'bold'
          }
        }],
        series: [
          {
            name: '测试结果占比',
            type: 'pie',
            radius: ['50%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: [
              { value: that.projectData.currentSuccessTotal, name: '成功', itemStyle: { color: '#00C292' } },
              { value: that.projectData.currentFailTotal, name: '失败', itemStyle: { color: '#E46A76' } },
            ],
            emphasis: {
              // label: {
              //   show: true,
              //   fontSize: '30',
              //   fontWeight: 'bold'
              // },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      return option
    },
  }
}
</script>

<style scoped lang="scss">
.container {

  /*ul { padding: 0 };*/


  .box {
    width: 100%;
    background: #fff;
    border-radius:8px;
    box-shadow: 0 2px 14px 0 #f3f3f3;
    position: relative;

    .project-header {
      height: 5vh;
      width: 100%;
      text-align: center;
      line-height: 5vh;

      .project-header-title {
        font-size: 16px;
        color: #596c8e;
      }

      .data-green {
        color: #00c292;
        font-size: 22px;
      }
      .data-red {
        color: #F4516C;
        font-size: 22px;
      }
    }

    .red {
      color: #F4516C;
    }

    .tody {

      div {
        height: 5vh;
        line-height: 5vh;
        text-align: center;
      }

      .tody-title {
        font-size: 16px;
      }

      .tody-data {
        font-size: 28px;
        color: #00c292;
      }
    }

    .title {
      position: absolute;
      font-size: 18px;
      left: 10px;
      top: 10px;
    }

    .data {
      font-size: 30px;
      text-align: center;
      line-height: 10vh;
      color: #4577ff;
    }

    .box-title {
      height: 8vh;
      line-height: 8vh;
      text-align: center;
      font-size: 22px;
    }

    .list-group {
      background: rgba(236, 245, 255, 0.5);
      border-radius: 4px;
      overflow-y: auto;
      width: 100%;
      margin: auto;
      box-sizing: border-box;
      /*也可以在根css中加入*ul { padding: 0 }; 解决浏览器中列表左侧的空出来的40px的padding*/
      padding-inline-start: 0;


      .item-color-normal {
        color: #4577ff;
        background: #ecf5ff;
        border:1px solid #b3d8ff;
      }

      .list-group-item {
        height: 35px;
        line-height: 35px;
        font-weight: 500;
        border-radius: 4px;
        padding: 0 5px;
        margin: 0 5px 5px 5px;
        display: flex;


        .name {
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100%;
          overflow: hidden;
        }

        .rate {
          margin: auto 2px;
        }

      }
    }

    /*.flip-list-move {*/
    /*  transition: transform 0.6s;*/
    /*}*/

    .list-group::-webkit-scrollbar{
      width:8px;
      height:8px;
      /**/
    }
    .list-group::-webkit-scrollbar-track{
      background: rgb(239, 239, 239);
      border-radius:2px;
    }
    .list-group::-webkit-scrollbar-thumb{
      background: #dad4d4;
      border-radius:10px;
    }
    .list-group::-webkit-scrollbar-thumb:hover{
      background: rgb(175, 173, 173);
    }

  }
  .box /deep/ .el-tabs__nav {
    width: 100% !important;
  }

  .box /deep/ .el-tabs__active-bar .is-top {
    width: 50% !important;
  }

  .box /deep/ .el-tabs__item{
    padding: 0 !important;
    width: 50%;
    text-align: center;
  }
}

@media screen and (max-width: 12px) {
  .container {
    display: none;
  }
  .container {
    width: 100%;
  }
  .container {
    width: 32%;
    &:last-child {
      display: none;
    }
  }
  .container {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .container {
    width: 100%;
  }
}
</style>
