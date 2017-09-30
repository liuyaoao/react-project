
import $ from 'jquery';
import * as Utils from 'utils/utils.jsx';
import React from 'react';

export default class PagesFooterComp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isMobile: Utils.isMobile()
      };
    }
    render() {
        const content = [];

        return (
            <div className='inner_content_wrap'>
                <div className='row'>
                    {this.props.children}
                </div>
                <div className='' style={{height:'4em',position:'relative',bottom:0,background:'none',width:'100%',color:'#fff'}}>
                    <div className='col-xs-12'>
                      <div className="row" style={{textAlign:'center'}}>
                        <div>
                          <span>版权所有@吉视传媒</span>
                          {this.state.isMobile?(<br/>):null}
                          <span>&nbsp;&nbsp;&nbsp;技术支持：北京游龙网网络科技有限公司</span>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        );
    }
}

PagesFooterComp.defaultProps = {
};

PagesFooterComp.propTypes = {
    children: React.PropTypes.object
};
