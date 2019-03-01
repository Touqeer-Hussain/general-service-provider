import React, { Component } from 'react';
import {
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { Contacts, Permissions } from 'expo'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import firebase from '../../Config/firebase'
import { Avatar, Divider, Input, Text, Button, Icon, ListItem  } from 'react-native-elements';
import { withNavigation, NavigationActions } from 'react-navigation';
 

 

class Friends  extends Component {
  static navigationOptions = {
    title: 'Contacts'
  };
  constructor(props){
    super(props);
    this.state = {
        list: [],
        usr: [],
        conts: [],
        done: null,
        profile: {}
      
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
let ss = await AsyncStorage.getItem('profile')
let profile = await JSON.parse(ss)
this.setState({profile})

          if (data.length > 0) {
              
              this.setState({
                list: data
              })
              data.map(l =>{
                this.state.conts.push(l.phoneNumbers[0].number)
              })
              
              firebase.database().ref(`users`).on('child_added', snap =>{
                  
                  if(snap.val().uid != profile.uid && this.state.conts.includes(snap.val().phoneNum) && snap.val().services){
                    
                    this.state.usr.push(snap.val())
                    this.setState({
                      done: true
                    })
                    
                  }
                 
                });
                
                
              
              
          }
  }



  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
    
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
    this.state.done && this.state.usr.map((l, i) => {
      
     return  <ListItem
        key={i}
        leftAvatar={{ source: { uri: l.photoURL } }}
        bottomDivider={true}
        title={l.name}
        subtitle={`Services: ` + l.services.join(', ')}
        onPress= {() => {
          
          this.props.screenProps.rootNav.navigate('Offer',{
            name: l
          })
        }}
        
      />
    })
  }
      
        
 

        </ScrollView>
        </View>
        // <View  >
        // <Button
        //   onPress={(e) => {
        //       console.log()
        //     }}
        //   title="Next"
        //   />
        // </View>
      

      
      
 
 
    );
  }
}


export default withNavigation(Friends) 