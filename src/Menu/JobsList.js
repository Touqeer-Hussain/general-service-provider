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
import { database } from 'firebase';
 

 

class Jobslist  extends Component {
  static navigationOptions = {
    
  };
  constructor(props){
    super(props);
    this.state = {
        list: [],
        usr: [],
        conts: [],
        done: null
      
    }
  }

  
  async componentWillMount() {

    
  

  this.willFocusListener = this.props.navigation.addListener(
    'didFocus',
    () => {
      this.setState({
        usr: []
      })
      this.getProfile()
    }
  )
}

componentWillUnmount() {
  this.willFocusListener.remove()
}

  getProfile = async () => {
    let ss = await AsyncStorage.getItem('profile')
let profile = await JSON.parse(ss)


   this.setState({profile}, () =>{
    firebase.database().ref(`job`).on('child_added', snap =>{
      
      
    if(profile.uid == snap.val().rId || profile.uid == snap.val().sId){
        console.log(snap.key, snap.val())
        this.state.usr.push({[snap.key] :snap.val()})
        this.setState({
          done: true
        })
      }
  })
  

  
   })
}
 
  render() {
      console.log('screeen')
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
        bottomDivider={true}
        title={l[Object.keys(l)[0]].title}
        subtitle={`Job Type: ` + l[Object.keys(l)[0]].jobType +  `\n` + 'Status: ' + l[Object.keys(l)[0]].status}
        onPress= {() => {
          
          this.props.navigation.navigate('Jobdetail',{
            job: l
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


export default withNavigation(Jobslist) 