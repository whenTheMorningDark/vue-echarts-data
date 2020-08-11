import { randomStr } from "@/utils";
import { maxBy, minBy, cloneDeep } from "lodash";
import { mapGetters } from "vuex";
export default {
	computed: {
		...mapGetters(["echartArr"]),
	},
	methods: {
		async groupFun() {
			console.log(this.currentSelectArr);
			let data = await this.changeDataTree(this.currentSelectArr);
			this.createGroup(data);
			console.log(this.groupData);
			// this.$refs.recursionItem.setTreeData(data);
		},
		// 创建group
		createGroup(options) {
			this.groupData.push(options);
		},
		changeDataTree(arr) {
			return new Promise((resolve) => {
				let groupFilterArr = arr.filter((v) => v.isGroup); // 找到已经组合的元素
				let ungroupFilterArr = arr.filter((v) => !v.isGroup); // 找到没有组合的元素
				// 找到它的parent元素
				// console.log(this.findParentGroup(this.groupData, groupFilterArr));
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
					v.pId = id;
					v.active = false;
					v.isGroup = true;
				});
				// 可能会出现x,y相同值的情况
				let childMax = maxBy(targetArr, "x");
				let childMix = minBy(targetArr, "x");
				// let childMaY = maxBy(targetArr, "y");
				// let childMiY = minBy(targetArr, "y");

				let maxHeight = maxBy(targetArr, "height");

				let targetJson = {
					id,
					children: arr,
					width: childMax.x + childMax.width - childMix.x,
					height: maxHeight.height,
					x: minX,
					y: minY,
					groupChildren: [],
					pId: "",
				};
				// targetArr.push(targetJson);
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
