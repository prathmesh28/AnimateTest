import React from 'react';
import { Platform, View } from 'react-native';
import PDFView from 'react-native-view-pdf';


export default class PdfView extends React.Component {
  render() {
    const resourceType = 'url';

    return (
      <View style={{ flex: 1, backgroundColor:'#000' }}>
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
      </View>
    );
  }
}