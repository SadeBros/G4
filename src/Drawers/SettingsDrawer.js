import React, { Component } from "react";
import { Drawer, Input } from "antd";

class SettingsDrawer extends Component {
  state = {
    ratioSidelap: 60, // given in %
    ratioFrontlap: 30, // given in %
    legLong: 220, // given in meters.
    legShort: 40, // given in meters.
    oa: 0,
    ob: 0,
    fovd: 94, // given in degrees
    cameraResolutionWidth: 4096,
    cameraResolutionHeight: 2160,
    cruisingSpeed: 35, // given in km/h
    heightTreeCanopy: 27, // given in meters
    heightAboveVisualPlane: 43 // given in meters
  };

  render() {
    return (
      <Drawer
        title="Settings"
        placement="left"
        closable={true}
        onClose={this.props.close}
        visible={this.props.visible}
      >
        <Input
          addonBefore="Rs"
          suffix="% "
          type="number"
          defaultValue={this.state.ratioSidelap}
        ></Input>

        <Input
          addonBefore="Rf"
          suffix="% "
          type="number"
          defaultValue={this.state.ratioFrontlap}
        ></Input>

        <Input
          addonBefore="ps"
          suffix="m "
          type="number"
          defaultValue={this.state.legShort}
        ></Input>

        <Input
          addonBefore="pl"
          suffix="m "
          type="number"
          defaultValue={this.state.legLong}
        ></Input>

        <Input
          addonBefore="camWidth"
          suffix="pixel "
          type="number"
          defaultValue={this.state.cameraResolutionWidth}
        ></Input>

        <Input
          addonBefore="camHeight"
          suffix="pixel "
          type="number"
          defaultValue={this.state.cameraResolutionHeight}
        ></Input>

        <Input
          addonBefore="FoVd"
          suffix="° "
          type="number"
          defaultValue={this.state.fovd}
        ></Input>

        <Input
          addonBefore="speed"
          suffix="m/s "
          type="number"
          defaultValue={this.state.cruisingSpeed}
        ></Input>

        <Input
          addonBefore="htc"
          suffix="m "
          type="number"
          defaultValue={this.state.heightTreeCanopy}
        ></Input>

        <Input
          addonBefore="h"
          suffix="m "
          type="number"
          defaultValue={this.state.heightAboveVisualPlane}
        ></Input>
      </Drawer>
    );
  }
}

export default SettingsDrawer;
