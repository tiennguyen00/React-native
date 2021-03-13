import React, { Component } from 'react'

import { View, Text, SafeAreaView } from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {MaterialCommunityIcons} from 'react-native-vector-icons'

import { connect } from 'react-redux'; //Cái này cho phép kết nối với redux
import { bindActionCreators } from 'redux';
import GlobalStyles from '../GlobalStyles';
import { fetchUser } from '../redux/actions/index';
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'


const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {
    componentDidMount(){
        //sẽ gọi hàm fetchUser bên action
        //this.props.fetchUser();
    }
    render() {
        return (
           <SafeAreaView style={GlobalStyles.droidSafeArea} >
               <Tab.Navigator initialRouteName="Feed" labeled={false}>
                    <Tab.Screen name="Feed" component={FeedScreen} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}/>
                    <Tab.Screen name="MainAdd" component={EmptyScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        ),
                    }}/>
                    <Tab.Screen name="Profile" component={ProfileScreen} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                        ),
                    }}/>
                </Tab.Navigator>
           </SafeAreaView>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main);
