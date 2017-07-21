import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fabric } from "office-ui-fabric-react";

import "./../scss/style.scss";

import GViewRender from "./components/GViewRender";
import Docx4JsRender from "./components/Docx4JsRender";

ReactDOM.render(
  <Fabric><Docx4JsRender/></Fabric>,
  document.getElementById("app")
);