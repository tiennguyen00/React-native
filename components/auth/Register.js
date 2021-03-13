import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


export class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            ageUsers: 1,
            password: '',

            isValidnameUser: true,
            isValidPassword: true,
            isValidEmail: true,

        }
        this.onSignUp = this.onSignUp.bind(this)
    }
    
    onSignUp(){
        if(this.state.isValidPassword && this.state.isValidEmail){
            const payLoad = {
                email: this.state.email, 
                ageUsers: this.state.ageUsers, 
                password: this.state.password
            }
        
            fetch("http://192.168.43.171:8080/send-data-user", {
                method: 'post',
                body: JSON.stringify(payLoad),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                return res.json()
            })
            .then(data => {
                console.log("Data of post methods into Users collection: ", data);
            }).catch(err => {
                console.log("Error: ", err);
            })


        }
    }

    render() {
        const handleValidEmail = (val) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            this.setState({
                isValidEmail: re.test(val)
            })
        }

        const handleValidPassword = (val) => {
            if(val.length >= 8)
                this.setState({isValidPassword: true})
            else
                this.setState({isValidPassword: false})
        }
        return (
            <View>
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                    onEndEditing={(e)=>handleValidEmail(e.nativeEvent.text)}
                />
                {this.state.isValidEmail ? null : <Text style={{color: 'red'}}>Email is an invalid.</Text>}
                
                <TextInput 
                    placeholder="ageUsers"
                    maxLength={2}
                    onChangeText={(ageUsers) => this.setState({ ageUsers })}
                />

                <TextInput 
                    placeholder="password"
                    secureTextEntry={true}
                    autoCompleteType='password'
                    onChangeText={(password) => this.setState({ password })}
                    onEndEditing={(e)=>handleValidPassword(e.nativeEvent.text)}
                />
               {this.state.isValidPassword ? null :  <Text style={{color: 'red'}} >Password must be 8 characters long.</Text>}


                <Button 
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

const styles = StyleSheet;

export default Register
