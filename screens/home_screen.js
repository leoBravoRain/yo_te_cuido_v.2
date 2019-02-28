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
  Picker
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { NavigationActions, withNavigation } from 'react-navigation';
import GPSState from 'react-native-gps-state';


// Permissions
async function requestLocationPermission() {

  try {

    // const granted = await PermissionsAndroid.request(
    const granted = await PermissionsAndroid.requestMultiple(

      [

        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // {
        //   'title': 'Permiso para localización',
        //   'message': 'Para entregarte el mejor servicio, necesitas darnos el permiso para acceder a tu posición actual'
        // },

        PermissionsAndroid.PERMISSIONS.CAMERA,
        // {
        //   'title': 'Cool Photo App Camera Permission',
        //   'message': 'Cool Photo App needs access to your camera '
        // }

      ]

    )

  } catch (err) {
    console.warn(err)
  }
}

// ask for permissions
requestLocationPermission();

class HelloWorldApp extends Component {

  // hide nav bar
  static navigationOptions = {

    header: null,

  }

  //Constructor
  constructor(props) {

    super(props);
  
  }

  componentDidMount(){

    // url server
    const url_server = "http://yotecuido.pythonanywhere.com/dangers/";

    // connect to server for wake up server
    fetch(url_server, {

      method: 'GET',

    });

  }

  // Manage danger map
  dangers_map(){

    // Analize if network and GPS is activated
    this.analize_network_connection_and_GPS("Dangers_Map");

  }

  analize_network_connection_and_GPS(go_to){

    // initialize network connection variable
    var connection_state = false;

    // Get network connection
    NetInfo.getConnectionInfo().then((connectionInfo) => {

      // get connection state
      connection_state = connectionInfo.type != "none" ? true : false;

      // If isn't connected to internet
      if(!connection_state){

        // Alert message for user
        Alert.alert(
          'Conección a internet',
          'Para poder usar nuestra app, debes estar conectado a internet',
          [
            {text: 'Me conectaré'},
          ],
          { cancelable: false }
        )

      }

    });

    // Get gps state
    GPSState.getStatus().then((status)=>{

      // Initialize variable
      var gps_state = false;

      // If gps is activated
      if(status == 3 || status == 4){

        // Set state
        gps_state = true;

        // push to next page
        if(connection_state && gps_state){

          // Navitage to next page
          this.props.navigation.push(go_to);     

        };

      }

      // If gps is not activated
      else{

        // Dialog for accesor to user location
        LocationServicesDialogBox.checkLocationServicesIsEnabled({

          message: "<h2>Tu ubicación</h2> Para poder mostrarte los mejores lugares, necesitamos saber tu ubicación actual.",
          ok: "Activar ubicación",
          cancel: "No permitir",
          
        });

      }
     
    });

  }
  // manage click on button 
  manage_click(){

    // Analize if network and GPS is activated
    this.analize_network_connection_and_GPS("Add_Danger");

  }

  // Render method
  render() {

    return (

      <View style = {styles.container_flex}>

        <ImageBackground 
          // source={{uri: 'https://previews.123rf.com/images/stocking/stocking1209/stocking120900044/15271577-portrait-of-an-happy-worker-in-a-factory.jpg'}}
          source = {require('../images/background.jpg')}
          style={styles.image_background}
          resizeMode='cover'
          blurRadius={0.4} 
          >

          <Button

            outline

            title = {"Informar peligro"}

            onPress = {this.manage_click.bind(this)}

            buttonStyle={styles.buttonStyle}

            icon = {{

              name : "comment",
              type: "font-awesome",
              size: 30,
              color: "white",
              padding: 5,

            }}
          />

          <Button

            outline

            title = {"Ver mapa de peligros"}

            onPress = {this.dangers_map.bind(this)}

            buttonStyle={styles.buttonStyle}

            icon = {{

              name: "map",
              type: "font-awesome",
              size: 30,
              color: "white",
              padding: 5,

            }}

          />

          <Button

            outline

            title = {"Envíanos tus sugerencias"}

            onPress = {() => this.props.navigation.push("Send_Suggestions")}

            buttonStyle={{

              // opacity: 0.8,
              backgroundColor: "rgba(158,133,0,1)",
              // width: 200,
              // height: 75,
              borderColor: "white",
              borderWidth: 2,
              borderRadius: 50,
              margin: 10,
              bottom: 10,
              padding: 15,

            }}

            icon = {{

              name: "paper-plane",
              type: "font-awesome",
              size: 20,
              color: "white",
              padding: 5,

            }}

          />


        </ImageBackground>

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
    width: 300,
    height: 75,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 50,
    margin: 10,
    // borderColor: "red"
  }

})

export default withNavigation(HelloWorldApp);