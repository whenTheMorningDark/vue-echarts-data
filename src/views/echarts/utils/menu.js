import { randomStr } from "@/utils";
import { maxBy, minBy, cloneDeep } from "lodash";
import { mapGetters } from "vuex";
export default {
	computed: {
		...mapGetters(["echartArr"]),
	},
	methods: {
		// 组合方法
		async groupFun() {
			console.log(this.currentSelectArr);
			let targetId = this.currentSelectArr.map((s) => s.id);
			let currentSouceData = cloneDeep(this.resizeBox);
			let data = await this.changeDataTree(this.currentSelectArr);
			currentSouceData = currentSouceData.filter(
				(v) => !targetId.includes(v.id)
			);
			currentSouceData.push(data);
			this.resizeBox = currentSouceData;
			console.log(this.resizeBox);
		},
		// 取消组合方法
		unGroupFun() {
			// 存在直接点击父元素的情况
			let targetArray = [];
			this.currentSelectArr.forEach((v) => {
				if (v.pId === 0) {
					// 如果选中的是父节点的情况
					targetArray.push(...v.children);
					let index = this.resizeBox.find((s) => s.id === v.id);
					this.resizeBox.splice(index, 1);
				} else {
					// 不是父节点直接推进数组
					targetArray.push(v);
				}
			});
			targetArray.forEach((v) => {
				v.pId = 0;
				v.isGroup = false;
				v.active = false;
			});
			console.log(targetArray);
			this.resizeBox = targetArray;
			// console.log(this.resizeBox);
			// console.log(this.currentSelectArr);
		},
		changeDataTree(arr) {
			console.log(arr);
			return new Promise((resolve) => {
				let groupFilterArr = arr.filter((v) => v.isGroup); // 找到已经组合的元素
				let ungroupFilterArr = arr.filter((v) => !v.isGroup); // 找到没有组合的元素
				let parentFilterArr = this.findParentGroup(
					this.groupData,
					groupFilterArr
				);
				console.log(parentFilterArr);
				let targetArr = parentFilterArr.concat(ungroupFilterArr);
				let id = randomStr(8);
				let minX = Math.min(...targetArr.map((v) => v.x));
				let minY = Math.min(...targetArr.map((v) => v.y));

				targetArr.map((v) => {
					v.pId = id; // 给每个图标都添加pId标识
					v.active = false;
					v.isGroup = true;
				});
				// 可能会出现x,y相同值的情况
				let childMax = maxBy(targetArr, "x");
				let childMix = minBy(targetArr, "x");

				let ychildMax = maxBy(targetArr, "y");
				let ychildMix = minBy(targetArr, "y");
				// let maxHeight = maxBy(targetArr, "height");
				let targetJson = {
					id,
					children: arr,
					width: childMax.x + childMax.width - childMix.x,
					height: ychildMax.y + ychildMax.height - ychildMix.y,
					x: minX,
					y: minY,
					pId: 0,
				};
				resolve(targetJson);
			});
		},
		findParentGroup(data, arr) {
			let result = []; // 结果的数据
			if (data.length === 0) {
				return result;
			}
			let statck = cloneDeep(arr);
			while (statck.length > 0) {
				let shift = statck.shift();
				// if(shift.pId)
				for (let i = 0; i < data.length; i++) {
					let groupItem = data[i];
					if (shift.pId === groupItem.id) {
						// if()
						let isHave = result.some((v) => v.id === shift.pId);
						if (!isHave) {
							result.push(groupItem);
						}
					}
				}
			}
			return result;
		},
	},
};
