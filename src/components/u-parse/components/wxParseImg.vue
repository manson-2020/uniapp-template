<template>
  <image :mode="node.attr.mode" :lazy-load="node.attr.lazyLoad" :class="node.classStr" :style="node.styleStr"
    :data-src="node.attr.src" :src="node.attr.src" @click="wxParseImgTap" />
</template>

<script>
export default {
  name: 'wxParseImg',
  data() {
    return {
      preview: true,
    };
  },
  props: {
    node: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    wxParseImgTap(e) {
      if (!this.preview) return;
      const { src } = e.currentTarget.dataset;
      if (!src) return;
      let parent = this.$parent;
      while (!parent.preview || typeof parent.preview !== 'function') {// TODO 遍历获取父节点执行方法
        parent = parent.$parent;
      }
      parent.preview(src, e);
    },
  },
};
</script>

<style scoped>
image {
  vertical-align: middle;
  margin: 18px;
  transform: scale(2.5);
}
</style>