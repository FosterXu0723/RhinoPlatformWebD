<template>
<!--    <Menu>-->
      <div slot="content">
          <el-col :span="24" class="el-table-headtoolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" class="userform" label-width="60px">
                <el-form-item label="用户名" prop="username">
                <el-input v-model="filters.username" placeholder="用户名" prefix-icon="el-icon-search" clearable></el-input>
                </el-form-item>
                <el-button split-button type="primary" @click="btnSearch" trigger="click">
                检索
                </el-button>

          </el-form>
          </el-col>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="btnNew">
                新增
              </el-button>
          </div>
          <el-table :data="userList" highlight-current-row v-loading="listLoading" @selection-change="selsUserChange"
                    ref="table" style="width: 100%;" >
            <el-table-column type="selection" width="60" align="center" header-align="center"></el-table-column>
            <el-table-column type="index" prop="id" width="60" label="id" align="center" header-align="center"></el-table-column>
            <el-table-column type="username" prop="username" label="用户名称" width="220" align="center" header-align="center"></el-table-column>
            <el-table-column type="date" prop="updatetime" label="更新时间" width="280" align="center" header-align="center"></el-table-column>
            <el-table-column type="operator" prop="operator" label="操作人" width="280"align="center" header-align="center"></el-table-column>
            <el-table-column type="operator" label="操作" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click.native="rowEdit(scope.row)" icon="el-icon-edit"></el-button>
                <el-button type="primary" @click.native="rowDelete(scope.row)" icon="el-icon-delete"></el-button>
              </template>
            </el-table-column>
          </el-table>

          <RhPagination :total="userTotal" @handleNumberChange="handleSizeChange" @handlePageChange='handleCurrentChange'
          :pageSize="pageSize" :currentPage="page"></RhPagination>
        </el-card>

      <!--   新增用户   -->
      <el-dialog title="新增" :visible.sync="addFormVisible">
        <el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--   编辑用户   -->
      <el-dialog title="编辑" :visible.sync="editFormVisible">
        <el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
          <el-form-item label="用户名:" prop="username" placeholder="请输入用户名">
            <el-input v-model="editForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码:" prop="password">
            <el-input v-model="editForm.password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="passwordcheck">
            <el-input v-model="editForm.passwordcheck" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="rowEditCommit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
<!--  </Menu>-->
</template>

