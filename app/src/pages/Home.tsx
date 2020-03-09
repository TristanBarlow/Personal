import React from 'react'
import { StyleSheet, Text, View, Modal, Button } from 'react-native'

interface State {
  showModal: boolean
}

export default class Hello extends React.Component<{}, State> {
  state: State = { showModal: false }

  render() {
    return (
      <View style={styles.container} >
        <Text>Open up App.tsx to gg on your!</Text>
        <Button title="Show Modal" onPress={() => this.setState({ showModal: true })}>
        </Button>
      </View>
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
