import React, {Component} from 'react';
import {
  Button,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as RNText,
  Animated,
} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {SharedElement} from 'react-navigation-shared-element';
import CrossMarker from './CrossMarker';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import {snap} from '@popmotion/popcorn';
import Svg, {G, Path, Text, TSpan} from 'react-native-svg';
const Discovery = require('react-native-discovery');
const DATA = [
  {
    id: '1',
    title: 'Manarola, Italy',
    description: 'The Cliffs of Cinque Terre',
    image_url:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80',
    iconName: 'location-pin',
  },
  {
    id: '2',
    title: 'Venezia, Italy',
    description: 'Rialto Bridge, Venezia, Italy',
    image_url:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=630&q=80',
    iconName: 'location-pin',
  },
  {
    id: '3',
    title: 'Prague, Czechia',
    description: 'Tram in Prague',
    image_url:
      'https://images.unsplash.com/photo-1513805959324-96eb66ca8713?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    iconName: 'location-pin',
  },
];

const {width} = Dimensions.get('screen');

const numberOfSegments = 12;
const wheelSize = width * 0.95;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = color({hue: 'purple'});

const makeWheel = () => {
  const data = Array.from({length: numberOfSegments}).fill(1);
  const arcs = d3Shape.pie()(data);
  const colors = color({
    luminosity: 'dark',
    count: numberOfSegments,
  });

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);

    return {
      path: instance(arc),
      color: colors[index],
      value: Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
      centroid: instance.centroid(arc),
    };
  });
};

export default class HomeScreen extends Component {
  _wheelPaths = makeWheel();
  _angle = new Animated.Value(0);
  angle = 0;

