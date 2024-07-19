import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import {enableLatestRenderer} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';
import notifee, {AndroidCategory, AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@react-native-material/core';
import Sound from 'react-native-sound';

enableLatestRenderer();

export default function Home({ navigation }:any) {
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });

    const [mark, setMark] = useState({ latitude: 37.78893, longitude: -122.430 });
    const [title, setTitle] = useState('');

    Sound.setCategory('Playback');

    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    var whoosh = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
    
    });



    function onRegionChange(region: any) {
        setRegion(region);
    }

    const getLocation = () => {
        Geolocation.getCurrentPosition((data) => {
            console.log(data.coords);
            setMark({ latitude: data.coords.latitude, longitude: data.coords.longitude });
            setRegion({
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });
        })
    }

    const storeData = async (value: string) => {
      try {
        let value= await AsyncStorage.getItem('data');
        if(value==null || value=="") {
            value= "[]";
        }
        let data= JSON.parse(value);
        let obj= {
            title: title,
            lat: mark.latitude,
            long: mark.longitude
        };
        data.push(obj);
        await AsyncStorage.setItem('data', JSON.stringify(data));
        console.log('Saved!');
      } catch (e) {
        // saving error
      }
    };
  
    // const getData = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('key');
    //     if (value !== null) {
    //       console.log(value)
    //       navigation.replace('Main')
  
    //     }
    //   } catch (e) {
    //     // error reading value
    //   }
    // };

    const sleep = (time:any) => new Promise((resolve) => setTimeout(() => resolve(), time));

    const veryIntensiveTask = async (taskDataArguments:any) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            while(BackgroundService.isRunning()) {
                let data= await AsyncStorage.getItem('data');
                let i= 0;
                let obj= JSON.parse(data);
                console.log('Data: '+data);
                getLocation();
                for(let i=0; i<obj?.length; i++) {
                    let rad= measure(mark.latitude, mark.longitude, obj[i].lat, obj[i].long)
                    if (rad <= 500) {
                        // if(i < 1) {
                            pushNotice();
                            // i++;
                        // }

                        // Play the sound with an onEnd callback
                        whoosh.play((success) => {
                          if (success) {
                            console.log('successfully finished playing');
                          } else {
                            console.log('playback failed due to audio decoding errors');
                          }
                        });
                        console.log(obj[i].title)
                    }
                }
                await sleep(delay);
            }
        });
    };

    function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000; // meters
    }

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
            delay: 10000,
        },
    };


    const startService = async () => {
        await BackgroundService.start(veryIntensiveTask, options);
        await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' }); // Only Android, iOS will ignore this call
    }

    const pushNotice = async () => {
        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        notifee.displayNotification({
            body: 'Full-screen notification',
            android: {
                category: AndroidCategory.ALARM,
                importance: AndroidImportance.HIGH,
                channelId,
                fullScreenAction: {
                    // For custom component:
                    id: 'default',
                    mainComponent: 'custom-component',

                    // id: 'default',
                    // launchActivity: 'com.smartreminder.CustActivity',

                },
            },
        })
    }

    const stopService = async () => {
        await BackgroundService.stop();
    }

    useEffect(() => { getLocation() }, []);

    return (
        // <SafeAreaView style={backgroundStyle}>
        <View
            style={[styles2.container]}>
            <View style={styles2.subContainer}>
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
            </View>
            <View style={styles2.control}>
                <View style={styles2.buttonBox}>
                    <Button
                        style={{width: '48%', margin: '1%'}}
                        color='green'
                        title="Start Service"
                        // loading={loading}
                        loadingIndicatorPosition="overlay"
                        onPress={startService}
                        // disabled={teamscore == '100' ? true : false}
                    />
                    <Button
                        style={{width: '48%', margin: '1%'}}
                        color='red'
                        titleStyle={{color: 'white'}}
                        title="Stop Service"
                        // loading={loading}
                        loadingIndicatorPosition="overlay"
                        onPress={stopService}
                        // disabled={teamscore == '100' ? true : false}
                    />
                </View>
                {/* <Pressable onPress={pushNotice} style={[{"backgroundColor":"red", "margin": 20} ]} >
                  <Text>Click here to Notify</Text>
                </Pressable> */}
                {/* <View>
                    <Text>{`Lat: ${mark.latitude} Long: ${mark.longitude} Title: ${title}`}</Text>
                </View> */}
                <View style={styles2.inputContainer}>
                    <TextInput style={styles2.input} placeholder='Enter title here' onChangeText={setTitle}></TextInput>
                    <TouchableOpacity style={styles2.saveBtn} onPress={storeData}><Text>Button</Text></TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles2.button}
                    onPress={()=>{navigation.navigate('List')}}
                ><Text style={{ "textAlign": "center" }}>My Reminders</Text></TouchableOpacity>
            </View>
        </View>
        // </SafeAreaView>
    );
}

const styles2 = StyleSheet.create({
    container: {
        // ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      subContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      control: {
        backgroundColor: '#17202A',
        width: '100%'
      },
      input: {
        backgroundColor: '#2C3E50',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        color: '#fff',
        width: '80%',
        height: 50,
        padding: 10,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
      },
      button: {
        padding: 20,
        backgroundColor: '#2C3E50'
      },
      saveBtn: {
        padding: 15,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#2C3E50'
      },
      buttonBox: {
        flexDirection: 'row'
      }
})