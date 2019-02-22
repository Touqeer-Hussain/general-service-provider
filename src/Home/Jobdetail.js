import React from 'react';
import { Facebook, ImagePicker } from 'expo';
import { StyleSheet, View, AsyncStorage} from 'react-native';
import firebase from '../../Config/firebase';
import { Avatar, Divider, Input, Text, Button, Icon, Rating, Overlay  } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class Jobdetail extends React.Component {
static navigationOptions = {
    title: 'Job Details',
  };
  
constructor(props) {
    super(props);

    this.state = {

      profile: {},
      job: {},
      done: null,
      dealer: {},
      isVisible: false
    }
  }
  
  
async componentWillMount() {

    this.getProfile()
  }

  getProfile = async () => {

    let ss = await AsyncStorage.getItem('profile')
    let profile = await JSON.parse(ss)
    console.log('profile agaya', profile.uid)

   this.setState({profile})

    const job = this.props.navigation.getParam('job')
    this.setState({
        job
    },() =>{

      if(job[Object.keys(job)[0]].rId == profile.uid){
        firebase.database().ref(`users/${job[Object.keys(job)[0]].sId}`).once('value', snap  => {
              this.setState({
                dealer: snap.val()
              })
        })
      }else{
        firebase.database().ref(`users/${job[Object.keys(job)[0]].rId}`).once('value', snap  => {
          this.setState({
            dealer: snap.val()
          })
    })
      }
      


      this.setState({
        done: true
      })
      console.log(this.state.job[Object.keys(this.state.job)[0]].descrip)
    })
    
}
    

  
        
    
    
    
    
  render() {
      const { profile, job, dealer } = this.state
      
    return (
      this.state.done && <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          
          }}>
      
<View style={{
    alignItems: 'flex-start'
}}>
<Overlay
  isVisible={this.state.isVisible}
  width="auto"
  height="auto"
  onRequestClose={() =>{
    this.setState({
      isVisible: false
    })
  }}
>
  <Text>Rate</Text>
  <Rating
                  imageSize={40}
            
                  startingValue={0}
                  onFinishRating={
                    (e) => {
                        this.setState({
                          rate: e,
                          isVisible: false
                        }, () => {
                          firebase.database().ref(`users/${dealer.uid}/rating/${profile.uid}`).set({
                            'rate': this.state.rate
                          })
                        })
                    }
                  }
                  
            />

</Overlay>

<View style={{ flexDirection: 'row'}}><Text h4>{job[Object.keys(job)[0]].title}</Text></View>
<View style={{ flexDirection: 'row'}}><Text >{job[Object.keys(job)[0]].descrip}</Text></View>
<View style={{ flexDirection: 'row'}}><Text style={{fontSize: 20}}>Rs. </Text><Text h4 style={{ color: 'red'}}>{job[Object.keys(job)[0]].price}</Text></View>  

<View style={{ flexDirection: 'row'}}><Text style={{fontSize: 20}}>Status: </Text><Text h4>{job[Object.keys(job)[0]].status}</Text></View>

<View style={{ flexDirection: 'row'}}><Text style={{fontSize: 20}}>{profile.uid == job[Object.keys(job)[0]].rId ? 'Client: ': 'Server: '}</Text><Text h4>{dealer.name}</Text></View>
</View>

            <View>
            
            </View>

<View style={{
          
          flexDirection: "row",
          justifyContent: "center",
          
          }}>




</View>

<View  style={{
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'space-between'
  

}} ><Button 
    
  onPress= {() => {
          
    this.props.navigation.navigate('Directions',{
      loc: dealer.coords
    })
  }}
  title="Show on Map"
/>
<Button 
    
  onPress= {() => {
          
    this.props.navigation.navigate('Chat',{
      chatData: this.state.job
    })
  }}
  title="Chat"
/>


</View>


{ 

job[Object.keys(job)[0]].status == 'Pending' &&
<View>
  
  
  <Button
  onPress= {() => {
          
    firebase.database().ref(`job/${Object.keys(job)[0]}`).update({
      status: 'Accepted'
    })
    this.setState({
      done: true? false: true
    })
    this.props.navigation.goBack()

  }}
  title="Accept Offer"
/>

<Button buttonStyle={{
  backgroundColor: 'red'
}}
  onPress= {() => {
    firebase.database().ref(`job/${Object.keys(job)[0]}`).update({
      status: 'Rejected'
    })
    this.setState({
      done: true? false: true
    })    
    this.props.navigation.goBack()
    
  }}
  title="Reject Offer"
/>

</View>  || job[Object.keys(job)[0]].status == 'Accepted' &&
<View>
  
  
  <Button
  onPress= {() => {
          
     
    this.setState({
      isVisible: true
    })
    
    
  }}
  title="Rate"
/>

<Button buttonStyle={{
  backgroundColor: 'red'
}}
  onPress= {() => {
          console.log('end contract')
    firebase.database().ref(`job/${Object.keys(job)[0]}`).update({
      status: 'Completed'
    })    
    this.setState({
      done: true? false: true
    })
    this.props.navigation.goBack()
  }}
  title="End Contract"
/>

</View> || job[Object.keys(job)[0]].status == 'Rejected' &&
<View>
  
  
  <Button
  buttonStyle={{
    backgroundColor: 'red'
  }}
  onPress= {() => {
    firebase.database().ref(`job/${Object.keys(job)[0]}`).set({
    })    
    this.props.navigation.goBack()
    
  }}
  title="Delete"
/>


</View> || job[Object.keys(job)[0]].status == 'Completed' &&
<View>
  
  
  <Button
  onPress= {() => {
          
    this.setState({
      isVisible: true
    })
  }}
  title="Rate"
/>

<Button buttonStyle={{
  backgroundColor: 'red'
}}
  onPress= {() => {
          
    firebase.database().ref(`job/${Object.keys(job)[0]}`).set({
    })    
    this.setState({
      done: true? false: true
    })
    this.props.navigation.goBack()
  }}
  title="Delete"
/>

</View>
}
       </View>
    );
  }
}

