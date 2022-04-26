import React, {Component} from 'react';
import {
  Button,
  Image,
  ScrollView,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import Interactable from 'react-native-interactable';
const Screen = {
  height: Dimensions.get('window').height,
};

class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(0);
    this._deltaX = new Animated.Value(0);
    this.state = {
      canScroll: false,
    };
  }
  onSnap(event) {
    const {id} = event.nativeEvent;
    if (id === 'bottom') {
      this.setState({canScroll: true});
    }
  }
  onScroll(event) {
    const {contentOffset} = event.nativeEvent;
    if (contentOffset.y <= 0) {
      this.setState({canScroll: false});
    }
  }
  render() {
    const {item} = this.props.route.params;

    return (
      <View style={{flex: 1, backgroundColor: '#0f0f0f'}}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this._deltaY.interpolate({
                  inputRange: [-300, -300, 0, 0],
                  outputRange: [-58, -58, 0, 0],
                }),
              },
              {
                scale: this._deltaY.interpolate({
                  inputRange: [-300, -300, 0, 0],
                  outputRange: [0.35, 0.35, 1, 1],
                }),
              },
            ],
          }}>
          <SharedElement id={`item.${item.id}.image_url`}>
            <Image
              source={{uri: item.image_url}}
              style={{
                width: 300,
                height: 300,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
              resizeMode="cover"
            />
          </SharedElement>
        </Animated.View>
        <View
          style={{flexDirection: 'row', marginTop: 10, paddingHorizontal: 20}}>
          <View style={{flexDirection: 'column', paddingLeft: 6}}>
            <SharedElement id={`item.${item.id}.title`}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 'bold',
                  lineHeight: 28,
                }}>
                {item.title}
              </Text>
            </SharedElement>
            <SharedElement id={`item.${item.id}.description`}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  lineHeight: 18,
                }}>
                {item.description}
              </Text>
            </SharedElement>
          </View>
        </View>
        <Interactable.View
          animatedNativeDriver={true} //
          verticalOnly={true}
          snapPoints={[{y: 0}, {y: -150, id: 'bottom'}]}
          boundaries={{top: -150}}
          onSnap={this.onSnap.bind(this)}
          animatedValueX={this._deltaX}
          animatedValueY={this._deltaY}
          showsVerticalScrollIndicator={false}>
          <SharedElement id={`item.${item.id}.para`}>
            <ScrollView
              bounces={false}
              scrollEnabled={this.state.canScroll}
              onScroll={this.onScroll.bind(this)}
              indicatorStyle="white"
              style={{
                paddingHorizontal: 20,
                backgroundColor: '#0f0f0f',
              }}
              contentContainerStyle={{paddingVertical: 20}}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#fff',
                  lineHeight: 24,
                  marginBottom: 4,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: '#fff',
                  lineHeight: 24,
                  marginBottom: 4,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </ScrollView>
          </SharedElement>
        </Interactable.View>
        {/* <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('DetailScreen')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Go back to first screen in stack"
          onPress={() => this.props.navigation.popToTop()}
        /> */}
      </View>
    );
  }
}
DetailsScreen.sharedElements = route => {
  const {item} = route.params;
  return [
    {
      id: `item.${item.id}.image_url`,
      animation: 'move',
      resize: 'clip',
    },
    {
      id: `item.${item.id}.title`,
      animation: 'fade',
      resize: 'clip',
    },
    {
      id: `item.${item.id}.description`,
      animation: 'fade',
      resize: 'clip',
    },
    {
      id: `item.${item.id}.iconName`,
      animation: 'move',
      resize: 'clip',
    },
    {
      id: `item.${item.id}.para`,
      animation: 'fade',
      resize: 'clip',
    },
  ];
};
export default DetailsScreen;
