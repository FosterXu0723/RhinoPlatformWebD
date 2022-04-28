<template>
<!--    <Menu>-->
      <div slot="content">
        <div class="app-container">
              <p class="warn-content">
                Yaml编辑器 基于
                <a href="https://github.com/codemirror/CodeMirror" target="_blank">CodeMirror</a>，
                主题预览地址 <a href="https://codemirror.net/demo/theme.html#idea" target="_blank">Theme</a>
              </p>
          <Yaml :value="value" :height="height" @change="handleChange"/>
          <el-button type="primary" @click="submit" style="float:right" :loading="true">提交</el-button>
        </div>
      </div>
<!--    </Menu>-->
</template>

<script>
  import Menu from 'components/common/Menu'
  import Yaml from "@/components/common/YamlEdit"
  import {request} from "@/network/request"
  import {formData} from "@/utils/DataResolve"
  export default {
    name: 'YmlEdit',
    components:{
      Menu,
      Yaml
    },
    data() {
    return {
      height: document.documentElement.clientHeight - 210 + 'px',
      value: '# 展示数据，如需更换主题，请在src/components/YamlEdit 目录中搜索原主题名称进行替换\n' +
        '# 需要提取的参数建议采用jsonpath的格式\n' +
        '# 替换参数采用${}标识,执行额外方法采用$()格式表识 \n'+
        '\n'+
        'testcase1: \n' +
        '  casename: \n' +
        '  projectid: \n' +
        '  module: \n' +
        '  enabled: \n' +
        '  step1: \n' +
        '    name: \n' +
        '    general: \n' +
        '      path: \n' +
        '      method: \n' +
        '    headers: \n' +
        '      Content-Type: \n' +
        '      Ev: "v4"\n' +
        '    data: \n' +
        '      key: value\n' +
        '    extract: \n' +
        '      key: value \n' +
        '    validate: \n' +
        '      expected_code: statusCode \n' +
        '      assert_kes_value: [{key: value}] \n' +
        '      assert_in_text: "success," \n' +
        '      assert_key_exists: "data,functionPermissionList" \n' +
        '      aseert_db: {"table":"","column":"","condition":"id=***"} \n' +
        '  headersparamsvalue: {key: value} \n'+
        '  dataparamsvalue: {} \n'
    }
  },
  methods:{
    submit(){
      const yml = require('js-yaml');
      request({
        url: "/testcase/ymlCase",
        method: "post",
        data: formData({"ymlData": yml.dump(this.value)})
      }).then(res =>{
        if(res.code === 10000){
          this.$message.success("新增成功")
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    handleChange(value){
      if(this.value != value){
        this.value = value
      }
    }
  },
  mounted() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 210 + 'px'
    }
  }
  }
</script>

<style scoped>

</style>
