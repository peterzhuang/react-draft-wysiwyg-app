import React from "react";
import ControlledEditor from "./ControlledEditor";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./App.css";

function App() {
  return (
    <div className="editorContainer">
      <ControlledEditor />
    </div>
  );
}

export default App;
