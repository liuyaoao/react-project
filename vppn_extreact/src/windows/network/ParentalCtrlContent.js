import React,{Component} from 'react';
import Intl from '../../intl/Intl';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class ParentalCtrlContent extends Component {
    state={
    }
    render(){
      return (
        <div className='parentalCtrl_content' style={{height:'100%'}}>
          <TabPanel cls='parentalCtrl_tabPanel'
            height={'100%'}
            defaults={{
                cls: "card",
                // layout: "center",
                tab: {
                    flex: 0,
                    minWidth: 100
                }
            }}
            tabBar={{
                layout: {
                    pack: 'left'
                }
            }}
          >
              <Container title={Intl.get('Plan')} cls="plan_tab" scrollable={true}>
                <div style={{margin:'20px'}}>计划
                </div>
              </Container>
              <Container title={Intl.get('Website Filter')} cls="pageFilter_tab" scrollable={true}>
                  <div className="">
                    网页过滤器
                  </div>
              </Container>

            </TabPanel>
        </div>
    )
  }
}
