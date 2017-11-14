import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { Container,Button,TextField,SearchField } from '@extjs/ext-react';

class HeaderBarFS extends Component{
  state={

  }
  componentDidMount(){

  }

  render(){

    return (
      <div style={{margin:'10px auto',clear:'both'}}>
        <div className="left_cnt">
          <Container>
            <Button cls='iconBtn' ui={'raised'} iconCls={'x-fa fa-chevron-left'}></Button>
            <Button cls='iconBtn' ui={'raised'} iconCls={'x-fa fa-chevron-right'}></Button>
            <Button cls='iconBtn' ui={'raised'} iconCls={'x-fa fa-rotate-right'}></Button>
          </Container>
        </div>
        <div className="right_cnt">
          <Container margin='0 10px 0 0' width='auto' height='32px'>
            <SearchField
                ui="faded"
                placeholder="Search"
            />
          </Container>
        </div>
        <div className="main_cnt">
          <div style={{margin:'0 10px 0 0',border:'1px solid #989895',height:'33px'}}> <span></span> </div>
        </div>
      </div>
    )
  }

}

export default HeaderBarFS;
