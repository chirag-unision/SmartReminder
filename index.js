/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {CustomComponent} from './App';
import notifee, { EventType } from '@notifee/react-native';


notifee.onBackgroundEvent(async ({ type, detail }) => {

  });

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('custom-component', () => CustomComponent);
