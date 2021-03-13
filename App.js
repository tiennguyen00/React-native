
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from "redux-thunk"; //Import để sử dụng dispatch func bên actions
const store = createStore(rootReducer, applyMiddleware(thunk))


import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import  MainScreen from './components/Main';
import LoginScreen from './components/auth/Login';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';


const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    
  }

  render() {

    // return (
    //   <NavigationContainer>
    //     <Stack.Navigator initalRouteName="Landing">
    //       <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
    //       <Stack.Screen name="Register" component={RegisterScreen}/>
    //       <Stack.Screen name="Login" component={LoginScreen}/>
    //     </Stack.Navigator>
    //   </NavigationContainer>
    // )

    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initalRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
    
  }
}

export default App

