
import jquery from 'jquery';
import React from 'react';
import { Tabs, Form, Input, Button, notification} from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

import '../less/SettingContentPanel.less';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

 class SettingContentPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          active_topTab:1,
        }
    }

    componentDidMount() {
    }

    onTabChanged=(val)=>{
      console.log("setting panel tab 改变了--：",val);
      this.setState({
        active_topTab:val,
      });
    }
    onSubmitSave = ()=>{
      this.props.form.validateFields(
      (err,values) => {
        if (!err) {
          console.info('success, valid values:',values);
        }
      });
    }
    onSavePacks = ()=>{
      //TODO, 修改保存packs
    }
    render() {
      const { getFieldDecorator } = this.props.form;
        return (
            <div id="setting_content">
              <Tabs onChange={this.onTabChanged} type="card">
                <TabPane tab="Manager Server" key="1">
                  <fieldset style={{width:'98%',margin:'0 auto'}}>
                    <legend>Setting:</legend>
                      <FormItem {...formItemLayout} label="Address:">
                        {getFieldDecorator('address', {
                          rules: [{
                            required: true,
                            message: 'Please input server Address',
                          }],
                        })(
                          <Input placeholder="Please input server Address" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="Port:">
                        {getFieldDecorator('port', {
                          rules: [{
                            required: true,
                            message: 'Please input server port',
                          }],
                        })(
                          <Input placeholder="Please input server port" />
                        )}
                      </FormItem>
                      <FormItem {...formTailLayout}>
                        <Button type="primary" onClick={this.onSubmitSave}>Save</Button>
                      </FormItem>
                  </fieldset>
                </TabPane>
                <TabPane tab="vPath Packs" key="2">
                  <div style={{width:"40%",display:'inline-block'}}>
                    Packs:
                    <div style={{height:'100%',border:'1px solid gray',borderRadius:'5px',margin:'5px'}}>

                    </div>
                  </div>
                  <div style={{width:"58%",display:'inline-block'}}>
                    Select a pack which you want to edit:
                    <div style={{height:'100%',border:'1px solid gray',borderRadius:'5px',margin:'5px'}}>

                    </div>
                    <div><Button type="primary" onClick={this.onSavePacks}>Save</Button></div>
                  </div>
                </TabPane>
                <TabPane tab="Package Info" key="3">Content of Tab Pane 3</TabPane>
              </Tabs>
            </div>
        );
    }
}

export default Form.create()(SettingContentPanel);
