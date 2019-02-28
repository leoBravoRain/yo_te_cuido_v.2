import React, { Component } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  PermissionsAndroid,
  NetInfo,
  // Button,
  Picker,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import ImageZoom from 'react-native-image-pan-zoom';

class Image_Details extends Component {

  // Options for header bar
    static navigationOptions = ({ navigation }) => {
      return {
        title: "Detalles del peligro",
        headerRight: (
          <Icon
            raised
            name='map'
            type='font-awesome'  
            onPress={() => navigation.push('Dangers_Map')}
            color='#3f5fe0'
          />
        ),
        headerLeft: (
          <Icon
            raised 
            name='home'
            type='font-awesome'  
            onPress={() => navigation.navigate('Home')}
            color='#3f5fe0'
          />
        ),
      };
    };


  //Constructor
  constructor(props) {

    super(props);
  
  }

  // Render method
  render() {

    return (

      <View style = {styles.container_flex}>

        <ImageZoom 

          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height}

        >

          <Image

            source={{ uri: this.props.navigation.state.params.image_uri }}
            style={{ 
              // width: 400, 
              // height: 400,
              flex: 3,
              alignSelf: 'stretch',
              width: undefined,
              height: 250,
              margin: 10
              // borderRadius: 10,
            }}
            PlaceholderContent={<ActivityIndicator />}
            resizeMode="contain"

          /> 


        </ImageZoom>


      </View>

    );

  }

}

const styles = StyleSheet.create({

  image_background: {

    flex: 1,
    // remove width and height to override fixed static size
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center'

  },

  container_flex : {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex:1 ,
    justifyContent: 'center', 
    alignItems: 'center'
  },

  buttonStyle: {
    backgroundColor: "#3f5fe0",
    width: 300,
    height: 75,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 50,
    margin: 10,
    // borderColor: "red"
  }

})

export default withNavigation(Image_Details);