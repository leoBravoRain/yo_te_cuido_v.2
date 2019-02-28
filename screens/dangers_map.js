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
  Vibration,
  ProgressBarAndroid,
  Dimensions,
  AppState
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps'
import haversine from "haversine";

import Geolocation from 'react-native-geolocation-service';

import PushNotification from 'react-native-push-notification';
// import PushController from './push_notification_service.js';

// Limit to risk
// Meters
const limit_dist_to_risk = 10;

// Vibration pattern
const PATTERN = [300, 500] // wait, vibrate, wait, vibrate, ...

// Initial region for map
// It's necesary for load map
var initial_position = {

  latitude: -39.565604,

  longitude: -72.899991,

}

// Initial places marker
var places_markers = [];

// Initial places marker to use like state
var initial_places_markers = [];

// Initial areas of companyss
var initial_areas_of_company = null;

// Variables for initial region (like zoom)
const initial_longitude_delta = 0.000922;
const initial_latitude_delta = 0.00421;

// Define initial region
var initial_region = {

  latitude: initial_position.latitude,
  longitude: initial_position.longitude,
  latitudeDelta: initial_longitude_delta,
  longitudeDelta: initial_latitude_delta,

}

// Push notificaion initial configuration
PushNotification.configure({
  onNotification: function(notification) {
    console.log('NOTIFICATION: ', notification);
  },
  popInitialNotification: true,
});

// Message when user is near danger
title_danger_alert = '¡Alerta de peligro!';
body_danger_alert = '¡Cuidado! Estás muy cerca de un peligro';
button_danger_alert = 'Me cuidaré';
notification_action_danger_alert = "Ver peligro";

// class
class Dangers_Map extends Component {

  //Constructor
  constructor(props) {

    super(props);

    this.state = {

      user_position: initial_position,

      places_markers: places_markers,

      region: initial_region,

      danger_state_filter: "todos",

      initial_places_markers: initial_places_markers,

      // markers already alerted
      markers_already_alerted: [],

      // parameter for filter danger by its state
      loaded_markers: true,

      // list of areas of company
      initial_areas_of_company: initial_areas_of_company,

      area_filter: "todos",

      // App state
      app_state: AppState.currentState,

    };

    //Add function for use in this component
    this.get_current_position_and_analize_risk = this.get_current_position_and_analize_risk.bind(this);
    this.filter_markers = this.filter_markers.bind(this);
    this.render_area_filter = this.render_area_filter.bind(this);
    this.local_notyfication = this.local_notyfication.bind(this);

  }

  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Mapa de peligros",
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

  // Function for manage app change state
  _handleAppStateChange = (nextAppState) => {

    console.log("app state has changed to: " + nextAppState);

    // Change app state
    this.setState({app_state: nextAppState});

  };


  componentDidMount() {
       
    PushNotification.configure({
          onNotification: function(notification) {
            console.log('NOTIFICATION: ', notification);
          },
          popInitialNotification: true,
        });

    // add listener for app state change
    AppState.addEventListener('change', this._handleAppStateChange);

    // get areas of company
    const url_area_server = "http://yotecuido.pythonanywhere.com/area_of_company";

    fetch(url_area_server)
      .then((response) => response.json())
      .then((responseJson) => {

        // console.log(responseJson);

        // create dict for acces with id area
        var areas_of_company = {};

        // Iterate over each area
        for(var i = 0; i < responseJson.length ; i++){

          // push each area
          areas_of_company[responseJson[i].id] = responseJson[i].area_name;

        };

        // console.log(areas_of_company);

        // Set state
        this.setState({

          initial_areas_of_company: areas_of_company,

        });

      });

    // get markers for map

    const url_server = "http://yotecuido.pythonanywhere.com/dangers/";
    
    fetch(url_server)
          .then((response) => response.json())
          .then((responseJson) => {

            // places with activated dangers
            var places_markers_from_server = [];
            var initial_places_markers = responseJson;

            // console.log(responseJson.length)

            // Iterate over each danger
            for(var i = 0; i < responseJson.length; i++){

              // add danger to marler to display on map
              // places_markers_from_server.push(responseJson[i]);
              // initial_places_markers.push(responseJson[i]);


              // If danger is active
              if(responseJson[i].state != "eliminado"){

                // add danger to marler to display on map
                places_markers_from_server.push(responseJson[i]);

              }

            }

            // Update places markers (dangers)
            this.setState({

              places_markers: places_markers_from_server,
              initial_places_markers: initial_places_markers,

            });

            // Get current position and analize risk
            this.get_current_position_and_analize_risk();

          })
          .catch((error) => {
            console.error(error);
          });  


  }

