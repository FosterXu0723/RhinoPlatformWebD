<template>
<!--  <Menu>-->
    <div >
      <el-card class="box-card">
        <!-- <el-col :span="24" class="el-table-headtoolbar" style="padding-bottom: 0px;">
          <el-button type="primary" @click.native="handleProject">新建项目</el-button>
        </el-col> -->
        <div slot="header" class="clearfix">
          <span>项目列表</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click.native="handleProject"
            >新建项目</el-button
          >
        </div>
        <RhTable
          :tableData="projectList"
          :tableLabel="[
            { label: 'id', param: 'id' },
            { label: '项目名称', param: 'projectName' },
            {
              label: '项目状态',
              param: 'projectStatus',
              formater: statusFormat,
            },
            { label: '创建时间', param: 'createTime' },
            { label: '更新时间', param: 'updateTime' },
          ]"
          :tableOption="{
            label: '操作',
            options: [
              { icon: 'el-icon-edit', type: 'text', methods: 'handleEdit' },
              { icon: 'el-icon-delete', type: 'text', methods: 'handleDelete' },
              { icon: 'el-icon-setting', type: 'text', methods: 'handleSet' },
            ],
          }"
          @handleButton="handleButton"
        ></RhTable>
      </el-card>

      <!--   底部页码   -->

      <RhPagination
        :total="total"
        @handleNumberChange="handleSizeChange"
        @handlePageChange="handleCurrentChange"
        :pageSize="pageSize"
        :currentPage="page"
      ></RhPagination>


      <!-- 新建项目 -->
      <el-dialog :visible.sync="addProjectFormVisible" title="新建项目">
        <el-form
          :model="projectForm"
          label-width="80px"
          :rules="projectFormRules"
          ref="projectForm"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="projectForm.projectName"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目描述" prop="projectDesc">
            <el-input type="textarea" v-model="projectForm.projectDesc"></el-input>
          </el-form-item>

          <el-form-item
            v-for="(module, index) in projectForm.modules"
            :label="'模块' + index"
            :key="module.key"
            :prop="'modules.' + index + '.value'"
            :rules="{
              required: true,
              message: '模块不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="module.value" type="text">
              <el-button  slot="append" @click.prevent="removeModule(module, 'add')">删除</el-button>
            </el-input>

          </el-form-item>

          <el-form-item label="启用项目">
            <el-switch v-model="projectForm.projectStatus"></el-switch>
          </el-form-item>
        </el-form>

        <!-- <RhForm :inline='inline' :form='projectForm' :name='projectForm' :formLabel='operatorFormlabel' :formRules='projectFormRules'></RhForm> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addProjectFormVisible = false">取消</el-button>
          <el-button @click="addModule('add')">新增模块</el-button>
          <el-button @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!-- 编辑项目 -->
      <el-dialog :visible.sync="editProjectFormVisible" title="编辑项目">
        <el-form
          :model="editProjectForm"
          label-width="80px"
          :rules="projectFormRules"
          ref="editProjectForm"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="editProjectForm.projectName"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目描述" prop="projectDesc">
            <el-input type="textarea" v-model="editProjectForm.projectDesc"></el-input>
          </el-form-item>

          <el-form-item
            v-for="(module, index) in editProjectForm.modules"
            :label="'模块' + index"
            :key="module.key"
            :prop="'modules.' + index + '.value'"
            :rules="{
              required: true,
              message: '模块不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="module.value" type="text">
              <el-button  slot="append" @click.prevent="removeModule(module, 'edit')">删除</el-button>
            </el-input>

          </el-form-item>
          <el-form-item label="启用项目">
            <el-switch v-model="editProjectForm.projectStatus"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editProjectFormVisible = false"
            >取消</el-button
          >
          <el-button @click="addModule('edit')">新增模块</el-button>
          <el-button @click.native="editSubmit" :loading="addLoading"
            >提交</el-button
          >
        </div>
      </el-dialog>

      <!-- 配置项目环境弹窗 -->
      <el-dialog
        :visible.sync="configVisible"
        :title="configDialogTitle[dialogStatus]"
      >
        <el-container class="RhContainer">
          <el-aside class="RhAside" style="width: 200px; margin-left: 0px">
            <div class="title-bar" style="height: 40px">
              <span
                >环境列表
                <i class="el-icon-plus"></i>
              </span>
              <el-input
                class="item-input"
                style="height: 23px; line-height: 23px; width: 110px"
                v-model="projectEnvForm.projectName"
                placeholder="请输入环境名称"
              >
              </el-input>
            </div>
          </el-aside>
          <el-main class="RhMain">
            <el-form
              :model="projectEnvForm"
              ref="projectEnvForm"
              :rules="envFormRule"
            >
              <el-form-item label="环境名称:" prop="projectenvName">
                <el-input
                  v-model="projectEnvForm.projectEnvName"
                  placeholder="请输入环境名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="环境域名:" prop="projectHost">
                <el-input
                  v-model="projectEnvForm.projectHost"
                  placeholder="请输入环境域名<http://domain.com>"
                ></el-input>
              </el-form-item>
              <el-form-item label="通用请求头:" prop="projectHeader">
                <el-input
                  v-model="projectEnvForm.projectHeader"
                  placeholder="请输入通用请求头,key:value格式"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目db名称:" prop="projectDbName">
                <el-input
                  v-model="projectEnvForm.projectDbName"
                  placeholder="请输入项目db名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目db地址" prop="projectDbUrl">
                <el-input v-model="projectEnvForm.projectDbUrl" placeholder="请输入项目db地址"></el-input>
              </el-form-item>
              <el-form-item label="项目db类型:" prop="projectDbType">
                <el-select
                  v-model="projectEnvForm.projectDbType"
                  placeholder="请选择项目db类型"
                >
                  <el-option label="mysql" value="mysql"></el-option>
                  <el-option label="mongo" value="mongo"></el-option>
                  <el-option label="redis" value="redis"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目db端口:" prop="projectDbPort">
                <el-input
                  v-model="projectEnvForm.projectDbPort"
                  placeholder="请输入项目db端口号"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目db用户名:" prop="projectDbUser">
                <el-input
                  v-model="projectEnvForm.projectDbUser"
                  placeholder="请输入项目db用户名"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目db密码:" prop="projectDbPassword">
                <el-input
                  type="password"
                  v-model="projectEnvForm.projectDbPassword"
                  placeholder="请输入项目db密码"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="configVisible = false">取消</el-button>
          <el-button @click.native="configCommit" :loading="addLoading"
            >提交</el-button
          >
        </div>
      </el-dialog>
    </div>
