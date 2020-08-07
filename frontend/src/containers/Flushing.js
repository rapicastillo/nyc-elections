import React from 'react';
import MapContainer from './MapContainer';

class Flushing extends React.Component {

  render = () => {
    return (
      <div style={{ width: '100%', height: '100%'}}>
        <MapContainer />
      </div>
    )
  }
}

export default Flushing;