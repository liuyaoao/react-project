import React from 'react';
import { TabPanel, Container,FormPanel,FieldSet,TextField,Button } from '@extjs/ext-react';

export default function DesktopTabsExample() {
    return (
        <TabPanel
            flex={1}
            shadow
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
            <Container title="setting">
              <FormPanel>
                <FieldSet title={"管理服务器1"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="10 10 0 10"
                  >
                    <TextField placeholder="Enter..." width="200" label="地址：" required flex={1}/>
                    <TextField placeholder="Enter..." width="200" label="端口：" required flex={1}/>
                    <Container flex={1}>
                      <Button text={"测试"} ui={'action raised'} style={{marginRight:'10px'}}></Button>
                      <Button text={"保存"} ui={'confirm raised'}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
              <FormPanel>
                <FieldSet title={"管理服务器2"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="10 10 0 10"
                  >
                    <TextField placeholder="Enter..." width="200" label="地址：" required flex={1}/>
                    <TextField placeholder="Enter..." width="200" label="端口：" required flex={1}/>
                    <Container flex={1}>
                      <Button text={"测试"} ui={'action raised'} style={{marginRight:'10px'}}></Button>
                      <Button text={"保存"} ui={'confirm raised'}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
              <FormPanel>
                <FieldSet title={"管理目标"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="10 10 0 10"
                  >
                    <TextField placeholder="Enter..." width="200" label="地址：" required flex={1}/>
                    <Container flex={1}>
                      <Button text={"保存"} ui={'confirm raised'} style={{marginLeft:'10px'}}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
              <FormPanel>
                <FieldSet title={"Syslog"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="10 10 0 10"
                  >
                    <TextField placeholder="Enter..." width="200" label="Address：" required flex={1}/>
                    <TextField placeholder="Enter..." width="200" label="Level：" required flex={1}/>
                    <Container flex={1}>
                      <Button text={"Enable"} ui={'confirm raised'} style={{marginLeft:'10px'}}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
            </Container>

            <Container title="vPath packs">
            <FormPanel>
              <FieldSet title={"vPathPacks:请选择一个要编辑的vPathPack"}
                layout={{type:'hbox',pack:'start',align: 'bottom'}}
                defaults={{labelAlign: "placeholder"}}
                margin="10 10 10 10"
                >
                  <Container flex={1}>
                    <Button text={"测试"} ui={'action raised'} style={{marginRight:'10px'}}></Button>
                    <Button text={"保存"} ui={'confirm raised'}></Button>
                  </Container>
              </FieldSet>
            </FormPanel>
            </Container>

            <Container title="payment">
                <span className="action">User tapped Tab 3</span>
            </Container>
        </TabPanel>
    )
}
