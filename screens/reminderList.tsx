import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ReminderList() {
  return (
    <View>
      <Text style={styles.text}>reminderList</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
        color: '#000'
    }
})