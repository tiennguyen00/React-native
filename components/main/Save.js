import React, {useState} from 'react'
import { View, Text, Image, Button } from 'react-native'
import { TextInput } from 'react-native-paper';

export default function Save(props) {
    const [caption, setCaption] = useState("");

    const uploadImage = async () => {
        //Upload to database

        console.log("Pressed Save",  props.route);
        var photo = {
            uri: props.route.params.image,
            type: 'image/jpeg',
            name: 'image',
        };
        var form = new FormData();
        form.append("file", photo);
        form.append("caption", caption);
        console.log(form);

        //Upload image to google drive and return path.
        fetch('http://172.20.15.3:8080/upload_image', {
            method: 'post',
            body: form,
            headers: {},
        }).then(res => {
            console.log('image uploaded')
        }).catch(err => {
            console.log("ERROR: ", err);
        })
        //Upload caption, date, time of post.
        


    }

    return (
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}} style={{flex: 1}}/>
            <TextInput 
                placeholder="Write a caption ...."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()}/>
        </View>
    )
}

