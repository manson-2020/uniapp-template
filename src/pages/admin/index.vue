<template>
  <view>
    <view
      class="fd-row jc-end pl-30 pr-30 ai-center height-110 oh"
      :style="{ borderBottom: `1px #f5f5f5 solid` }"
    >
      <view class="fd-row ai-center">
        <input
          class="fs-24 height-60 br-6"
          type="text"
          :style="{ border: `1px #dcdfe6 solid`, padding: `0 20rpx` }"
          v-model="searchVal"
          @confirm="search"
          placeholder="请输入搜索内容"
          placeholder-class="color-999"
        />
        <button
          class="fs-24 ml-20 bgc-transparent color-606266 lh-60 br-6"
          :style="{ border: `1px solid #dcdfe6` }"
          :plain="true"
          @click="search"
        >
          搜索
        </button>
        <button
          class="fs-24 ml-20 bgc-transparent color-606266 lh-60 br-6"
          :style="{ border: `1px solid #dcdfe6` }"
          :plain="true"
        >
          新增
        </button>
        <button
          class="fs-24 ml-20 bgc-transparent color-606266 lh-60 br-6"
          :style="{ border: `1px solid #dcdfe6` }"
          :plain="true"
          @click="delTable"
        >
          删除
        </button>
      </view>
    </view>
    <view :style="{ padding: `30rpx` }">
      <uni-table
        :loading="loading"
        border
        stripe
        type="selection"
        emptyText="暂无更多数据"
        @selection-change="selectionChange"
      >
        <uni-tr>
          <uni-th width="150" align="center">日期</uni-th>
          <uni-th width="150" align="center">姓名</uni-th>
          <uni-th align="center">地址</uni-th>
          <uni-th width="204" align="center">设置</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in tableData" :key="index">
          <uni-td>{{ item.date }}</uni-td>
          <uni-td>
            <text>{{ item.name }}</text>
          </uni-td>
          <uni-td>{{ item.address }}</uni-td>
          <uni-td>
            <view class="fd-row">
              <button class="bgc-409eff fs-24" size="mini" type="primary">
                修改
              </button>
              <button class="bgc-f56c6c fs-24" size="mini" type="warn">
                删除
              </button>
            </view>
          </uni-td>
        </uni-tr>
      </uni-table>
      <uni-pagination
        class="mt-60"
        show-icon
        :page-size="pageSize"
        :current="pageCurrent"
        :total="total"
        @change="change"
      />
    </view>
  </view>
</template>

<script>
  import tableData from "../../static/tableData";
  export default {
    data() {
      return {
        searchVal: "",
        tableData: [],
        // 每页数据量
        pageSize: 10,
        // 当前页
        pageCurrent: 1,
        // 数据总量
        total: 0,
        loading: false,
      };
    },
    onLoad() {
      this.selectedIndexs = [];
      this.getData(1);
    },
    methods: {
      // 多选处理
      selectedItems() {
        return this.selectedIndexs.map((i) => this.tableData[i]);
      },
      // 多选
      selectionChange(e) {
        console.log(e.detail.index);
        this.selectedIndexs = e.detail.index;
      },
      //批量删除
      delTable() {
        console.log(this.selectedItems());
      },
      // 分页触发
      change(e) {
        this.getData(e.current);
      },
      // 搜索
      search() {
        this.getData(1, this.searchVal);
      },
      // 获取数据
      getData(pageCurrent, value = "") {
        this.loading = true;
        this.pageCurrent = pageCurrent;
        this.request({
          pageSize: this.pageSize,
          pageCurrent: pageCurrent,
          value: value,
          success: (res) => {
            // console.log('data', res);
            this.tableData = res.data;
            this.total = res.total;
            this.loading = false;
          },
        });
      },
      // 伪request请求
      request(options) {
        const { pageSize, pageCurrent, success, value } = options;
        let total = tableData.length;
        let data = tableData.filter((item, index) => {
          const idx = index - (pageCurrent - 1) * pageSize;
          return idx < pageSize && idx >= 0;
        });
        if (value) {
          data = [];
          tableData.forEach((item) => {
            if (item.name.indexOf(value) !== -1) {
              data.push(item);
            }
          });
          total = data.length;
        }

        setTimeout(() => {
          typeof success === "function" &&
            success({
              data: data,
              total: total,
            });
        }, 500);
      },
    },
  };
</script>

<style>
  /* #ifndef H5 */
  page {
    padding-top: 85px;
  }
  /* #endif */
</style>
