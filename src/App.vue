/* eslint-disable */
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import Menu from 'components/common/Menu'

  export default {
    name: 'App',
    data () {
      return {
        userid: 'username'
      }
    },
    components:{
      Menu
    },
    computed: {
      userId () {
        // this.$route 当前那个路由处于活跃状态就表示对象
        return this.$route.params.userid
      }
    },
    methods: {
    }
  }
</script>

<style>
.el-container {
  padding: 0px;
  margin: 0px;
  height: 100%;
}
</style>
/* eslint-disable */
