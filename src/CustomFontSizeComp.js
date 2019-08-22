import React, { Component } from "react";
import PropTypes from "prop-types";

import Dropdown from "./Dropdown";
import DropdownOption from "./DropdownOption";

export default class CustomFontSizeComp extends Component {
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
    defaultFontSize: undefined
  };

  componentDidMount() {
    const editorElm = document.getElementsByClassName("DraftEditor-root");
    if (editorElm && editorElm.length > 0) {
      const editorStyles = window.getComputedStyle(editorElm[0]);
      let defaultFontSize = editorStyles.getPropertyValue("font-size");
      defaultFontSize = defaultFontSize.substring(
        0,
        defaultFontSize.length - 2
      );
      this.setState({
        // eslint-disable-line react/no-did-mount-set-state
        defaultFontSize
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
      translations: { options, fontSizeTitle }
    } = this.props;
    let {
      currentState: { fontSize: currentFontSize }
    } = this.props;
    let { defaultFontSize } = this.state;
    defaultFontSize = Number(defaultFontSize);
    currentFontSize =
      currentFontSize ||
      (options && options.indexOf(defaultFontSize) >= 0 && defaultFontSize);
    return (
      <div className="rdw-fontsize-wrapper" aria-label="rdw-font-size-control">
        <Dropdown
          className={"rdw-fontsize-dropdown"}
          onChange={onChange}
          expanded={expanded}
          doExpand={doExpand}
          doCollapse={doCollapse}
          onExpandEvent={onExpandEvent}
          title={fontSizeTitle}
        >
          {currentFontSize ? <span>{currentFontSize}</span> : <img alt="" />}
          {options.map((size, index) => (
            <DropdownOption
              className="rdw-fontsize-option"
              active={currentFontSize === size}
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
