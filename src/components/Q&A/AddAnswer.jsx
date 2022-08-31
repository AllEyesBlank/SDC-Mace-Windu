import React from "react";
import ReactDOM from "react-dom";
const axios = require('axios');

class AddAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }









  render() {
    if (!this.props.showAns) {
      return null;
    }
    return(
      <div className='modal'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h4 className='modal-title'>Add Answer</h4>
          </div>
          <div className='modal-body'>
            Answer Content
          </div>
          <div className='modal-footer'>
            <button className='modal-button' onClick={this.props.onClose}>Submit</button>
          </div>
        </div>
      </div>

    )
  }




}




export default AddAnswer;