import React from 'react';
import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import Friends from './Friends';
import Nearby from './Nearby';

class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (<TabNavigator screenProps={{
      rootNav: this.props.navigation
    }}/>);
  }
}

const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
  Nearby,
  Friends
}, {initialRouteName: "Friends"}));

export default Home