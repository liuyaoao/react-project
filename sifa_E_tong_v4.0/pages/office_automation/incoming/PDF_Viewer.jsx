import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';

export default class PDF_Viewer extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }

  onDocumentLoad({ numPages }) {
    this.setState({ numPages });
  }

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div style={{position:'absolute',zIndex:'9999',top:0,left:0,width:'100%'}}>
        <Document
          file={this.props.fileUrl}
          onLoadSuccess={this.onDocumentLoad}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
      </div>
    );
  }
}
