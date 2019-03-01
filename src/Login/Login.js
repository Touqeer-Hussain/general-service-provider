import React from 'react';
import { Facebook } from 'expo';
import { StyleSheet, View, Text, AsyncStorage} from 'react-native';
import firebase from '../../Config/firebase';
import { Button, ThemeProvider, SocialIcon } from 'react-native-elements';


export default class Login extends React.Component {
  static navigationOptions = {
    title: 'Login',
    headerStyle: {
      backgroundColor: '#0091EA',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      logged: 'true',
    };
  }
  handleLogin = async () => {


    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(async () => {
    
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('296322607749454', {
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        const CREDENTIAL = firebase.auth.FacebookAuthProvider.credential(token);

        const data = await firebase
          .auth()
          .signInAndRetrieveDataWithCredential(CREDENTIAL)
          .catch(error => console.error(error));
          const { uid, displayName, email, photoURL } = data.user.providerData[0];
                    
             firebase.database().ref("users/" + uid).once('value', async snap =>{
                    if(!snap.val() || snap.val().init == 1){
                          firebase.database().ref("users/" + uid).set({
                              name: displayName,
                              email,
                              photoURL: photoURL + '?type=large',
                              init: 1,
                              uid,
                              status: true
                          });
                        await AsyncStorage.setItem('profile',JSON.stringify({
                              name: displayName,
                              email,
                              photoURL: photoURL + '?type=large',
                              init: 1,
                              uid,
                              status: true
                        }), (e) => console.log(e))
                        console.log('init', snap.val())
                        this.props.navigation.replace('Profile')
                    }else{
                           firebase.database().ref("users/" + uid).once('value', async snap =>{
                                if(snap.val().status != true){
                                  alert(`Your account is deactivated`);
                                }else{
                                  
                                  await AsyncStorage.setItem('profile',JSON.stringify(snap.val()))
                                  this.props.navigation.replace('Menu')
                                }
                                
                              

                           })
                          

                    }

              })
          
        
                    // firest login setup
                    
          
         
        
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
    
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
        <SocialIcon
          title="Sign In With Facebook"
          button
          type="facebook"
          onPress={ this.handleLogin.bind(this) }
        />

        
      </View>
    );
  }
}
