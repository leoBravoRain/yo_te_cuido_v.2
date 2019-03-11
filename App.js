import React from 'react';
import { 
  Text, 
  View,
  AsyncStorage,
  Alert
} from 'react-native';
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
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
import App_Introduction from "./screens/app_introduction.js"
import Loading_Screen from "./screens/loading_screen.js"

// stack of screens of App
const app_stack = {
  
  // Dangers_Map: Dangers_Map,
  Login: Login,
  Home: Home,
  Add_Danger: Add_Danger,
  Dangers_Map: Dangers_Map,
  Danger_Details: Danger_Details,
  Add_Comment_To_Danger: Add_Comment_To_Danger,
  Change_Danger_State: Change_Danger_State,
  Image_Details: Image_Details,
  Send_Suggestions: Send_Suggestions

}

// Stack of screens of App Introduction
const app_introduction = {

  App_Introduction:App_Introduction,

}

// Create app stack navigator
const App_Stack_Navigator = createStackNavigator(

  app_stack,

  { 
    headerMode: 'screen' 
  },

  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: { backgroundColor: 'red' },
      headerTitleStyle: { color: 'green' },
    }
  },

);

// Create app introduction stack navigator
const App_Introduction_Stack_Navigator = createStackNavigator(

  app_introduction,

  { 
    headerMode: 'screen' 
  },

  {
    initialRouteName: "App_Introduction",
    defaultNavigationOptions: {
      headerStyle: { backgroundColor: 'red' },
      headerTitleStyle: { color: 'green' },
    }
  },

);

// Create app container considering switch navigator
export default createAppContainer(createSwitchNavigator(

  {
    // Next screen is going to load 'App' or 'Introduction' depending if there is firts launc of app
    Loading_Screen: Loading_Screen,

    // Navigator when it's NOT firt time launching the app
    App: App_Stack_Navigator,

    // Navigator when IT'S firt time launching the app
    Introduction: App_Introduction_Stack_Navigator,
  },

  {
    initialRouteName: 'Loading_Screen',
  }

));