  componentWillUnmount(){

    // Clear watch Id (stop asking location information)
    Geolocation.clearWatch(this.watchId);

  };


  // Function for calculate distance to markers
  calculate_distance_to_markers(){

    // List for store if user is near of risk
    user_is_near_risk_list = [];

    // Calculate the distance to risk_makers
    // If there is a marker
    if(this.state.places_markers.length > 0){

      // console.log("places length > 0");

      // iterat for each place marker
      for(var i = 0; i < this.state.places_markers.length; i++ ){

        // marker
        var marker_i = this.state.places_markers[i];

        // Get user and risk distance for each place_marker
        dist_user_risk = haversine(this.state.user_position, marker_i, {unit: 'meter'});

        // Analize if user is near. boolean var
        user_is_near_risk = dist_user_risk <= limit_dist_to_risk ? true : false;

        // Create list for save user_is_near_risk
        user_is_near_risk_list[i] = user_is_near_risk;

      }

      // Get markers with true values(and id) 
      markers_not_alerted_yet = this.state.places_markers.filter((marker, index) => user_is_near_risk_list[index]);


      // Get id of markers
      markers_not_alerted_yet = markers_not_alerted_yet.map( (marker) => marker.id);


      // Remove markers already alerted (from list state)
      // markers_not_alerted_yet = markers_not_alerted_yet.map( (id_marker) => {if(!this.state.markers_already_alerted.includes(id_marker)){ return id_marker} });

      // Iterate over each marker
      for(let id_marker of markers_not_alerted_yet){

        // If marker is already alerted
        if(this.state.markers_already_alerted.includes(id_marker)){ 

          // remove marker from list of markers not alerted yet
          markers_not_alerted_yet.splice(markers_not_alerted_yet.indexOf(id_marker), 1);

        };

      };


      // Update markers already alerted list state
      this.setState({

        // Merge two arrays
        markers_already_alerted: this.state.markers_already_alerted.concat(markers_not_alerted_yet),

      });

      // Analize if user_is_near_risk_list but with list before filtered

      // If exist any danger not alerted yet
      if(markers_not_alerted_yet.length > 0){

        // If app is active
        if(this.state.app_state == "active"){

          // Vibrate if user is near marker
          Vibration.vibrate(PATTERN, true);

          // Create alert to user
          Alert.alert(
            title_danger_alert,
            body_danger_alert,
            [
              {text: button_danger_alert, onPress: () => Vibration.cancel()},
            ]
          );

        }

        // If app is in background
        else if(this.state.app_state == "background"){

          // Show notification
          this.local_notyfication();

        }

      };

    }

  }

  // Function for get current position and analize risk
  get_current_position_and_analize_risk(){

    // Get current position (initial and when user location changes)
    this.watchId = Geolocation.watchPosition(

        (position) => {

            // console.log(position);

            // Get user position
            // Position has altitude!!! Maybe we can add altitude to location on map for distinguis between floors in a factory
            this.setState({ 

              user_position: {

                latitude: position.coords.latitude, 
                longitude: position.coords.longitude

              },

              region: {

                latitude: position.coords.latitude, 
                longitude: position.coords.longitude, 
                latitudeDelta: initial_latitude_delta,
                longitudeDelta: initial_longitude_delta,


              }

            })

            // function for calculate distance to risk_markers
            this.calculate_distance_to_markers();

        },
        (error) => console.log(new Date(), error),
        // {enableHighAccuracy: true, timeout: 100000}
        // If gps is not working, so uncomment next line
        // {timeout: 10000, enableHighAccuracy: true}

        // Next one works always (22-02-2019 16:44)
        // {timeout: 100000000}

        // This is new (implemented with Google gps) (22-02-2019 16:50)
        { enableHighAccuracy: true, distanceFilter: 3, interval:100 }
    ); 

  }

