<template>
  <view>
    <view class="fd-row jc-end pl-30 pr-30 ai-center height-110 oh" :style="{ borderBottom: `1px #f5f5f5 solid` }">
      <view class="fd-row ai-center">
        <uni-easyinput type="text" v-model="searchVal" @confirm="getData(1)" placeholder="请输入搜索内容"
          placeholder-class="color-5" />
        <button class="fs-24 ml-20 bgc-0 color-1 lh-60 br-6" :style="{ border: `1px solid #dcdfe6` }" :plain="true"
          @click="getData(1)">
          搜索
        </button>
        <button class="fs-24 ml-20 bgc-2 color-3 lh-60 br-6">
          新增
        </button>
        <button class="fs-24 ml-20 bgc-1 color-3 lh-60 br-6" @click="delTable" disabled>
          批量删除
        </button>
      </view>
    </view>
    <view :style="{ padding: `30rpx` }">
      <uni-table :loading="loading" border stripe type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
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
              <button class="bgc-2 fs-24" size="mini" type="primary">
                修改
              </button>
              <button class="bgc-1 fs-24" size="mini" type="warn">
                删除
              </button>
            </view>
          </uni-td>
        </uni-tr>
      </uni-table>
      <uni-pagination class="mt-60" show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
        @change="change" />
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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
      selectedIndexes: [],
    };
  },
  onLoad() {
    this.selectedIndexes = [];
    this.getData();
  },
  methods: {
    // 多选处理
    selectedItems() {
      return this.selectedIndexes.map((i) => this.tableData[i]);
    },
    // 多选
    selectionChange(e: any) {
      this.selectedIndexes = e.detail.index;
    },
    //批量删除
    delTable() {
      console.log(this.selectedItems());
    },
    // 分页触发
    change(e: any) {
      this.getData(e.current);
    },
    // 获取数据
    async getData(pageCurrent = 1) {
      this.loading = true;
      this.pageCurrent = pageCurrent;
      try {
        const {
          data: { list, total },
        }: any = await uni.request({
          url: "/data",
          data: {
            pageCurrent,
            pageSize: this.pageSize,
            keywords: this.searchVal,
          },
        });

        this.tableData = list;
        this.total = total;
        this.loading = false;
      } catch (error) { }
    },
  },
});
</script>

<style lang="scss">
page {
  padding-top: 15px;
}
</style>
