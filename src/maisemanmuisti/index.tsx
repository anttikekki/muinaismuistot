import "core-js/stable";
import "cross-fetch/polyfill";
import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Content } from "./components/Content";

ReactDOM.render(<Content />, document.getElementById("root"));
