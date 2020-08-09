/* eslint-disable indent */
import { defaultTtileKeys } from "../../../../rightTool/components/commonData/commonData";
import { cloneDeep } from "lodash";
import { legendData } from "../../../../rightTool/components/commonData/legendData";
let currentLegendData = {
	data: ["最高气温", "最低气温"],
};
export const lineMarker = {
	name: "平滑折线图",
	type: "line",
	images: require("@/assets/images/line-marker.jpg"),
	optionsData: {
		title: defaultTtileKeys,
		legend: Object.assign({}, cloneDeep(legendData), currentLegendData),
		tooltip: {
			trigger: "axis",
		},
		toolbox: {
			show: true,
			feature: {
				dataZoom: {
					yAxisIndex: "none",
				},
				dataView: { readOnly: false },
				magicType: { type: ["line", "bar"] },
				restore: {},
				saveAsImage: {},
			},
		},
		xAxis: {
			type: "category",
			boundaryGap: false,
			data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
		},
		yAxis: {
			type: "value",
			axisLabel: {
				formatter: "{value} °C",
			},
		},
		series: [
			{
				name: "最高气温",
				type: "line",
				data: [11, 11, 15, 13, 12, 13, 10],
				markPoint: {
					data: [
						{ type: "max", name: "最大值" },
						{ type: "min", name: "最小值" },
					],
				},
				markLine: {
					data: [{ type: "average", name: "平均值" }],
				},
			},
			{
				name: "最低气温",
				type: "line",
				data: [1, -2, 2, 5, 3, 2, 0],
				markPoint: {
					data: [{ name: "周最低", value: -2, xAxis: 1, yAxis: -1.5 }],
				},
				markLine: {
					data: [
						{ type: "average", name: "平均值" },
						[
							{
								symbol: "none",
								x: "90%",
								yAxis: "max",
							},
							{
								symbol: "circle",
								label: {
									position: "start",
									formatter: "最大值",
								},
								type: "max",
								name: "最高点",
							},
						],
					],
				},
			},
		],
	},
};
