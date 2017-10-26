var React = require('react');

var setRightHeight = function(id){
  // console.log(id);
  var windowId = '#window-' + id;
  var height = $(windowId).height();
  var headerHeight = 34;  //49
  var hg1 = height - headerHeight;
  var hg2 = hg1 - 30;  // - 51 top tab height , - 60 bottom height
  $(windowId + ' .phone-help').css("height", hg2);
  $(windowId + ' .phone-help .step').css("height", hg2 - 50);
  $(windowId + ' .phone-help .step img').css("height", hg2 - 50);
}

var PhoneHelp = React.createClass({
  componentDidMount: function(){
    setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
  },
  componentWillUnmount: function () {
    document.removeEventListener('mousemove', this.handleMouseMove);
  },
  handleMouseMove: function(){
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      setRightHeight(this.props.id);
    }
  },
  render: function(){
    return (
      <div className="grid condensed no-margin phone-help">
        <div className="row cells3">
          <div className="cell step">
            <div className="stepper">
              <a><span className="circle text-shadow">1</span>First step</a>
            </div>
            <img src="images/phone/step1.jpg" />
          </div>
          <div className="cell step">
            <div className="stepper">
              <a><span className="circle text-shadow">2</span>Second step</a>
            </div>
            <img src="images/phone/step2.jpg" />
          </div>
          <div className="cell step">
            <div className="stepper">
              <a><span className="circle text-shadow">3</span>Third step</a>
            </div>
            <img src="images/phone/step3.jpg" />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = PhoneHelp;
