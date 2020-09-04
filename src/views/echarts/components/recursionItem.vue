<template>
  <div class="tree-box">
    <div class="tree-box-wrapper">
      <vdr
        :w="item.width"
        :h="item.height"
        :x="item.x"
        :y="item.y"
        :active.sync="item.active"
        :parent="'.add-wrapper'"
        :key="item.id"
        :prevent-deactivation="preventActiveBehavior"
        @activated="onActivated(item)"
        v-contextmenu:contextmenu
        @dragging="onDrag"
        @resizing="onResize"
        :class="parentCls(item)"
        ref="vdr"
      >
        <echartComponent
          :id="item.id"
          ref="echartComponent"
          :optionsData="item.optionsData"
          :item="item"
          :key="item.id"
          v-if="item.optionsData"
        ></echartComponent>
      </vdr>
    </div>
    <template v-if="item.children && item.children.length>0">
      <!-- <span>12312312312</span> -->
      <tree-list
        :item="sItem"
        v-for="sItem in item.children"
        :key="sItem.id"
        @handleContextmenu="childHandleContextmenu"
        @onActivated="childActivated"
      ></tree-list>
    </template>
    <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu(item)">
      <v-contextmenu-item @click="delFun(item)">删除</v-contextmenu-item>
      <v-contextmenu-item @click="group">组合</v-contextmenu-item>
      <v-contextmenu-item @click="unGroup">取消组合</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import echartComponent from "../echartComponent/echartTemplate"
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    isGroupDisable: {
      type: Boolean,
      default: true
    }
  },
  name: "TreeList",
  computed: {
    subMenu () {
      if (this.item && this.item.children > 0) {
        return this.item.children
      }
      return []

    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    echartComponent
  },
  data () {
    return {
      preventActiveBehavior: true,
      timer: null,
      treeData: this.listData,
    }
  },
  methods: {
    // 组合方法
    group () {
      // console.log("group")
      this.$emit("group")
    },
    // 取消组合
    unGroup () {
      console.log("unGroup")
      this.$emit("unGroup")
    },
    parentCls (item) {
      if (item.children && item.children.length > 0) {
        return "parentCls"
      }
      return "childCls"
    },
    getEchartComponents () {
      return this.$refs.echartComponent
    },
    onResize (x, y, width, height) {
      this.item = Object.assign(this.item, { x, y, width, height });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let id = this.item.id
        this.$store.commit("echart/setResizeFun", id)
        this.$emit("onResize", this.item);
      }, 200);
    },
    onDrag (x, y) {
      console.log("onDrag");
      this.item = Object.assign(this.item, { x, y });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        console.log(this.item)
        this.$emit("onDrag", this.item);
      }, 200);
    },
    // 选中的状态
    onActivated (item) {
      console.log(item)
      this.$emit("onActivated", item);
    },
    childActivated (item) {
      console.log(item)
      this.$emit("onActivated", item);
    },
    childHandleContextmenu (item) {
      this.$emit("handleContextmenu", item);
    },
    handleContextmenu (item) {
      console.log(item)
      this.$emit("handleContextmenu", item);
    },
    // 删除方法
    delFun (item) {
      this.$emit("delFun", item);
    },
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  /* display: flex; */
  position: absolute;
  left: 0;
  top: 0;
}
.item {
  padding: 10px;
}
.parentCls {
  background: red;
  z-index: 1 !important;
}
.childCls {
  z-index: 3 !important;
}
</style>
