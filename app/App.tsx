import React from 'react';
import { StyleSheet, Text, View, Modal, Button } from 'react-native';

interface State {
  showModal: boolean
}
export default class App extends React.Component<{}, State> {
  state: State = { showModal: false }

  render() {
    return (
      <View style={styles.container} >
        <Text >Open up App.tsx to start gg on your!</Text>
        <Button title="Show Modal" onPress={() => this.setState({ showModal: true })}>
        </Button>
        <Modal visible={this.state.showModal}>
          <Text>foo</Text>
          <Button title="Hide Modal" onPress={() => this.setState({ showModal: false })} />
        </Modal>
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
