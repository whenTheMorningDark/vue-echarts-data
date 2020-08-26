<template>
  <div class="tree-box">
    <div class="tree-box-wrapper">
      <vdr
        v-for="item in listData"
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
    <tree-list :listData="subMenu" v-if="subMenu && subMenu.length>0"></tree-list>
    <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu(item)">
      <v-contextmenu-item @click="delFun(item)">删除</v-contextmenu-item>
      <v-contextmenu-item @click="group">组合</v-contextmenu-item>
    </v-contextmenu>
    <!-- <vdr
      v-for="item in listData"
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
      <slot>
        <echartComponent
          :id="item.id"
          ref="echartComponent"
          :optionsData="item.optionsData"
          :item="item"
          :key="item.id"
          v-if="item.optionsData"
        ></echartComponent>
      </slot>
      <div v-if="item.children" style="position:absolute;left:0;top:0">
        <tree-list :listData="item.children" v-bind="$attrs" v-on="$listeners"></tree-list>
      </div>
      <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu(item)">
        <v-contextmenu-item @click="delFun(item)">删除</v-contextmenu-item>
        <v-contextmenu-item @click="group">组合</v-contextmenu-item>
      </v-contextmenu>
    </vdr>-->
  </div>
</template>

<script>
import echartComponent from "../echartComponent/echartTemplate"
export default {
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    isGroupDisable: {
      type: Boolean,
      default: true
    }
  },
  name: "TreeList",
  computed: {
    subMenu () {
      if (this.listData.length === 0) {
        return []
      }
      if (this.listData[0].children && this.listData[0].children.length > 0) {
        return this.listData[0].children
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
      item: null,
      treeData: this.listData,

    }
  },
  methods: {
    setTreeData (data) {
      console.log(data)
      this.treeData = data
      this.$nextTick(() => {
        console.log(this.getEchartComponents())
        let echartsComponent = this.$refs.vdr
        console.log(echartsComponent)
        // echartsComponent.forEach(v => {
        //   v.resizeFun()
        // })
      })
      // let echartsComponent = this.getEchartComponents()
      // echartsComponent.forEach(v => {
      //   v.myChart.resize()
      // })
    },
    // 组合方法
    group () {
      // console.log("group")
      this.$emit("group")
    },
    parentCls (item) {
      if (item.pId === 0) {
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
