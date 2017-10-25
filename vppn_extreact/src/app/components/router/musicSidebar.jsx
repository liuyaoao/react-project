var React = require('react');

var RouterMusicSidebar = React.createClass({
  render: function(){
    return (
      <ul className="sidebar2 sidebar3">
        <li className="active"><a onClick={this.handleShow.bind(this, 1)}><span className="mif-tree icon"></span> Music Library</a></li>
        <li><a onClick={this.handleShow.bind(this, 2)}><span className="mif-heart icon"></span> My Love</a></li>
        <li><a onClick={this.handleShow.bind(this, 3)}><span className="mif-play icon"></span> Recently Played</a></li>
      </ul>
    )
  },
  handleShow: function(key, e) {
    // $('#phoneMusicWindow .wi').each(function(){
    //   $(this).removeClass('active');
    // })
    $('#routerMusicWindow .sidebar3 li').each(function(i){
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      }
    })
    $(e.target.parentNode).addClass('active');
    // $('#phoneMusicWindow #wi_right_' + key).addClass('active');
  }
});

module.exports = RouterMusicSidebar;
