import React from 'react';
import { Text, View, ScrollView, AsyncStorage } from 'react-native';
import { AppLoading, Font } from 'expo'
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { SearchBar, ListItem } from 'react-native-elements';
import firebase from '../../Config/firebase'



class Search extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      query: '',
      font: false,
      list: [],
        usr: [],
        conts: [],
        done: null,
        profile: {}
    }
  }

  async componentWillMount(){
    await Font.loadAsync({
      'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf'),
      'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')
    });
    this.setState({
      font: true
    })
    this.getContact()
  }



  
getContact = async () =>{
  
  let ss = await AsyncStorage.getItem('profile')
  let profile = await JSON.parse(ss)
  this.setState({profile}, () => {
                      
    firebase.database().ref(`users`).on('child_added', snap =>{
                    
      if(snap.val().uid != profile.uid && snap.val().services){
        console.log('Search',snap.val())
        this.state.usr.push(snap.val())
        this.setState({
          done: true
        })
        
      }
     
    });
    
    
  

  })
  
  
                
            
    }
  
  

  render() {
    const {query, font} = this.state
      if(!font){
        return <AppLoading/>
      }
    
      return    <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}>
      <SearchBar
                  placeholder="Type Here..."
                  onChangeText={(e) => {
                    this.state.usr.splice(0,this.state.usr.length)
                    this.setState({
                      query: e,
                    })
                    
                    var sear = new RegExp(e, 'gi');
                    console.log(e)
                    firebase.database().ref(`users`).on('child_added', snap =>{
                    
                      if(snap.val().uid != this.state.profile.uid &&  snap.val().services && ( snap.val().services.join(' ').match(sear) != null  ||  snap.val().phoneNum.match(sear) != null)){
                       
                        this.state.usr.push(snap.val())
                        this.setState({
                          done: true
                        })
                        
                      }
                     
                    });
                  }}
                  value={query} />
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
          
          this.props.navigation.navigate('Offer',{
            name: l
          })
        }}
        
      />
    })
  }
      
        
 

        </ScrollView>
        
      
      </View>
    
  }
}

export default Search