<!--  </Menu>-->
</template>

<script>
import Menu from "components/common/Menu";
import RhPagination from "components/common/TablePagination";
import RhTable from "components/common/CommonTable";
import RhForm from "components/common/CommonForm";
import { request } from "@/network/request";
import { formData } from "@/utils/DataResolve";
import { DateFormat } from "@/utils/DatetimeUtils";

export default {
  name: "Project",
  components: {
    Menu,
    RhPagination,
    RhTable,
    RhForm,
  },
  data() {
    return {
      inline: true,
      name: "projectForm",
      page: 1,
      pageSize: 10,
      total: null,
      addProjectFormVisible: false,
      editProjectFormVisible: false,
      addLoading: false,
      projectList: [],
      projectForm: {
        projectName: "",
        projectDesc: "",
        modules: [{ value: "" }],
        projectStatus: false,
      },
      projectFormRules: {
        projectName: [
          { required: true, message: "请输入项目名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度需要2-10个字符",
            trigger: "blur",
          },
        ],
        projectDesc: [
          {
            required: false,
            message: "",
            trigger: "blur",
          },
        ],
      },
      editProjectForm: {
        projectName: "",
        projectDesc: "",
        projectStatus: NaN,
        modules: [{value: ""}]
      },
      operatorFormlabel: [
        { model: "projectName", label: "项目名称", type: "input" },
        { model: "projectDesc", label: "项目描述", type: "input" },
        { model: "projectStatus", label: "启用项目", type: "switch" },
      ],
      // config参数
      configVisible: false,
      projectEnvForm: {
        projectId: "",
        projectEnvName: "",
        projectHost: "",
        projectHeader: "",
        projectDbName: "",
        projectDbType: "",
        projectDbPort: "",
        projectDbUrl: "",
        projectDbUser: "",
        projectDbPassword: "",
      },
      envFormRule: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度限制为2-10的字符" },
        ],
        projectHost: [
          { required: true, message: "请输入项目域名", trigger: "blur" },
        ],
      },
      hasEnv: null,
      configDialogTitle: {
        addConfig: "新增配置",
        editConfig: "编辑配置",
      },
      dialogStatus: "",
    };
  },
  methods: {
    handleProject() {
      this.addProjectFormVisible = true;
    },
    addSubmit() {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          this.addLoading = true;
          let para = Object.assign({}, this.projectForm);
          request({
            url: "/projects/addProject",
            method: "post",
            Headers: {
              "Content-Type": "application/json"
            },
            data: JSON.stringify(para),
          }).then((res) => {
            this.addLoading = false;
            if (res.code == 10000) {
              this.$message({ message: "提交成功", type: "success" });
              this.$refs["projectForm"].resetFields();
              this.addProjectFormVisible = false;
              this.getAllProject();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    getAllProject() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
      };
      request({
        url: "/projects/getProjects",
        method: "post",
        data: formData(params),
      }).then((res) => {
        if (res.code == 10000) {
          this.total = res.total;
          res.data.list.map((item) => {
            item.createTime = DateFormat(item.createTime);
            item.updateTime = DateFormat(item.updateTime);
            if (item.updateTime == "" || item.updateTime == NaN) {
              item.updateTime = "-";
            }
            if(item.modules != null){
              item.modules.map((innerItem, index)=>{
                item.modules[index] = {"value": innerItem}
              })
            }
          }

          );
          this.projectList = res.data.list;
          console.log(this.projectList);
        } else {
          // 没有项目数据
          this.$message.info(res.msg);
        }
      });
    },
    handleButton(value) {
      switch (value.methods) {
        case "handleEdit":
          this.editProjectFormVisible = true;
          this.editProjectForm = Object.assign({}, value.row);
          console.log(this.editProjectForm);
          break;
        // todo
        case "handleDelete":
          const h = this.$createElement;
          this.$notify({
            title: "系统提示",
            message: h("i", { style: "color: teal" }, "功能开发中，敬请期待！"),
          });
          break;
        // todo
        case "handleSet":
          const envData = {};
          this.configVisible = true;
          this.projectEnvForm.projectId = value.row.id;
          request({
            url: "/projects/getEnv",
            method: "post",
            data: formData({ projectId: this.projectEnvForm.projectId }),
          }).then((res) => {
            console.log(res);
            if (res.code === 10000) {
              this.dialogStatus = "editConfig";
              for (var item in res.data) {
                this.projectEnvForm[item] = res.data[item];
              }
              console.log(this.projectEnvForm);
            } else {
              this.dialogStatus = "addConfig";
            }
          });
      }
    },
    // 格式化内容
    statusFormat(row, column) {
      switch (row.projectStatus) {
        case true:
          return "启用";
          break;
        case false:
          return "禁用";
          break;
        default:
          return "禁用";
      }
    },
    handleCurrentChange(item) {
      this.page = item;
      this.getAllProject();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getAllProject();
    },
    editSubmit() {
      let params = Object.assign({}, this.editProjectForm)
      this.$refs.editProjectForm.validate((valid) => {
        if (valid) {
          request({
            url: "/projects/editProject",
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            data: JSON.stringify(params)
          }).then((res) => {
            if (res.code == 10000) {
              this.editProjectFormVisible = false;
              this.$refs.editProjectForm.resetFields();
              this.getAllProject();
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    // 提交项目环境配置
    configCommit() {
      if (this.dialogStatus == "addConfig") {
        this.$refs["projectEnvForm"].validate((valid) => {
          if (valid) {
            request({
              url: "/projects/addEnv",
              method: "post",
              data: formData(this.projectEnvForm),
            }).then((res) => {
              if (res.code == 10000) {
                this.configVisible = false;
                this.$message.success("提交成功");
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        });
      } else {
        this.$refs.projectEnvForm.validate((valid) => {
          if (valid) {
            request({
              url: "/projects/editEnv",
              method: "post",
              data: formData(this.projectEnvForm),
            }).then((res) => {
              if (res.code === 10000) {
                this.configVisible = false;
                this.$refs.projectEnvForm.resetFields();
                this.$message.success("提交成功！");
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        });
      }
    },
    /**
     * 删除新增模块
     */
    removeModule(item, flag){
      if(flag == "add"){
        var index = this.projectForm.modules.indexOf(item)
        if (index !== -1) {
          this.projectForm.modules.splice(index, 1)
        }
      }else{
        var index = this.editProjectForm.modules.indexOf(item)
        if (index !== -1) {
          this.editProjectForm.modules.splice(index, 1)
        }
      }
      
    },
    /**
     * 新增模块
     */
    addModule(flag) {
      if(flag == "add"){
        this.projectForm.modules.push({
          value: '',
          key: Date.now()
        });
      }else{
        this.editProjectForm.modules.push({
          value: '',
          key: Date.now()
        });
      }
        
    }
  },
  mounted() {
    this.getAllProject();
  },
};
</script>

<style scoped>
.RhContainer >>> span.title {
  font-size: 16px;
  font-weight: 500;
  margin-top: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  white-space: nowrap;
}

.RhMain {
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  overflow: auto;
  padding: 20px;
}

.RhAside {
  border: 1px solid #e6e6e6;
  padding: 10px;
  border-radius: 2px;
  box-sizing: border-box;
  background-color: #fff;
  height: calc(100vh - 80px);
  border-right: 0px;
  position: relative;
}

el-input {
  text-rendering: auto;
  color: -internal-light-dark(black, #ffffff);
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  appearance: textfield;
  background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
  -webkit-rtl-ordering: logical;
  cursor: text;
  margin: 0em;
  font: 400 13.3333px Arial;
  padding: 1px 2px;
  border-width: 2px;
  border-style: inset;
  border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
  border-image: initial;
}

.item-input {
  border: hidden;
  display: inline;
  background-color: transparent;
}

.el-icon-plus:before {
  content: "\e6d9";
}

.title-bar {
  background: #e9ebef;
  width: 100%;
  padding: 5px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
