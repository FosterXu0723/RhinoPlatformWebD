<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{cardName}}</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click.native="buttonBehavior">
        {{buttonName}}
      </el-button>
    </div>
    <common-table :tableData="tableData" :tableLabel="tableLabel" :tableOption="tableOption" @handleButton="handleButton"></common-table>
  </el-card>
</template>

<script>
import CommonTable from './CommonTable.vue'
export default {
  components: { CommonTable },
  name: 'RhCard',
  props:{
    cardName: {
      type: String
    },
    buttonName:{
      type: String
    },
    tableData: {
      type: Array,
      default: [
        {'label':"id",'param':''}
      ]
    },
    tableLabel:{
      type: Array
    },
    tableOption:{
      type: Object
    }
  },
  methods:{
    buttonBehavior(){
      this.$emit("buttonBehavior",)
    },
    handleButton(value){
      this.$emit("handleButton", value)
    }
  }
}
</script>

<style scoped>

</style>>
