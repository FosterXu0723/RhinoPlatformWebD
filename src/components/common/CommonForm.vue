<template>
    <!--是否行内表单-->
    <el-form :inline="inline" :model="form" :ref="formName" label-width="100px" :rules="formRules">
      <!--标签显示名称-->
      <el-form-item v-for="item in formLabel" :key="item.model" :label="item.label" :rules="formRules[item.label]" :prop="item.model">
        <!--根据type来显示是什么标签-->
        <el-input v-model="form[item.model]" :placeholder="'请输入' + item.label" v-if="item.type==='input'"></el-input>
        <el-select v-model="form[item.model]" placeholder="请选择" v-if="item.type === 'select'">
          <!--如果是select或者checkbox 、Radio就还需要选项信息-->
          <el-option v-for="item in item.opts" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-switch v-model="form[item.model]" v-if="item.type === 'switch'"></el-switch>
        <el-date-picker v-model="form[item.model]" type="date" placeholder="选择日期" v-if="item.type === 'date'" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <!--留一个插槽-->
      <el-form-item><slot></slot></el-form-item>
    </el-form>
</template>
<script>
export default {
    name: "RhForm",
    props: {
      inline: Boolean,
      form: Object,
      formLabel: Array,
      formRules:{
          type: Object,
          default: ()=>{}
      },
      formName: String
    },
    methods:{
      validdateForm(){
        let flag = null;
        this.$refs['form'].validate(valid =>{
          if(valid){
            flag = true;
          }else{
            flag = false;
            this.$message.error("保存信息不完整，请继续填写完整");
          }
        });
        return flag
      }
    }

}
</script>

<style scoped>

</style>