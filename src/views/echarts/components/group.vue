<template>
  <div class="group">
    <div
      class="group-item"
      v-for="(item,index) in groupData"
      :key="index"
      :style="itemStyle(item)"
      @click="groupItemClick(item)"
      :class="{active:item.active}"
      v-contextmenu:contextmenu
    >
      <!-- <div v-if="item.groupChildren && item.groupChildren.length>0">
        <group :groupData="item.groupChildren"></group>
      </div>-->
      <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu(item)">
        <v-contextmenu-item @click="unGroupFun">取消组合</v-contextmenu-item>
      </v-contextmenu>
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
    },
    groupItemClick (item) {
      console.log(item)
      // item.active = true
      this.$set(item, "active", true)
      this.$store.commit("echart/setCurrentTarget", item);
    },
    // 右键菜单
    handleContextmenu (item) {
      console.log(item)
      // this.$emit("handleContextmenu", this.item);
      // console.log(this.item)
      this.$set(item, "active", true)
      // this.$store.commit("echart/setCurrentTarget", this.item);
    },
    // 取消组合
    unGroupFun () {

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
    &.active {
      border: 1px solid black;
    }
  }
}
</style>
