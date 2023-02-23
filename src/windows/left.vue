<template>
  <view style="height: calc(100vh - var(--top-window-height)); padding: 15px 0 15px 15px;">
    <scroll-view class="bgc-primary br-12" style="max-height: 100%; border-right: 3px solid #0c1322;" scroll-y>
      <uni-collapse :accordion="true">
        <uni-collapse-item v-for="(menu, menuIndex) in menuItems" :key="menuIndex" :disabled="menu.disabled"
          titleBorder="none" :showArrow="!!menu.children" :open="!!menu.open">
          <template v-slot:title>
            <label @click="onClickItems({ menuIndex })" class="height-110" :style="{
              padding: `0 20px`,
              opacity: menu.disabled ? 0.6 : 1
            }">
              <uni-icons :type="menu.icon" :color="$route!.path.includes(menu.dir) ? '#0892f5' : '#fff'" size="18" />
              <text :class="[
                `ml-10 fs-28`,
                `color-${$route!.path.includes(menu.dir) ? 'primary' : 'inverse'}`,
              ]">
                {{ menu.title }}
              </text>
            </label>
          </template>
          <label v-for="(item, itemIndex) in menu.children" :key="itemIndex"
            @click="onClickItems({ menuIndex, itemIndex })" class="height-110 bgc-3"
            :style="{ padding: `0 20px 0 36px`, opacity: item.disabled ? 0.6 : 1 }">
            <uni-icons :type="item.icon" :color="$route!.path === item.dir + item.path ? '#007aff' : '#333'" size="15" />
            <text :class="[
              `ml-10 fs-28`,
              `color-${$route!.path === item.dir + item.path ? 'primary' : 'inverse'}`,
            ]">
              {{ item.title }}
            </text>
          </label>
        </uni-collapse-item>
      </uni-collapse>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    menuItems: [
      {
        icon: "star-filled",
        title: "系统管理",
        open: true,
        dir: "/pages/admin",
        children: [
          {
            icon: "list",
            title: "管理菜单",
            dir: "/pages/admin",

            path: "/index",
          },
          {
            disabled: true,
            icon: "list",
            title: "管理菜单",
            dir: "/pages/admin",
            path: "/index1",
          },
          {
            icon: "list",
            title: "管理菜单",
            dir: "/pages/admin",
            path: "/index2",
          },
        ],
      },
    ] as any[],
  }),
  methods: {
    onClickItems({ menuIndex, itemIndex }: { menuIndex: number; itemIndex?: number; }) {
      const menu = this.menuItems[menuIndex];
      if (menu.disabled) return;
      const { path: routePath } = this.$route!;
      if (itemIndex === undefined) {
        let url = menu.dir + menu.path;
        url !== routePath && uni.navigateTo({ url, success: () => uni.hideLeftWindow({}) });
        return;
      };
      const item = menu.children![itemIndex];
      if (item.disabled) return;
      const url = item.dir + item.path;
      url !== routePath && uni.navigateTo({ url, success: () => uni.hideLeftWindow({}) });
    },
  },
});
</script>

<style lang="scss" scoped>
// scss
::v-deep {

  &.uni-collapse-item__wrap,

  &.uni-collapse {
    background-color: unset;
  }

  &.uni-collapse-item__wrap-content.uni-collapse-item--border {
    border-bottom-color: transparent;
  }
}
</style>