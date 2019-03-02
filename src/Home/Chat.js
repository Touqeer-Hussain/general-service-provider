import React, {Component} from 'react';
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import firebase from '../../Config/firebase';

export default class Chat extends Component {
  static navigationOptions = {
    title: 'Chat'
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      msg: '',
      done: null
    };
  }

  async componentDidMount() {
    this.getProfile()

  }
  getProfile = async() => {

    let ss = await AsyncStorage.getItem('profile')
    let profile = await JSON.parse(ss)
    console.log('profile agaya', profile.uid)
    this.setState({profile, data: []})

    const job = this
      .props
      .navigation
      .getParam('chatData');
    this.setState({
      job
    }, () => {

      firebase
        .database()
        .ref(`jo b/${Object.keys(job)[0]}/chat`)
        .on('child_added', snap => {
          console.log('msg')
          this
            .state
            .data
            .push({
              id: snap.key,
              message: snap
                .val()
                .message,
              type: snap
                .val()
                .uid == profile.uid
                ? 'out'
                : 'in',
              date: snap
                .val()
                .time
            })

          this.setState({
            done: true
              ? false
              : true
          })
          // this.refs.scroll.scroll
        })

    })

  }

  renderDate = (date) => {
    var raw = new Date(-date).toISOString()
    var f = raw.split('.')
    var h = f[0].split('T')

    return (
      <Text style={styles.time}>
        {h[0] + '\n' + h[1]}
      </Text>
    );
  }

  render() {
    const {job, msg, profile} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          ref={ref => this.scrollView = ref}
          onContentSizeChange={() => {
          this
            .scrollView
            .scrollToEnd({animated: true})
        }}
          data={this.state.data}
          keyExtractor=
          {(item) => { return item.id; }}
          renderItem={(message) => {
          const item = message.item;
          let inMessage = item.type === 'in';
          let itemStyle = inMessage
            ? styles.itemIn
            : styles.itemOut;
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
            <TextInput
              style={styles.inputs}
              placeholder="Write a message..."
              underlineColorAndroid='transparent'
              onChangeText={(msg) => this.setState({msg})}/>
          </View>

          <TouchableOpacity
            style={styles.btnSend}
            onPress={() => {
            firebase
              .database()
              .ref(`job/${Object.keys(job)[0]}/chat`)
              .push()
              .set({
                message: msg,
                uid: profile.uid,
                time: -Date.now()
              });
            this.render();
            this.setState({done: true})
          }}>
            <Image
              source={{
              uri: "https://png.icons8.com/small/75/ffffff/filled-sent.png"
            }}
              style={styles.iconSend}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingHorizontal: 17
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5
  },
  btnSend: {
    backgroundColor: "#00BFFF",
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center'
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20
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
    fontSize: 12,
    color: "#808080"
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#eeeeee",
    borderRadius: 300,
    padding: 5
  }
});