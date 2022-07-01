import 'react-native-gesture-handler';
import * as React from 'react';
import {Button, View, Text, Animated} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

import DetailsScreen from './DetailsScreen';
import HomeScreen from './HomeScreen';
import PdfView from './PdfView';
import CollapsibleExample from './CollapsibleExample';
import WheelOfFortune from './WheelOfFortune';
import WheelAnimation from './WheelAnimation';
const Stack = createSharedElementStackNavigator();

// const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}>
          {/* <Stack.Screen name="WheelAnimation" component={WheelAnimation} /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen
          name="DetailScreen"
          component={DetailsScreen}
          options={{
            headerBackTitleVisible: false,
            cardStyleInterpolator: ({current: {progress}}) => {
              return {
                cardStyle: {
                  opacity: progress,
                },
              };
            }, //removes white flickring
          }}
        />
        <Stack.Screen name="Pdfview" component={PdfView} />
        <Stack.Screen name="CollapsibleExample" component={CollapsibleExample} />
        <Stack.Screen name="WheelOfFortune" component={WheelOfFortune} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
