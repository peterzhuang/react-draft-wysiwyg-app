import React, { Component } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
// import { stateToHTML } from "draft-js-export-html";
import draftToHtml from "./DraftToHtml";
import CustomColorPicker from "./CustomColorPicker";
import FontSize from "./fontSize";
import LineHeight from "./lineHeight";

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
    // let options = {
    //   inlineStyleFn: styles => {
    //     let textColorKey = "color-",
    //       bgColorKey = "bgcolor-",
    //       fontSizeKey = "fontsize-",
    //       lineHeightKey = "lineheight-";
    //     let textColor = styles
    //         .filter(value => value.startsWith(textColorKey))
    //         .first(),
    //       bgColor = styles
    //         .filter(value => value.startsWith(bgColorKey))
    //         .first(),
    //       fontSize = styles
    //         .filter(value => value.startsWith(fontSizeKey))
    //         .first(),
    //       lineHeight = styles
    //         .filter(value => value.startsWith(lineHeightKey))
    //         .first();

    //     if (textColor) {
    //       return {
    //         element: "span",
    //         style: {
    //           color: textColor.replace(textColorKey, "")
    //         }
    //       };
    //     }
    //     if (bgColor) {
    //       return {
    //         element: "span",
    //         style: {
    //           backgroundColor: bgColor.replace(bgColorKey, "")
    //         }
    //       };
    //     }
    //     if (fontSize) {
    //       return {
    //         element: "span",
    //         style: {
    //           fontSize: fontSize.replace(fontSizeKey, "")
    //         }
    //       };
    //     }
    //     if (lineHeight) {
    //       return {
    //         element: "span",
    //         style: {
    //           lineHeight: lineHeight.replace(lineHeightKey, "")
    //         }
    //       };
    //     }
    //   }
    // };
    // const contentState = this.state.editorState.getCurrentContent();
    // const html = stateToHTML(contentState, options);
    const html = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    return { __html: html };
  }

  render() {
    const { editorState } = this.state;
    const customStyleMap = {
      "lineheight-1": {
        lineHeight: 1
      },
      "lineheight-2": {
        lineHeight: 2
      },
      "lineheight-3": {
        lineHeight: 3
      },
      "lineheight-4": {
        lineHeight: 4
      }
    };
    return (
      <>
        <Editor
          customStyleMap={customStyleMap}
          editorState={editorState}
          wrapperStyle={{ width: "600px" }}
          editorClassName="controlledEditor-block"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: ["inline", "blockType", "colorPicker", "link"],
            colorPicker: { component: CustomColorPicker, title: "Color Picker" }
          }}
          localization={{
            locale: "en",
            translations: {
              "components.controls.fontsize.fontsize": "Font Size",
              fontSizeTitle: "Font Size",
              options: [
                8,
                9,
                10,
                11,
                12,
                14,
                16,
                18,
                24,
                30,
                36,
                48,
                60,
                72,
                96
              ],
              lineHeightTitle: "Line Height",
              lineHeightOptions: [1, 1.2, 1.5, 1.75, 2, 2.5, 3, 4]
            }
          }}
          toolbarCustomButtons={[<FontSize />, <LineHeight />]}
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
