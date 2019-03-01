import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  ImageBackground,
  Text
} from 'react-native';

import { 
  withNavigation
} from 'react-navigation';


// Loading screen just for load app launching screens
class Loading_Screen extends React.Component {

  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {

    // Get token 
    const first_time_launch = await AsyncStorage.getItem('first_time_launch');

    // console.log(first_time_launch);

    // This will switch to the App screen or Introduction screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(first_time_launch == "true" ? 'App' : 'Introduction');

  };

  // Render any loading content that you like here
  render() {

    return (

      <View style={styles.container}>

        <ImageBackground 
          // source={{uri: 'https://previews.123rf.com/images/stocking/stocking1209/stocking120900044/15271577-portrait-of-an-happy-worker-in-a-factory.jpg'}}
          source = {require('../images/background.jpg')}
          style={styles.image_background}
          resizeMode='cover'
          blurRadius={0.4} 
          >

          <Text 

            style = {{

              marginBottom: 30,
              color: "white",
              fontSize: 40,
              fontWeight: '500',
              backgroundColor: 'rgba(63,95,224,0.7)',
              padding: 20,
              borderRadius: 50,
              elevation:6,

            }}
           
           >

            Yo te cuido

          </Text>

          <ActivityIndicator color="white" size="large"/>

          <StatusBar barStyle="default" />

        </ImageBackground>

      </View>

    );

  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image_background: {

    flex: 1,
    // remove width and height to override fixed static size
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center'

  },
});


export default withNavigation(Loading_Screen);