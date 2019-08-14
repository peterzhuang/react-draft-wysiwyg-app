import React, { Component } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import CustomColorPicker from "./CustomColorPicker";

class ControlledEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  getContentAsRawJson() {
    const contentState = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    return JSON.stringify(raw, null, 2);
  }

  saveContent = () => {
    const json = this.getContentAsRawJson();
    localStorage.setItem("reactDraftWYSIWYGContentJson", json);
  };

  loadContent = () => {
    //local content from localStorage if saved
    const savedData = localStorage.getItem("reactDraftWYSIWYGContentJson");
    return savedData ? JSON.parse(savedData) : null;

    //populate draft editor with content
  };

  setEditorContent = () => {
    const rawEditorData = this.loadContent();
    if (rawEditorData) {
      const contentState = convertFromRaw(rawEditorData);
      const newEditorState = EditorState.createWithContent(contentState);
      this.onEditorStateChange(newEditorState);
    }
  };

  getContentAsRawHtml() {
    let options = {
      inlineStyleFn: styles => {
        let textColorKey = "color-",
          bgColorKey = "bgcolor-";
        let textColor = styles
            .filter(value => value.startsWith(textColorKey))
            .first(),
          bgColor = styles
            .filter(value => value.startsWith(bgColorKey))
            .first();

        if (textColor) {
          return {
            element: "span",
            style: {
              color: textColor.replace(textColorKey, "")
            }
          };
        }

        if (bgColor) {
          return {
            element: "span",
            style: {
              backgroundColor: bgColor.replace(bgColorKey, "")
            }
          };
        }
      }
    };
    const contentState = this.state.editorState.getCurrentContent();
    const html = stateToHTML(contentState, options);
    return { __html: html };
  }

  render() {
    const { editorState } = this.state;
    return (
      <>
        <Editor
          editorState={editorState}
          editorClassName="controlledEditor-block"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            colorPicker: { component: CustomColorPicker }
          }}
        />
        <div style={{ margin: "10px" }}>
          <button onClick={this.saveContent}>Save content</button>
          <button onClick={this.setEditorContent}>Load content</button>
        </div>
        <div dangerouslySetInnerHTML={this.getContentAsRawHtml()} />
      </>
    );
  }
}

export default ControlledEditor;
