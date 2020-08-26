<template>
  <div :id="id" :style="cStyle"></div>
</template>

<script>
import initMixins from "./mixins/init";
export default {
  mixins: [initMixins],
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    cStyle () {
      return {
        width: this.item.width + "px",
        height: this.item.height + "px"
      }
    }
  }
};
</script>

<style>
</style>