<script>
    import Menu from '../../components/common/Menu'
    import RhPagination from 'components/common/TablePagination'
    import {request} from '@/network/request'
    import {DateFormat} from '@/utils/DatetimeUtils'
    import {formData} from '@/utils/DataResolve'

    export default {
        name: 'User',
        data() {
            return {
                userTotal: null,
                filters: {
                    username: ''
                },
                page: 1,
                pageSize: 10,
                editLoading: false,
                userList: [],
                editFormVisible: false, // 编辑页面是否显示
                listLoading: false,
                addFormVisible: false, // 新增界面是否显示
                addForm: {
                    username: '',
                    password: '',
                },
                editForm: {
                    id: undefined,
                    username: '',
                    password: '',
                    passwordcheck: ''
                },
                editFormRules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
                    ],
                    password: [{required: true, message: '请输入密码', trigger: 'change'},
                        {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}],
                    passwordcheck: [{required: true, message: '请输入密码', trigger: 'change'},
                        {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}],
                },
                addFormRules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'change'},
                        {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}],
                },
                addLoading: false,
                // 选中列表
                sels: [],
                arrID: []
            }
        },
        components: {
            Menu,
            RhPagination
        },
        computed: {
            nowTime() {
                const data = new Date()
                return data.toLocaleString()
            }
        },
        mounted() {
            this.getUsers()
        },
        methods: {
            selsUserChange(sels) {
                this.sels = sels
                if (sels.lenth > 0) {
                    const valId = []
                    for (let i = 0; i < sels.length; i++) {
                        // const arrIdsame = false;
                        valId.push(sels[i].id)
                    }
                    this.arrID = valId
                }
            },
            addSubmit() {
                this.$refs.addForm.validate(
                    (valid) => {
                        if (valid) {
                            this.$confirm('确认提交吗？', '提示', {}).then(
                                () => {
                                    this.addLoading = true
                                    let para = Object.assign({}, this.addForm)
                                    request({
                                        url: '/addUser',
                                        method: 'post',
                                        data: formData(para)
                                    }).then(res => {
                                        this.addLoading = false
                                        if (res.code === 10000) {
                                            this.$message({message: '提交成功', type: 'success'})
                                            this.$refs['addForm'].resetFields()
                                            this.addFormVisible = false
                                            this.getUsers()
                                        } else {
                                            this.$message.error(res.msg)
                                        }
                                    })
                                }
                            )
                        }
                    }
                )
            },
            getUsers() {
                let params = {
                    'page': this.page,
                    'pageSize': this.pageSize
                }
                request({
                    url: '/getUsers',
                    method: 'post',
                    data: formData(params),
                }).then(result => {
                    if (result.code === 10000) {
                        this.userList = result.data.list
                        this.userTotal = result.total
                        this.userList.map(item => {
                            item.updatetime = DateFormat(item.updatetime)
                        })
                    } else {
                        throw result.msg
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            btnSearch() {
                const queryParams = {
                    'username': this.filters.username
                }
                request({
                    url: '/getUser',
                    method: 'post',
                    data: formData(queryParams)
                }).then(res => {
                    if (res.data.code != 99999) {
                        this.userList = res.data.list
                        this.userList.map(item => {
                            item.updatetime = DateFormat(item.updatetime)
                        })
                    } else {
                        this.$message(res.msg)
                    }
                })
            },
            btnNew() {
                this.addFormVisible = true
            },
            btnEdit() {
                const ids = this.sels.map(item => item.id)
                if (ids == '' || ids.length < 1) {
                    console.log(this.sels)
                    this.$alert('请选择一条要编辑的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    })
                } else {
                    const obj = {}
                    obj.id = this.sels.map(item => item.id).toString()
                    obj.username = this.sels.map(item => item.username).toString()
                    obj.password = this.sels.map(item => item.password).toString()
                    obj.passwordcheck = this.sels.map(item => item.passwordcheck).toString()
                    this.editFormVisible = true
                    this.editForm = Object.assign({}, obj)
                }
            },
            editSubmit() {
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            let para = Object.assign({}, this.editForm)
                            request({
                                url: '/editUser',
                                method: 'post',
                                data: formData(para)
                            }).then(res => {
                                if (res.code != 99999) {
                                    this.editLoading = false
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    })


                                    this.$refs['editForm'].resetFields()
                                    this.editFormVisible = false
                                    this.editLoading = false
                                    this.getUsers()
                                } else {
                                    this.editLoading = false
                                    this.$message.error(res.msg)
                                }

                            })
                        })
                    }
                })
            },
            btnDelete() {
            },
            handleCurrentChange(val) {
                this.page = val
                this.getUsers()
            },
            handleSizeChange(size) {
                this.pageSize = size
                this.getUsers()
            },
            rowEdit(row) {
                this.editFormVisible = true
                console.log(row)
                this.editForm.id = row.id
                this.editForm.username = row.username
            },
            rowEditCommit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            let para = Object.assign({}, this.editForm)
                            request({
                                url: '/editUser',
                                method: 'post',
                                data: formData(para)
                            }).then(res => {
                                if (res.code != 99999) {
                                    this.editLoading = false
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    })
                                    // 更新姓名
                                    this.$store.commit('updateUsername',this.editForm.username)
                                    this.$refs['editForm'].resetFields()
                                    this.editFormVisible = false
                                    this.editLoading = false
                                    this.getUsers()
                                } else {
                                    this.editLoading = false
                                    this.$message.error(res.msg)
                                }

                            })
                        })
                    }
                })
            },
            rowDelete(row) {
                this.$confirm('确认删除吗？', '提示', {}).then(valid => {
                    if (valid) {
                        request({
                            url: '/deleteUser',
                            method: 'post',
                            data: formData({
                                'id': row.id
                            })
                        }).then(res => {
                            if (res.code != 99999) {
                                // 请求成功
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                })
                                this.getUsers()
                            } else {
                                this.$message.error(res.msg)
                            }
                        })

                    }
                })
            }

        }
    }
</script>

<style scoped>

</style>
