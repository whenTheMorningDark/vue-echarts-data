import {
  randomStr
} from "@/utils";
import {
  cloneDeep,
  maxBy,
  minBy
} from "lodash";
export default {
  methods: {
    groupFun() {
      console.log(this.currentSelectData)
      this.resizeBox = this.changeDataTree(this.currentSelectData)
      console.log(this.resizeBox)
    },
    changeDataTree(arr) {
      let id = randomStr(8);
      let targetArr = [];
      let minX = Math.min(...arr.map(v => v.x))
      let minY = Math.min(...arr.map(v => v.y))
      let childrenArr = cloneDeep(arr).map(v => { // 这里的操作是为了元素复位
        v.x = v.x - minX
        v.y = v.y - minY
        v.pId = id;
        v.active = false;
        return v;
      })
      let childMax = maxBy(childrenArr, "x")
      let childMix = minBy(childrenArr, "x")
      let childMaY = maxBy(childrenArr, "y")
      let childMiY = minBy(childrenArr, "y")
      let targetJson = {
        id,
        children: childrenArr,
        width: childMax.x + childMax.width - childMix.x,
        height: childMaY.y + childMaY.height - childMiY.y,
        x: minX,
        y: minY,
        active: true
      }
      targetArr.push(targetJson)
      return targetArr
      // this.resizeBox = targetArr
      // console.log(this.resizeBox)
    }
  },
}