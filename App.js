import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const API_KEY = "dbc562a84ea4bd907d40900e32dfe298"
// const API_KEY = "my api key"

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async() => {
    // 위치 권한요청
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps: false}
    );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View> 
          ) : (
          days.map((day, index) => 
            <View key={index} style={styles.day} >
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Text style={styles.desc}>{day.weather[0].main}</Text>
              <Text style={styles.mdesc}>{day.weather[0].description}</Text>
            </View>
          )
        )}
      </ScrollView>
      <StatusBar style='light'></StatusBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(115, 119, 158)',
  },
  city: {
    flex: 1.2,
    // color: 'white',
    // backgroundColor: "rgb(222, 224, 236)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500',
  },
  weather: {
    // backgroundColor: "rgb(72, 73, 82)",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    // backgroundColor: "teal",
    
  },
  temp: {
    fontSize: 158,
    color: 'white',
  },
  desc: {
    fontSize: 60,
    marginTop: -30,
    color: 'white',
  },
  mdesc: {
    fontSize: 30,
    marginTop: -10,
    color: 'white',
  },
});
