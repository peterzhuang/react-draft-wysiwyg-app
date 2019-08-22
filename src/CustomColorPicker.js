import React, { Component } from "react";
import { PhotoshopPicker } from "react-color";
import styled from "styled-components";
import ColorPickerButton from "./ColorPickerButton.svg";

const Wrapper = styled.div`
  position: relative;
`;

class CustomColorPicker extends Component {
  state = {
    initialColor: "",
    currentStyle: "color",
    showColorPicker: false
  };

  stopPropagation = event => {
    event.stopPropagation();
  };

  onChange = color => {
    const { onChange } = this.props;
    const { currentStyle } = this.state;
    onChange(currentStyle, color.hex);
  };

  setCurrentStyleColor = () => {
    this.setState({
      currentStyle: "color"
    });
  };

  setCurrentStyleBgcolor = () => {
    this.setState({
      currentStyle: "bgcolor"
    });
  };

  onButtonClick = () => {
    const colorPicker = document.getElementById("rteColorPicker");
    this.props.onExpandEvent();
    if (!colorPicker) {
      this.setState({
        initialColor: this.props.currentState.color || "#ffffff",
        currentStyle: "color",
        showColorPicker: true
      });
    } else {
      this.setState({ showColorPicker: false });
    }
  };

  handleAccept = () => {
    this.setState({ showColorPicker: false });
  };

  handleCancel = () => {
    this.props.onChange("color", this.state.initialColor);
    this.setState({ showColorPicker: false });
  };

  renderModal = () => {
    const { color = "#ffffff", bgColor = "#ffffff" } = this.props.currentState;
    const { currentStyle } = this.state;
    console.log("current color", color);
    const modalStyle = {
      position: "absolute",
      right: "-65px",
      top: "20px",
      zIndex: "10"
    };
    return (
      <div style={modalStyle} onClick={this.stopPropagation}>
        <span
          className="rdw-colorpicker-modal-header"
          style={{ backgroundColor: "#DCDCDC" }}
        >
          <span
            className={`rdw-colorpicker-modal-style-label 
              ${
                currentStyle === "color"
                  ? "rdw-colorpicker-modal-style-label-active"
                  : ""
              }`}
            onClick={this.setCurrentStyleColor}
          >
            Text
          </span>
          <span
            className={`rdw-colorpicker-modal-style-label 
              ${
                currentStyle === "bgcolor"
                  ? "rdw-colorpicker-modal-style-label-active"
                  : ""
              }`}
            onClick={this.setCurrentStyleBgcolor}
          >
            Background
          </span>
        </span>
        <PhotoshopPicker
          color={`${currentStyle === "color" ? color : bgColor}`}
          onChange={this.onChange}
          onAccept={this.handleAccept}
          onCancel={this.handleCancel}
        />
      </div>
    );
  };

  render() {
    const {
      expanded,
      onExpandEvent,
      config: { title }
    } = this.props;
    return (
      <div
        className="rdw-image-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
        title={title}
      >
        <div className="rdw-option-wrapper" onClick={this.onButtonClick}>
          <img style={{ width: "20px" }} src={ColorPickerButton} alt="" />
        </div>
        {this.state.showColorPicker ? (
          <Wrapper id="rteColorPicker">{this.renderModal()}</Wrapper>
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default CustomColorPicker;
