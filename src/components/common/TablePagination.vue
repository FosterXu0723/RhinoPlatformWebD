<template>
  <el-row type="flex" justify="end">
    <div class="table-page">
      <el-pagination
        @size-change="handleNumberChange"
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-row>
</template>

<script>
  export default {
    name: "RhPagination",
    props: {
      currentPage: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 10
      },
      pageSizes: {
        type: Array,
        default: function () {
          return [5, 10, 20, 50, 100]
        }
      },
      total: {
        type: Number,
        default: 0
      },
    },
    methods: {
      handleNumberChange: function (size) {
        this.$emit('handleNumberChange', size)
      },
      handlePageChange(current) {
        this.$emit('handlePageChange', current)
      }
    }
  }
</script>

<style scoped>
  .table-page {
    padding-top: 20px;
  }
</style>