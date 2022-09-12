import * as React from "react"
import { Button, View, Platform, Image } from "react-native-web"
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component {

    state = {
        'image' : null
    }

    componentDidMount() {
        this.getPermissions()
    }

    getPermissions = async () => {
        if(Platform.OS !== 'web') {
            const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
            if(status !== 'granted') {
                alert('Give Permission for the app to work...')
            }
        }
    }

    selectImage = async () => {
        try {
            let image = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })

            if(!image.cancelled) {
                this.setState({image: image.data})
                this.uploadImage(image.uri)
            }

        } catch (error) {
            console.log(error)
        }
    }

    uploadImage = async (uri) => {
        const data = new FormData()
        filename = uri.split('/')[uri.split('/').length - 1]
        type = `image/${filename}`
        const filetoupload = {
            uri: uri,
            name: filename,
            type: type
        }
        data.append('digit', filetoupload)
        fetch('http://8b4c-49-36-39-68.ngrok.io/predict-digit', {
            method: 'POST',
            body: data,
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((response) => response.json())
        .then((result) => {
            console.log('Success', result)
        }).catch((error) => {console.log('error', error)})
    }

    render() {
        let {image} = this.state
        return (
            <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button title = "Select an Image" onPress = {this.selectImage} color = 'blue' />
            </View>
        )
    }
}