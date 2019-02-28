import React from 'react';
import { 
  Text, 
  View
} from 'react-native';
import {
      createStackNavigator,
      createAppContainer
    } from 'react-navigation';

import Home from "./screens/home_screen.js"
import Add_Danger from "./screens/add_danger_screen.js"
import Dangers_Map from "./screens/dangers_map.js"
import Danger_Details from "./screens/danger_details_screen.js"
import Login from "./screens/login_screen.js"
import Add_Comment_To_Danger from "./screens/add_comment_to_danger.js"
import Change_Danger_State from "./screens/change_danger_state_screen.js"
import Image_Details from "./screens/image_details_screen.js"
import Send_Suggestions from "./screens/send_suggestions_screen.js"

const AppStackNavigator = createStackNavigator(

  {
    // Dangers_Map: Dangers_Map,
    // Home: Home,
    Login: Login,
    Home: Home,
    Add_Danger: Add_Danger,
    Dangers_Map: Dangers_Map,
    Danger_Details: Danger_Details,
    Add_Comment_To_Danger: Add_Comment_To_Danger,
    Change_Danger_State: Change_Danger_State,
    Image_Details: Image_Details,
    Send_Suggestions: Send_Suggestions

  },

  { 
    headerMode: 'screen' 
  },

  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      //  headerStyle: {
      //   backgroundColor: '#3f5fe0',
      // },
      // headerTintColor: '#3f5fe0',
      // headerTitleStyle: {
      //   fontWeight: 'bold',
      // },
      headerStyle: { backgroundColor: 'red' },
      headerTitleStyle: { color: 'green' },
    }
  },


);


const App = createAppContainer(AppStackNavigator);

export default App;