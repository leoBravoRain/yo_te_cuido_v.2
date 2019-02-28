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
var index = 0;

// Max Index for add danger button
// 1: add suggestions
// 2: photo (optional)
var max_form_items = 2;

class Send_Suggestions extends Component {

  // Options for header bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Enviar sugerencia",
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

      suggestion: null,
      index: index,
      avatarSource: null,

    };

    // Add select photo method
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    
  }

  componentDidMount(){

  }

  // Componente will mount
  componentWillMount(){

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
    const url_server = "http://yotecuido.pythonanywhere.com/suggestions_from_user/";

    // Crete form for post
    const form = new FormData();

    // Add parameters to post request

    // If there is a comment
    if(this.state.suggestion != null){

      // Add comment
      form.append('suggestion', this.state.suggestion);

    }

    // If there isn't comment
    else{

      // Variable for send data to server
      every_data_filled = false;

      // Message for user
      message = "Debes agregar una sugerencia";

    }

    // If there is photo
    // Photo is OPTIONAL
    if(this.state.avatarSource != null){

      // Add photo
      form.append('photo', {

          uri: this.state.avatarSource.uri,
          type: this.state.avatarSource.type,
          name: this.state.avatarSource.fileName,
          data: this.state.avatarSource.data,

      });

    };

    // It there are all data
    if(every_data_filled){

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
        'Sugerencia Enviada',
        '¡Muchas gracias por tu ayuda! \n \n Tu sugerencia será revisada por nuestro equipo. \n \n ¡Ésto nos ayudará a entregarte siempre la mejor solución!',
        [
          {text: 'Continuar', onPress: () => console.log('Ask me later pressed')},
        ],
        { cancelable: false }
      )

      // Back to home
      this.props.navigation.push("Home");

    }

    // If there is a problem
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

          <View style = {styles.container_flex}>

            <Text style = {{margin: 20, fontSize: 25, fontWeight: 'bold', 'textAlign': "center"}} >

              Escribir sugerencia

            </Text>

            <Text style = {{ textAlign: "center" , "margin": 5}}>

              Puedes escribirnos lo que te gustaría mejorar.

              {"\n \n"}

              Quizás le falta agregar alguna información importante a cada peligro, quizás no se ve bien el mapa de peligros, quizás no te gustan los colores, etc. 

            </Text>

            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder = "Agregar sugerencia"
              style={{
                textAlign: "center", 
                borderRadius: 50, 
                height: 200, 
                width: 200, 
                borderColor: 'gray', 
                borderWidth: 1, 
                margin: 40, 
                padding: 5
              }}
              onChangeText={(suggestion) => this.setState({suggestion})}
              value={this.state.suggestion}
              maxLength={2000}
            />

          </View>
         
        );

    // Add photo
    case 1:

      return (

        <View style = {styles.container_flex}>

          <Text style = {{margin: 20, fontSize: 25, fontWeight: 'bold', 'textAlign': "center"}} >

            Opcional

          </Text>

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
                  <Text style = {{ textAlign: 'center'}}> Si quieres puedes adjuntar una foto {"\n \n"} (NO es obligatorio) </Text>
                ) 

                : 

                (
                  <Image style={styles.avatar} source={this.state.avatarSource} />
                )
              }

            </View>

          </TouchableOpacity>

        </View>

      );

    // Add danger button
    case max_form_items:

      return(

        <Button

            outline

            title = {"Enviar sugerencia"}

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
        
          <View style = {{flex: 0, flexDirection: "row"}}>

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

export default withNavigation(Send_Suggestions);