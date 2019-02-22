import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  AsyncStorage
} from 'react-native';

import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import { Avatar, Divider, Input, Text, Button, Icon  } from 'react-native-elements';
import { Constants, Location, Permissions } from 'expo';
import firebase from '../../Config/firebase'



const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 24.8789349;
const LONGITUDE = 67.0644417;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function log(eventName, e) {
  console.log(eventName, e.nativeEvent);
}

class MapPosition extends React.Component {
  static navigationOptions = {
    title: 'Select Location'
  };
  
  constructor(props) {
    super(props);

    this.state = {
      a: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE + SPACE,
      }
    };
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status)
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    this.setState({ a: {
      latitude: location.coords.latitude + SPACE,
      longitude: location.coords.longitude + SPACE
    } });
    
  };

 async componentDidMount(){
     this._getLocationAsync()
     this.getProfile()
  
}

  getProfile = async () => {
      let ss = await AsyncStorage.getItem('profile')
      let profile = await JSON.parse(ss)
      console.log('profile agaya', profile)

   this.setState({profile})
}

  render() {
    return (

      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
        <View style={{flex: 1, alignSelf: 'stretch'}} >
        <MapView
          provider={this.props.provider}
          style={styles.map}
          region={{
            latitude: this.state.a.latitude,
            longitude: this.state.a.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker
            draggable
            coordinate={this.state.a}
            onDragEnd={(e) => this.setState({a: e.nativeEvent.coordinate })}
          >
          </Marker>
        </MapView></View>
        <View  >
        <Button
          onPress={() => {
    firebase.database().ref(`users/${this.state.profile.uid}/`).update({
        coords: this.state.a,
        init: 0
   })
   this.props.navigation.replace('Menu')
            }}
          title="Next"
          />
        </View>
      </View>

    );
  }
}



const styles = StyleSheet.create({
  // container: {
  //   ...StyleSheet.absoluteFillObject,
  //   flex: 1,
  //   flexDirection: 'column',
  //   justifyContent: 'flex-end',
  // },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapPosition