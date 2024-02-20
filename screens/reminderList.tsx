import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReminderList() {
    const [data, setData]= useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData= async ()=> {
        let data= await AsyncStorage.getItem('data');
        setData(JSON.parse(data));
    }
    

  return (
    <View>
      <Text style={styles.text}>reminderList</Text>
      <View>
        {data.map((item)=> {
            return <TouchableOpacity onLongPress={()=>{}} style={styles.card}>
                <Text style={styles.text}>{item?.title}</Text>
                </TouchableOpacity>
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
        color: '#000'
    },
    card: {
        padding: 20,
        margin: 10,
        backgroundColor: 'grey'
    }
})