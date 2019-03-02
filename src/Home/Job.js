import React from 'react';
import { AsyncStorage, Picker, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import firebase from '../../Config/firebase';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class Job extends React.Component {
static navigationOptions = {
    title: 'Job Description',
  };
  
constructor(props) {
    super(props);

    this.state = {
            profile: {},
            title: '',
            descrip: '',
            price: '',
            jobType: '',
            feth: null,
            my: ''
      
    }
  }
  
  
async componentWillMount() {

    this.getProfile()
    this.getMy()
  }

  getProfile = async () => {
    const prof = this.props.navigation.getParam('name')
    this.setState({
        profile: prof
    }, () => {
        this.setState({
            feth: true
        })
    })
    
}
    

    getMy = async () => {
        const fth = await AsyncStorage.getItem('profile')
        const  my = await JSON.parse(fth)
        this.setState({
            my
        })
    }
        
    
    
    
    
  render() {
      const { profile, my } = this.state
      
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          
          }}>
      
      
      <View style={{
     
  
      
      }}>
      <Input
  placeholder='Title'
  value={this.state.title}
  onChangeText={e => {

      this.setState({
          title: e
      })
  }}
  
/>


<Input
  placeholder='Description'
  
         multiline = {true}
         numberOfLines = {9}
         value={this.state.descrip}
        onChangeText={e => {
      this.setState({
          descrip: e
      })
  }}
/>

</View>


            <View>
                
                <Input
                  placeholder='Price'
                  keyboardType = 'numeric'
                  value={this.state.price}
                onChangeText={e => {
                this.setState({
                        price: e
                })
  }}
  
                />
                
            </View>
            <View>
            <Picker
  selectedValue={this.state.jobType}
  
  
  onValueChange={(itemValue, itemIndex) =>
    this.setState({jobType: itemValue})}
>
    <Picker.Item label="Job Type" value="" />
    {profile.services.map((i, l) => {
        return <Picker.Item label={i} value={i} key={l} />
    })}
  
</Picker>
            </View>

<View style={{
          
          flexDirection: "row",
          justifyContent: "center",
          
          }}>




</View>
<View><Button
  onPress= {() => {
          
          firebase.database().ref(`job`).push().set({
            title: this.state.title,
            descrip: this.state.descrip,
            price: this.state.price,
            jobType: this.state.jobType,
            rId: this.state.profile.uid,
            sId: my.uid,
            status: 'Pending'
        }).then(() => {
          this.props.navigation.goBack()
        })

  }}
  title="Confirm"
/></View>

       </View>
    );
  }
}

