import React, { Component } from "react";
import Control from 'react-leaflet-control';
import { Map, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L, { marker } from "leaflet";
import 'leaflet/dist/leaflet.css';

import { Button, Statistic, Tag, Drawer } from 'antd';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class MapComp extends Component {
  state = {
    lat: 12.92415,
    lng: 77.67229,
    zoom: 11,
    markers: [],
    distance: 0,
    visible: false,
    title: "",
    selectedPosition: null
  };

  // İlgili Fonksiyonları buraya yazacaksın
  // Markers dizisinde tutuluyor değerler
  // Distance toplam uzunluk km cinsinden
  // this.state.markers
  // this.state.distance
  // Güncellerken this.setState({markers: ... , distance ...}) state güncellemesine bakabilirsin react

  showDrawer = (position) => {
    this.setState({
      visible: true,
      title: "Marker",
      selectedPosition: position
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  addMarker = (e) => {
    const { markers, distance } = this.state
    const { lat, lng } = e.latlng

    let new_dist = distance;
    if (markers.length > 0) {
      new_dist += this.distance(markers[markers.length - 1][0], markers[markers.length - 1][1], lat, lng, "K");
    }

    console.log(new_dist);
    markers.push([lat, lng])
    this.setState({ markers, distance: new_dist })
    console.log(this.state.markers)
  }

  // Distance Güncellenecek
  deleteMarker = (pos) => {
    const { markers, distance } = this.state

    let a = markers.filter((val) => val !== pos)

    this.setState({ markers: a })

    this.onClose();
  }

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }

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
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
            {this.state.markers.map((position, idx) =>
              <Marker key={`marker-${idx}`} position={position} onClick={() => this.showDrawer(position)} />
            )}
            {this.state.markers.map((position, idx) =>
              this.state.markers[idx + 1] ? <Polyline key={idx} positions={[this.state.markers[idx], this.state.markers[idx + 1]]} color={'red'}></Polyline> : null,
            )}
            <Control position="topleft">
              <Tag color="purple"><Statistic title="Total KM" precision={2} value={this.state.distance} /></Tag>
            </Control>

            <Control position="bottomleft" >
              <Button
                shape="circle"
                icon="delete"
                onClick={() => this.setState({ markers: [], distance: 0 })}
              >
              </Button>
            </Control>
          </Map>
        </div>

        <Drawer
          title={this.state.title}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {this.state.selectedPosition ?
            <div>
              <Tag color="purple">Lat: {this.state.selectedPosition[0]}</Tag>
              <Tag color="purple">Lng: {this.state.selectedPosition[1]}</Tag>
            </div>
            :
            null
          }
          <Button
            shape="circle"
            icon="delete"
            onClick={() => this.deleteMarker(this.state.selectedPosition)}
          >
          </Button>
        </Drawer>
      </div>
    );
  }
}

export default MapComp;