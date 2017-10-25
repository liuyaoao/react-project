var React = require('react');
var ReactDOM = require('react-dom');
const Utils = require('../../script/utils');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../../actions/home_action';
import ImageGallery from 'react-image-gallery';
import PhotoTable from '../../components/phone/photo/photoTable';
import PhotoList from '../../components/phone/photo/photoList';
import PhotoThumbnail from '../../components/phone/photo/photoThumbnail';

// var photoData = [
//   {
//     albumName: "风景",
//     coverUrl: "images/1.jpg",
//     albumPhotos: [
//       {
//         original: 'images/1.jpg',
//         thumbnail: 'images/1.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/2.jpg',
//         thumbnail: 'images/2.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/3.jpg',
//         thumbnail: 'images/3.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/4.jpg',
//         thumbnail: 'images/4.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/5.jpg',
//         thumbnail: 'images/5.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       }
//     ]
//   },
//   {
//     albumName: "人物",
//     coverUrl: "images/jek_vorobey.jpg",
//     albumPhotos: [
//       {
//         original: 'images/jek_vorobey.jpg',
//         thumbnail: 'images/jek_vorobey.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/jeki_chan.jpg',
//         thumbnail: 'images/jeki_chan.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/jolie.jpg',
//         thumbnail: 'images/jolie.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/me.jpg',
//         thumbnail: 'images/me.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/shvarcenegger.jpg',
//         thumbnail: 'images/shvarcenegger.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/spface.jpg',
//         thumbnail: 'images/spface.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/vin_d.jpg',
//         thumbnail: 'images/vin_d.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       }
//     ]
//   },
//   {
//     albumName: "Download",
//     coverUrl: "images/Genie.ico",
//     albumPhotos: [
//       {
//         original: 'images/Genie.ico',
//         thumbnail: 'images/Genie.ico',
//         size: '203 KB',
//         format: 'ico',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         original: 'images/favicon.ico',
//         thumbnail: 'images/favicon.ico',
//         size: '203 KB',
//         format: 'ico',
//         modifyDate: '08/24/2016 14:52'
//       }
//     ]
//   },
//   {
//     albumName: "Sceen",
//     coverUrl: "images/bj.jpg",
//     albumPhotos: [
//       {
//         original: 'images/bj.jpg',
//         thumbnail: 'images/bj.jpg',
//         size: '203 KB',
//         format: 'jpeg',
//         modifyDate: '08/24/2016 14:52'
//       }
//     ]
//   }
// ]

var setWinHeight = function(id, width, height){
  var windowId = '#window-' + id;
  // console.log(height);
  // height = height ? height : $(windowId).height();
  // var width = $(windowId).width();
  var headerHeight = 38;  //49
  $(windowId + ' .sidebar3').css("height", height - headerHeight - 30);
  $(windowId + ' .wi-right').css("height", height - headerHeight);
  $(windowId + ' .wi-right-1').css("height", height - headerHeight - 30 - 44);
  $(windowId + ' .photoTable_body').css("height", height - headerHeight - 30 - 44 - 35);
}

