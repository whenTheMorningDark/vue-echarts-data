<template>
  <div :id="id" :style="cStyle"></div>
</template>

<script>
import initMixins from "./mixins/init";
export default {
  mixins: [initMixins],
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    cStyle () {
      return {
        width: 300 + "px",
        height: 300 + "px"
      }
    }
  }
};
</script>

<style>
</style>