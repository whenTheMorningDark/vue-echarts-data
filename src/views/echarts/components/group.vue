<template>
  <div class="group">
    <div class="group-item" v-for="(item,index) in groupData" :key="index" :style="itemStyle(item)">
      <div v-if="item.groupChildren && item.groupChildren.length>0">
        <group :groupData="item.groupChildren"></group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupData: {
      type: Array,
      default: () => { [] }
    }
  },
  name: "group",
  methods: {
    itemStyle (item) {
      return {
        left: item.x + "px",
        top: item.y + "px",
        width: item.width + 'px',
        height: item.height + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.group {
  .group-item {
    position: absolute;
    background: #3a8ee6;
    z-index: 1;
  }
}
</style>
