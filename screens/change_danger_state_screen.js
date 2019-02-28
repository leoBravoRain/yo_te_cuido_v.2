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
  ScrollView,
  Picker,
   // AppRegistry,
  PixelRatio,
  TouchableOpacity,
  TextInput,
  ProgressBarAndroid
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps'

// Index for item form
index = 0;

class Change_Danger_State extends Component {

  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Cambiar estado",
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

    this.state = {

      danger_state: this.props.navigation.state.params.marker.state,

    };

  }

  componentDidMount(){

  }

  // Componente will mount
  componentWillMount(){

  }


  // manage click on button 
  manage_click(){

    // Variable for send danger to server
    var every_data_filled = true;

    // Message for user because there is a problem
    var message;

    // Add danger to server

    // Server url
    var url_server;

    // Add parameters to post request

    // If there is a comment
    if(this.state.danger_state != null){

      // Add video of place to server
      url_server = "http://yotecuido.pythonanywhere.com/update_danger/" + this.props.navigation.state.params.marker.id + "/" + this.state.danger_state + "/";

    }

    // If there isn't comment
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes seleccionar el estado";

    }

    // It there are all data
    if(every_data_filled){

      // Send data to server
      fetch(url_server, {

        method: 'GET',

      })

      .catch((error) => {

        console.error(error);

      })

      // Alert for response user
      Alert.alert(
        'Alerta de peligro',
        'Acabas de cambiar el estado del peligro',
        [
          {text: 'Seguiré atento a otros posibles peligros', onPress: () => console.log('Ask me later pressed')},
        ],
        { cancelable: false }
      )

      // Back to home
      this.props.navigation.push("Home");
      
    }

    // IF there is a problem
    else{

      // Alert for user response
      Alert.alert(

        'Tuvimos un problema',
        message,

        [
          {text: 'Intentarlo de nuevo', onPress: () => console.log('Ask me later pressed')},
        ],

        { cancelable: false }

      )

    }

  }

  // Render method
  render() {

    return (

        <View style = {styles.container_flex}>

          <Picker

            selectedValue={this.state.danger_state}
            style={{height: 50, width: 200}}
            onValueChange={(itemValue, itemIndex) =>

              this.setState({danger_state: itemValue})

            }>

            <Picker.Item label="Sin control" value="sin_control" />

            <Picker.Item label="Controlado" value="controlado" />

            <Picker.Item label="Eliminado" value="eliminado" />

          </Picker>


          <Button
            outline
            title = "Cambiar estado de peligro"
            onPress = {this.manage_click.bind(this)}
            buttonStyle = {styles.buttonStyle}
          />
          
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

    flex:1 ,
    justifyContent: 'center', 
    alignItems: 'center'
  },

  buttonStyle: {
    backgroundColor: "#3f5fe0",
    // width: 300,
    // height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    // borderColor: "white",
    // borderRadius: 5
    elevation: 5,
    margin: 30,
    padding: 10,
  },

  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 50,
  },
  avatar: {
    borderRadius: 30,
    width: 300,
    height: 300,
  },

})

export default withNavigation(Change_Danger_State);