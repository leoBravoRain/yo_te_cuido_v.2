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
  ActivityIndicator,
  Dimensions,
  // Modal
  // ScrollView
  // TouchableHighlight
} from 'react-native';

import { Button, Icon, Card, Divider, Tooltip } from 'react-native-elements';
import { NavigationActions, withNavigation } from 'react-navigation';
import {danger_state_definition} from '../global_variables.js'


class Danger_Details extends Component {

  // Initial state
  state = {
    avatarSource: null,
    videoSource: null,
  };

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

    this.state = {

      initialPosition: null,
      avatarSource: null,
      text: null,
      comments: null,

    };

    // Add select photo method
    this.add_comment = this.add_comment.bind(this);
    this.change_danger_state = this.change_danger_state.bind(this);

  }

  componentWillMount(){

    console.log(this.props.navigation.state.params);


    // get comments to danger from server

    const url_server = "http://yotecuido.pythonanywhere.com/danger_details/" + this.props.navigation.state.params.marker.id;
    
    fetch(url_server)
          .then((response) => response.json())
          .then((responseJson) => {

            // places with activated dangers
            var comments = [];

            // Parse date
            var date = this.parse_date(this.props.navigation.state.params.marker.date);

            // Define fitst comment object
            var first_comment = {

              id: this.props.navigation.state.params.marker.id,
              date: date,
              photo: this.props.navigation.state.params.marker.photo,
              comment: this.props.navigation.state.params.marker.comment,
              state: this.props.navigation.state.params.marker.state,
              floor_number: this.props.navigation.state.params.marker.floor_number,

            }

            // add firt coment
            comments.push(first_comment);

            // Add each comments from server
            for(var i = 0; i < responseJson.length; i++){

              var comment_i = responseJson[i];

              // parse date
              comment_i.date = this.parse_date(comment_i.date);

              // add comment
              comments.push(comment_i);

            }

            // Update places markers (dangers)
            this.setState({

              comments: comments,

            });

          })
          .catch((error) => {
            console.error(error);
          });  


  }

  // Parse date for comments
  parse_date(date_string){

    // format options
    // const options = { year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric"};

    // Create object
    // var date = new Date(date_string).toLocaleDateString("es-ES", options);
    const date = new Date(date_string).toUTCString();


    // return value
    return date;

  }

  // Add comment to danger
  add_comment(){

    // Go to add comment to danger
    this.props.navigation.push("Add_Comment_To_Danger", {marker: this.props.navigation.state.params.marker}); 

  }

  // Change comment state
  change_danger_state(){

    // Go to change danger state
    this.props.navigation.push("Change_Danger_State", {marker: this.props.navigation.state.params.marker}); 


  }

  // Select pin color depending of its state
  select_pin_color(marker_state){

    switch(marker_state){

      case "sin_control":

        return "red"
        break;

      case "controlado":

        return "rgba(245, 215, 110, 1)"
        break;

      case "eliminado":

        return "green"
        break;

    }

  }

  // Render method
  render() {

    return (

        <View style = {styles.container_flex}>

          {/*  Row for labels */}
          <View style = {{elevation: 2, flex: 0, flexWrap: "wrap",flexDirection: "row", width: Dimensions.get('window').width}}>            

            {/*  Risk state */}

            <Tooltip 

              // highlightColor = 'black'

              backgroundColor = 'white'

              // height = 50
              containerStyle = {{
                // backgroundColor: 'blue',
                // : 'white',
                // height: 300,
                // paddingBottom: 50,
                // paddingTop: 50,
              }}

              height = {Dimensions.get("window").height*0.5}

              width = {Dimensions.get("window").width*0.9}

              popover = {

                <View>

                  <Text style = {{fontWeight: 'bold', padding: 5, fontSize: 20}}>

                    {this.props.navigation.state.params.marker.state.replace("_"," ").toUpperCase()}

                  </Text>

                  <Text style = {{fontWeight: 'normal', padding: 5}}>

                    {danger_state_definition[this.props.navigation.state.params.marker.state]}

                  </Text>

                </View>
              }

            >

              <Text style = {{elevation: 30, margin: 5, fontSize: 15, borderRadius: 10, padding: 8, color: "white", backgroundColor: this.select_pin_color(this.props.navigation.state.params.marker.state) }} >

                {this.props.navigation.state.params.marker.state.replace("_"," ").toUpperCase()}

              </Text>

            </Tooltip>

            {/*  Floor number */}
            <Text style = {{ margin: 5, fontSize: 15, borderRadius: 10, padding: 8, color: "white", backgroundColor: "blue"}}>

              Piso: {this.props.navigation.state.params.marker.floor_number}

            </Text>

              {/*  Id of managment system */}

              {

                this.props.navigation.state.params.marker.id_management_system.length > 0 && 

                    <Text style = {{ margin: 5, fontSize: 15, borderRadius: 10, padding: 8, color: "white", backgroundColor: "blue"}}>

                      Nº sistema gestión: {this.props.navigation.state.params.marker.id_management_system}

                    </Text>     

              }

              {/*  Area */}

              {

                this.props.navigation.state.params.area_name != null && 

                    <Text style = {{ margin: 5, fontSize: 15, borderRadius: 10, padding: 8, color: "white", backgroundColor: "blue"}}>

                      Área: {this.props.navigation.state.params.area_name}

                    </Text>     

              }

            <Divider style={{elevation:5, borderColor: "gray",borderWidth: 1, width: '100%' }} />

          </View>

          <ScrollView style = {{height: 10, width: '100%'}}>

            <View>

              { 

                this.state.comments != null 

                ?

                this.state.comments.map( (comment, index) => (

                    <View key = {index}>

                      <Text style = {{margin: 5}}>

                        {comment.date}

                      </Text>

                      <TouchableOpacity 

                        onPress = {()=> 

                          // Navitage to image details
                          this.props.navigation.push("Image_Details", {image_uri: comment.photo})   

                        } 

                      >

                      <Image
                        source={{ uri: comment.photo }}
                        style={{ 
                          // width: 400, 
                          // height: 400,
                          flex: 3,
                          alignSelf: 'stretch',
                          width: undefined,
                          height: 250,
                          margin: 10,
                          // borderRadius: 10,
                          // elevation: 5,
                          // shadowOffset: 10,
                          // shadowOffset: {
                          //   width: 0.4,
                          //   height: 0.5
                          // },
                          // shadowColor: "red",
                          // shadowOpacity: 0,
                          // shadowRadius: 1,
                        }}
                        PlaceholderContent={<ActivityIndicator />}
                        resizeMode="contain"

                      /> 

                      </TouchableOpacity>

                      <Text style = {{margin: 10, fontSize: 18}} > 

                       { comment.comment }

                      </Text>

                      <Divider 

                        style={{
                          elevation:2, 
                          backgroundColor: 'gray', 
                          marginBottom: 30, 
                          marginTop: 20,
                          width: '93%',
                          alignSelf: "center",
                        }} 

                      />

                    </View>

                  ))

                  :

                  <ActivityIndicator/>

              }

            </View>

          </ScrollView>

          <View 

            style = {{

              // backgroundColor: "rgba(63, 95, 224,0.3)", 
              // elevation: 2, 
              flex: 0, 
              flexWrap: "wrap",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: 'center', 
              width: Dimensions.get('window').width

            }}

          >

            <Button

              outline

              title = {"Agregar comentario"}

              onPress = {this.add_comment.bind(this)}

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

              title = {"Cambiar estado de peligro"}

              onPress = {this.change_danger_state.bind(this)}

              buttonStyle={styles.buttonStyle}

              icon = {{

                name : "edit",
                type: "font-awesome",
                size: 30,
                color: "white",
                padding: 5,

              }}

            />

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
    width: 300,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    margin: 5,
    borderRadius: 50,
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

export default withNavigation(Danger_Details);