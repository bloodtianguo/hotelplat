<template>
  <div class="app-container" v-if="tableData.length>0">
    <el-card shadow="hover" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span>公会主播获取打赏找票（未分账）排名</span>
      </div>
      <div class="tab_box"> 
        <el-table
          :data="tableData"
          v-loading="loading"
          element-loading-text="数据加载中"
          max-height="570"
          height="570"
          :header-cell-style="{background:'#7DC692',color:'#fff'}"
          :default-sort="{ prop: 'monthUp', order: 'descending' }"
          @sort-change="clicksort"
        >
          <el-table-column
            :prop="lable.pro"
            align="center"
            :resizable="false"
            :label="lable.labels"
            v-for="(lable, index) in tablist"
            :key="index"
          >
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            label="上月涨幅"
            prop="monthUp"
            :resizable="false"
            sortable
            align="center"
          >
            <template slot-scope="scope">
              <div class="up">
                {{ scope.row.monthUp }}%
                <span v-show="scope.row.monthUp > 0" class="svg-container">
                  <svg-icon icon-class="riseShang" />
                </span>
                <span v-show="scope.row.monthUp < 0" class="svg-container">
                  <svg-icon icon-class="declineXia" />
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { guildAnchorRank } from '@/api/guild/anchor'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      loading: true,
      tablist: [
        { pro: "rank", labels: "排名" },
        { pro: "guildName", labels: "公会名称" },
        { pro: "name", labels: "主播昵称" },
        { pro: "nums", labels: "找票打赏" },
      ],
      searchData: {
        sort: "0"
      },
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      guildAnchorRank(this.searchData).then(response => {
        if (response.code == "0") {
          this.tableData = response.data.map(item => {
            if (item.ranges == "") {
              item.ranges = "--"
            }
            return item
          })
        }
        this.loading = false
      })
    },
    // 排序  ascending:升序 descending:降序
    clicksort(column) {
      var arrFirst = [];
      var arrSecond = [];
      var arrLast = [];
      arrFirst = this.tableData.filter(item => {
        return item.monthUp
      })
      arrSecond = this.tableData.filter(item => {
        return item.monthUp == ""
      })
      if (column.order == "ascending") {
        arrLast = this.sortFunallrise("monthUp", arrFirst)
      } else if (column.order == "descending") {
        arrLast = this.sortFunalldrop("monthUp", arrFirst)
      } else {
        arrLast = arrFirst
      }
      if (arrSecond.length > 0) {
        this.tableData = [...arrLast, arrSecond]
      } else {
        this.tableData = arrLast
      }
    }
  }
}
</script>
