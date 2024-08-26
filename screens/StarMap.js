import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview'; // Make sure to install this package

export default class StarMapScreen extends Component {
    constructor() {
        super()
        this.state = {
            longitude: '',
            latitude: ''
        }
    }

    renderWebMap() {
        const { longitude, latitude } = this.state;
        const path = `https://virtualsky.lco.global/embed/index.html?longitude=${longitude}&latitude=${latitude}&constellations=true&constellationlabels=true&showstarlabels=true&gridlines_az=true&live=true&projection=stereo&showdate=false&showposition=false`;

        if (Platform.OS === 'web') {
            return (
                <iframe
                    src={path}
                    style={{ width: '100%', height: '100%', border: 0 }}
                />
            );
        } else {
            return (
                <WebView
                    scalesPageToFit={true}
                    source={{ uri: path }} 
                    style={{ flex: 1 }}
                />
            );
        }
    }

    render() {
        return (
            <SafeAreaProvider>
                <View style={{ flex: 1, backgroundColor: "#1a0023" }}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={{ flex: 0.3, marginTop: 20, alignItems: 'center' }}>
                        <Text style={styles.titleText}>Star Map</Text>
                        
                        <TextInput
                            style={styles.inputStyle}
                            placeholder="Enter your latitude"
                            placeholderTextColor="white"
                            onChangeText={(text) => {
                                this.setState({
                                    latitude: text
                                })
                            }}
                        />
                        <TextInput
                            style={styles.inputStyle}
                            placeholder="Enter your longitude"
                            placeholderTextColor="white"
                            onChangeText={(text) => {
                                this.setState({
                                    longitude: text
                                })
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        {this.renderWebMap()}
                    </View>
                </View>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    titleText: {
        fontSize: 35,
        fontWeight: "bold",
        color: "white",
        justifyContent: "center",
        alignContent: "center",
    },
    inputStyle: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 0,
        marginRight: 20,
        marginLeft: 20,
        textAlign: 'center',
        color: 'white',
        width: 200
    }
});
