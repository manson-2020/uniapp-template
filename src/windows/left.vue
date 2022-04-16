<template>
  <scroll-view
    class="bgc-4"
    scroll-y
    :style="{
      height: `calc(100vh - var(--top-window-height))`,
      borderRight: `1px solid #ebebeb`,
      width: `240px`,
    }"
  >
    <uni-collapse :accordion="true">
      <uni-collapse-item
        v-for="(menu, menuIndex) in menuItems"
        :key="menuIndex"
        :disabled="menu.disabled"
        titleBorder="none"
        :showArrow="!!menu.children"
        :open="!!menu.open"
      >
        <template v-slot:title>
          <label
            @click="onClickItems({ menuIndex })"
            class="height-110"
            :style="{
              padding: `0 20px`,
              filter: menu.disabled ? `opacity(60%)` : 'unset',
            }"
          >
            <uni-icons
              :type="menu.icon"
              :color="$route.path === menu.url ? '#007aff' : '#333'"
              size="18"
            />
            <text
              :class="[
                `ml-10 fs-28`,
                `color-${$route.path === menu.url ? '007aff' : '333'}`,
              ]"
            >
              {{ menu.title }}
            </text>
          </label>
        </template>
        <label
          v-for="(item, itemIndex) in menu.children"
          :key="itemIndex"
          @click="onClickItems({ menuIndex, itemIndex })"
          class="height-110 bgc-3"
          :style="{ padding: `0 20px 0 36px` }"
        >
          <uni-icons
            :type="item.icon"
            :color="$route.path === item.url ? '#007aff' : '#333'"
            size="15"
          />
          <text
            :class="[
              `ml-10 fs-28`,
              `color-${$route.path === item.url ? '007aff' : '333'}`,
            ]"
          >
            {{ item.title }}
          </text>
        </label>
      </uni-collapse-item>
    </uni-collapse>
  </scroll-view>
</template>

<script lang="ts">
  export default {
    data: () => ({
      menuItems: [
        {
          icon: "star-filled",
          title: "系统管理",
          open: false,
          children: [
            {
              icon: "list",
              title: "管理菜单",
              url: "/pages/admin/index",
            },
            {
              icon: "list",
              title: "管理菜单",
              url: "/pages/admin/index1",
            },
            {
              icon: "list",
              title: "管理菜单",
              url: "/pages/admin/index2",
            },
          ],
        },
        {
          icon: "star-filled",
          title: "订单管理",
          children: [
            {
              icon: "list",
              title: "管理菜单",
              url: "/pages/admin/index3",
            },
            {
              icon: "list",
              title: "管理菜单",
              url: "/pages/admin/index4",
            },
            {
              icon: "list",
              title: "管理菜单",
              url: "/pages/admin/index5",
            },
          ],
        },
        {
          icon: "star-filled",
          title: "权限管理",
          disabled: true,
          children: [
            {
              icon: "list",
              title: "管理菜单",
              url: "/pages/admin/index",
            },
          ],
        },
        {
          icon: "star-filled",
          title: "用户管理",
          url: "/pages/admin/index6",
        },
      ],
    }),
    methods: {
      onClickItems({
        menuIndex,
        itemIndex,
      }: {
        menuIndex: number;
        itemIndex: number | void;
      }) {
        if (this.menuItems[menuIndex].children && typeof itemIndex !== "number")
          return;

        const url =
          typeof itemIndex === "number"
            ? (<Array<any>>this.menuItems)[menuIndex].children[itemIndex].url
            : this.menuItems[menuIndex].url;

        uni.navigateTo({ url });
      },
    },
  };
</script>

<style lang="scss" scoped>
  // scss
</style>