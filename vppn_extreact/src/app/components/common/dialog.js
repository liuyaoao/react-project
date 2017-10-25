import React,{Component} from 'react';
import ReactDOM from 'react-dom';

class CommonDialog extends Component{

  handleOk() {
    if (this.props.confirmFunc) {
      this.props.confirmFunc();
    }
    this.handleClose();
  }
  handleClose(){
    hideMetroDialog("#" + this.props.id);
  }

  render(){
    var {id, dialogMsg} = this.props;
    return (
      <div data-role="dialog, draggable" id={id} className="padding20 dialog" data-close-button="true">
        <h3 className="dia-title">{dialogMsg.title}</h3>
        <p id="content">
            {dialogMsg.content}
        </p>
        <div className="footer place-right p-t-10">
          <button type="button" className="button info info2" onClick={this.handleOk}>OK</button>
          <button type="button" className="button" onClick={this.handleClose}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default CommonDialog;
