import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fabric } from "office-ui-fabric-react";

import "./../scss/style.scss";

import GViewRender from "./components/GViewRender";

ReactDOM.render(
  <Fabric><GViewRender/></Fabric>,
  document.getElementById("app")
);