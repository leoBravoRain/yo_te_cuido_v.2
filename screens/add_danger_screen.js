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
import {danger_state_definition} from '../global_variables.js'

// Index for item form
var index = 0;

// Max Index for add danger button
// 0: add photo
// 1: add comment
// 2: add state
// 3: add Id management system
// 4: add area of company
// 5: add floor number
// 6: add map
var max_form_items = 7;


class Add_Danger extends Component {


  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Informar peligro",
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

      initialPosition: null,
      avatarSource: null,
      text: null, 
      index: index,
      danger_state: "sin_control",
      floor_number: null,
      it_is_on_local_MS: "no",
      id_management_system: null,
      initial_areas_of_company: null,
      area_of_company: null

    };

    // Add select photo method
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  

  }

  componentDidMount(){

    // get areas of company
    const url_area_server = "http://yotecuido.pythonanywhere.com/area_of_company";

    fetch(url_area_server)
      .then((response) => response.json())
      .then((responseJson) => {

        // console.log(responseJson);

        // create dict for acces with id area
        // id_area: area_name
        // var areas_of_company = {};

        // // Iterate over each area
        // for(var i = 0; i < responseJson.length ; i++){

        //   // push each area
        //   areas_of_company[responseJson[i].id] = responseJson[i].area_name;

        // };

        // console.log(areas_of_company);

        // Set state
        this.setState({

          // initial_areas_of_company: areas_of_company,
          initial_areas_of_company: responseJson,

        });

        // console.log(initial_areas_of_company);

      });

  }

  // Componente will mount
  componentWillMount(){


    // Get user position
    navigator.geolocation.getCurrentPosition(
      
        (position) => {

            // Position has altitude!!! Maybe we can add altitude to location on map for distinguis between floors in a factory
            this.setState({ initialPosition: {latitude: position.coords.latitude, longitude: position.coords.longitude }})

        },
        (error) => console.log(new Date(), error),
        // {enableHighAccuracy: true, timeout: 100000}
        // If gps is not working, so uncomment next line
        // {timeout: 10000, enableHighAccuracy: true}
        {timeout: 100000000}
    ); 

  }

  // Select photo taped
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    // Take image
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        // Take image
        let source = response;

        // Set state
        this.setState({

          // Set state to photo
          avatarSource: source,

        });
      }
    });
  }

  // manage click on button 
  manage_click(){

    // Variable for send danger to server
    var every_data_filled = true;

    // Message for user because there is a problem
    var message;

    // Add danger to server
    // Add video of place to server
    const url_server = "http://yotecuido.pythonanywhere.com/dangers/";

    // Crete form for post
    const form = new FormData();

    // Add parameters to post request

    // If there is photo
    if(this.state.avatarSource != null){

      // Add photo
      form.append('photo', {

          uri: this.state.avatarSource.uri,
          type: this.state.avatarSource.type,
          name: this.state.avatarSource.fileName,
          data: this.state.avatarSource.data,
          // danger_state: 'sin_control',

      });

    }

    // If there is not photo
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes agregar una foto"

    }
  
    // If location is defined
    if(this.state.initialPosition != null ){

      // Add latitude
      form.append('latitude', this.state.initialPosition.latitude);

      // Add longitude
      form.append('longitude', this.state.initialPosition.longitude);    

    }

    // If location is null
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Tenemos problemas para obtener tu ubicación";

    }

    // If there is a comment
    if(this.state.text != null){

      // Add comment
      form.append('comment', this.state.text);

    }

    // If there isn't comment
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes agregar un comentario";

    }

    // If there is floor number
    if(this.state.floor_number != null){

      // Add photo
      form.append('floor_number', this.state.floor_number);

    }

    // If there is not photo
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes agregar un piso al peligro"

    }

    // If there is Id on local MS
    if(this.state.it_is_on_local_MS == 'si'){

      // If id is defined and length is more than 0
      if(this.state.id_management_system != null && this.state.id_management_system.length > 0){

        // Add id_management_system to form post
        form.append('id_management_system', this.state.id_management_system);

      }

      // If there is not id
      else{

        // Variable for send data to server
        every_data_filled = false;

        // Message for user
        message = "Si estas seguro que el peligro está agregado en el sistema de gestión de la empresa, DEBES agregar el ID";

      }

    }

    // If there is area
    if(this.state.area_of_company != null){

      // Add photo
      form.append('area_name', this.state.area_of_company);

    }

    // If there is not photo
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes agregar un área al peligro"

    }

    // If there are all data
    if(every_data_filled){

      // Add state
      form.append('state', this.state.danger_state);

      // Send data to server
      fetch(url_server, {

        method: 'POST',

        body: form

      })

      .catch((error) => {

        console.error(error);

      })

      // Alert for response user
      Alert.alert(
        'Alerta de peligro',
        'Acabas de agregar un peligro al mapa',
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

  renderSwitch(param){

    switch(param) {

      // Add photo
      case 0:

        return (

          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>

            <View
              style={[
                styles.avatar,
                styles.avatarContainer,
                { marginBottom: 20 },
              ]}
            >
              {

                this.state.avatarSource === null 

                ? 

                (
                  <Text> Agrega una foto del peligro </Text>
                ) 

                : 

                (
                  <Image style={styles.avatar} source={this.state.avatarSource} />
                )
              }

            </View>

          </TouchableOpacity>

        );

      // Add comment
      case 1: 

        return(

          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder = "Agregar algún comentario sobre el peligro"
            style={{textAlign: "center", borderRadius: 50, height: 100, width: "80%", borderColor: 'gray', borderWidth: 1, margin: 40, padding: 5}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            maxLength={2000}
          />

        );

      // Add danger state
      case 2:

        return(

          <View>

            <Text style = {{margin: 40, fontSize: 25, fontWeight: 'bold', 'textAlign': "center"}} >

              Selecciona el estado actual del peligro

            </Text>

            <Picker

              selectedValue={this.state.danger_state}
              style={{height: 30, width: 200, alignSelf: "center", margin: 30}}
              onValueChange={(itemValue, itemIndex) =>

                this.setState({danger_state: itemValue})

              }>

              <Picker.Item label="Sin control" value="sin_control" />

              <Picker.Item label="Controlado" value="controlado" />

              <Picker.Item label="Eliminado" value="eliminado" />

            </Picker>

            <Text style = {{ textAlign: "center" , "margin": 30, backgroundColor: 'rgba(158,133,0,0.8)', color: "white", padding: 10, borderRadius: 50}}>

              {danger_state_definition[this.state.danger_state]}

            </Text>

          </View>

        );

      // Add id management system
      case 3:

        // Return component
        return(

          <View style = {{ alignItems: 'center'}}>

            <Text style = {{ textAlign: "center" , margin: 30, fontWeight: 'bold', fontSize: 25}}>

              ¿Se ha subido la condición al sistema de gestión de peligros de la empresa?

            </Text>

            <Picker

              selectedValue={this.state.it_is_on_local_MS}
              style={{height: 30, width: 200, alignSelf: "center", margin: 30}}
              onValueChange={(itemValue, itemIndex) =>

                {
                  // console.log(itemValue);
                  this.setState({it_is_on_local_MS: itemValue})
                }
              }

              >

              <Picker.Item label="No" value="no" />

              <Picker.Item label="Si" value="si" />

            </Picker>

            {this.state.it_is_on_local_MS === "si" && 

              <TextInput
                multiline={true}
                numberOfLines={4}
                placeholder = "Escribir ID del peligro en sistema de gestión de empresa"
                style={{fontSize: 12,textAlign: "center", borderRadius: 50,  width: "80%", borderColor: 'gray', borderWidth: 1, margin: 10, padding: 15}}
                onChangeText={(text) => this.setState({id_management_system: text})}
                value={this.state.id_management_system}
                maxLength={100}
              />

            }
            
          </View>

        );

      // Add area of company
      case 4:

        return(

          <View>

            <Text style = {{margin: 40, fontSize: 25, fontWeight: 'bold', 'textAlign': "center"}} >

              Selecciona el área en donde se encuentra el peligro

            </Text>

            <Picker

              selectedValue={this.state.area_of_company}
              style={{height: 30, width: 200, alignSelf: "center", margin: 30}}
              onValueChange={(itemValue, itemIndex) =>

                this.setState({area_of_company: itemValue})

              }>

              {

                this.state.initial_areas_of_company != null && 

                  this.state.initial_areas_of_company.map((area, index) => (
                         
                    <Picker.Item key = {index} label = {area.area_name} value = {area.id} />

                  ))

              }

            </Picker>

          </View>

        );

      // Add floor number
      case 5: 

        return(

          <View>

            <Text style = {{ textAlign: "center" , margin: 30, fontWeight: 'bold', fontSize: 25}}>

              ¿En qué piso se encuentra el peligro?

            </Text>

            <Text style = {{textAlign: 'center',margin: 20}} >

              Ejemplo: Si es que el peligro se encuentra en 
              el segundo piso, entonces debes escribir:

            </Text>

            <Text style = {{fontWeight: '500', fontSize: 30,textAlign: 'center',margin: 0}}>

              2

            </Text>

            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder = "Agregar el piso en el que se encuentra el peligro"
              style={{textAlign: "center", borderRadius: 50, height: 100, width: "80%", borderColor: 'gray', borderWidth: 1, margin: 40, padding: 5}}
              onChangeText={(text) => this.setState({floor_number: text})}
              value={this.state.floor_number}
              maxLength={2000}
            />

          </View>

        );

      // Add map
      case 6:

        return (

          // {

              this.state.initialPosition === null 

            ?

              (<ProgressBarAndroid /> )

            :

              // <View style = {styles.container_flex}>

                <MapView

                  mapType = "satellite"

                  initialRegion={{
                    latitude: this.state.initialPosition.latitude,
                    longitude: this.state.initialPosition.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001, 
                  }}

                  // showUserLocation
                  region = { this.state.initial_region }
                  style = {{width: '100%', height: '85%'}}

                >

                  <MapView.Marker
                    draggable
                    coordinate = {this.state.initialPosition}
                    pinColor = {"#474744"}
                    onDragEnd={(e) => this.setState({ initialPosition: e.nativeEvent.coordinate })}
                    // style = {{zindex: -1}}
                  />

                  <Text style={{ 

                    color: "white", 
                    "textAlign": 'center', 
                    margin: 50,
                    fontWeight: 'bold', 
                    textDecorationStyle:'solid',
                    backgroundColor: 'rgba(63, 95, 224,0.5)'


                  }}>

                    Manten presionado el marcador amarillo para poder moverlo

                  </Text>

                </MapView>

                

            // </View>

        );

      // Add danger button
      case max_form_items:

        return(

          <Button

              outline

              title = {"Agregar peligro"}

              onPress = {this.manage_click.bind(this)}

              buttonStyle={{

                backgroundColor: "#3f5fe0",
                // backgroundColor: 'rgba(255, 184, 0, 0.5)',
                width: 300,
                height: 80,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 25,
                margin: 80,
                borderColor: "white",
                borderWidth: 2,
                elevation: 5,

              }}

              icon = {{

                name : "comment",
                type: "font-awesome",
                size: 30,
                color: "white",
                padding: 5,

              }}

            />

        )

    }

  }


  next_index(){

    // define new index
    var new_index = this.state.index >= max_form_items ? max_form_items : this.state.index + 1;

    // Set state
    this.setState({

      // Set state to photo
      index: new_index,

    });

  }

  previous_index(){

    // define new index
    var new_index = this.state.index <= 0 ? 0 : this.state.index - 1;

    // Set state
    this.setState({

      // Set state to photo
      index: new_index,

    });

  }

  render_previous_button(){

    // If there isn't index before
    if(this.state.index > 0){

      return (

        <Button
          outline
          title = "Anterior"
          onPress = {this.previous_index.bind(this)}
          buttonStyle = {styles.buttonStyle}
          icon = {{

              name : "angle-double-left",
              type: "font-awesome",
              size: 30,
              color: "white",
              padding: 5,

            }}

        />

      )

    }

  }

  render_next_button(){

    // If there isn't index before
    if(this.state.index < max_form_items){

      return (

        <Button
          outline
          title = "Siguiente"
          onPress = {this.next_index.bind(this)}
          buttonStyle = {styles.buttonStyle}
          icon = {{

              name : "angle-double-right",
              type: "font-awesome",
              size: 30,
              color: "white",
              padding: 5,

            }}
          iconRight


        />

      )

    }

  }

  // Render method
  render() {

    return (

        <View style = {styles.container_flex}>

          {this.renderSwitch(this.state.index)}

          <View style = {{flex: 0, flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>

          { this.render_previous_button() }

          { this.render_next_button() }

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
    // width: 300,
    // height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    // borderColor: "white",
    // borderRadius: 5
    elevation: 5,
    margin: 5,
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

export default withNavigation(Add_Danger);