  // Select pin color depending of its state
  select_pin_color(marker_state){

    switch(marker_state){

      case "sin_control":

        return "red"
        break;

      case "controlado":

        return "yellow"
        break;

      case "eliminado":

        return "green"
        break;

    }

  }

  // filter marker by state
  filter_markers(source:string, value: string){

    // Define current filter value
    var current_filter_value;

    // If filter by danger state
    if(source == "danger_state_filter"){

      // Get current value
      current_filter_value = this.state.danger_state_filter;

    }

    else if(source == "area_filter"){

      // Get current value
      current_filter_value = this.state.area_filter;

    }


    if(source == "danger_state_filter"){
    
      this.setState({

        // This variable is becuase set state is asynchronous
        loaded_markers: false,

        danger_state_filter: value,

      })

    }

    else if(source = "area_filter"){

      this.setState({

        // This variable is becuase set state is asynchronous
        loaded_markers: false,

        area_filter: value,

      })
    }

    // If selected value is different from current value
    if(value != current_filter_value){

      // new markers
      var places_markers_filters = [];

      // Filter places markers
      // iterat for each INITIAL place marker (These are ALL markers from server)
      console.log(this.state.initial_places_markers);

      for(var i = 0; i < this.state.initial_places_markers.length; i++ ){

        // marker
        var marker_filter = this.state.initial_places_markers[i];

        if(source == "danger_state_filter"){

          if(value == "todos"){

            // "Todos" is considered like all activated dangers (Anyone different to "eliminado")
            if(marker_filter.state != "eliminado"){

              if(this.state.area_filter == "todos"){

                // add marker to list
                places_markers_filters.push(marker_filter);              

              }

              else if(marker_filter.area_name == this.state.area_filter){

                // add marker to list
                places_markers_filters.push(marker_filter);  

              }

            }

          }  

          // If state is specific one
          else if(marker_filter.state == value){

            if(this.state.area_filter == "todos"){

              // add marker to list
              places_markers_filters.push(marker_filter);              

            }

            else if(marker_filter.area_name == this.state.area_filter){

              // add marker to list
              places_markers_filters.push(marker_filter);  

            }

          }        

        }

        else if(source == "area_filter"){

          if(value == "todos"){

            if(this.state.danger_state_filter == "todos" && marker_filter.state != "eliminado"){

              // add marker to list
              places_markers_filters.push(marker_filter);              

            }

            else if(marker_filter.state == this.state.danger_state_filter){

              // add marker to list
              places_markers_filters.push(marker_filter);  

            }

          }  

          else if(marker_filter.area_name == value){

            if(this.state.danger_state_filter == "todos" && marker_filter.state != "eliminado"){

              // add marker to list
              places_markers_filters.push(marker_filter);              

            }

            else if(marker_filter.state == this.state.danger_state_filter){

              // add marker to list
              places_markers_filters.push(marker_filter);  

            }

          }        

        }

      }

      // setState is asynchronous
      this.setState({

        places_markers: places_markers_filters,
        // danger_state_filter: value,

      },

        // This variable is becuase set state is asynchronous
        function() { this.setState({loaded_markers: true}); console.log(this.state.places_markers) }

      );



    }

  }

  // Render area from filter
  render_area_filter(){

    // If areas is defined
    if(this.state.initial_areas_of_company != null){

      
      // Define list for areas
      var list = [];

      // Add first element for area filter list
      list.push(<Picker.Item label="Todas las areas" value="todos" />)

      // Iterate over each area of company
      Object.keys(this.state.initial_areas_of_company).map( (key_dict, index) => {
             
  
        // add picker with each area of company
        list.push(

          <Picker.Item 

            key = {index} 
            label = {this.state.initial_areas_of_company[key_dict]} 
            value = {key_dict} 

          />

        );

      });

      // return piccker items with company areas
      return list;

    };
    
  };

