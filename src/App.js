import React, { Component } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";

import "./App.css";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { getStreetViewImage } from "./apiResponse";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g",
});

export default class App extends Component {
  state = {
    coordinates: {},
    markers: {},
    markerSelected: [],
    imgBuffer: "",
  };

  getPolygonCoordinates = (features) => {
    var coordinatesArray = features.map((feature) => {
      return feature.geometry.coordinates;
    });
    const arr = coordinatesArray[0][0];
    return arr.slice(0, arr.length - 1);
  };

  getPointCoordinates = (features) => {
    const { coordinates } = features[0].geometry;
    return coordinates;
  };

  updatePolygonCoordinates = (id, coord) => {
    var { coordinates } = this.state;
    coordinates[id] = coord;
    this.setState({ coordinates });
  };

  updateMarkerCoordinates = (id, coord) => {
    var { markers } = this.state;
    markers[id] = coord;
    this.setState({ markers });
  };

  updateState = (features) => {
    const type = features[0].geometry.type;
    const featureId = features[0].id;

    if (type === "Polygon") {
      const coord = this.getPolygonCoordinates(features);
      this.updatePolygonCoordinates(featureId, coord);
    } else {
      const coord = this.getPointCoordinates(features);
      this.updateMarkerCoordinates(featureId, coord);
    }
  };

  onDrawCreate = ({ features }) => {
    this.updateState(features);
  };

  onDrawUpdate = ({ features }) => {
    this.updateState(features);
  };

  showStreetView = async (point) => {
    const imgBuffer = await getStreetViewImage(point);
    var blob = new Blob([imgBuffer]);

    var image = document.getElementById("streetViewImage");

    var reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
    };
    reader.readAsDataURL(blob);

    this.setState({ markerSelected: point });
  };

  render() {
    const { coordinates, markers, imgBuffer } = this.state;

    return (
      <div>
        <h2>Welcome to react-mapbox-gl-draw</h2>
        <Map
          style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
          containerStyle={{
            height: "600px",
            width: "85vw",
          }}
        >
          <DrawControl
            onDrawCreate={this.onDrawCreate}
            onDrawUpdate={this.onDrawUpdate}
          />
        </Map>
        <div className="row outer__row">
          <div className="col-6">
            <h4 className="text-center row__heading">Polygons</h4>
            <div className="row">
              <div className="col-2">
                <h5>#</h5>
              </div>
              <div className="col-5">
                <h5>Corner Points</h5>
              </div>
              <div className="col-5">
                <h5>Coordinates</h5>
              </div>
            </div>
            {Object.values(coordinates).map((arr, i) => (
              <div className="row">
                <div className="col-2">
                  <p>{i + 1}</p>
                </div>
                <div className="col-5">
                  <p>{arr.length}</p>
                </div>
                <div className="col-5">
                  <ol>
                    {arr.map((pair) => (
                      <li>
                        x: {pair[0].toFixed(2)} &nbsp; y: {pair[1].toFixed(2)}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
          <div className="col-6">
            <h4 className="text-center row__heading">Markers</h4>
            <div className="row">
              <div className="col-2">
                <h5>#</h5>
              </div>
              <div className="col-5">
                <h5>Coordinates</h5>
              </div>
              <div className="col-5">
                <h5></h5>
              </div>
            </div>
            {Object.values(markers).map((point, i) => (
              <div className="row">
                <div className="col-2">
                  <p>{i + 1}</p>
                </div>
                <div className="col-5">
                  <p>
                    x: {point[0].toFixed(2)} &nbsp; y: {point[1].toFixed(2)}
                  </p>
                </div>
                <div className="col-5">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                    onClick={() => this.showStreetView(point)}
                  >
                    Show street view
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          class="modal fade"
          id="exampleModalCenter"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
                  Google Street View
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <img id="streetViewImage" alt="street" />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
