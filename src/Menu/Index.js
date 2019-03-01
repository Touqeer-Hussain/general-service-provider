import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import MyProfile from './myProfile';
import Search from './Search';
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
        Search,
        Jobslist,

          MyProfile: {
            screen: MyProfile,
            navigationOptions : {
              title: 'Profile',
              
            }
            
          },
        
        },{
          initialRouteName: 'Home'
        });

export default createAppContainer(TabNavigator)