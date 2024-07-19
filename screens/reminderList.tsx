import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-swipeable'

export default function ReminderList() {
    const [data, setData]= useState([]);
    const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable]= useState(null);

    useEffect(() => {
        fetchData();
    }, [])

    const onOpen = (event, gestureState, swipeable) => {
      if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
        currentlyOpenSwipeable.recenter();
      }
      setCurrentlyOpenSwipeable(swipeable);
    }
    const onClose= () => setCurrentlyOpenSwipeable(null);

    const fetchData= async ()=> {
        let data= await AsyncStorage.getItem('data');
        setData(JSON.parse(data));
    }
    

  return (
    <View style={{backgroundColor: '#17202A', height: '100%'}}>
      <Text style={styles.text}>Reminder List</Text>
      <View style={{marginHorizontal: 10, overflow: 'hidden'}}>
        {data?.map((item, i)=> { 
          return       <Swipeable
                          key={i}
                          rightButtons={[
                            <TouchableOpacity style={[styles.card2, {backgroundColor: 'green'}]}>
                              <Text>Done</Text>
                            </TouchableOpacity>
                          ]}
                          onRightButtonsOpenRelease={onOpen}
                          onRightButtonsCloseRelease={onClose}
                        >
                          <View style={[styles.card, {backgroundColor: '#2C3E50'}]}>
                            <Text>{item?.title}</Text>
                          </View>
                        </Swipeable>
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        padding: 10,
        fontWeight: '500'
    },
    card: {
        padding: 20,
        marginVertical: 5,
        backgroundColor: 'grey'
    },
    card2: {
        padding: 20,
        marginVertical: 5,
        backgroundColor: 'grey'
    },
})