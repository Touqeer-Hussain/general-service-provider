import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    TextInput,
    FlatList,
    Button,
    AsyncStorage
  } from 'react-native';
import { Contacts, Permissions } from 'expo'
import firebase from '../../Config/firebase'


export default class AdminChat extends Component {
  static navigationOptions = {
    title: 'Admin Chat',
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [
        
      ],
      msg: '',
      done: null
    };
  }

async componentDidMount(){
this.getProfile()

}
  getProfile = async () => {
    let profile = this.props.navigation.getParam('profile');
    
    
    console.log('profile agaya', profile.uid)
      this.setState({profile, data: []}, () => {


        firebase.database().ref(`users/${profile.uid}/adminchat`).on('child_added', snap => {
            console.log('msg', snap.val().message)
              this.state.data.push({
                id: snap.key,
                message: snap.val().message,
                type: snap.val().uid == profile.uid ? 'out' : 'in',
                date: snap.val().time
              })
              
              this.setState({
                done: true? false: true
              })
              // this.refs.scroll.scroll
          })


      })
        

        

    
        
       

    
  
}

  renderDate = (date) => {
    var raw = new Date(-date).toISOString()
    var f = raw.split('.')
    var h = f[0].split('T')

    return(
      <Text style={styles.time}>
        {h[0] + '\n' + h[1]}
      </Text>
    );
  }

  render() {
      const {  msg, profile } = this.state;
    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
            ref={ref => this.scrollView = ref}
          onContentSizeChange={() => {
            
              this.scrollView.scrollToEnd({animated: true}) 
            }}
        
          data={this.state.data}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={(message) => {
            
            const item = message.item;
            let inMessage = item.type === 'in';
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View style={[styles.item, itemStyle]}>
                {!inMessage && this.renderDate(item.date)}
                <View style={[styles.balloon]}>
                  <Text>{item.message}</Text>
                </View>
                {inMessage && this.renderDate(item.date)}
              </View>
            )
          }}/>
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Write a message..."
                underlineColorAndroid='transparent'
                value={msg}
                onChangeText={(msg) => this.setState({msg})}/>
                
          </View>

            <TouchableOpacity style={styles.btnSend} onPress={() => {
                firebase.database().ref(`users/${profile.uid}/adminchat`).push().set({
                  message: msg,
                  uid: profile.uid,
                  time: -Date.now()
                })
                
                this.setState({
                  done: true,
                  msg: ''
                })
                this.render()
            }}>
              <Image source={{uri:"https://png.icons8.com/small/75/ffffff/filled-sent.png"}} style={styles.iconSend}  />
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  list:{
    paddingHorizontal: 17,
  },
  footer:{
    flexDirection: 'row',
    height:60,
    backgroundColor: '#eeeeee',
    paddingHorizontal:10,
    padding:5,
  },
  btnSend:{
    backgroundColor:"#00BFFF",
    width:40,
    height:40,
    borderRadius:360,
    alignItems:'center',
    justifyContent:'center',
  },
  iconSend:{
    width:30,
    height:30,
    alignSelf:'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    height:40,
    flexDirection: 'row',
    alignItems:'center',
    flex:1,
    marginRight:10,
  },
  inputs:{
    height:40,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start'
  },
  itemOut: {
    alignSelf: 'flex-end'
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize:12,
    color:"#808080",
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor:"#eeeeee",
    borderRadius:300,
    padding:5,
  },
});