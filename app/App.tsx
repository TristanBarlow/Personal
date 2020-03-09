import React from 'react'
import { } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/pages/Home'
import Stack from './src/Stack'

interface State {
  showModal: boolean
}
export default class App extends React.Component<{}, State> {
  state: State = { showModal: false }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
