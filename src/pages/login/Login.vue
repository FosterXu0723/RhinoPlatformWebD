<template>
  <div class="login-wrapper">
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="LoginForm"
               autocomplete="on" label-position="left">
        <div class="title-container">
          <span>灵犀测试平台</span>
        </div>
        <el-form-item prop="username">
          <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username"
                    type="text" tabindex="1" auto-complete="on" prefix-icon="el-icon-user" label="用户名:"></el-input>
        </el-form-item>
        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                      placeholder="请输入密码" tabindex="2" name="password" @keyup.native="checkCapslock"
                      prefix-icon="rh-platform-icon rh-iconpassword">
            </el-input>
          </el-form-item>
        </el-tooltip>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="Login" @keyup.enter.native="Login">登录
        </el-button>

      </el-form>
    </div>
  </div>
</template>
<script>
    import {request} from '@/network/request'
    import {formData} from '@/utils/DataResolve'

    export default {
        data() {
            return {
                loginRules: {
                    username: [{required: true, message: '账号不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                },
                passwordType: 'password',
                capsTooltip: false,
                loading: false,
                loginForm: {
                    username: '',
                    password: ''
                }
            }
        },
        created() {
          window.addEventListener('keydown', this.handleKeyDown, true)//开启监听键盘按下事件
        },
        mounted() {
            if (this.loginForm.username === '') {
                this.$refs.username.focus()
            } else if (this.loginForm.password === '') {
                this.$refs.password.focus()
            }
        },
        methods: {
            //获取头像颜色
            getHeadBg() {
                let colorList = ['#EF5350', '#FFB300', '#7CB342', '#03A9F4', '#536DFE', '#607D8B', '#2D8CF0']
                let colorIndex = Math.floor(Math.random() * colorList.length)
                return colorList[colorIndex]
            },
            // 键盘监听enter键登录
            handleKeyDown (e) {
              let key = null
              if (window.event === undefined) {
                key = e.keyCode
              } else {
                key = window.event.keyCode
              }
              if (key === 13) {
                this.Login()
              }
            },
            checkCapslock(e) {
                const {key} = e
                this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
            },
            Login: function () {
                this.$refs['loginForm'].validate(valid => {
                    if (valid) {
                        request({
                            url: '/login',
                            method: 'post',
                            data: formData(this.loginForm)
                        }).then(result => {
                            if (result.code === 10000) {
                                // localStorage.setItem('login_username', this.loginForm.username)
                                this.$store.commit('storeToken', result.token)
                                this.$store.commit('updateUsername', this.loginForm.username)
                                this.$router.push('home')
                                this.loginForm.resetFields()
                                this.loading = false
                            } else {
                                this.$message.error(result.msg)
                                this.loading = false
                                this.loginForm.resetFields()
                            }
                        }).catch(err => {
                        })
                    }
                })

            }
        }
    }
</script>
<style scoped>
  .login-wrapper {
    background-color: #2b4b6b;
    position: absolute;
    width: 100%;
    height: 100%;
    /*background: url('../assets/img/newlogin-bg.jpg');*/
  }

  .login-container {
    position: relative;
    width: 450px;
    height: 335px;
    max-width: 90%;
    margin: 260px auto;
    border-radius: 5px;
    background: white;
    overflow: hidden;
  }

  .title-container {
    padding-top: 40px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    margin: 30px 0px 15px;
  }

  .LoginForm {
    position: absolute; /*绝对定位*/
    width: 300px;
    height: 200px;

    text-align: center; /*(让div中的内容居中)*/
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -150px;
  }
</style>
