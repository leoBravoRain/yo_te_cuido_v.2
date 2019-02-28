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
  TextInput
} from 'react-native';

import { Button, FormInput } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

class Login extends Component {

  // hide nav bar
  static navigationOptions = {

    header: null,

  }

  //Constructor
  constructor(props) {

    super(props);

    this.state = {

      user: null,
      password: null

    };
  
  }

  // manage click on button 
  manage_click(){

    // Alert.alert("hola");

    // Analize if user and password are correct
    if(this.state.user == "003" && this.state.password == "123456"){

      // Go to home
      this.props.navigation.push("Home");

    }

    else{

      // Alert for response user
      Alert.alert(
        'Información incorrecta',
        'El usuario o contraseña son incorrectos',
        [
          {text: 'Intentar de nuevo', onPress: () => console.log('Ask me later pressed')},
        ],
        { cancelable: false }
      )

    }

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

        <View style = {styles.input_icon_container}>

          <Icon

            raised
            name='user'
            type='font-awesome'  
            color='gray'
            size = {30}

          />

          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder = "Usuario"
            onChangeText={(text) => this.setState({user: text})}
            value={this.state.text}
            maxLength={2000}
          />

        </View>

        <View style = {styles.input_icon_container} >

          <Icon

            raised
            name='key'
            type='font-awesome'
            color='gray'
            size = {30}

          />

          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder = "Contraseña"
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.text}
            maxLength={2000}
            secureTextEntry = {true}
          />

        </View>

          <Button

              outline

              title = {"Ingresar"}

              onPress = {this.manage_click.bind(this)}

              buttonStyle={{

                backgroundColor: "#3f5fe0",
                // backgroundColor: 'rgba(255, 184, 0, 0.5)',
                width: 150,
                height: 50,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 25,
                margin: 20,
                borderColor: "white",
                borderWidth: 2,
                elevation: 5,

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
    alignItems: 'center',
    flexWrap: 'wrap' 
  },

  buttonStyle: {
    backgroundColor: "#3f5fe0",
    width: 300,
    height: 75,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 50,
    margin: 4,
    // borderColor: "red",
    elevation: 10
  },

  input_icon_container: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', 
    textAlign: "center", 
    borderRadius: 50, 
    height: 50, 
    width: "80%", 
    borderColor: 'gray', 
    borderWidth: 1, 
    margin: 4, 
    padding: 5,
    elevation: 10,
    // borderBottomWidth: 1,
    // borderColor: '#000',
    // paddingBottom: 10,
    // backgroundColor: 'white'
  },



})

export default withNavigation(Login);