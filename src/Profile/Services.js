import React, { Component } from 'react';
import {
  View,
  AsyncStorage
} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import firebase from '../../Config/firebase';
import { Avatar, Divider, Input, Text, Button, Icon  } from 'react-native-elements';
 

 

export default class Services extends Component {
static navigationOptions = {
    title: 'Add Services',
  };
  
  constructor(){
    super()
    this.state = {
      selectedItems: [],
      items: [
  {
    name: "Available Services",
    id: 2,
    icon: { uri: "https://cdn4.iconfinder.com/data/icons/free-crystal-icons/512/Gemstone.png" }  ,// material icons icon name
    children: []
  },
]
    }
  }

getProfile = async () => {
  let ss = await AsyncStorage.getItem('profile')
let profile = await JSON.parse(ss)
console.log('profile agaya', profile)

   this.setState({profile})
}

async  componentDidMount(){
 this.getProfile() 
   
      firebase.database().ref(`services/list`).once('value', snap => {
        console.log(snap.val())
          this.setState({
            items: [
  {
    name: "Available Services",
    id: 2,
    icon: { uri: "https://cdn4.iconfinder.com/data/icons/free-crystal-icons/512/Gemstone.png" }  ,// material icons icon name
    children: snap.val()
  },
]
          })
      })




}
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
    console.log(selectedItems)
  }
 
  render() {
    return (
      
      
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
        <View style={{flex: 1, alignSelf: 'stretch'}} >

      
        <SectionedMultiSelect
          items={this.state.items} 
          uniqueKey='id'
          subKey='children'
          iconKey='icon'
          selectText='Choose some things...'
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          onConfirm={() => console.log(this.state.selectedItems)}
        />
 

        </View>
        <View  >
        <Button
          onPress={() => {
              firebase.database().ref(`users/${this.state.profile.uid}/`).update({
                    services: this.state.selectedItems
              })
              this.props.navigation.navigate('Profile')
            }}
          title="Next"
          />
        </View>
      </View>

      
      
 
 
    );
  }
}