<template>
  <el-dialog :title="dialogTile" :visible.sync="dialogVisible" append-to-body="true">
    <slot name="dialogContent"></slot>
  </el-dialog>
</template>

<script>
  export default {
    name: 'CommonDialog',
    data () {
      return {
      }
    }, props: {
      dialogTile: {
        type: String,
      },
      dialogVisible: {
        type: Boolean,
      }
    }, mounted () {
    }
  }
</script>

<style scoped>

</style>
