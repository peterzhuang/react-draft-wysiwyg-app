import React, { Component } from "react";
import PropTypes from "prop-types";

import Dropdown from "./Dropdown";
import DropdownOption from "./DropdownOption";

export default class CustomLineHeightComp extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    doExpand: PropTypes.func,
    doCollapse: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    currentState: PropTypes.object,
    translations: PropTypes.object
  };

  state = {
    defaultLineHeight: undefined
  };

  componentDidMount() {
    const editorElm = document.getElementsByClassName("DraftEditor-root");
    if (editorElm && editorElm.length > 0) {
      const editorStyles = window.getComputedStyle(editorElm[0]);
      let defaultLineHeight = editorStyles.getPropertyValue("line-height");
      if (defaultLineHeight === "normal") {
        defaultLineHeight = "1";
      }
      //   defaultLineHeight = defaultLineHeight.substring(
      //     0,
      //     defaultLineHeight.length - 2
      //   );
      this.setState({
        // eslint-disable-line react/no-did-mount-set-state
        defaultLineHeight
      });
    }
  }

  render() {
    const {
      onChange,
      expanded,
      doCollapse,
      onExpandEvent,
      doExpand,
      translations: { lineHeightOptions, lineHeightTitle }
    } = this.props;
    let {
      currentState: { lineHeight: currentLineHeight }
    } = this.props;
    let { defaultLineHeight } = this.state;
    defaultLineHeight = Number(defaultLineHeight);
    currentLineHeight =
      currentLineHeight ||
      (lineHeightOptions &&
        lineHeightOptions.indexOf(defaultLineHeight) >= 0 &&
        defaultLineHeight);
    return (
      <div className="rdw-fontsize-wrapper" aria-label="rdw-font-size-control">
        <Dropdown
          className={"rdw-fontsize-dropdown"}
          onChange={onChange}
          expanded={expanded}
          doExpand={doExpand}
          doCollapse={doCollapse}
          onExpandEvent={onExpandEvent}
          title={lineHeightTitle}
        >
          {currentLineHeight ? (
            <span>{currentLineHeight}</span>
          ) : (
            <img alt="" />
          )}
          {lineHeightOptions.map((size, index) => (
            <DropdownOption
              className="rdw-fontsize-option"
              active={currentLineHeight === size}
              value={size}
              key={index}
            >
              {size}
            </DropdownOption>
          ))}
        </Dropdown>
      </div>
    );
  }
}
