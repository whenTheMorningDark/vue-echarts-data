<template>
  <div class="echarts-wrapper">
    <div class="left-container">
      <toolbar :rightBtn="rightBtn" :targetFunScreen="targetFunScreen"></toolbar>
      <div class="add-wrapper" @drop="drop" @dragover="allowDrop" ref="addWrapper" id="addWrapper">
        <template v-if="cResizeBox.length>0">
          <recursionItem
            v-for="item in cResizeBox"
            :key="item.id"
            :item="item"
            @onActivated="onActivated"
            @group="groupFun"
            @unGroup="unGroupFun"
            @handleContextmenu="handleContextmenu"
          ></recursionItem>
        </template>
      </div>
    </div>
    <div class="right-container">
      <rightTool></rightTool>
    </div>
  </div>
</template>
<script>
import toolbar from "./components/toolBar";
// import echartTemplate from "./echartComponent/echartTemplate";
// import resizeBox from "./components/resizeBox";
import { randomStr } from "@/utils";
import rightTool from "./rightTool/index";
import History from "./utils/history";
import event from "./utils/event";
import menu from "./utils/menu";
// import Group from "./components/group"
import recursionItem from "./components/recursionItem"
export default {
  name: "echarts",
  mixins: [event, menu],
  components: {
    toolbar,
    // echartTemplate,
    // resizeBox,
    rightTool,
    // Group,
    recursionItem
  },
  provide () {
    return {
      root: this
    };
  },
  computed: {
    currentSelectArr () {
      return this.findReseverTree(this.resizeBox, "active", true);
    },
    cResizeBox () {
      console.log(this.resizeBox)
      return this.resizeBox
    }
  },
  created () {
    this.$nextTick(() => {
      // console.log(document.getElementById("addWrapper"))
      this.targetFunScreen = document.getElementById("addWrapper")
    })
  },
  data () {
    return {
      resizeBox: [],
      currentId: "", // 当前操作的id
      targetEchart: null, // 当前操作的echart对象
      stack: new History(), // 历史记录栈对象
      rightBtn: [ // toolbar右侧按钮
        { text: "回撤", icon: "el-icon-refresh-right", func: this.cancelFun },
        { text: "前进", icon: "el-icon-refresh-left", func: this.uncancel },
        { text: "全选", icon: "el-icon-crop", func: this.selectAllFun },
        { text: "全不选", icon: "el-icon-crop", func: this.cancelSelectAllFun }
      ],
      flag: false,
      currentItem: {}, // 当前的对象
      targetFunScreen: null,
      groupData: []
      // groupData: [
      //   { x: 100, y: 100, w: 500, h: 200, groupChildren: [{ x: 120, y: 110, w: 100, h: 100 }] },
      //   { x: 400, y: 350, w: 200, h: 200, groupChildren: [] }
      // ] // 组合的数据
    };
  },
  methods: {
    allowDrop (ev) {
      ev.preventDefault();
    },
    // 放置后触发事件
    async drop (ev) {
      let ele = this.$refs.addWrapper;
      let elex = ele.getBoundingClientRect().x;
      let eley = ele.getBoundingClientRect().y;
      let { x, y } = ev;
      let uid = randomStr(8);
      ev.preventDefault();
      var data = JSON.parse(ev.dataTransfer.getData("data"));
      let styleOption = { x: x - elex, y: y - eley, id: uid, optionsData: data.optionsData };
      let boxOptions = Object.assign({ x: 0, y: 0, width: 300, height: 300 }, styleOption);
      let id = await this.createEchart(boxOptions);
      console.log(id)
      console.log(this.resizeBox)
      // let echartsComponents = this.$refs.echartComponent;
      // let targetEchart = echartsComponents.find(v => v.id === id);
      // this.$store.commit("echart/setEchartArr", echartsComponents); // 设置当前echart对象集合
      // targetEchart.resizeFun();
    },
    // 创建图形
    createEchart (boxOptions) {
      return new Promise((resolve => {
        this.resizeBox.push({
          ...boxOptions,
          active: false, // 活跃状态
          isGroup: false, // 是否已经组合了
          pId: 0
        });
        // console.log(this.stack);
        this.stack.setState(this.resizeBox); // 设置历史记录
        resolve(boxOptions.id);
      }));
    },
    onResize (data) { // 处理resize变化后的图形
      this.$nextTick(() => {
        if (!data || Object.keys(data).length === 0) {
          data = this.currentItem;
        }
        if (this.currentId.length === 0 || this.currentId !== data.id || this.targetEchart === null) {
          this.currentId = data.id;
          this.targetEchart = this.$refs.echartComponent.find(v => v.id === data.id);
        }
        this.targetEchart.resizeFun();
        this.stack.setState(this.resizeBox); // 设置历史记录
        // this.$store.commit("echart/setCurrentTarget", data);
      });
    },
    // 处理拖拽后的图形
    onDragFun (data) {
      console.log('处理拖拽后的图形', data)
      this.stack.setState(this.resizeBox); // 设置历史记录
      // this.$store.commit("echart/setCurrentTarget", data);
    },
    // 选中元素
    onActivated (data) {
      console.log('选中的元素', data)
      this.currentItem = data;
    },
    // 删除的方法
    delFun () {
      this.resizeBox = this.resizeBox.filter(v => !v.active);
      this.stack.setState(this.resizeBox); // 设置历史记录
    },
    // 处理前进和撤销共同方法
    commCancelGoFun (replaceArr) {
      this.currentId = "";
      if (replaceArr && replaceArr.length >= 0) {
        this.resizeBox = replaceArr;
        this.$nextTick(() => {
          this.$refs.echartComponent.forEach(v => {
            v.resizeFun();
          });
        });
      }
    },
    // 撤销方法
    cancelFun () {
      let replaceArr = this.stack.replaceState();
      this.commCancelGoFun(replaceArr);
    },
    // 前进方法
    uncancel () {
      let replaceArr = this.stack.unReplaceState();
      this.commCancelGoFun(replaceArr);
    },
    // 菜单事件
    handleContextmenu (item) {
      console.log('菜单事件', item);
      // console.log(this.currentSelectArr);
      this.currentItem = item;
      // this.$store.commit("echart/setCurrentTarget", item);
    },
    // 全选
    selectAllFun () {
      // this.flag = !this.flag;
      this.resizeBox.forEach(v => {
        this.$set(v, "active", true);
      });
      console.log(this.resizeBox);
    },
    // 全不选
    cancelSelectAllFun () {
      this.resizeBox.forEach(v => {
        this.$set(v, "active", false);
      });
    },
    // 点击addWrapper状态都为false,点击当前resizeBox的active则为true,其它为false
    addWrapperMouseDownFun (e) { // 如果是ctrl+左健的情况
      console.log(e);
      if (e.button === 0 && e.ctrlKey) {
        console.log("c+");
        console.log(this.resizeBox);
      } else if (e.button === 2 && !e.ctrlKey) { // 只是单纯的右键情况
        setTimeout(() => {
          console.log("右键")
          console.log(this.currentItem)
          this.reseverTree(this.resizeBox, "active", false)
          this.$set(this.currentItem, "active", true);
          this.$store.commit("echart/setCurrentTarget", this.currentItem);
        }, 200)
      } else {
        if (e.button === 0 && e.target.className !== "add-wrapper") { // 点击是图形的情况
          console.log(e)
          setTimeout(() => {
            console.log(this.currentItem)
            this.reseverTree(this.resizeBox, "active", false)
            this.$set(this.currentItem, "active", true);
            this.$store.commit("echart/setCurrentTarget", this.currentItem);
          }, 200)
        } else if (e.button === 0 && e.target.className === "add-wrapper") { // 只是点击空白addWrapper的情况
          console.log("只是点击空白addWrapper的情况");
          this.reseverTree(this.resizeBox, "active", false)
          this.currentItem = {};
          this.$store.commit("echart/setCurrentTarget", this.currentItem);
        }
      }

    }
  },
  mounted () {
    this.stack.setState(this.resizeBox);
    let el = this.$refs.addWrapper;
    el.addEventListener("mousedown", this.addWrapperMouseDownFun);
  },
  destroyed () {
    let el = this.$refs.addWrapper;
    el.removeEventListener("mousedown", this.addWrapperMouseDownFun);
  }
};
</script>
<style lang="scss" scoped>
.echarts-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  .left-container {
    width: calc(100% - 280px);
    height: 100%;
    margin-right: 20px;
    .add-wrapper {
      // width: 220px;
      width: 100%;
      height: calc(100% - 30px);
      position: relative;
    }
  }
  .right-container {
    width: 300px;
    height: 100%;
  }
}
</style>
