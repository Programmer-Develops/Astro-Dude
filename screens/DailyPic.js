import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';

import axios from 'axios';

export default class DailyPicScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apod: [],
    };
  }

  componentDidMount() {
    this.getAPOD();
  }

  getAPOD = () => {
    axios
      .get(
        'https://api.nasa.gov/planetary/apod?api_key=CtvyV6sBUIPmkC3VbPKdFPwi4EhPMdOldadM4Dfb'
      )
      .then((response) => {
        this.setState({ apod: response.data });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };
  render() {
    if (Object.keys(this.state.apod).length === 0) {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/space.jpeg')}
            style={[styles.backgroundImage, { width: '100%', height: '100%' }]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.routeText}>Loading</Text>
              <Image
                source={{
                  uri: 'https://www.wpfaster.org/wp-content/uploads/2013/06/loading-gif.gif',
                }}
                style={{ width: 50, height: 50 }}></Image>
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ScrollView>
            <SafeAreaView style={styles.droidSafeArea}>
              <ImageBackground
                source={require('../assets/space.jpeg')}
                style={styles.backgroundImage}>
                <Text style={styles.routeText}> Daily Pic </Text>
                <TouchableOpacity
                  style={styles.listContainer}
                  onPress={() =>
                    Linking.openURL(this.state.apod.url).catch((err) =>
                      console.error("Couldn't Load Page", err)
                    )
                  }>
                  <View style={styles.iconContainer}>
                    <Image
                      source={{ uri: this.state.apod.url }}
                      style={{
                        width: '100%',
                        height: 300,
                        borderRadius: 20,
                      }}></Image>
                  </View>
                </TouchableOpacity>
                <Text style={styles.titleText}>{this.state.apod.title}</Text>
                <Text style={{ color: 'dodgerblue', fontSize: 20 }}>
                  {this.state.apod.date}
                </Text>
                <Text style={styles.explanationText}>
                  {this.state.apod.explanation}
                </Text>
                <Text style={{ color: 'yellow' }}>
                  Source -
                  NASA API
                </Text>
              </ImageBackground>
            </SafeAreaView>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  routeText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ec63ff',
  },
  explanationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    // margin: 10,
    // textAlign: 'center'
  },
  listContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    flex: 0.8,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
