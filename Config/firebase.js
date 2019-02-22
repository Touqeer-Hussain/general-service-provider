import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyD191lrsjAIAwgSCV0wGfoPylvoU2C-RvU",
  authDomain: "test-site-saylani.firebaseapp.com",
  databaseURL: "https://test-site-saylani.firebaseio.com",
  projectId: "test-site-saylani",
  storageBucket: "test-site-saylani.appspot.com",
  messagingSenderId: "557939382502"
}

if (!firebase.apps.length) firebase.initializeApp(config);

export default firebase;
