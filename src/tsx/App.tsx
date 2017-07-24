import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fabric, CommandBar } from "office-ui-fabric-react";

import "./../scss/style.scss";

import Viewer from "./components/Viewer";

ReactDOM.render(
  <Fabric>
    <Viewer/>
  </Fabric>,
  document.getElementById("app")
);