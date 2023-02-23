<template>
  <view :class="[theme, `fd-row`]">
    <view v-for="(col, colIndex) in columns" :key="colIndex" class="f1">
      <u-image v-for="(img, imgIndex) in columns[colIndex]" :key="imgIndex" @click="previewImg(img)" :src="img.src"
        width="100%" mode="widthFix" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useMapState } from "@/common/libs/store";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const { theme } = useMapState(["theme"]);


let column;
const { windowWidth } = uni.getSystemInfoSync();
switch (true) {
  case windowWidth <= 750:
    column = 2;
    break;
  case windowWidth <= 1080:
    column = 3;
    break;
  case windowWidth <= 1200:
    column = 4;
    break;
  case windowWidth <= 1500:
    column = 5;
    break;
  case windowWidth <= 1920:
    column = 6;
    break;
  case windowWidth > 1920:
    column = 7;
    break;
  default:
    column = 1;
    break;
}

const columns = reactive<any[][]>(Array(column).fill(null).map(() => [])),
  columnsHeight = Array(column).fill(0);

function setColumnsData() {
  uni.showToast({ title: "loading...", icon: "loading" });
  setTimeout(() => {
    const list = [
      {
        "src": "https://pic4.zhimg.com/v2-e24c8f459f085df6469421a40e3aad22_r.jpg?source=1940ef5c",
        width: 2667,
        height: 4000
      },
      {
        "src": "https://pic2.zhimg.com/v2-a2efccd2c99cf699bd7a0d1f155f19f6_r.jpg",
        width: 2304,
        height: 4096
      },
      {
        "src": "https://pic4.zhimg.com/v2-82511e3a09c75d8d5119b5657ada5307_r.jpg?source=1940ef5c",
        width: 1280,
        height: 2276
      },
      {
        "src": "https://pic1.zhimg.com/v2-3caef93a3857b4f3b8d0e91941ecb165_r.jpg",
        width: 1920,
        height: 1080
      },
      {
        "src": "https://img.zmtc.com/2019/0726/20190726090744436.jpg",
        width: 1125,
        height: 2436
      },
      {
        "src": "https://pic4.zhimg.com/v2-d877a40b104fb966a750809d57788d73_r.jpg?source=1940ef5c",
        width: 1242,
        height: 2688
      },
      {
        "src": "https://pic3.zhimg.com/v2-11bd579ef0360e711aa7d39f1d6fb5bc_r.jpg?source=1940ef5c",
        width: 4000,
        height: 6000
      },
      {
        "src": "https://pic4.zhimg.com/v2-82511e3a09c75d8d5119b5657ada5307_r.jpg?source=1940ef5c",
        width: 1280,
        height: 2276
      },
      {
        "src": "https://pic1.zhimg.com/v2-3caef93a3857b4f3b8d0e91941ecb165_r.jpg",
        width: 1920,
        height: 1080
      },
      {
        "src": "https://pic2.zhimg.com/v2-a2efccd2c99cf699bd7a0d1f155f19f6_r.jpg",
        width: 2304,
        height: 4096
      },
      {
        "src": "https://pic4.zhimg.com/v2-82511e3a09c75d8d5119b5657ada5307_r.jpg?source=1940ef5c",
        width: 1280,
        height: 2276
      },
      {
        "src": "https://pic4.zhimg.com/v2-e24c8f459f085df6469421a40e3aad22_r.jpg?source=1940ef5c",
        width: 2667,
        height: 4000
      },
      {
        "src": "https://pic2.zhimg.com/v2-a2efccd2c99cf699bd7a0d1f155f19f6_r.jpg",
        width: 2304,
        height: 4096
      },
      {
        "src": "https://pic4.zhimg.com/v2-82511e3a09c75d8d5119b5657ada5307_r.jpg?source=1940ef5c",
        width: 1280,
        height: 2276
      },
      {
        "src": "https://pic4.zhimg.com/v2-82511e3a09c75d8d5119b5657ada5307_r.jpg?source=1940ef5c",
        width: 1280,
        height: 2276
      },
    ];
    list.forEach(img => {
      const minColIndex = columnsHeight.findIndex(height => height === Math.min(...columnsHeight));
      columns[minColIndex].push(img);
      columnsHeight[minColIndex] += 750 / img.width * img.height;
    });
    uni.hideToast();
  }, 100);
}

onLoad(setColumnsData);

onReachBottom(setColumnsData);

const previewImg = (img: any) => {
  uni.previewImage({ urls: [img.src] });
}

</script>


<style></style>