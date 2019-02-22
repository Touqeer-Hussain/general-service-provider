import React, { Component } from 'react';
import {
  View,
  ScrollView
} from 'react-native';
import { Contacts, Permissions } from 'expo'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import firebase from '../../Config/firebase';
import { Avatar, Divider, Input, Text, Button, Icon, ListItem  } from 'react-native-elements';
 

 

export default class Contact extends Component {
  static navigationOptions = {
    title: 'Contacts on GSP'
  };
  constructor(){
    super()
    this.state = {
        list: []
      
    }
  }

  
  async componentDidMount(){
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    if(status == 'granted'){
            this.getContact()
        }
      
}

getContact = async () =>{
const { data } = await Contacts.getContactsAsync({});
  
          if (data.length > 0) {
              console.log(data.length)
              this.setState({
                list: data
              })
              console.log(this.state.list)
          }
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
        <ScrollView style={{flex: 1, alignSelf: 'stretch'}} >
 {
    this.state.list.map((l, i) => (
      <ListItem
        key={i}
        // leftAvatar={{ source: { uri: l.avatar_url } }}
        bottomDivider={true}
        title={l.name}
        subtitle={l.phoneNumbers[0].number}
        onPress= {() => {
            console.log('yes')
        }}
        
      />
    ))
  }
      
        
 

        </ScrollView>
        <View  >
        <Button
          onPress={(e) => {
              console.log()
            }}
          title="Next"
          />
        </View>
      </View>

      
      
 
 
    );
  }
}