var timer = null;
var PhonePhoto = React.createClass({
  getInitialState: function () {
    return {
      menuStatus: 3,
      photoData: [],
      imageGalleryData: []
    };
  },
  componentDidMount: function(){
    // var windowId = '#window-' + this.props.id;
    var phonePhotoWindow = this.props.manager.get('phone_photo');
    setWinHeight(this.props.id, phonePhotoWindow.width, phonePhotoWindow.height);
    // document.addEventListener('mousemove', this.handleMouseMove);
    this.getPhotos();

    timer = setInterval(function(){
      if(this.props.windowSizeChange.flag && this.props.windowSizeChange.windowId=='phone_photo') {
        var phonePhotoWindow = this.props.manager.get('phone_photo');
        setWinHeight(this.props.id, phonePhotoWindow.width, phonePhotoWindow.height);
        hideMetroDialog('#phonePhotoDialog');
      }
    }.bind(this), 10);
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   var cl = $("#window-" + this.props.id);
  //   if(cl.hasClass('active') && nextProps.windowSizeChange) {
  //     // for(var i = 0; i < photoData.length; i++) {
  //     //   if($('#phonePhoto_right_' + i).hasClass('active')) {
  //     //     this.refs["ImageGallery_"+i]._handleResize();
  //     //     break;
  //     //   }
  //     // }
  //     hideMetroDialog('#phonePhotoDialog');
  //     // var phonePhotoWindow = this.props.manager.get('phone_photo');
  //     // setWinHeight(this.props.id, phonePhotoWindow.width, phonePhotoWindow.height);
  //     // this.refs.ImageGallery._handleResize();
  //     this.props.actions.setWindowSizeChange(false);
  //   }
  //   return true;
  // },
  componentDidUpdate: function() {
    var cl = $("#window-" + this.props.id);
    if(cl.hasClass('active')) {
      var phonePhotoWindow = this.props.manager.get('phone_photo');
      setWinHeight(this.props.id, phonePhotoWindow.width, phonePhotoWindow.height);
    }
  },
  componentWillUnmount: function() {
    // document.removeEventListener('mousemove', this.handleMouseMove);
    clearInterval(timer);
    timer = null;
  },
  // handleMouseMove: function(){
  //   var cl = $("#window-" + this.props.id);
  //   if (cl.hasClass('active')) {
  //     // setWinHeight(this.props.id);
  //     var phonePhotoWindow = this.props.manager.get('phone_photo');
  //     setWinHeight(this.props.id, phonePhotoWindow.width, phonePhotoWindow.height);
  //   }
  // },
  render: function () {
    var phonePhotoSidebar_li = this.state.photoData.map(function (data, i) {
      return (
        <li id={"phonePhotoSidebar_li_"+i} key={"phonePhotoSidebar_li_"+i} className={i==0?"active":""}>
          <span className="mif-play icon"></span>
          <a onClick={this.handleShow.bind(this, i)}>
            <div><img src={data.coverUrl}/></div>
            {data.albumName}({data.albumPhotos.length})
          </a>
        </li>
      )
    }, this);
    // var phonePhoto_right = photoData.map(function (data, i) {
    //   return (
    //     <div className={"wi"+(i==0?" active":"")} id={"phonePhoto_right_"+i} key={"phonePhoto_right_"+i}>
    //       <div className="wi-right-1">
    //         <ImageGallery
    //           ref={"ImageGallery_"+i}
    //           items={data.albumPhotos}
    //           slideInterval={2000}
    //           lazyLoad={true}
    //           onImageLoad={this.handleImageLoad}/>
    //       </div>
    //     </div>
    //   )
    // }, this);
    var phonePhoto_right = this.state.photoData.map(function (data, i) {
      return (
        <div className={"wi"+(i==0?" active":"")} id={"phonePhoto_right_"+i} key={"phonePhoto_right_"+i}>
          <div className="wi-right-1" style={{overflowY:"auto"}}>
            {this._getPhotoList(data)}
          </div>
        </div>
      )
    }, this);

    return (
      <div className="grid condensed no-margin net-win" id="phonePhotoWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <ul className="sidebar2 sidebar3 phonePhoto_sidebar">
              {phonePhotoSidebar_li}
            </ul>
          </div>
          <div className="cell colspan3 wi-right">
            <div className="menu-header">
              <div className="p-l-10 menu-group" data-role="group" data-group-type="one-state">
                <button className="button" onClick={this.handleToggleMenu.bind(this, 1)}><span className="mif-menu icon"></span></button>
                <button className="button" onClick={this.handleToggleMenu.bind(this, 2)}><span className="mif-apps icon"></span></button>
                <button className="button active" onClick={this.handleToggleMenu.bind(this, 3)}><span className="mif-widgets icon"></span></button>
              </div>
              <form className="inline place-right" onSubmit={this.handleSearch}>
                <div className="input-control text m-r-10" data-role="input" style={{width:"18rem"}}>
                  <input type="text" placeholder="Search..." ref="searchPhoto"/>
                  <button type="submit" className="button"><span className="mif-search icon"></span></button>
                </div>
              </form>
            </div>
            {phonePhoto_right}
          </div>
        </div>
        <div data-role="dialog" id="phonePhotoDialog" className="padding20 dialog" data-close-button="true" style={{position:"absolute"}}>
          <ImageGallery
            ref="ImageGallery"
            items={this.state.imageGalleryData}
            slideInterval={2000}
            lazyLoad={true}
            onImageLoad={this.handleImageLoad}
            onSlide={this.handleSlide}
            onScreenChange={this.handleScreenChange}/>
        </div>
      </div>
    );
  },
  _getPhotoList: function(photoData){
    switch (this.state.menuStatus) {
      case 1:
        return <PhotoTable photoData={photoData} handleDblClickPhoto={this.handleDblClickPhoto} />
        break;
      case 2:
        return <PhotoList photoData={photoData} handleDblClickPhoto={this.handleDblClickPhoto} />
        break;
      case 3:
        return <PhotoThumbnail photoData={photoData} handleDblClickPhoto={this.handleDblClickPhoto} />
        break;
      default:
        break;
    }
  },
  handleShow: function(key, e){
    $('#phonePhotoWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    $('#phonePhotoWindow .sidebar3 li').each(function(){
      $(this).removeClass('active');
    })
    $('#phonePhotoSidebar_li_' + key).addClass('active');
    $('#phonePhoto_right_' + key).addClass('active');
    // this.refs["ImageGallery_"+key].slideToIndex(0);
    // for(var i = 0; i < photoData.length; i++) {
    //   if(photoData[i].albumName == e.currentTarget.id.substring(e.currentTarget.id.indexOf("_")+1, e.currentTarget.id.lastIndexOf("_"))) {
    //     this.setState({imageGalleryData: photoData[i].albumPhotos});
    //   }
    // }
    this.setState({imageGalleryData: this.state.photoData[key].albumPhotos});
    this.refs.ImageGallery._handleResize();
    this.refs.ImageGallery.slideToIndex(0);
  },
  handleToggleMenu: function(key) {
    this.setState({menuStatus: key});
  },
  handleSearch: function(e){
    e.preventDefault();
  },
  getPhotos: function(){
    const { myPhoneIP } = this.props;
    var _this = this;
    $.ajax({
      type: "GET",
      async: true,
      url: "http://"+myPhoneIP+":12012/album",
      dataType: "json",
      cache:false,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          for(var i = 0; i < res.length; i++) {
            res[i].coverUrl = "http://"+myPhoneIP+":12012"+res[i].coverUrl;
            for(var j = 0; j < res[i].albumPhotos.length; j++) {
              res[i].albumPhotos[j].original = "http://"+myPhoneIP+":12012"+res[i].albumPhotos[j].original;
              res[i].albumPhotos[j].thumbnail = "http://"+myPhoneIP+":12012"+res[i].albumPhotos[j].thumbnail;
            }
          }
          _this.setState({photoData: res});
          if(res.length > 0) {
            _this.setState({imageGalleryData: res[0].albumPhotos});
          }
        } catch (e) {
          console.log("get pictures error!");
        }
      }
    });
  },
  handleMousedownPhoto: function(e) {
    $("#phonePhotoWindow .wi-right-1 .phone_photo").removeClass("photo_focus");
		$("#"+e.currentTarget.id).addClass("photo_focus");
  },
  resizeImageGallery: function() {
    var windowId = '#window-' + this.props.id;
    var windowHeight = $(windowId).height();
    var windowWidth = $(windowId).width();
    var height = $(windowId + ' .wi-right').height();
    var width = $(windowId + ' .wi-right').width();
    setTimeout(function(){
      if($(windowId + ' .image-gallery-content').hasClass("fullscreen")) {
        $(windowId + ' .image-gallery-content').css("width", window.innerWidth);
        $(windowId + ' .image-gallery-slide-wrapper').css("width", "auto");
        $(windowId + ' .image-gallery-slide-wrapper').css("height", window.innerHeight - 110);
        $(windowId + ' .image-gallery-image').css("height", window.innerHeight - 110);
        $(windowId + ' .image-gallery-image').css("lineHeight", window.innerHeight - 110 + "px");
        $(windowId + ' .image-gallery-slide img').css("maxHeight", window.innerHeight - 110);
        $(windowId + ' .image-gallery-thumbnails').css("width", "auto");
      }
      else {
        $(windowId + ' .image-gallery-content').css("width", "auto");
        $(windowId + ' .image-gallery-slide-wrapper').css("width", width - 15 + "px");
        $(windowId + ' .image-gallery-slide-wrapper').css("height", height - 40 - 110 + "px");
        $(windowId + ' .image-gallery-image').css("height", height - 40 - 110 + "px");
        $(windowId + ' .image-gallery-image').css("lineHeight", height - 40 - 110 + "px");
        $(windowId + ' .image-gallery-slide img').css("maxHeight", height - 40 - 110 + "px");
        $(windowId + ' .image-gallery-thumbnails').css("width", width - 15 + "px");
        $('#phonePhotoDialog').css("left", (windowWidth-width)/2 + "px");
        $('#phonePhotoDialog').css("top", "0px");
      }
      this.refs.ImageGallery._handleResize();
    }.bind(this), 100);
  },
  handleDblClickPhoto: function(e) {
    this.refs.ImageGallery.slideToIndex(parseInt(e.currentTarget.id.substr(e.currentTarget.id.lastIndexOf("_")+1)));
    setTimeout(function(){
      showMetroDialog('#phonePhotoDialog');
    }, 100);
    this.resizeImageGallery();
  },
  handleImageLoad: function(event) {
    console.log('Image loaded ', event.target)
    // this.resizeImageGallery();
  },
  handleSlide: function() {
    var windowId = '#window-' + this.props.id;
    var windowHeight = $(windowId).height();
    var windowWidth = $(windowId).width();
    var height = $(windowId + ' .wi-right').height();
    var width = $(windowId + ' .wi-right').width();
    if($(windowId + ' .image-gallery-content').hasClass("fullscreen")) {
      $(windowId + ' .image-gallery-content').css("width", window.innerWidth);
      $(windowId + ' .image-gallery-slide-wrapper').css("width", "auto");
      $(windowId + ' .image-gallery-slide-wrapper').css("height", window.innerHeight - 110);
      $(windowId + ' .image-gallery-image').css("height", window.innerHeight - 110);
      $(windowId + ' .image-gallery-image').css("lineHeight", window.innerHeight - 110 + "px");
      $(windowId + ' .image-gallery-slide img').css("maxHeight", window.innerHeight - 110);
      $(windowId + ' .image-gallery-thumbnails').css("width", "auto");
    }
    else {
      $(windowId + ' .image-gallery-content').css("width", "auto");
      $(windowId + ' .image-gallery-slide-wrapper').css("width", width - 15 + "px");
      $(windowId + ' .image-gallery-slide-wrapper').css("height", height - 40 - 110 + "px");
      $(windowId + ' .image-gallery-image').css("height", height - 40 - 110 + "px");
      $(windowId + ' .image-gallery-image').css("lineHeight", height - 40 - 110 + "px");
      $(windowId + ' .image-gallery-slide img').css("maxHeight", height - 40 - 110 + "px");
      $(windowId + ' .image-gallery-thumbnails').css("width", width - 15 + "px");
      $('#phonePhotoDialog').css("left", (windowWidth-width)/2 + "px");
      $('#phonePhotoDialog').css("top", "0px");
    }
    this.refs.ImageGallery._handleResize();
  },
  handleScreenChange: function(event) {
    this.resizeImageGallery();
  }
});

// module.exports = PhonePhoto;
function mapStateToProps(state){
  const { windowSizeChange, myPhoneIP } = state.homeReducer;
  return {
    windowSizeChange,
    myPhoneIP
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(HomeActions, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(PhonePhoto);
