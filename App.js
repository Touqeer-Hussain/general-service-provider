import React from 'react';
import { StyleSheet, View, Platform, Text, AsyncStorage } from 'react-native';
import { createAppContainer, createStackNavigator } from "react-navigation";
import { AppLoading, Font } from 'expo'
import firebase from './Config/firebase'
import Login from './src/Login/Login';
import Profile from './src/Profile/Profile';
import MapPosition from './src/Profile/Location';
import Services from './src/Profile/Services';
import Justi from './src/Profile/flex'
import Contact from './src/Profile/Contact'
import Menu from './src/Menu/Index'
import Offer from './src/Home/Offer'
import Job from './src/Home/Job'
import Home from './src/Home/Home'
import Jobdetail from './src/Home/Jobdetail';
import Directions from './src/Home/Directions';
import Chat from './src/Home/Chat'





  
  





const AppNavigator = createAppContainer(
    createStackNavigator(
      {
        Login,
        Profile,
        Services,
        MapPosition,
        Justi,
        Contact,
        Menu: {
          screen: Menu,
          headerMode: 'none',
          navigationOptions: {
              headerVisible: false,
          }
        },
        Offer,
        Job,
        Home,
        Jobdetail,
        Directions,
        Chat,
        
      },
      {
        initialRouteName: firebase.auth().currentUser ? 'Menu' : 'Login'
      
        }
      
    )
  );
  

class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      font: false
    }
  }

  async componentWillMount(){
    await Font.loadAsync({
      'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf'),
    });
    this.setState({
      font: true
    })
  }
  render() {
    
      if (!this.state.font) {
        return <AppLoading />;
      }
      return <AppNavigator />;
    
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App
