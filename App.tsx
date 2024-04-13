/* eslint-disable */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import formatTime from 'minutes-seconds-milliseconds';

export default class App extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      timeElapsed: null,
      running: false,
      startTime: null,
      laps: []
    };

    this.handleStartPress = this.handleStartPress.bind(this);
    this.startStopButton = this.startStopButton.bind(this);
    this.handleLapPress = this.handleLapPress.bind(this);
  }

  laps() {
    return this.state.laps.map(function (time: any, index: any) {
      return <View key={index} style={styles.lap}>
        <Text style={[styles.lapText, styles.whiteText]}>
          Lap {index + 1}
        </Text>
        <Text style={[styles.lapText, styles.whiteText]}>
          {formatTime(time)}
        </Text>
      </View>
    });
  }

  startStopButton() {
    var style = this.state.running ? styles.stopButton : styles.startButton;
    var buttonText = this.state.running ? 'Stop' : 'Start';
    var buttonTextColor = this.state.running ? 'red' : 'green'; // Màu chữ tương ứng
    return (
        <TouchableHighlight 
            underlayColor="gray"
            onPress={this.handleStartPress} 
            style={[styles.button, style]}
        >
            <Text style={[styles.buttonText, {color: buttonTextColor}]}>
                {buttonText}
            </Text>
        </TouchableHighlight>
    );
  }

  lapButton() {
    return <TouchableHighlight style={styles.lapButton}
      underlayColor="gray" onPress={this.handleLapPress}>
      <Text style={styles.whiteText}>
        Lap
      </Text>
    </TouchableHighlight>;
  }

  handleLapPress() {
    var lap = this.state.timeElapsed;
    this.setState({
      startTime: new Date(),
      laps: this.state.laps.concat([lap])
    });
  }

  handleStartPress() {
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({ running: false, interval: null });
      return;
    }

    this.setState({ startTime: new Date() });

    this.interval = setInterval(() => {
      this.setState({
        timeElapsed: new Date() - this.state.startTime,
        running: true
      });
    }, 30);
  }

  render() {
    return <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerWrapper}>
          <Text style={[styles.timer, styles.whiteText]}>
            {formatTime(this.state.timeElapsed)}
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          {this.lapButton()}
          {this.startStopButton()}
        </View>
      </View>
      <View style={styles.footer}>
        {this.laps()}
      </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  header: {
    flex: 1
  },
  footer: {
    flex: 1
  },
  timerWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  lap: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 10,
    marginTop: 10
  },
  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lapButton: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey'
  },
  timer: {
    fontSize: 60
  },
  lapText: {
    fontSize: 30
  },
  startButton: {
    borderColor: 'green'
  },
  stopButton: {
    borderColor: 'red'
  }
  ,
  whiteText: {
    color: 'white'
  }
});
