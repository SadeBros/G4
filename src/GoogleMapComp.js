import React, { Component } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps";

import MarkerDrawer from "./Drawers/MarkerDrawer"

class Map extends Component {
  state = {
    markers: [],
    selectedPosition: null,
    markerDrawerVisible: false
  };

  addMarker = event => {
    const markers = [...this.state.markers];
    let coordinate = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    markers.push(coordinate);
    this.setState({ markers: markers });
  };

  deleteMarker = pos => {
    const {markers} = this.state;

    let a = markers.filter(val => val !== pos);

    this.setState({ markers: a });

    this.closeMarkerDrawer();
  };

  showMarkerDrawer = position => {
    this.setState({
      markerDrawerVisible: true,
      selectedPosition: position
    });
  };

  closeMarkerDrawer = () => {
    this.setState({
      markerDrawerVisible: false
    });
  };

  render() {
    return (
      <div>
        <GoogleMap
          defaultZoom={13}
          defaultCenter={{ lat: 40.0791304267338, lng: 30.817412137985233 }}
          onClick={e => this.addMarker(e)}
        >
          {this.state.markers.map((position, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={position}
              onClick={() => this.showMarkerDrawer(position)}
            />
          ))}

          <MarkerDrawer
            close={this.closeMarkerDrawer}
            visible={this.state.markerDrawerVisible}
            deleteMarker={this.deleteMarker}
            selectedPosition={this.state.selectedPosition}
          />
        </GoogleMap>
      </div>
    );
  }
}

const GoogleMapComp = withScriptjs(withGoogleMap(Map));

export default GoogleMapComp;
