/* eslint-disable require-jsdoc */
/* eslint-disable indent */
import { fileToData } from "../utils/common";
const componentsContext = require.context("./", true, /(vue|js)$/);
export const radarChildren = fileToData(componentsContext);