import React, { Component } from 'react';
import { Window, TitleBar, Text } from 'react-desktop/windows';
import {FormPanel,Container,ComboBoxField,TextField} from '@extjs/ext-react';

Ext.require('store.chained');

export default class TempWindow extends Component {
  static defaultProps = {
    color: '#cc7f29',
    theme: 'light'
  };

  render() {
    const data = [
          {"name":"Alabama","abbrev":"AL"},
          {"name":"Alaska","abbrev":"AK"},
          {"name":"Arizona","abbrev":"AZ"}
     ];
    return (
      <Window
        color={this.props.color}
        theme={this.props.theme}
        chrome
        width="500px"
        height="300px"
        padding="12px"
      >
        <TitleBar title="My Windows Application" controls/>
        <Container layout="center">
             <FormPanel shadow>
                 <ComboBoxField
                     width={200}
                     label="State"
                     options={data}
                     displayField="name"
                     valueField="code"
                     labelAlign="placeholder"
                     typeAhead
                 />
                 <TextField placeholder="Enter..." width="200" label="端口：" required flex={1}/>
                 <TextField placeholder="Enter..." width="200" label="端口：" required flex={1}/>

             </FormPanel>
         </Container>
      </Window>
    );
  }
}
