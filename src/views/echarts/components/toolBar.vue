<template>
  <div class="toolbar">
    <div class="left-toolbar">
      <el-popover placement="right" title="选择图表" width="800" trigger="hover">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane
            :label="item.label"
            :name="item.name"
            v-for="(item,index) in listData"
            :key="index"
          >
            <el-row :gutter="20">
              <el-col :span="6" v-for="(element,index) in item.children" :key="index">
                <div class="content-wrapper" @dragstart="drag($event,element)" draggable="true">
                  <div class="imgages" v-if="element.images">
                    <img :src="element.images" width="100%" height="140" />
                  </div>
                  <div>{{element.name}}</div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <div class="toolbar-item" slot="reference">
          <i class="el-icon-s-operation"></i>
        </div>
      </el-popover>
    </div>
    <div class="right-toolbar">
      <el-button
        v-for="item in rightBtn"
        :key="item.text"
        :type="item.type ||'default'"
        size="mini"
        :icon="item.icon"
        @click="item.func"
      >{{item.text}}</el-button>
      <ScreenFull :targetFunScreen="targetFunScreen" v-if="isShowScreenFull"></ScreenFull>
    </div>
  </div>
</template>

<script>
import { barChildren } from "../echartComponent/data/bar/index";
import { lineChildren } from "../echartComponent/data/line/index";
import { pieChildren } from "../echartComponent/data/pie/index";
import { scatterChildren } from "../echartComponent/data/scatter/index";
import { radarChildren } from "../echartComponent/data/radar/index";
import ScreenFull from "@/components/ScreenFull"
export default {
  name: "echartToolbar",
  props: {
    rightBtn: {
      type: Array,
      default: () => []
    },
    targetFunScreen: { // 全屏的节点
      type: [Object, HTMLDivElement],
    },
    isShowScreenFull: { // 是否显示全屏按钮
      type: Boolean,
      default: true
    }
  },
  components: {
    ScreenFull
  },
  data () {
    return {
      listData: [
        { name: "bar", label: "柱形图", children: barChildren },
        { name: "line", label: "折线图", children: lineChildren },
        { name: "pie", label: "饼图", children: pieChildren },
        { name: "scatter", label: "散点图", children: scatterChildren },
        { name: "radar", label: "雷达图", children: radarChildren },
      ],
      activeName: "bar",
    };
  },
  mounted () {
  },
  methods: {
    drag (e, element) {
      e.dataTransfer.setData("data", JSON.stringify(element));
    }
  }

};
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.toolbar {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  .toolbar-item {
    cursor: pointer;
    width: 32px;
    height: 32px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-item {
      width: 100%;
      height: 100%;
      color: #1296db;
    }
  }
}
</style>
