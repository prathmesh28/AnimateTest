import React, {Component} from 'react';
import {
  Button,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import CrossMarker from './CrossMarker';
import Collapsible from 'react-native-collapsible';
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
export default class HomeScreen extends Component {
  renderItem = item => (
    <View key={item.id}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{marginBottom: 14, flexDirection: 'row'}}
        onPress={() => this.props.navigation.navigate('DetailScreen', {item})}>
        <SharedElement id={`item.${item.id}.image_url`}>
          <Image
            style={{
              borderRadius: 14,
              width: 100,
              height: 100,
            }}
            source={{uri: item.image_url}}
            resizeMode="cover"
          />
        </SharedElement>

        <View style={{flexDirection: 'row'}}>
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
            <SharedElement id={`item.${item.id}.para`}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  lineHeight: 18,
                }}>
                para
              </Text>
            </SharedElement>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  render() {
    return (
      <View
        style={{
          flex: 1,
          // alignItems: 'center',
          // justifyContent: 'center'
          paddingHorizontal: 20,
          backgroundColor: '#000',
        }}>
        <Button
          title="pdf"
          onPress={() => this.props.navigation.navigate('Pdfview')}
        />
        <Button
        title="CollapsibleExample"
        onPress={()=>this.props.navigation.navigate('CollapsibleExample')}
        />
      <View style={{backgroundColor:"#fff"}}><CrossMarker /></View>
        {/* <CrossMarker />
        <CrossMarker
          height={50}
          width={5}
          color={'green'}
          delay={300}
          onMarkPress={() => console.log('To Cross')}
          onCrossPress={() => console.log('To Mark')}
        />
        <CrossMarker height={70} width={6} color={'red'} delay={1000} /> */}
        <FlatList
          data={DATA}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#cccccc',
    padding: 20,
    marginVertical: 8,
    // marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
