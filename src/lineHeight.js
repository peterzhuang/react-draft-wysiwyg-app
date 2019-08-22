import React, { Component } from "react";
import { Modifier, RichUtils, EditorState } from "draft-js";
import PropTypes from "prop-types";
import { getSelectionCustomInlineStyle } from "draftjs-utils";

import LayoutComponent from "./CustomLineHeightComp";

const customInlineStylesMap = {
  color: {},
  bgcolor: {},
  fontSize: {},
  lineHeight: {},
  fontFamily: {},
  CODE: {
    fontFamily: "monospace",
    wordWrap: "break-word",
    background: "#f1f1f1",
    borderRadius: 3,
    padding: "1px 3px"
  },
  SUPERSCRIPT: {
    fontSize: 11,
    position: "relative",
    top: -8,
    display: "inline-flex"
  },
  SUBSCRIPT: {
    fontSize: 11,
    position: "relative",
    bottom: -8,
    display: "inline-flex"
  }
};

export default class LineHeight extends Component {
  static propTypes = {
    editorState: PropTypes.object,
    modalHandler: PropTypes.object,
    translations: PropTypes.object
  };

  state = {
    expanded: undefined,
    currentLineHeight: undefined
  };

  componentWillMount() {
    const { editorState, modalHandler } = this.props;
    if (editorState) {
      this.setState({
        currentLineHeight: getSelectionCustomInlineStyle(editorState, [
          "LINEHEIGHT"
        ]).LINEHEIGHT
      });
    }
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillReceiveProps(properties) {
    if (
      properties.editorState &&
      this.props.editorState !== properties.editorState
    ) {
      this.setState({
        currentLineHeight: getSelectionCustomInlineStyle(
          properties.editorState,
          ["LINEHEIGHT"]
        ).LINEHEIGHT
      });
    }
  }

  componentWillUnmount() {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onExpandEvent = () => {
    this.signalExpanded = !this.state.expanded;
  };

  expandCollapse = () => {
    this.setState({
      expanded: this.signalExpanded
    });
    this.signalExpanded = false;
  };

  doExpand = () => {
    this.setState({
      expanded: true
    });
  };

  doCollapse = () => {
    this.setState({
      expanded: false
    });
  };

  toggleLineHeight = lineHeight => {
    const { editorState, onChange } = this.props;
    const newState = this.toggleCustomInlineStyle(
      editorState,
      "lineHeight",
      lineHeight
    );
    if (newState) {
      onChange(newState);
    }
  };

  /**
   * Set style.
   */
  addToCustomStyleMap = (styleType, styleKey, style) => {
    // eslint-disable-line
    customInlineStylesMap[styleType][`${styleType.toLowerCase()}-${style}`] = {
      [`${styleKey}`]: style
    };
  };

  /**
   * Function to toggle a custom inline style in current selection current selection.
   */
  toggleCustomInlineStyle(editorState, styleType, style) {
    const selection = editorState.getSelection();
    const nextContentState = Object.keys(
      customInlineStylesMap[styleType]
    ).reduce(
      (contentState, s) =>
        Modifier.removeInlineStyle(contentState, selection, s),
      editorState.getCurrentContent()
    );
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "changeinline-style"
    );
    const currentStyle = editorState.getCurrentInlineStyle();
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce(
        (state, s) => RichUtils.toggleInlineStyle(state, s),
        nextEditorState
      );
    }
    if (styleType === "SUPERSCRIPT" || styleType == "SUBSCRIPT") {
      if (!currentStyle.has(style)) {
        nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
      }
    } else {
      const styleKey = styleType === "bgcolor" ? "backgroundColor" : styleType;
      if (!currentStyle.has(`${styleKey}-${style}`)) {
        nextEditorState = RichUtils.toggleInlineStyle(
          nextEditorState,
          `${styleType.toLowerCase()}-${style}`
        );
        this.addToCustomStyleMap(styleType, styleKey, style);
      }
    }
    return nextEditorState;
  }

  render() {
    const { translations } = this.props;
    const { expanded, currentLineHeight } = this.state;
    const LineHeightComponent = LayoutComponent;
    const lineHeight =
      currentLineHeight && Number(currentLineHeight.substring(11));
    return (
      <LineHeightComponent
        translations={translations}
        currentState={{ lineHeight }}
        onChange={this.toggleLineHeight}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
      />
    );
  }
}
