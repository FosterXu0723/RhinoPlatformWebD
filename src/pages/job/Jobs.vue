<template>
<!--  <Menu>-->
    <div slot="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>定时任务列表</span>
          <button
            style="float: right; padding: 3px 0"
            @click="addJob"
            type="text"
          >
            新增任务
          </button>
        </div>

        <el-table :data="jobTable">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="任务名称" prop="taskName"></el-table-column>
          <el-table-column label="任务执行状态" :formatter="taskStatusFormat"></el-table-column>
          <el-table-column label="任务类型"></el-table-column>
          <el-table-column label="下次执行时间" prop="taskStart" :formatter="startTimeFormater"></el-table-column>
          <el-table-column label="创建者" prop="owner"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                @click.native="editJob(scope.row, tableData)"
                type="text"
                size="small"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <table-pagination
          :total="total"
          :currentPage="page"
          :pageSize="pageSize"
          @handleNumberChange="handleSizeChange"
          @handlePageChange="handleCurrentChange"
        >
        </table-pagination>
      </el-card>

      <!-- 新建task弹窗 -->
      <el-dialog :visible.sync="taskDialog" title="新建任务" width="50%" @close="closeDialog">
        <el-form
          ref="taskForm"
          :model="taskForm"
          label-width="90px"
          :rules="taskRules"
        >
          <el-form-item label="任务名称:" prop="taskName">
            <el-input
              v-model="taskForm.taskName"
              type="text"
              placeholder="请输入任务名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="任务类型:" prop="taskType">
            <el-select
              class="jobType"
              v-model="taskForm.taskType"
              placeholder="请选择任务类型"
              @change="handleSelectChange"
            >
              <el-option label="指定时间" value="date"></el-option>
              <el-option label="循环执行" value="interval"></el-option>
            </el-select>
          </el-form-item>
          <!-- 当任务类型为date时，展示datePicker -->
          <el-form-item
            v-if="taskForm.taskType == 'date'"
            label="首次运行:"
            prop="runtime"
          >
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="taskForm.runDate"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker
                placeholder="选择时间"
                v-model="taskForm.runTime"
                style="width: 100%"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-col>
          </el-form-item>
          <!-- 否则展示输入循环执行参数 -->
          <el-form-item v-else label="循环时间:">
            <el-input
              placeholder="请输入内容"
              v-model="taskForm.taskRegularNum"
              prop="taskRegularNum"
              type="number"
            >
              <el-select
                v-model="taskForm.taskRegularType"
                slot="prepend"
                prop="taskRegularType"
                style="width: 100px"
              >
                <el-option label="周间隔" value="weeks"></el-option>
                <el-option label="天间隔" value="days"></el-option>
                <el-option label="时间隔" value="hours"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="关联内容:" prop="relationType">
            <el-radio-group
              v-model="taskForm.relationType"
              @change="radioChange"
            >
              <el-radio label="project">项目关联</el-radio>
              <el-radio label="case">用例关联</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 选中project才展示 -->
          <el-form-item
            v-if="projectIsSelected"
            label="关联项目:"
            prop="projectId"
          >
            <el-select v-model="taskForm.projectId">
              <el-option
                v-for="item in projectList"
                :key="item.projectName"
                :label="item.projectName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 否则就是关联用例 -->
          <el-form-item v-else label="关联用例:" prop="cases">
            <el-cascader
              v-model="taskForm.cases"
              :props="caseOption"
              @change="cascaderChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <!-- footer -->
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="taskDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click.native="taskCommit"
            :loading="loading"
            >提交</el-button
          >
        </div>
      </el-dialog>
    </div>
<!--  </Menu>-->
</template>

