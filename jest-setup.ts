import "cross-fetch/polyfill";

// @ts-ignore
import { JSDOM } from "jsdom";
// @ts-ignore
global.DOMParser = new JSDOM().window.DOMParser;
