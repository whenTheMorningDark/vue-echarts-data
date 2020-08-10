import { randomStr } from "@/utils";
import { cloneDeep, maxBy, minBy } from "lodash";
import { mapGetters } from "vuex";
export default {
	computed: {
		...mapGetters(["echartArr"]),
	},
	methods: {
		async groupFun() {
			console.log(this.currentSelectData);
			let data = await this.changeDataTree(this.currentSelectData);
			this.$refs.recursionItem.setTreeData(data);
			// let echartsComponents = this.$refs.recursionItem.getEchartComponents();
			// console.log(echartsComponents);
			// // // console.log(this.resizeBox);
			// // // // this.resizeBox
			// // let children = this.resizeBox[0].children;
			// // let filterChildren = this.echartArr.filter((v) =>
			// // 	children.map((s) => s.id).includes(v.id)
			// // );
			// // console.log(filterChildren);
			// this.echartArr.forEach((v) => {
			// 	v.resizeFun();
			// });
		},
		changeDataTree(arr) {
			return new Promise((resolve) => {
				let id = randomStr(8);
				let targetArr = [];
				let minX = Math.min(...arr.map((v) => v.x));
				let minY = Math.min(...arr.map((v) => v.y));
				let childrenArr = cloneDeep(arr).map((v) => {
					// 这里的操作是为了元素复位
					v.x = v.x - minX;
					v.y = v.y - minY;
					v.pId = id;
					v.active = false;
					return v;
				});
				let childMax = maxBy(childrenArr, "x");
				let childMix = minBy(childrenArr, "x");
				let childMaY = maxBy(childrenArr, "y");
				let childMiY = minBy(childrenArr, "y");
				let targetJson = {
					id,
					children: childrenArr,
					width: childMax.x + childMax.width - childMix.x,
					height: childMaY.y + childMaY.height - childMiY.y,
					x: minX,
					y: minY,
					active: true,
				};
				targetArr.push(targetJson);
				resolve(targetArr);
			});
		},
	},
};
