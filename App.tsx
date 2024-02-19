import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ReminderList from './screens/reminderList';
import Home from './screens/home';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {

  const Stack = createNativeStackNavigator();
  const main = "Main";
  const list = "List";

  return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName={main} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={main} component={Home} />
            <Stack.Screen name={list} component={ReminderList} />
        </Stack.Navigator>
        </NavigationContainer>
  );
}

export function CustomComponent(): React.JSX.Element {

  return (
    // <SafeAreaView style={backgroundStyle}>
        <View
          style={[styles2.container]}>
          <Pressable onPress={()=>{}} style={[{"backgroundColor":"red", "margin": 20} ]} >
            <Text>Click here to Notify</Text>
          </Pressable>
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
  }
 });

export default App;