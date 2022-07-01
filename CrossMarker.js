import React, {Component} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';

export default class CrossMarker extends Component {
  static defaultProps = {
    isOpen: false,
    color: '#000',
    delay: 500,
    height: 30,
    width: 4,
  };
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
  }
  componentDidMount() {
    this.props.isOpen ? this.startAnimation(1) : this.startAnimation(0);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      this.props.isOpen ? this.startAnimation(1) : this.startAnimation(0);
    }
  }
  startAnimation(target) {
    Animated.timing(this.animatedValue, {
      toValue: target,
      duration: this.props.delay,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }
  renderLine = (angle, offset) => {
    const {color, height, width} = this.props;
    return (
      <Animated.View
        style={[
          styles.line,
          {
            backgroundColor: color,
            height,
            width,
            transform: [{rotateZ: angle}],
            left: offset,
          },
        ]}
      />
    );
  };

  render() {
    const {height} = this.props,
      origin = {
        x: height,
        y: height / 2,
      };
    const leftLinePos = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.x - height / 3, origin.x],
    });
    const rightLinePos = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.x + height / 3, origin.x],
    });
    return (
      <View style={[styles.container, {height, width: height * 2}]}>
        {this.renderLine('-45 deg', leftLinePos)}
        {this.renderLine('45 deg', rightLinePos)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    borderRadius: 10,
  },
});