/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  Header
} from 'react-native/Libraries/NewAppScreen';

import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import {enableLatestRenderer} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';

enableLatestRenderer();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [region, setRegion]= useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [mark, setMark]= useState({latitude: 37.78893, longitude: -122.430});

  function onRegionChange(region:any) {
    setRegion(region);
  }

  useEffect(()=> {
    getLocation();
  }, []);

  const getLocation= ()=>{
    Geolocation.getCurrentPosition((data)=>{
        console.log(data.coords);
        setMark({latitude: data.coords.latitude, longitude: data.coords.longitude});
        setRegion({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
    })
  }

  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise( async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(delay);
        }
    });
  };

  const options = {
      taskName: 'Example',
      taskTitle: 'ExampleTask title',
      taskDesc: 'ExampleTask description',
      taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
      parameters: {
          delay: 1000,
      },
  };


  const startService= async ()=> {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'}); // Only Android, iOS will ignore this call
  }

  const stopService= async ()=> {
    await BackgroundService.stop();
  }

  return (
    // <SafeAreaView style={backgroundStyle}>
        <View
          style={[{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }, styles2.container]}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles2.map}
            region={region}
            // showsUserLocation={true}
            // onRegionChange={onRegionChange}
          >
                {/* <Marker
                  key={1}
                  coordinate={{latitude: 37.78813, longitude: -122.430}}
                  title={"marker.title"}
                  description={"marker.description"}
                /> */}
                  <Marker draggable
                    coordinate={mark}
                    onDragEnd={(e) => setMark(e.nativeEvent.coordinate)}
                  />
                  <Circle center={mark} radius={500} strokeColor='red' fillColor='rgba(12,12,12,0.1)' />
          </MapView>
          <Pressable onPress={startService} style={[{"backgroundColor":"green"} ]} >
            <Text>Click here to Start</Text>
          </Pressable>
          <Pressable onPress={stopService} style={[{"backgroundColor":"red"} ]} >
            <Text>Click here to Stop</Text>
          </Pressable>
        </View>
    // </SafeAreaView>
  );
}

const styles2 = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '90%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });

export default App;