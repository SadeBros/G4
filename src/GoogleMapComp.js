import React, { Component } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps";

import MarkerDrawer from "./Drawers/MarkerDrawer";
import { Button } from "antd";
import axios from "axios";

class Map extends Component {
  state = {
    markers: [],
    selectedPosition: null,
    markerDrawerVisible: false,
    textFileContent: null,
    waitingForFileUpload: false
  };


  addMarker = event => {
    const markers = [...this.state.markers];
    let coordinate = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    markers.push(coordinate);
    this.setState({ markers: markers });
  };

  deleteMarker = pos => {
    const { markers } = this.state;

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

  static readUploadedFileAsText = inputFile => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };

  uploadFile = async event => {
    event.persist();

    if (!event.target || !event.target.files) {
      return;
    }

    this.setState({ waitingForFileUpload: true });

    const fileList = event.target.files;

    // Uploads will push to the file input's `.files` array. Get the last uploaded file.
    const latestUploadedFile = fileList.item(fileList.length - 1);

    try {
      const fileContents = await Map.readUploadedFileAsText(latestUploadedFile);
      this.setState({
        textFileContent: fileContents,
        waitingForFileUpload: false
      });
      this.updateMarkers();
    } catch (e) {
      console.log(e);
      this.setState({
        waitingForFileUpload: false
      });
    }
  };

  updateMarkers = () => {
    const content = this.state.textFileContent;
    const coordinates = content
      .split("\n")
      .filter(el => el !== "lat,lng" && el !== "");

    const markers = coordinates.map(coordinate => {
      let [lat, lng] = coordinate.split(",");
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      return { lat: lat, lng: lng };
    });
    this.setState({ markers: markers });
  };

  saveFileHandler = async () => {

    const markers = [...this.state.markers];
    axios
      .post(`http://localhost:5000`, {markers})
      .then(res => console.log(res, res.data))
      .then(() => console.log('Book Created'));

  };

  render() {
    const icon = {
      url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Button_Icon_Red.svg/1024px-Button_Icon_Red.svg.png",
      scaledSize: { width: 8, height: 8 }
    };

    return (
      <div>
        <GoogleMap
          defaultZoom={17}
          defaultCenter={{ lat: 40.100056583071414, lng: 30.800300346746894 }}
          onClick={e => this.addMarker(e)}
        >
          {this.state.markers.map((position, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={position}
              icon={icon}
              onClick={() => this.showMarkerDrawer(position)}
            />
          ))}

          <MarkerDrawer
            close={this.closeMarkerDrawer}
            visible={this.state.markerDrawerVisible}
            deleteMarker={this.deleteMarker}
            selectedPosition={this.state.selectedPosition}
          />

          <input size="large" type="file" onChange={this.uploadFile}></input>
          <Button size="large" onClick={this.saveFileHandler}>
            SAVE FILE
          </Button>
          <p>{this.state.textFileContent}</p>
        </GoogleMap>
      </div>
    );
  }
}

const GoogleMapComp = withScriptjs(withGoogleMap(Map));

export default GoogleMapComp;
