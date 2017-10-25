import React from 'react'

// import { BrowserRouter as Router } from 'react-router-dom';
// import Layout from './Layout';

import ReactWMHome from './main_page';
import "./scss/screen.scss";


// Enable responsiveConfig app-wide. You can remove this if you don't plan to build a responsive UI.
Ext.require('Ext.plugin.Responsive');

/**
 * The main application view
 */
export default function App() {

      return (<ReactWMHome/>)
    // return (
    //     <Router>
    //         <Layout/>
    //     </Router>
    // )

}
