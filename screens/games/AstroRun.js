import react, { Component } from 'react';
import { Text, View, StyleSheet, Platform, StatusBar, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default class AstroRunner extends Component {
    render() {
        return(
            <SafeAreaProvider>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.container}>
                    <View style={styles.container2}>
                        <Text style={styles.titleText}>Astro Runner</Text>
                    </View>
                    <View style={styles.gameContainer}>
                        <Text style={styles.routeText}>Coming Soon</Text>
                    </View>
                </View>
            </SafeAreaProvider>
        )
    }
}
const styles = StyleSheet.create({
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },

    container2: {
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
        marginTop:'20%'
    },

    gameContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})