import React, { Component } from 'react';

const common = `
  #root {
    color: rgba(255,255,255,0.9);
    margin: 8px;
    font-weight: 100;
    letter-spacing: 1.2px;
}

  #root > div {
    width: calc(100vw - 32px)!important;
}

  a {
    color: rgba(255,255,255,0.9);
  }
  #title h1 {
    font-weight: 500;
    color: #999933;
    font-size: 36px;
}
  .manual-refsect1 h1 {
    font-weight: 100;
    color: #999933;
}
  .manual-synopsis {
    font-weight: 100;
    color: rgb(255,255,255);
    background-color: #000000;
    padding: 10px 2em;
}

 .manual-command {
   color: #444480;
   font-weight: 900;
}
.manual-para {
   margin: 12px 0;
}

.manual-example-code {
    font-weight: 100;
    color: rgb(255,255,255);
    background-color: #000000;
    padding: 10px 2em;
}
 .manual-screen {
    font-weight: 100;
    color: rgb(255,255,255);
    background-color: #000000;
    padding: 10px 2em;
}

.manual-main-entry {
   font-size: 16px;
   display: flex;
   text-decoration: none;
}

.manual-main-entry:hover {
   font-size: 16px;
   background-color: rgba(255,255,255,0.5);
}

.manual-main-entry span {
  font-weight: 500;
  display: inline-block;
}

.manual-main-entry p {
  padding: 0;
  margin: 0;
  display: inline-block;
}

.manual-main-opcode-container {
  display: inline-block;
  padding: 0;
  margin: 0 12px;
  height: 100%;
}

.manual-main-form-control {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
`;

class ManualStyles extends Component {
    render() {
        return (
            <style>
              {common}
            </style>
        )
    }
}

export default ManualStyles;
