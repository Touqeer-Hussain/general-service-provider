import React, { Component } from 'react';
import {
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { Contacts, Permissions, Location } from 'expo'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import firebase from '../../Config/firebase'
import { Avatar, Divider, Input, Text, Button, Icon, ListItem  } from 'react-native-elements';
 

 

export default class Nearby extends Component {
  static navigationOptions = {
    title: 'Nearby'
  };
  constructor(props){
    super(props)
    this.state = {
        list: [],
        coords: {},
        done: null,
        profile: {}
      
    }
  }

  
  async componentDidMount(){
      this._getLocationAsync()  
      
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
  
  this.setState({
    coords: {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude 
    }
  }, () =>{
    this.getUsers()
  });
  
};


withinRadius(point, interest) {
    
  let R = 6371;
  let deg2rad = (n) => { return Math.tan(n * (Math.PI/180)) };

  let dLat = deg2rad(interest.latitude - point.latitude );
  let dLon = deg2rad( interest.longitude - point.longitude );

  let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(point.latitude)) * Math.cos(deg2rad(interest.latitude)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let d = R * c;
 
  return (d <= 100);
}



getUsers = async () =>{

  
  let ss = await AsyncStorage.getItem('profile')
  let profile = await JSON.parse(ss)
  this.setState({profile})

              firebase.database().ref(`users`).on('child_added', snap =>{
                  
                  

                  if(snap.val().uid != profile.uid && snap.val().coords && this.withinRadius(this.state.coords,snap.val().coords) && snap.val().services){
                    
                    this.state.list.push(snap.val())
                    
                    this.setState({
                      done: true
                    })
                    
                  }
                 
                });
     
}



  
 
  render() {
    return (
      
      
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
        <ScrollView style={{flex: 1, alignSelf: 'stretch'}} >
 {
    this.state.done && this.state.list.map((l, i) => {
      
     return  <ListItem
        key={i}
        leftAvatar={{ source: { uri: l.photoURL } }}
        bottomDivider={true}
        title={l.name}
        subtitle={`Services: ` + l.services.join(', ')}
        onPress= {() => {
          
          this.props.screenProps.rootNav.navigate('Offer',{
            name: l
          })
        }}
        
      />
    })
  }
      
        
 

        </ScrollView>
        </View>
        // <View  >
        // <Button
        //   onPress={(e) => {
        //       console.log()
        //     }}
        //   title="Next"
        //   />
        // </View>
      

      
      
 
 
    );
  }
}