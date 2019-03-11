import React from 'react';
import { StyleSheet, AsyncStorage, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { NavigationActions, withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    // elevation: 4,
    }
});

// Slides for display app introduction
const slides = [
  {
    key: 'welcome',
    title: 'Bienvenido',
    text: 'Desde ahora podrás cuidarte a tí y a todos tus compañeros de la mejor forma posible \n \n ¡A través de la cooperación!',
    image: require('../images/welcome.jpg'),
    imageStyle: styles.image,
    backgroundColor: 'rgba(63,95,224,0.8)',
  },
  {
    key: 'danger_map',
    title: 'Mapa de peligros',
    text: 'Observa el mapa de peligros y entérate de todos los peligros que hay actualmente en tu zona de trabajo',
    image: require('../images/map.png'),
    imageStyle: styles.image,
    backgroundColor: 'rgba(158,133,0,0.8)',
  },
  {
    key: 'danger_inform',
    title: 'Informa peligros',
    text: 'Si ves un peligro en terreno, no dudes en informarlo, así podrás mantener a todos tus compañeros informados y alerta',
    image: require('../images/inform.png'),
    imageStyle: styles.image,
    backgroundColor: 'rgba(158,133,0,0.8)',
  },
  // {
  //   key: 'danger_alert',
  //   title: 'Alertas automáticas de peligros',
  //   text: 'Manteniendo abierta la app en la sección del "Mapa de Peligros", podrás recibir automáticamente alertas de peligros que estén cercanos a tu posición \n \n ¡No cierres la app!',
  //   image: require('../images/alert.png'),
  //   imageStyle: styles.image,
  //    backgroundColor: 'rgba(63,95,224,0.8)',
  // }
];

class App_Introduction extends React.Component {

  //Constructor
  constructor(props) {

    super(props);

  };

  // hide nav bar
  static navigationOptions = {

    header: null,

  }

  // Function for set token of first time launch and for navigate to App navigator
  _onDone = async () => {
    
    // Set token
    await AsyncStorage.setItem('first_time_launch', "true");

    // Back to App navigator
    this.props.navigation.navigate('App');

  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          raised
          name = "arrow-right"
          type = "font-awesome"
        />
      </View>
    );
  }

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
       <Icon
          raised
          name = "check"
          type = "font-awesome"
        />
      </View>
    );
  }

  render() {
         
    return(

      <AppIntroSlider 
        slides={slides} 
        onDone={this._onDone}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
      />

    )
    
  }

}

export default withNavigation(App_Introduction);