import React from 'react';
import ReactDOM from 'react-dom';
import AppFacade from 'routing/AppFacade';

window.onload = () => {
  let href = window.location.href;
  href = href.substring(7);
  let hrefarr = href.split("/");
  if(!localStorage.getItem("isReload")){
    localStorage.setItem("isReload",'0');
  }
  if(hrefarr.length > 1){
    if(!hrefarr[1]){
      localStorage.removeItem('sessionId');
      localStorage.removeItem('username');
      localStorage.removeItem('searchAllName');

      // localStorage.setItem("sessionId",'');
      if(localStorage.getItem("isReload") == "0"){
        localStorage.setItem("isReload",'1');
        window.location.reload();
      }
      // window.location.reload();
    }
  }

  const appContainer = document.createElement('div');
  document.body.appendChild(appContainer);
  ReactDOM.render(<AppFacade />, appContainer);
};