  state = {
    enabled: true,
    finished: false,
    winner: null,
    end: false,
  };
  componentDidMount() {
    // DeviceEventEmitter.addListener('discoveredUsers', data => {
    //   console.log(data);
    // });

    this._angle.addListener(event => {
      if (this.state.enabled) {
        this.setState({
          finished: false,
        });
        if (this.state.end) {
          this.setState({
            enabled: false,
            finished: false,
          });
        }
      }

      this.angle = event.value;
    });
  }
  _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(this.angle % oneTurn));
    return Math.floor(deg / angleBySegment);
  };

  _onMove = ({nativeEvent}) => {};
  _onPan = ({nativeEvent}) => {
    // console.log(nativeEvent);
    this.setState({end: false});
    if (nativeEvent.state === State.ACTIVE) {
      const {velocityY} = nativeEvent;
      // console.log('velocityY:', velocityY);
      Animated.decay(this._angle, {
        velocity: velocityY / 2000,
        deceleration: 0.999,
        useNativeDriver: true,
      }).start(() => {
        this._angle.setValue(this.angle % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);
        Animated.timing(this._angle, {
          toValue: snapTo(this.angle),
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // const winnerIndex = this._getWinnerIndex();
          this.setState({
            enabled: true,
            // finished: true,
            // winner: this._wheelPaths[winnerIndex].value,
          });
        });
        // do something here;
      });
    } else if (nativeEvent.state === State.END) {
      this.setState({end: true});
      // console.log('end');
      const {velocityY} = nativeEvent;
      Animated.decay(this._angle, {
        velocity: velocityY / 2000,
        deceleration: 0.999,
        useNativeDriver: true,
      }).start(() => {
        this._angle.setValue(this.angle % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);
        Animated.timing(this._angle, {
          toValue: snapTo(this.angle),
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          const winnerIndex = this._getWinnerIndex();
          this.setState({
            enabled: true,
            end: true,
            finished: true,
            winner: this._wheelPaths[winnerIndex].value,
          });
        });
        // do something here;
      });
    }
  };

  _renderKnob = () => {
    const knobSize = 30;
    // [0, numberOfSegments]
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(this._angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment),
      ),
      1,
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: [
                  '0deg',
                  '0deg',
                  '35deg',
                  '-35deg',
                  '0deg',
                  '0deg',
                ],
              }),
            },
          ],
        }}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{transform: [{translateY: 8}]}}>
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={knobFill}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderWinner = () => {
    return (
      <RNText style={styles.winnerText}>Winner is: {this.state.winner}</RNText>
    );
  };

  _renderSvgWheel = () => {
    return (
      <View style={styles.container}>
        {this._renderKnob()}
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: this._angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
                }),
              },
            ],
          }}>
          <Svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{transform: [{rotate: `-${angleOffset}deg`}]}}>
            <G y={width / 2} x={width / 2}>
              {this._wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;
                const number = arc.value.toString();

                return (
                  <G key={`arc-${i}`}>
                    <Path d={arc.path} fill={arc.color} />
                    <G
                      rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                      origin={`${x}, ${y}`}>
                      <Text
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle"
                        fontSize={fontSize}>
                        {Array.from({length: number.length}).map((_, j) => {
                          return (
                            <TSpan
                              x={x}
                              dy={fontSize}
                              key={`arc-${i}-slice-${j}`}>
                              {number.charAt(j)}
                            </TSpan>
                          );
                        })}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  };
  // renderItem = item => (
  //   <View key={item.id}>
  //     <TouchableOpacity
  //       activeOpacity={0.8}
  //       style={{marginBottom: 14, flexDirection: 'row'}}
  //       onPress={() => this.props.navigation.navigate('DetailScreen', {item})}>
  //       <SharedElement id={`item.${item.id}.image_url`}>
  //         <Image
  //           style={{
  //             borderRadius: 14,
  //             width: 100,
  //             height: 100,
  //           }}
  //           source={{uri: item.image_url}}
  //           resizeMode="cover"
  //         />
  //       </SharedElement>

  //       <View style={{flexDirection: 'row'}}>
  //         <View style={{flexDirection: 'column', paddingLeft: 6}}>
  //           <SharedElement id={`item.${item.id}.title`}>
  //             <RNText
  //               style={{
  //                 color: 'white',
  //                 fontSize: 24,
  //                 fontWeight: 'bold',
  //                 lineHeight: 28,
  //               }}>
  //               {item.title}
  //             </RNText>
  //           </SharedElement>
  //           <SharedElement id={`item.${item.id}.description`}>
  //             <RNText
  //               style={{
  //                 color: 'white',
  //                 fontSize: 16,
  //                 fontWeight: 'bold',
  //                 lineHeight: 18,
  //               }}>
  //               {item.description}
  //             </RNText>
  //           </SharedElement>
  //           <SharedElement id={`item.${item.id}.para`}>
  //             <RNText
  //               style={{
  //                 color: 'white',
  //                 fontSize: 16,
  //                 fontWeight: 'bold',
  //                 lineHeight: 18,
  //               }}>
  //               para
  //             </RNText>
  //           </SharedElement>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   </View>
  // );
  render() {
    return (
      <View
        style={{
          flex: 1,
          // alignItems: 'center',
          // justifyContent: 'center'

          backgroundColor: '#000',
        }}>
        <PanGestureHandler
          onHandlerStateChange={this._onPan}
          enabled={this.state.enabled}>
          <View style={styles.container}>
            {this._renderSvgWheel()}
            {this.state.finished && this.state.enabled && this._renderWinner()}
          </View>
        </PanGestureHandler>

        {/* <Button
          title="pdf"
          onPress={() => this.props.navigation.navigate('Pdfview')}
        />
        <Button
          title="CollapsibleExample"
          onPress={() => this.props.navigation.navigate('CollapsibleExample')}
        />
        <View style={{backgroundColor: '#fff'}}>
          <CrossMarker />
        </View>

        <FlatList
          data={DATA}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={item => item.id}
        /> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   marginTop: StatusBar.currentHeight || 0,
  // },
  // item: {
  //   backgroundColor: '#cccccc',
  //   padding: 20,
  //   marginVertical: 8,
  //   // marginHorizontal: 16,
  // },
  // title: {
  //   fontSize: 32,
  // },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerText: {
    fontSize: 32,
    fontFamily: 'Menlo',
    position: 'absolute',
    bottom: 10,
  },
});
