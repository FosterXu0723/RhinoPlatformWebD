<template>
    <el-container style="margin: 0px;padding: 0px;height: 100%;height: 100vh;">
        <el-header style="height: auto;font-size: 20px;">
          <div class="logo">
            <span>灵犀测试平台</span>
          </div>
          <div class="header-right">
            <div class="header-user-con">
              <!-- 用户头像 -->
              <div class="user-avator"><img src="~assets/img/avator/boy.svg"/></div>
              <!-- 用户名下拉菜单 -->
              <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                      <span class="el-dropdown-link">
                          {{ $store.state.username }}
                          <i class="el-icon-caret-bottom"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                  <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

        </el-header>

      <el-container>

        <el-aside width="200px" style="background-color: rgb(84, 92, 100);">
          <header-top-menus></header-top-menus>
        </el-aside>
        <el-main>
<!--          router-view 可以渲染路径匹配到的视图组件 因为vue会去复用组件   如果不设置绑定key
在路由之间跳转时将不再执行mounted之类的钩子 即从page?1到page2?不会拉取到最新的页面数据 所以使用key来阻止其复用-->
<!--   不再使用插槽使用router-view       <slot name="content"></slot>-->
          <router-view :key="key">

          </router-view>

        </el-main>
      </el-container>

      <!--   修改密码弹窗    -->
      <el-dialog :visible.sync="editPasswordVisible" title="修改密码">
        <el-form :model="editPasswordForm" :rules="passwordFormRule" ref="editPasswordForm"
                 label-width="80px">
          <el-form-item label="新密码" prop="password">
            <el-input v-model="editPasswordForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="再次输入" prop="passwordcheck">
            <el-input v-model="editPasswordForm.passwordcheck"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editPasswordVisible = false">取消</el-button>
          <el-button @click.native="editPasswordSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </el-container>


</template>

<script>
  import HeaderTopMenus from 'components/common/HeaderTopMenus'
  import {request} from '@/network/request'

  export default {
    name: 'Menu',
    components:{
      HeaderTopMenus
    },
    data () {
      return {
        editPasswordVisible: false,
        editPasswordForm: {
          'username': localStorage.getItem('login_username'),
          'password': '',
          'passwordcheck': ''
        },
        editPassTile: '修改密码',
        passwordFormRule: {
          password: [{required: true, message: '请输入密码', trigger: 'change'},
            {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}],
          passwordcheck: [{required: true, message: '请输入密码', trigger: 'change'},
            {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}],
        },
        addLoading: false
      }
    },
    created() {
      console.log('组件创建')
    },
    computed: {
      username () {
        // 取本地缓存
        let username = localStorage.getItem('login_username')
        return username ? username : this.name
      },
      key(){
        //$route 代表当前路由信息对象（$router是全局的路由实例对象）
        //$route.fullPath 完成解析后的url 包含查询参数和hash的完整路径
        return this.$route.fullPath
      }
    },
    methods: {
      handleCommand (command) {
        if (command === 'editPassword') {
          // 弹窗出现编辑密码弹窗
          this.editPasswordVisible = true
          console.log(this.editPasswordVisible)
        } else if (command === 'loginOut') {
          this.$store.commit('clearToken')
          this.$router.replace('/login')
        }
      },
      editPasswordSubmit () {
        this.$refs.editPasswordForm.validate(valid => {
          if (valid) {
            request({
              url: '/editUser',
              method:'post',
              data: this.editPasswordForm
            }).then(res=>{
              this.addLoading = false
              if (res.code != 99999){
                this.$message({message: '提交成功', type: 'success'})
                this.editPasswordVisible = false
                this.$refs['editPasswordForm'].resetFields()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      handleClose(){
        console.log('handleClose')
        this.editPasswordVisible = false
      }
    },
  }
</script>

<style scoped>

.el-header{
  background-color: rgb(17, 116, 111);
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: white;
  font-size: 20px;

}
  .logo {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .header-right {
    float: right;
    padding-right: 50px;
  }

  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }

  .user-avator {
    margin-left: 20px;
    margin-right: 10px;
  }

  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-name{
    color: white;
    font-size: 20px;
  }


</style>
