Ext.require(["Ext.app.Application", "Ext.Component", "Ext.Widget"]);
Ext.require("Ext.reactor.RendererCell");
Ext.require('Ext.plugin.Responsive');
Ext.create({"xtype":"container"});
Ext.create({
  xtype: 'tooltip',
  cls: "toolTip_container_" + this.icon.id,
  showDelay: 300,
  dismissDelay: 3000,
  trackMouse: true
});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"tooltip"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"container"});
Ext.require('Ext.Toast');
Ext.require('store.chained');
Ext.create({
  xtype: 'tabpanel',
  flex: 1,
  shadow: true,
  height: '100%',
  defaults: {
    cls: "card",
    // layout: "center",
    tab: {
      flex: 0,
      minWidth: 100
    }
  },
  tabBar: {
    layout: {
      pack: 'left'
    }
  }
});
Ext.create({
  xtype: 'container',
  title: 'setting'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "管理服务器1",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '5 10 0 10'
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  labelAlign: 'placeholder',
  width: '200',
  label: '\u5730\u5740\uFF1A',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  width: '200',
  label: '\u7AEF\u53E3\uFF1A',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  text: "测试",
  ui: 'confirm  raised',
  style: {
    marginLeft: '10px',
    marginRight: '10px'
  }
});
Ext.create({
  xtype: 'button',
  text: "保存",
  ui: 'action raised'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "管理服务器2",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '5 10 0 10'
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  width: '200',
  label: '\u5730\u5740\uFF1A',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  width: '200',
  label: '\u7AEF\u53E3\uFF1A',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  text: "测试",
  ui: 'confirm raised',
  style: {
    marginLeft: '10px',
    marginRight: '10px'
  }
});
Ext.create({
  xtype: 'button',
  text: "保存",
  ui: 'action raised'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "管理目标",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '5 10 0 10'
});
Ext.create({
  xtype: 'comboboxfield',
  width: 200,
  label: '\u5730\u5740\uFF1A',
  store: data,
  displayField: 'name',
  valueField: 'abbrev',
  queryMode: 'local',
  labelAlign: 'placeholder',
  clearable: true
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  text: "保存",
  ui: 'action raised',
  style: {
    marginLeft: '10px'
  }
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "Syslog",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '5 10 0 10'
});
Ext.create({
  xtype: 'comboboxfield',
  width: 200,
  label: '\u5730\u5740\uFF1A',
  store: data,
  displayField: 'name',
  valueField: 'abbrev',
  queryMode: 'local',
  labelAlign: 'placeholder',
  clearable: true
});
Ext.create({
  xtype: 'selectfield',
  label: 'Level:',
  width: '200',
  onChange: function onChange(field, newValue) {
    return Ext.toast('You selected the item with value ' + newValue);
  },
  options: [{
    text: '',
    value: null
  }, {
    text: 'Option 1',
    value: 1
  }, {
    text: 'Option 2',
    value: 2
  }, {
    text: 'Option 3',
    value: 3
  }]
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  text: "Enable",
  ui: 'action raised',
  style: {
    marginLeft: '10px'
  }
});
Ext.create({
  xtype: 'container',
  title: 'vPath packs'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "vPathPacks:请选择一个要编辑的vPathPack",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'top'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '5 5 5 5'
});
Ext.create({
  xtype: 'list',
  cls: '',
  shadow: true,
  itemTpl: this.itemTpl,
  store: this.dataStore,
  onSelect: this.onListSelect,
  zIndex: 999,
  height: '' + (this.props.windowHeight - 169),
  width: '160'
});
Ext.create({
  xtype: 'container',
  flex: 1,
  style: {
    marginLeft: '20px'
  }
});
Ext.create({
  xtype: 'button',
  text: "保存",
  ui: 'action raised',
  style: {
    'float': 'right',
    marginTop: '10px'
  }
});
Ext.create({
  xtype: 'container',
  title: 'payment'
});
Ext.create({"xtype":"tabpanel"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"formpanel"});
Ext.create({"xtype":"fieldset"});
Ext.create({"xtype":"textfield"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"selectfield"});
Ext.create({"xtype":"comboboxfield"});
Ext.create({"xtype":"list"});
Ext.create({"xtype":"textareafield"});
Ext.require('Ext.data.TreeStore');
Ext.create({
  xtype: 'treelist',
  cls: 'sidebar3 ext_treeList_container',
  ui: 'nav',
  expanderFirst: false,
  onItemClick: function onItemClick(tree, item) {
    return _this3.onItemClick(item.node.getId());
  },
  selection: '1_vport',
  store: this.treeListData,
  responsiveConfig: (_ref2 = {}, _defineProperty(_ref2, medium, {
    micro: true,
    width: 56
  }), _defineProperty(_ref2, large, {
    micro: false,
    width: 200
  }), _ref2)
});
Ext.create({"xtype":"treelist"});
Ext.create({"xtype":"list"});
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');
Ext.create({
  xtype: 'tabpanel',
  cls: 'vportContent',
  flex: 1,
  shadow: true,
  height: '100%',
  defaults: {
    cls: "card",
    // layout: "center",
    tab: {
      flex: 0,
      minWidth: 100
    }
  },
  tabBar: {
    layout: {
      pack: 'left'
    }
  }
});
Ext.create({
  xtype: 'container',
  title: 'Remote Router',
  cls: 'remoter_router'
});
Ext.create({
  xtype: 'container',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'center'
  },
  margin: '0 0 10 0',
  defaults: {
    margin: "0 10 0 0"
  }
});
Ext.create({
  xtype: 'selectfield',
  width: '200',
  name: 'bootsNode',
  displayField: 'value',
  value: selectedBootsNode,
  onChange: this.onBootsNodeSelectChanged,
  options: bootsNodeOptions
});
Ext.create({
  xtype: 'button',
  text: "关闭",
  ui: 'decline alt'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh',
  alt: '\u5237\u65B0'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '99%',
  height: '320px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u72B6\u6001',
  width: '100',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u865A\u62DFIP',
  width: '120',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u5B50\u7F51',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u94FE\u8DEF\u72B6\u6001',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u5EF6\u65F6',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'container',
  margin: '10 0 10 0',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'bottom'
  }
});
Ext.create({
  xtype: 'textfield',
  width: '300',
  labelWidth: '60',
  labelAlign: 'left',
  labelTextAlign: 'center',
  label: '\u865A\u62DFIP:'
});
Ext.create({
  xtype: 'button',
  text: "添加",
  ui: 'action raised',
  style: {
    marginLeft: '10px'
  }
});
Ext.create({
  xtype: 'container',
  title: 'vPath',
  cls: 'v_path'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "来自vPort" + idNum + "的域名的流量将通过所选的vProxy路由。",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '10 10 10 10'
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  width: '200',
  label: '\u8BF7\u8F93\u5165\u5173\u952E\u5B57\u6216\u57DF\u540D\u6216URL',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'selectfield',
  label: 'vProxy',
  flex: 1,
  width: '200',
  value: this.state.selectedVProxyIp,
  onChange: this.onVProxySelectChanged,
  options: vProxyIpOptions
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  ui: 'menu raised',
  text: 'Add',
  style: {
    marginRight: '10px',
    marginBottom: '2px'
  }
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onAddTypeChange,
    group: 'buttonstyle'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: 'Add',
  value: '',
  iconCls: menuItemVal === '' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'Import cloud vPath to 10.100.16.24',
  value: 'action',
  iconCls: menuItemVal === 'action' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from China2World pack',
  value: 'decline',
  iconCls: menuItemVal === 'decline' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from World2China pack',
  value: 'confirm',
  iconCls: menuItemVal === 'confirm' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '98%',
  height: '340px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u57DF\u540D',
  width: '150',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u4EE3\u7406',
  width: '85',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({"xtype":"tabpanel"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"formpanel"});
Ext.create({"xtype":"textfield"});
Ext.create({"xtype":"fieldset"});
Ext.create({"xtype":"selectfield"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"menu"});
Ext.create({"xtype":"menuitem"});
Ext.create({"xtype":"grid"});
Ext.create({"xtype":"column"});
Ext.create({"xtype":"renderercell"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"container"});
Ext.create({
  xtype: 'button',
  cls: 'iconBtn',
  ui: 'action raised',
  iconCls: 'x-fa fa-chevron-left'
});
Ext.create({
  xtype: 'button',
  cls: 'iconBtn',
  ui: 'action raised',
  iconCls: 'x-fa fa-chevron-right'
});
Ext.create({
  xtype: 'button',
  cls: 'iconBtn',
  ui: 'action raised',
  iconCls: 'x-fa fa-rotate-right'
});
Ext.create({
  xtype: 'container',
  margin: '0 10px 0 0',
  width: 'auto',
  height: '32px'
});
Ext.create({
  xtype: 'searchfield',
  ui: 'faded',
  placeholder: 'Search'
});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"textfield"});
Ext.create({"xtype":"searchfield"});
Ext.create({"xtype":"container"});
Ext.create({
  xtype: 'button',
  cls: '',
  text: '\u4E0A\u4F20',
  ui: 'confirm raised'
});
Ext.create({
  xtype: 'button',
  cls: '',
  text: '\u65B0\u589E',
  ui: 'confirm raised'
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onNewAddTypeChange,
    group: 'buttontype'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: '\u65B0\u5EFA\u6587\u4EF6\u5939',
  value: 'newFolder',
  iconCls: newAddType === 'newFolder' ? 'x-font-icon md-icon-check' : 'x-fa fa-folder'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u65B0\u589E\u5171\u4EAB\u6587\u4EF6\u5939',
  value: 'newShareFolder',
  iconCls: newAddType === 'newShareFolder' ? 'x-font-icon md-icon-check' : 'x-fa fa-folder-open'
});
Ext.create({
  xtype: 'button',
  cls: '',
  text: '\u64CD\u4F5C',
  ui: 'confirm raised'
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onOperaTypeChange,
    group: 'buttontype'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: 'Text',
  value: 'text',
  iconCls: operaType === 'text' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'Icon',
  value: 'icon',
  iconCls: operaType === 'icon' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'Text & Icon',
  value: 'texticon',
  iconCls: operaType === 'texticon' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'button',
  cls: '',
  text: '\u5DE5\u5177',
  ui: 'confirm raised'
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onToolTypeChange,
    group: 'buttontype'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: '\u5171\u4EAB\u94FE\u8DEF\u7BA1\u7406\u5668',
  value: 'tool_1',
  iconCls: toolType === 'tool_1' ? 'x-font-icon md-icon-check' : 'x-fa fa-share-alt'
});
Ext.create({
  xtype: 'button',
  cls: '',
  text: '\u8BBE\u7F6E',
  ui: 'confirm raised'
});
Ext.create({"xtype":"container"});
Ext.create({
  xtype: 'button',
  cls: '',
  text: ' ',
  ui: 'confirm raised',
  iconCls: 'x-fa fa-th-list'
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onOperaTypeChange,
    group: 'buttontype'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: '\u5217\u8868\u89C6\u56FE',
  value: '\u5217\u8868\u89C6\u56FE',
  iconCls: operaType === '列表视图' ? 'x-font-icon md-icon-check' : 'x-fa fa-list'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u5C0F',
  value: '\u5C0F',
  iconCls: operaType === '小' ? 'x-font-icon md-icon-check' : 'x-fa fa-th'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u4E2D',
  value: '\u4E2D',
  iconCls: operaType === '中' ? 'x-font-icon md-icon-check' : 'x-fa fa-th-large'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u5927',
  value: '\u5927',
  iconCls: operaType === '大' ? 'x-font-icon md-icon-check' : 'x-fa fa-window-maximize'
});
Ext.create({
  xtype: 'button',
  cls: '',
  text: ' ',
  ui: 'confirm raised',
  iconCls: 'x-fa fa-sort-amount-asc'
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onOperaTypeChange,
    group: 'buttontype'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: '\u540D\u79F0',
  value: '\u540D\u79F0',
  iconCls: operaType === '名称' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u5927\u5C0F',
  value: '\u5927\u5C0F',
  iconCls: operaType === '大小' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u6587\u4EF6\u7C7B\u578B',
  value: '\u6587\u4EF6\u7C7B\u578B',
  iconCls: operaType === '文件类型' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u4FEE\u6539\u65E5\u671F',
  value: '\u4FEE\u6539\u65E5\u671F',
  iconCls: operaType === '修改日期' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u521B\u5EFA\u65E5\u671F',
  value: '\u521B\u5EFA\u65E5\u671F',
  iconCls: operaType === '创建日期' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u6700\u8FD1\u8BBF\u95EE\u65F6\u95F4',
  value: '\u6700\u8FD1\u8BBF\u95EE\u65F6\u95F4',
  iconCls: operaType === '最近访问时间' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u6743\u9650',
  value: '\u6743\u9650',
  iconCls: operaType === '权限' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u62E5\u6709\u8005',
  value: '\u62E5\u6709\u8005',
  iconCls: operaType === '拥有者' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: '\u7FA4\u7EC4',
  value: '\u7FA4\u7EC4',
  iconCls: operaType === '群组' && 'x-font-icon md-icon-check'
});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"menu"});
Ext.create({"xtype":"menuitem"});
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');
Ext.create({
  xtype: 'tabpanel',
  cls: 'vportContent',
  flex: 1,
  shadow: true,
  height: '100%',
  defaults: {
    cls: "card",
    // layout: "center",
    tab: {
      flex: 0,
      minWidth: 100
    }
  },
  tabBar: {
    layout: {
      pack: 'left'
    }
  }
});
Ext.create({
  xtype: 'container',
  title: 'Remote Router',
  cls: 'remoter_router'
});
Ext.create({
  xtype: 'container',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'center'
  },
  margin: '0 0 10 0',
  defaults: {
    margin: "0 10 0 0"
  }
});
Ext.create({
  xtype: 'selectfield',
  width: '200',
  name: 'bootsNode',
  displayField: 'value',
  value: selectedBootsNode,
  onChange: this.onBootsNodeSelectChanged,
  options: bootsNodeOptions
});
Ext.create({
  xtype: 'button',
  text: "关闭",
  ui: 'decline alt'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh',
  alt: '\u5237\u65B0'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '99%',
  height: '320px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u72B6\u6001',
  width: '100',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u865A\u62DFIP',
  width: '120',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u5B50\u7F51',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u94FE\u8DEF\u72B6\u6001',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u5EF6\u65F6',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'container',
  margin: '10 0 10 0',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'bottom'
  }
});
Ext.create({
  xtype: 'textfield',
  width: '300',
  labelWidth: '60',
  labelAlign: 'left',
  labelTextAlign: 'center',
  label: '\u865A\u62DFIP:'
});
Ext.create({
  xtype: 'button',
  text: "添加",
  ui: 'action raised',
  style: {
    marginLeft: '10px'
  }
});
Ext.create({
  xtype: 'container',
  title: 'vPath',
  cls: 'v_path'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "来自vPort的域名的流量将通过所选的vProxy路由。",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '10 10 10 10'
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  width: '200',
  label: '\u8BF7\u8F93\u5165\u5173\u952E\u5B57\u6216\u57DF\u540D\u6216URL',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  ui: 'menu raised',
  text: 'Add',
  style: {
    marginRight: '10px',
    marginBottom: '2px'
  }
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onAddTypeChange,
    group: 'buttonstyle'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: 'Add',
  value: '',
  iconCls: menuItemVal === '' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'Import cloud vPath to 10.100.16.24',
  value: 'action',
  iconCls: menuItemVal === 'action' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from China2World pack',
  value: 'decline',
  iconCls: menuItemVal === 'decline' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from World2China pack',
  value: 'confirm',
  iconCls: menuItemVal === 'confirm' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '98%',
  height: '340px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u57DF\u540D',
  width: '150',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u4EE3\u7406',
  width: '85',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({"xtype":"tabpanel"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"formpanel"});
Ext.create({"xtype":"textfield"});
Ext.create({"xtype":"fieldset"});
Ext.create({"xtype":"selectfield"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"menu"});
Ext.create({"xtype":"menuitem"});
Ext.create({"xtype":"grid"});
Ext.create({"xtype":"column"});
Ext.create({"xtype":"renderercell"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"container"});
Ext.require('Ext.data.TreeStore');
Ext.create({
  xtype: 'treelist',
  cls: 'sidebar3 ext_treeList_container',
  ui: 'nav',
  expanderFirst: false,
  onItemClick: function onItemClick(tree, item) {
    return _this3.onItemClick(item.node.getId());
  },
  selection: '1_vport',
  store: this.treeListData,
  responsiveConfig: (_ref2 = {}, _defineProperty(_ref2, medium, {
    micro: true,
    width: 56
  }), _defineProperty(_ref2, large, {
    micro: false,
    width: 200
  }), _ref2)
});
Ext.create({"xtype":"treelist"});
Ext.create({"xtype":"list"});
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');
Ext.create({
  xtype: 'tabpanel',
  cls: 'vportContent',
  flex: 1,
  shadow: true,
  height: '100%',
  defaults: {
    cls: "card",
    // layout: "center",
    tab: {
      flex: 0,
      minWidth: 100
    }
  },
  tabBar: {
    layout: {
      pack: 'left'
    }
  }
});
Ext.create({
  xtype: 'container',
  title: 'Remote Router',
  cls: 'remoter_router'
});
Ext.create({
  xtype: 'container',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'center'
  },
  margin: '0 0 10 0',
  defaults: {
    margin: "0 10 0 0"
  }
});
Ext.create({
  xtype: 'selectfield',
  width: '200',
  name: 'bootsNode',
  displayField: 'value',
  value: selectedBootsNode,
  onChange: this.onBootsNodeSelectChanged,
  options: bootsNodeOptions
});
Ext.create({
  xtype: 'button',
  text: "关闭",
  ui: 'decline alt'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh',
  alt: '\u5237\u65B0'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '99%',
  height: '320px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u72B6\u6001',
  width: '100',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u865A\u62DFIP',
  width: '120',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u5B50\u7F51',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u94FE\u8DEF\u72B6\u6001',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u5EF6\u65F6',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'container',
  margin: '10 0 10 0',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'bottom'
  }
});
Ext.create({
  xtype: 'textfield',
  width: '300',
  labelWidth: '60',
  labelAlign: 'left',
  labelTextAlign: 'center',
  label: '\u865A\u62DFIP:'
});
Ext.create({
  xtype: 'button',
  text: "添加",
  ui: 'action raised',
  style: {
    marginLeft: '10px'
  }
});
Ext.create({
  xtype: 'container',
  title: 'vPath',
  cls: 'v_path'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "来自vPort的域名的流量将通过所选的vProxy路由。",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '10 10 10 10'
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  width: '200',
  label: '\u8BF7\u8F93\u5165\u5173\u952E\u5B57\u6216\u57DF\u540D\u6216URL',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  ui: 'menu raised',
  text: 'Add',
  style: {
    marginRight: '10px',
    marginBottom: '2px'
  }
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onAddTypeChange,
    group: 'buttonstyle'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: 'Add',
  value: '',
  iconCls: menuItemVal === '' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'Import cloud vPath to 10.100.16.24',
  value: 'action',
  iconCls: menuItemVal === 'action' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from China2World pack',
  value: 'decline',
  iconCls: menuItemVal === 'decline' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from World2China pack',
  value: 'confirm',
  iconCls: menuItemVal === 'confirm' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '98%',
  height: '340px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u57DF\u540D',
  width: '150',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u4EE3\u7406',
  width: '85',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({"xtype":"tabpanel"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"formpanel"});
Ext.create({"xtype":"textfield"});
Ext.create({"xtype":"fieldset"});
Ext.create({"xtype":"selectfield"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"menu"});
Ext.create({"xtype":"menuitem"});
Ext.create({"xtype":"grid"});
Ext.create({"xtype":"column"});
Ext.create({"xtype":"renderercell"});
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');
Ext.create({
  xtype: 'tabpanel',
  cls: 'vportContent',
  flex: 1,
  shadow: true,
  height: '100%',
  defaults: {
    cls: "card",
    // layout: "center",
    tab: {
      flex: 0,
      minWidth: 100
    }
  },
  tabBar: {
    layout: {
      pack: 'left'
    }
  }
});
Ext.create({
  xtype: 'container',
  title: 'Remote Router',
  cls: 'remoter_router'
});
Ext.create({
  xtype: 'container',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'center'
  },
  margin: '0 0 10 0',
  defaults: {
    margin: "0 10 0 0"
  }
});
Ext.create({
  xtype: 'selectfield',
  width: '200',
  name: 'bootsNode',
  displayField: 'value',
  value: selectedBootsNode,
  onChange: this.onBootsNodeSelectChanged,
  options: bootsNodeOptions
});
Ext.create({
  xtype: 'button',
  text: "关闭",
  ui: 'decline alt'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh',
  alt: '\u5237\u65B0'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '99%',
  height: '320px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u72B6\u6001',
  width: '100',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u865A\u62DFIP',
  width: '120',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u8FDC\u7A0B\u5B50\u7F51',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u94FE\u8DEF\u72B6\u6001',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u5EF6\u65F6',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({
  xtype: 'container',
  margin: '10 0 10 0',
  layout: {
    type: 'hbox',
    pack: Ext.os.is.Phone ? 'center' : 'left',
    align: 'bottom'
  }
});
Ext.create({
  xtype: 'textfield',
  width: '300',
  labelWidth: '60',
  labelAlign: 'left',
  labelTextAlign: 'center',
  label: '\u865A\u62DFIP:'
});
Ext.create({
  xtype: 'button',
  text: "添加",
  ui: 'action raised',
  style: {
    marginLeft: '10px'
  }
});
Ext.create({
  xtype: 'container',
  title: 'vPath',
  cls: 'v_path'
});
Ext.create({"xtype":"formpanel"});
Ext.create({
  xtype: 'fieldset',
  title: "来自vPort的域名的流量将通过所选的vProxy路由。",
  layout: {
    type: 'hbox',
    pack: 'start',
    align: 'bottom'
  },
  defaults: {
    labelAlign: "placeholder"
  },
  margin: '10 10 10 10'
});
Ext.create({
  xtype: 'textfield',
  placeholder: 'Enter...',
  width: '200',
  label: '\u8BF7\u8F93\u5165\u5173\u952E\u5B57\u6216\u57DF\u540D\u6216URL',
  required: true,
  flex: 1
});
Ext.create({
  xtype: 'container',
  flex: 1
});
Ext.create({
  xtype: 'button',
  ui: 'menu raised',
  text: 'Add',
  style: {
    marginRight: '10px',
    marginBottom: '2px'
  }
});
Ext.create({
  xtype: 'menu',
  defaults: {
    handler: this.onAddTypeChange,
    group: 'buttonstyle'
  }
});
Ext.create({
  xtype: 'menuitem',
  text: 'Add',
  value: '',
  iconCls: menuItemVal === '' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'Import cloud vPath to 10.100.16.24',
  value: 'action',
  iconCls: menuItemVal === 'action' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from China2World pack',
  value: 'decline',
  iconCls: menuItemVal === 'decline' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'menuitem',
  text: 'import from World2China pack',
  value: 'confirm',
  iconCls: menuItemVal === 'confirm' && 'x-font-icon md-icon-check'
});
Ext.create({
  xtype: 'button',
  text: "",
  ui: 'confirm round alt',
  iconCls: 'x-fa fa-refresh'
});
Ext.create({
  xtype: 'grid',
  store: this.dataStore,
  grouped: true,
  width: '98%',
  height: '340px',
  style: {
    margin: '0 auto',
    border: '1px solid #73d8ef'
  }
});
Ext.create({
  xtype: 'column',
  text: '\u57DF\u540D',
  width: '150',
  dataIndex: 'name'
});
Ext.create({
  xtype: 'column',
  text: '\u4EE3\u7406',
  width: '85',
  dataIndex: 'price'
});
Ext.create({
  xtype: 'column',
  text: '\u63CF\u8FF0',
  width: '100',
  dataIndex: 'priceChange'
});
Ext.create({"xtype":"tabpanel"});
Ext.create({"xtype":"container"});
Ext.create({"xtype":"formpanel"});
Ext.create({"xtype":"textfield"});
Ext.create({"xtype":"fieldset"});
Ext.create({"xtype":"selectfield"});
Ext.create({"xtype":"button"});
Ext.create({"xtype":"menu"});
Ext.create({"xtype":"menuitem"});
Ext.create({"xtype":"grid"});
Ext.create({"xtype":"column"});
Ext.create({"xtype":"renderercell"});
Ext.create({"xtype":"container"})