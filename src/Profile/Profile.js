import React from 'react';
import { Facebook, ImagePicker, AppLoading, Font } from 'expo';
import { StyleSheet, View, AsyncStorage} from 'react-native';
import firebase from '../../Config/firebase';
import { Avatar, Divider, Input, Text, Button, Icon  } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class Profile extends React.Component {
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
      font: false
    }
  }
  
  handleNav = () =>{
      this.props.navigation.navigate('MapPosition')
  }
async componentWillMount() {

  await Font.loadAsync({
    'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf'),
    'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')
  });
  this.setState({
    font: true
  })

this.getProfile()   
   
  }

  getProfile = async () => {
  let ss = await AsyncStorage.getItem('profile')
let profile = await JSON.parse(ss)
console.log('profile agaya', profile)

   this.setState({profile})
}
    

    
    
 handleEdit = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });



    if (!result.cancelled) {
      // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
      const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', result.uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(`${this.state.profile.uid}/profile`);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
   let url =  await snapshot.ref.getDownloadURL();
   firebase.database().ref(`users/${this.state.profile.uid}/`).update({
     photoURL: url
   })
   this.setState({
     profile: {photoURL: url}
   })
    }
  };
    
    
    
    
    
  render() {
    if(!this.state.font){
      return <AppLoading/>
    }

  
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
          uri: this.state.profile.photoURL
      }}
      showEditButton
      onEditPress={this.handleEdit.bind(this)}
/>      

<Text h4>Change Profile Picture</Text>


</View>

            <View>
  
<Input
  placeholder='Please enter mobile no...'
  rightIcon={{ type: 'font-awesome', name: 'phone' }}
  shake={true}
  label='Mobile No.'
  errorStyle={{ color: 'red' }}
  errorMessage=''
  autoComplete='tel'
  value={this.state.phoneNum}
  onChangeText={(e) => {
    console.log(e)
    this.setState({
    phoneNum: e
  })}
  }
/>          
            </View>

<View style={{
          
          flexDirection: "row",
          justifyContent: "center",
          
          }}>

<Button
 onPress={() => {
    
    this.props.navigation.navigate('Services')
  }}
  title="Add Services"
/>


</View>
<View><Button
  onPress={() => {
    firebase.database().ref(`users/${this.state.profile.uid}/`).update({
     phoneNum: this.state.phoneNum
   })
   this.props.navigation.navigate('MapPosition')
  }}
  title="Next"
/></View>

       </View>
    );
  }
}