<script>
import Menu from "components/common/Menu";
import TablePagination from "../../components/common/TablePagination.vue";
import {request} from '@/network/request'
import {formData} from '@/utils/DataResolve'
import {DateFormat} from "@/utils/DatetimeUtils"
export default {
  name: "Jobs",
  components: {
    Menu,
    TablePagination,
  },
  data() {
    return {
      taskDialog: false,
      loading: false,
      jobTable: [],
      // 总数
      total: 0,
      page: 1,
      pageSize: 10,
      taskForm: {
        taskName: "",
        taskType: "interval",
        // 任务循环执行的时间间隔类型。**周  **天 或者**小时
        taskRegularType: "weeks",
        taskRegularNum: "",
        // 任务关联的对象 关联项目或者cases
        relationType: "project",
        runDate: "",
        runTime: "",
        projectId: "",
        cases: [],
      },
      taskRules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        taskType: [
          { required: true, message: "请选择定时任务类型", trigger: "blur" },
        ],
      },
      projectIsSelected: true,
      projectList: [],
      // 级联选择器option
      caseOption: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          setTimeout(() => {});
        },
      },
    };
  },
  methods: {
    /**
     * 新增job
     */
    addJob(scope) {
      console.log("add");
      this.taskDialog = true;
      this.projectIsSelected = true;
    },
    /**
     * 更改选择处理事件
     */
    radioChange(label) {
      console.log(label);
      this.projectIsSelected = !this.projectIsSelected;
      // 根据label判断事件
      if (label == "project") {
        // 表示project选中
        this.taskForm.cases = [];
      } else {
        // 表示选中的是关联cases
        this.taskForm.projectId = "";
      }

      if (!this.projectIsSelected) {
        this.initCascader();
      }
    },
    /**
     *  全部项目列表
     */
    allProject() {
      request({
        url: "/projects/allProject",
        method: "get",
      }).then((res) => {
        if (res.code === 10000) {
          this.projectList = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * 级联选择器
     */
    cascaderChange() {},
    /**
     * 获取全部定时任务
     * todo
     */
    allJobs() {},
    /**
     * 翻页
     */
    handleCurrentChange(item) {
      this.page = item;
      // 发起请求
      // this.pageCase()
    },
    /**
     * 改变每页条数
     */
    handleSizeChange(item) {
      this.pageSize = item;
      // 发起请求
      // this.pageCase()
    },
    /**
     * 初始化级联选择器
     */
    initCascader() {
      let index = 0;
      for (let obj of this.projectList) {
        this.caseOption[index] = {
          value: obj.id,
          label: obj.projectName,
          children: {},
        };
        index++;
      }
    },
    /**
     *
     */
    handleChange(currentValue, oldValue) {
      this.taskForm.weeks = currentValue;
    },
    /**
     * 提交任务
     */
    taskCommit() {
      console.log(this.taskForm);
      let requestData = Object.assign({}, this.taskForm);
      request({
        url: "/task/addTask",
        method: "post",
        data: formData(requestData)
      })
        .then((res) => {
          if(res.code === 10000){
            // 获取任务列表

            this.$message.info(res.msg)
            // 关闭dialog
            this.taskDialog = false
            this.$refs.taskForm.resetFields()
          }else{
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {});
    },
    /**
     * 处理改变任务循环方式的事件
     */
    handleSelectChange(value) {
      // 当选择的任务类型是date时,需要对interval的关联参数做处理
      if (value == "date") {
        this.taskForm.taskRegularNum == "";

      } else {
        // interval类型的任务直接将date&time恢复为空值
        this.taskForm.runDate = "";
        this.taskForm.runTime = "";
      }
    },
    /**
     * 获取任务
     */
    listTask(){
      let params = {
        "page": this.page,
        "pageSize": this.pageSize
      }
      request({
        url: "/task/list",
        method: "get",
        params: params
      }).then(res => {
        if(res.code === 10000){
          this.jobTable = res.data.list
          this.total = res.data.total
        }else{
          this.$message.error(res.msg)
        }
      }).catch(err =>{
        console.log(err);
      })
    },
    /**
     * 格式化时间
     */
    startTimeFormater(row, column, cellValue, index){
      return DateFormat(row.taskStart)
    },
    /**
     * 格式化表格中的开启状态
     */
    taskStatusFormat(row, column, cellValue, index){
      return row.taskStatus == true? "开启":"关闭"
    },
    /**
     * 关闭dialog的回调函数
     */
    closeDialog(){
      this.$refs.taskForm.resetFields()
    }
  },
  created() {
    this.allJobs();
    this.allProject();
    this.listTask()
  },
};
</script>

<style scoped>
</style>
