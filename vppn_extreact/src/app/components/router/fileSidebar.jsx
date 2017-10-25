var React = require('react');

var RouterFileSidebar = React.createClass({
  render: function(){
    return (
      <ul className="sidebar2 sidebar3">
        <li className="active"><a onClick={this.handleShow.bind(this, 1)}><span className="mif-files-empty icon"></span> My All Files</a></li>
        <li><a onClick={this.handleShow.bind(this, 2)}><span className="mif-file-text icon"></span> Text</a></li>
        <li><a onClick={this.handleShow.bind(this, 3)}><span className="mif-file-download icon"></span> Download</a></li>
      </ul>
    )
  },
  handleShow: function(key, e) {
    // $('#phoneFileWindow .wi').each(function(){
    //   $(this).removeClass('active');
    // })
    $('#routerFileWindow .sidebar3 li').each(function(i){
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      }
    })
    $(e.target.parentNode).addClass('active');
    // $('#phoneFileWindow #wi_right_' + key).addClass('active');
  }
});

module.exports = RouterFileSidebar;
