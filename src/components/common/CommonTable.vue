<template>
    <el-table :data='tableData' empty-text="暂无数据" highlight-current-row>
        <el-table-column v-for="(item,index) in tableLabel"
        :key="index"
        :label="item.label"
        :prop="item.param"
        :fixed="item.fixed"
        :align="item.align ? item.align : 'center'"
        :formatter="item.formater"
        :min-width="item.width"
        :show-overflow-tooltip="true"></el-table-column>
        <el-table-column :fixed="tableOption.fixed" :label="tableOption.label">
            <template slot-scope="scope">
                <el-button v-for="(item,index) in tableOption.options"
                :key="index"
                :type="item.type"
                size="mini"
                :icon="item.icon"
                @click="handleButton(item.methods,scope.row)">
                {{item.label}}
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: "RhTable",
    props:{
        tableData:{
            type: Array,
            default:()=>{}
        },
        tableLabel:{
            type: Array,
            default:()=>{}
        },
        tableOption:{
            type: Object,
            default:()=>{}
        }
    },
    methods:{
        handleButton(methods, row){
            this.$emit('handleButton',{"methods":methods,"row":row})
        }
    }
    
}
</script>
<style scope>

</style>