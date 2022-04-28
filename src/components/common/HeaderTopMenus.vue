<template>
  <el-menu
    :default-active="this.$route.path"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#409BFF"
    router>
    <el-menu-item index="/home">
      <template slot="title">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </template>
    </el-menu-item>

    <el-submenu index="/top">
      <template slot="title">
          <i class="el-icon-location"></i>
          <span>接口测试</span>
      </template>
        <el-menu-item index="/api/project">
          <template slot="title">
            <span>项目</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/api/interface">
          <span slot="title">接口</span>
        </el-menu-item>
        <el-menu-item index="/api/testcase">
          <span slot="title"> 测试用例</span>
        </el-menu-item>
        <el-menu-item index="/api/report">
          <span slot="title">测试报告</span>
        </el-menu-item>
        <el-menu-item index="/api/mock">
          <span slot="title">mock数据</span>
        </el-menu-item>
        <el-menu-item index="/api/ymleditor">
          <span slot="title">yml编辑</span>
        </el-menu-item>
    </el-submenu>

    <el-menu-item index="/user">
      <i class="el-icon-user-solid"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-menu-item index="/jobs">
      <i class="el-icon-alarm-clock"></i>
      <span slot="title">定时任务</span>
    </el-menu-item>
    <el-menu-item index="/testtools">
      <i class="el-icon-suitcase-1"></i>
      <span slot="title">测试工具</span>
    </el-menu-item>
    <el-menu-item index="/publishmanage">
      <i class="el-icon-s-open"></i>
      <span slot="title">发布管理</span>
    </el-menu-item>
    <el-menu-item index="/errormsgmanage">
      <i class="el-icon-s-release"></i>
      <span slot="title">线上错误信息管理</span>
    </el-menu-item>
    <el-menu-item index="/logmanage">
      <i class="el-icon-search"></i>
      <span slot="title">线上日志查询</span>
    </el-menu-item>
  </el-menu>

</template>

<script>
export default {
    name: "RhHeaderMenu",
    data(){
      return {
        activeIndex: "/"
      }
    }

}
</script>

<style scope>
.el-menu{
  border: none;
}

</style>
