import {Location, Permissions} from 'expo';
import React from 'react';
import {AsyncStorage, Dimensions, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDoTc2HQ7MuRr74Z4tQjdsNshLuN04VIrI';
const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 24.8789349;
const LONGITUDE = 67.0644417;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function log(eventName, e) {
  console.log(eventName, e.nativeEvent);
}

class Directions extends React.Component {
  static navigationOptions = {
    title: 'Directions'
  };

  constructor(props) {
    super(props);

    this.state = {
      a: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE + SPACE
      }
    };
  }

  _getLocationAsync = async() => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status)
    if (status !== 'granted') {
      this.setState({errorMessage: 'Permission to access location was denied'});
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    this.setState({
      a: {
        latitude: location.coords.latitude + SPACE,
        longitude: location.coords.longitude + SPACE
      }
    });

  };

  async componentDidMount() {
    this._getLocationAsync()
    this.getProfile()

  }

  getProfile = async() => {
    let ss = await AsyncStorage.getItem('profile')
    let profile = await JSON.parse(ss)
    console.log('profile agaya', profile)

    this.setState({profile})
    const coordsDealer = this
      .props
      .navigation
      .getParam('loc')
    this.setState({coordsDealer})
  }

  render() {
    return (

      <View
        style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch'
      }}>
        <View style={{
          flex: 1,
          alignSelf: 'stretch'
        }}>
          <MapView
            provider={this.props.provider}
            style={styles.map}
            region={{
            latitude: this.state.a.latitude,
            longitude: this.state.a.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}>
            <Marker coordinate={this.state.a}></Marker>
            <Marker coordinate={this.state.coordsDealer}></Marker>

            <MapViewDirections
              origin={this.state.a}
              destination={this.state.coordsDealer}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"
              optimizeWaypoints={true}/>

          </MapView>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export default Directions