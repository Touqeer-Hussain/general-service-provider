import React from 'react';
import { Text, View, Button } from 'react-native';


export default class FrontList extends React.Component {
  
  constructor(){
    super()
    this.state ={

    }
  }

  withinRadius(point, interest) {
    
     let R = 6371;
     let deg2rad = (n) => { return Math.tan(n * (Math.PI/180)) };
   
     let dLat = deg2rad(interest.lat - point.lat );
     let dLon = deg2rad( interest.lng - point.lng );
   
     let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(point.lat)) * Math.cos(deg2rad(interest.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
     let c = 2 * Math.asin(Math.sqrt(a));
     let d = R * c;
    console.log(d)
     return (d <= 100);
   }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>FrontList</Text>
      </View>
    );
  }
}
