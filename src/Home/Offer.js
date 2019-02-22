import React from 'react';
import { Facebook, ImagePicker } from 'expo';
import { StyleSheet, View, AsyncStorage} from 'react-native';
import firebase from '../../Config/firebase';
import { Avatar, Divider, Input, Text, Button, Icon, Rating  } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class Offer extends React.Component {
static navigationOptions = {
    title: 'Profile',
  };
  
constructor(props) {
    super(props);

    this.state = {

      profile: {
        
        photoURL: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'
     
      },
      phoneNum: '',
      rating: []
    }
  }
  
  
async componentWillMount() {

    this.getProfile()
  }

  getProfile = async () => {
    const profile = this.props.navigation.getParam('name', 'Ali')
    this.setState({
        profile
    })

    if(profile.rating){
      firebase.database().ref(`users/${profile.uid}/rating`).on('child_added', snap => {
        this.state.rating.push(snap.val().rate)
    })
    
    let sum = this.state.rating.reduce((previous, current) => current += previous);
    let avg = sum / this.state.rating.length;
    this.setState({
      rateFound: avg
    })

    }
    
}
    

    
        
    
    
    
    
  render() {
      const { profile } = this.state
      
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          
          }}>
      
      
      <View style={{
     
      alignItems: 'center'
      
      }}>
      
      <Avatar
      size={200}
      rounded
      source={{
          uri: profile.photoURL
      }}
/>    
<Text h4>{profile.name}</Text>  
</View>
<View style={{
    alignItems: 'flex-start'
}}>


<View style={{ flexDirection: 'row'}}><Text style={{fontSize: 20}}>Services: </Text><Text h4>{profile.services.join(', ')}</Text></View>
<View style={{ flexDirection: 'row'}}><Text style={{fontSize: 20}}>E-Mail: </Text><Text h4>{profile.email}</Text></View>
<View style={{ flexDirection: 'row'}}><Text style={{fontSize: 20}}>Mobile No. </Text><Text h4>{profile.phoneNum}</Text></View>





</View>

            <View>
            <View>
            {this.state.rateFound && <Rating
                  imageSize={40}
                  readonly
                  startingValue={this.state.rateFound}
                  
            /> }
            </View>
            </View>

<View style={{
          
          flexDirection: "row",
          justifyContent: "center",
          
          }}>




</View>
<View><Button
  onPress= {() => {
          
    this.props.navigation.navigate('Job',{
      name: this.state.profile
    })
  }}
  title="Send Offer"
/></View>

       </View>
    );
  }
}

