/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
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
                  <Circle center={mark} radius={100} strokeColor='red' fillColor='rgba(12,12,12,0.1)' />
          </MapView>
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
