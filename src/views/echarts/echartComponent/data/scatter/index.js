import { fileToData } from "../utils/common";
const componentsContext = require.context("./", true, /(vue|js)$/);
export const scatterChildren = fileToData(componentsContext);
