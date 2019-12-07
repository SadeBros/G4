import React, { Component } from "react";
import Control from "react-leaflet-control";
import { Map, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Button, Statistic, Tag, Drawer, Input } from "antd";
import SettingsDrawer from "./Drawers/SettingsDrawer";
import MarkerDrawer from "./Drawers/MarkerDrawer";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

class MapComp extends Component {
  state = {
    lat: 40.0791304267338,
    lng: 30.817412137985233,
    zoom: 13,
    markers: [],
    distance: 0,
    markerDrawerVisible: false,
    settingsDrawerVisible: false,
    selectedPosition: null
  };

  showMarkersDrawer = position => {
    this.setState({
      markerDrawerVisible: true,
      selectedPosition: position
    });
  };

  showSettingsDrawer = () => {
    this.setState({
      settingsDrawerVisible: true
    });
  };

  closeMarkerDrawer = () => {
    this.setState({
      markerDrawerVisible: false
    });
  };

  closeSettingsDrawer = () => {
    this.setState({
      settingsDrawerVisible: false
    });
  };

  addMarker = e => {
    const { markers, distance } = this.state;
    const { lat, lng } = e.latlng;

    let new_dist = distance;
    if (markers.length > 0) {
      new_dist += this.distance(
        markers[markers.length - 1][0],
        markers[markers.length - 1][1],
        lat,
        lng,
        "K"
      );
    }

    // console.log("new_dist", new_dist);
    markers.push([lat, lng]);
    this.setState({ markers, distance: new_dist });
    // console.log(this.state.markers);
  };

  // Distance Güncellenecek
  deleteMarker = pos => {
    const { markers, distance } = this.state;

    let a = markers.filter(val => val !== pos);

    this.setState({ markers: a });

    this.closeMarkerDrawer();
  };

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  };

  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div>
        <div id="map">
          <Map
            style={{ height: "100vh" }}
            center={position}
            zoom={this.state.zoom}
            onClick={this.addMarker}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            {this.state.markers.map((position, idx) => (
              <Marker
                key={`marker-${idx}`}
                position={position}
                onClick={() => this.showMarkersDrawer(position)}
              />
            ))}
            {/* {this.state.markers.map((position, idx) =>
              this.state.markers[idx + 1] ? (
                <Polyline
                  key={idx}
                  positions={[
                    this.state.markers[idx],
                    this.state.markers[idx + 1]
                  ]}
                  color={"red"}
                ></Polyline>
              ) : null
            )} */}
            <Control position="topleft">
              <Tag color="purple">
                <Statistic
                  title="Total KM"
                  precision={2}
                  value={this.state.distance}
                />
              </Tag>
            </Control>

            <Control position="bottomleft">
              <Button
                shape="circle"
                icon="delete"
                onClick={() => this.setState({ markers: [], distance: 0 })}
              ></Button>

              <Button
                size="large"
                type="primary"
                onClick={() => alert("MISSIONS must be opened, downloaded.")}
              >
                MISSIONS
              </Button>
              <Button size="large" onClick={this.showSettingsDrawer}>
                SETTINGS
              </Button>
              <Button
                size="large"
                onClick={() =>
                  alert("The video about the flight planning will be played.")
                }
              >
                HELP
              </Button>

              <Button size="large" onClick={() => console.log(this.state.markers)}>
                PRINT MARKERS
              </Button>
            </Control>
          </Map>
        </div>

        <MarkerDrawer
          close={this.closeMarkerDrawer}
          visible={this.state.markerDrawerVisible}
          deleteMarker={this.deleteMarker}
          selectedPosition={this.state.selectedPosition}
        />

        <SettingsDrawer
          close={this.closeSettingsDrawer}
          visible={this.state.settingsDrawerVisible}
        />
      </div>
    );
  }
}

export default MapComp;
