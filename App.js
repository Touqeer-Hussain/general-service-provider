import {AppLoading, Font} from 'expo';
import React from 'react';
import {StyleSheet} from 'react-native';
import {createAppContainer, createStackNavigator} from "react-navigation";
import firebase from './Config/firebase';
import AdminChat from './src/Home/AdminChat';
import Chat from './src/Home/Chat';
import Directions from './src/Home/Directions';
import Home from './src/Home/Home';
import Job from './src/Home/Job';
import Jobdetail from './src/Home/Jobdetail';
import Offer from './src/Home/Offer';
import Login from './src/Login/Login';
import Menu from './src/Menu/Index';
import Contact from './src/Profile/Contact';
import Justi from './src/Profile/flex';
import MapPosition from './src/Profile/Location';
import Profile from './src/Profile/Profile';
import Services from './src/Profile/Services';

const AppNavigator = createAppContainer(createStackNavigator({
  Login,
  Profile,
  Services,
  MapPosition,
  Justi,
  Contact,
  Menu: {
    screen: Menu,
    navigationOptions: {
      title: 'Home'
    }

  },
  Offer,
  Job,
  Home,
  Jobdetail,
  Directions,
  Chat,
  AdminChat

}, {
  initialRouteName: firebase
    .auth()
    .currentUser
    ? 'Menu'
    : 'Login'

}));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      font: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf')});
    this.setState({font: true})
  }
  render() {

    if (!this.state.font) {
      return <AppLoading/>;
    }
    return <AppNavigator/>;

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App
