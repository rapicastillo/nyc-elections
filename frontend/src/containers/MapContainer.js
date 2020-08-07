import React from 'react';
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, { Layer, Feature, Popup, Source } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoicmFwaWNvbGxjIiwiYSI6ImNrOXRhc3ZrMzFlNHgzZG8xZDk3NGJrdnQifQ.stg6zjtXFfOtExoAow_sxA'
});
const MAPBOX_STYLE = "mapbox://styles/rapicollc/ckddf4rz63ko71io2eg85v28b?fresh=true"
// const MAPBOX_STYLE = "mapbox://styles/rapicollc/ckdkaddzd0wtq1ipcyxfzw5ek?fresh=true/";

const ED_SOURCE = "ed-4rtct9";

const HIDDEN = ["lngLat", "elect_dist", "shape_area", "shape_leng", "share_real", "share_perc", "total_int", "share", "total"]

const DROPDOWN_CHOICE = {
  statesenate : {
    id: "statesenate-dist",
    layer: "State_Senate_Districts-cygenc",
    label: "State Senate Districts",
    text: 'st_sen_dis'
  },
  assembly: {
    id: "assembly-dist",
    layer: "State_Assembly_Districts-54ss53",
    label: "State Assembly Districts",
    text: 'assem_dist'
  },
  congress: {
    id: "cong-dist",
    layer: "Congressional_Districts-cdn2oo",
    label: "Congressional Districts",
    text: 'cong_dist'
  },
  council: {
    id: "council-dist",
    layer: "City_Council_Districts-8m6a88",
    label: "Council Districts",
    text: 'coun_dist'
  }
}
class MapContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      popupData: null,
      popupLnglat: null,
      hoveredED: null,
      center: [-74.0060, 40.7128],
      showDistrict: false
    };
  }
  //#2020-incumbents-1ctjgy
  componentDidMount = () => {
  /*
  #762a83
#9970ab
#c2a5cf
#e7d4e8
#d9f0d3
#a6dba0
#5aae61
#1b783 */
  }

  onMouseMove = (map, event) => {
    // const target = map.queryRenderedFeatures(event.point, {layers: ['202005-cd14']})
    const target = map.queryRenderedFeatures(event.point, {layers: ['2020-incumbents']})
    
    this.setState({ popupLnglat: event.lngLat });
    if (target[0]) {
      this.setState({ popupData: {...target[0].properties } })
    } else {
      this.setState({ popupData: null})
    }
  };

  onLoad = (map, event) => {
    
    map.addSource("election-districts", {
      type: "vector",
      url: "mapbox://rapicollc.8yrrl6oa"
    });

    map.addSource("council-dist", {
      type: "vector",
      url: "mapbox://rapicollc.bieih97g"
    });

    map.addSource("cong-dist", {
      type: "vector",
      url: "mapbox://rapicollc.3audoul8"
    });
    
    map.addSource("statesenate-dist", {
      type: "vector",
      url: "mapbox://rapicollc.60m867d3"
    });
    
    map.addSource("assembly-dist", {
      type: "vector",
      url: "mapbox://rapicollc.9z2es0gx"
    });
    

    
    


    map.addLayer({
      'id': 'eds',
      'type': 'fill',
      'source-layer': 'ED-4rtct9',
      'source': "election-districts",
      'layout': {},
      'paint': { 
        "fill-color": 'black', 
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.3,
          0
        ]
      }
    });


    map.on('mousemove', 'eds', (e) => {
      if (e.features.length > 0) {
        if (this.state.hoveredStateId) {
          map.setFeatureState(
            { source: 'election-districts', 'sourceLayer': 'ED-4rtct9', id: this.state.hoveredStateId },
            { hover: false }
          );
        }
  
          const hoveredStateId = e.features[0].id
          this.setState({hoveredStateId: hoveredStateId});
          map.setFeatureState(
            { source: 'election-districts', 'sourceLayer': 'ED-4rtct9', id: hoveredStateId },
            { hover: true }
          );
        }
      }
    );

    map.on('mouseleave', 'eds', (e) => {
        if (this.state.hoveredStateId) {
          map.setFeatureState(
            { source: 'election-districts', 'sourceLayer': 'ED-4rtct9', id: this.state.hoveredStateId },
            { hover: false }
          );
        }
    });
  }



  render = () => (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10}}>
        <select onChange={ e => { 
            const value= e.target.value;
            this.setState({
              showDistrict: null
            }, ()=> {
              this.setState({showDistrict: value})
            })
          }} >
          <option>Select a District Boundary to show</option>
          {Object.keys(DROPDOWN_CHOICE).map(
            item => <option key={DROPDOWN_CHOICE[item].id} value={item}>{DROPDOWN_CHOICE[item].label}</option>
          )}
        </select>
      </div>
      <Map
        style={MAPBOX_STYLE}
        containerStyle={{
          height: '100%',
          width: '100%'
        }}
        center={this.state.center}

        onStyleLoad={this.onLoad}
        onMouseMove={this.onMouseMove}
      
      >
        {
          this.state.popupData && (
            <Popup
              coordinates={this.state.popupLnglat}
              offset={{
                'bottom': [0, -10]
              }}
            >
              <p>ED {this.state.popupData['elect_dist']}</p>
              <table>
                <tbody>
                {
                  Object.keys(this.state.popupData).map((item) => 
                    !HIDDEN.includes(item) && this.state.popupData[item] && (
                    <tr key={item}>
                      <td>{item}</td><td>{this.state.popupData[item]}</td>
                    </tr>
                  )) 
                }
                </tbody>
              </table>
              
            </Popup>
          )
        }

        {
          this.state.showDistrict &&
          (
            <>
              <Layer type='line' 
                sourceId={DROPDOWN_CHOICE[this.state.showDistrict].id}
                sourceLayer={DROPDOWN_CHOICE[this.state.showDistrict].layer}
                paint={{'line-color': '#044776', 'line-opacity': 0.3, 'line-width': 2 }} />
              <Layer 
                type='symbol' 
                paint={{ 'text-color': 'brown' }}
                layout={{'text-size': 12, 'text-field': ['get', DROPDOWN_CHOICE[this.state.showDistrict].text]}} 
                sourceId={DROPDOWN_CHOICE[this.state.showDistrict].id}
                sourceLayer={DROPDOWN_CHOICE[this.state.showDistrict].layer}
              />
            </>
          )
        }
        

      </Map>
    </>
  )

}

export default MapContainer;