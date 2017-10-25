var React = require('react');

var setRightHeight = function(id){
  var windowId = '#window-' + id;
  var height = $(windowId).height(), headerHeight = 30;
  $(windowId + ' .device-content').css("height", height - headerHeight - 200);
}

var DeviceManage = React.createClass({
  getInitialState: function(){
    return {
      connectStatus: 0
    }
  },
  componentDidMount: function(){
    var header = $("#window-" + this.props.id + " .window-caption");
    header.css('border-bottom', 'none');
    setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
  },
  componentWillUnmount: function(){
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.setState({connectStatus: 0});
  },
  handleMouseMove: function(){
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      setRightHeight(this.props.id);
    }
  },
  render: function(){
    var {connectStatus} = this.state;
    return (
      <div className="device-box">
        <div className="device-header">
          <h3 className="title"></h3>
        </div>
        <div className="device-content padding20">
          <h3>WR7000-T1</h3>
          <label style={{color:"rgb(187, 187, 187)"}}>Android</label>
          <div className="m-b-10">
            <p className="no-margin-bottom">9.23G / 5.36G</p>
            <div className="progress small" data-role="progress" data-value="30"></div>
          </div>
          <div className="m-b-10">
            <p className="no-margin-bottom">9.23G / 5.36G</p>
            <div className="progress small" data-role="progress" data-value="30"></div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = DeviceManage;