  local_notyfication(){

    // Send notification
    PushNotification.localNotification({
      /* Android Only Properties */
      // id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      // ticker: "My Notification Ticker", // (optional)
      autoCancel: true, // (optional) default: true
      // largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      // smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: body_danger_alert, // (optional) default: "message" prop
      subText: "Peligro cercano", // (optional) default: none
      // color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 1000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: 'hola', // (optional) add tag to message
      // group: "group", // (optional) add group to message
      // ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      visibility: "private", // (optional) set notification visibility, default: private
      importance: "high", // (optional) set notification importance, default: high
   
    
      /* iOS and Android properties */
      title: title_danger_alert, // (optional)
      message:  body_danger_alert, // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      actions: '[Ver]',  // (Android only) See the doc for notification actions to know more
    });

  }

  // Render method
  render() {

    return (

        <View style = {styles.container_flex} >

            <Text style={{ 

              color: "white", 
              "textAlign": 'center', 
              margin: 50,
              // fontWeight: 'bold', 
              textDecorationStyle:'solid',
              backgroundColor: 'rgba(63, 95, 224,0.8)',
              position: "absolute",
              top: -30,
              borderRadius: 50, 
              padding: 15,
              justifyContent: 'center',
              elevation: 5,

            }}>

              Peligros actuales: { this.state.places_markers.length}

            </Text>

            <MapView

              showsUserLocation
              followsUserLocation
              showsMyLocationButton = {true}
              initialRegion = {this.state.region}
              mapType = "satellite"
              region = { this.state.region }
              style = {{width: '100%', height: '100%',zIndex: 0}}
              showsMyLocationButton = {true}

            >

              { 

                this.state.loaded_markers ?

                this.state.places_markers.map( (marker, index) => (
                       
                  <MapView.Marker

                    key = {index}

                    coordinate = {{latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }}

                    onPress = {() => this.props.navigation.push("Danger_Details", {marker: marker, area_name: this.state.initial_areas_of_company[marker.area_name]})}

                    pinColor = { this.select_pin_color(marker.state) }
                    
                  />

                ))

                :

                <MapView.Marker

                  coordinate = {{latitude: 12.2, longitude: 23.9 }}

                />

              }

            </MapView>

            <View style = {{ flex: 1, position: "absolute", bottom: 20, flexDirection: "row", flexWrap: 'wrap',justifyContent: 'center'  }}>

              <Picker

                selectedValue = {this.state.danger_state_filter}

                style = {{

                  height: 50, 
                  // width: Dimensions.get("window").width/4, 
                  width: 150,
                  // zIndex: 10, 
                  // position: "absolute",
                  // left: 1,
                  // bottom: 10,
                  backgroundColor: 'rgba(63, 95, 224,0.8)',
                  justifyContent: 'center',
                  color: "white",
                  elevation: 5,
                  margin: 10,
                

                }}

                onValueChange={

                  (itemValue, itemIndex) =>

                    this.filter_markers("danger_state_filter",itemValue)

                  }

                >

                <Picker.Item label="Todos activos" value="todos" />

                <Picker.Item label="Sin control" value="sin_control" />

                <Picker.Item label="Controlado" value="controlado" />

                <Picker.Item label="Eliminado" value="eliminado" />

              </Picker> 

              {/* picker for area filter */}
              <Picker

                selectedValue={this.state.area_filter}
                style = {{

                  height: 50, 
                  // width: Dimensions.get("window").width/4, 
                  width: 150,
                  // zIndex: 10, 
                  // position: "absolute",
                  // bottom: 80,
                  backgroundColor: 'rgba(63, 95, 224,0.8)',
                  justifyContent: 'center',
                  color: "white",
                  elevation: 5,
                  margin: 10,
                

                }}

                onValueChange={

                  (itemValue, itemIndex) =>

                    this.filter_markers("area_filter",itemValue)

                }

              >

                {

                  this.render_area_filter()

                }

              </Picker>

            </View>
            

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
    width: 30,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    // borderRadius: 5
    elevation: 5,
  },

  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },

})

export default withNavigation(Dangers_Map);