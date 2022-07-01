import React from 'react';
import {Animated, Dimensions, StyleSheet, Text} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';
const {width} = Dimensions.get('screen');

export class WheelAnimation extends React.Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  dragRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      _isMounted: false,
    };

    /* Pinching */
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);

    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event(
      [{nativeEvent: {scale: this._pinchScale}}],
      {useNativeDriver: true},
    );

    /* Rotation */
    this._rotate = new Animated.Value(0);
    this._rotateStr = this._rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    });
    this._lastRotate = 0;
    this._onRotateGestureEvent = Animated.event(
      [{nativeEvent: {rotation: this._rotate}}],
      {useNativeDriver: true},
    );

   
   
   
  }

  _onRotateHandlerStateChange = event => {
    console.log(event.nativeEvent)
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };
  


  render() {
    const {image, children} = this.props;

    return (
      <React.Fragment>
       
          <Animated.View
            style={[
              styles.wrapper,
              
            ]}>
            <RotationGestureHandler
              ref={this.rotationRef}
              // simultaneousHandlers={this.pinchRef}
              onGestureEvent={this._onRotateGestureEvent}
              onHandlerStateChange={this._onRotateHandlerStateChange}>
              <Animated.View
                style={[
                  styles.wrapper,
                  {
                    transform: [{rotate: this._rotateStr}],
                  },
                ]}>
              
                  <Animated.View
                    style={[
                      styles.container,
                      {
                        transform: [{scale: this._scale}],
                      },
                    ]}
                    collapsable={false}>
                    <Animated.View
                      style={[styles.pinchableImage]}
                      source={{uri: image}}>
                      <Text style={{color: '#fff'}}>HI</Text>
                    </Animated.View>
                  </Animated.View>
              </Animated.View>
            </RotationGestureHandler>
          </Animated.View>
        {children}
      </React.Fragment>
    );
  }
}

export default WheelAnimation;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pinchableImage: {
    backgroundColor: '#000',
    width: width,
    height: width,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    // ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    flex: 1,
  },
});
