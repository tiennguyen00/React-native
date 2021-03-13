import React, { Component } from 'react'
import { Text, View, Button, TextInput } from 'react-native';

export class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    render() {
        return (
            <View>
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    placeholder="password"
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry={true}
                />
                <Button 
                    title="Login"
                    onPress={() => this.onLogIn()}/>
            </View>
        )
    }
}

export default Login

