<template>
  <div class="tree-box">
    <vdr
      v-for="item of listData"
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
    >
      <slot>
        <echartComponent :id="item.id" ref="echartComponent" :optionsData="item.optionsData"></echartComponent>
      </slot>
      <div v-if="item.children">
        <tree-list :listData="item.children" v-bind="$attrs" v-on="$listeners"></tree-list>
      </div>
      <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu(item)">
        <v-contextmenu-item @click="delFun(item)">删除</v-contextmenu-item>
      </v-contextmenu>
    </vdr>
  </div>
</template>

<script>
import echartComponent from "../echartComponent/echartTemplate"
export default {
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  name: "TreeList",
  components: {
    echartComponent
  },
  data () {
    return {
      preventActiveBehavior: true,
      timer: null,
      item: null
    }
  },
  methods: {
    getEchartComponents () {
      return this.$refs.echartComponent
    },
    onResize (x, y, width, height) {
      this.item = Object.assign(this.item, { x, y, width, height });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit("onResize", this.item);
      }, 200);
      // throttle(this.emitFun(this.item), 2300);
    },
    onDrag (x, y) {
      console.log("onDrag");
      this.item = Object.assign(this.item, { x, y });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit("onDrag", this.item);
      }, 200);
    },
    // 选中的状态
    onActivated (item) {
      console.log("onActivated");
      this.item = item
      this.$emit("onActivated", item);
    },
    handleContextmenu (item) {
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
  margin: 20px auto;
  display: flex;
}
.item {
  padding: 10px;
}
</style>
