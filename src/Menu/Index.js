import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import MyProfile from './myProfile';
import Jobs from './Jobs';
import Home from '../Home/Home'
import Jobslist from './JobsList'


class Index extends React.Component {
  render() {
    return (
      <View >
        
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator({
        Home,
        MyProfile: {
          screen: MyProfile,
          title: 'Profile'
          
        },
        Jobslist
        },{
          initialRouteName: 'Home'
        });

export default createAppContainer(TabNavigator)