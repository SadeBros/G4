import React, { Component } from "react";

import { Drawer, Button, Tag } from "antd";

class MarkerDrawer extends Component {
  render() {
    return (
      <Drawer
        title="Marker"
        placement="right"
        closable={true}
        onClose={this.props.close}
        visible={this.props.visible}
      >
        {this.props.selectedPosition ? (
            <div>
              <Tag color="purple">Lat: {this.props.selectedPosition["lat"]}</Tag>
              <Tag color="purple">Lng: {this.props.selectedPosition["lng"]}</Tag>
            </div>
          ) : null}

        <Button
          shape="circle"
          icon="delete"
          onClick={() => this.props.deleteMarker(this.props.selectedPosition)}
        ></Button>
      </Drawer>
    );
  }
}

export default MarkerDrawer;
