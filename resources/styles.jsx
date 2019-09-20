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

  .manual-header a:hover {
   text-decoration: underline;
   cursor: pointer;
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
    font-size: 14px;
    color: rgb(255,255,255);
    background-color: #000000;
    padding: 10px 2em;
}

thead {
    font-weight: 700!important;
}
 .manual-command {
   color: #444480;
   font-weight: 900;
}
.manual-para {
   margin: 12px 0;
}

.manual-caption {
  display: none;
}

.manual-example .cm-s-monokai.CodeMirror,.CodeMirror-gutters {
  background-color: rgba(139,140,134,0.1)!important;
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
   display: block;
   font-size: 14px;
   text-decoration: none;
   margin: 3px 0;
}

.manual-main-entry:hover {
   background-color: rgba(255,255,255,0.5);
}

.manual-main-entry span {
  font-weight: 500;
  display: inline-block;
}

.manual-main-entry p {
  padding: 0;
  margin: 0;
  display: initial;
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

.manual-button-container {
  text-align: left;
  display: inline-block;
  zoom: 33%;
  position: relative;
  margin: 60px 0;
}

.manual-button-circle {
  stroke: #f8aa28;
  stroke-dasharray: 650;
  stroke-dashoffset: 650;
  -webkit-transition: all 0.5s ease-in-out;
  opacity: 0.3;
}

.manual-button-triangle {
 -webkit-transition: all 0.7s ease-in-out;
 stroke-dasharray: 240;
 stroke-dashoffset: 480;
 stroke: #000;
 transform: translateY(0)
}


@keyframes nudge{
 0% {
 transform: translateX(0)
 }
 30% {
 transform: translateX(-5px)
 }
 50% {
 transform: translateX(5px)
 }
 70% {
 transform: translateX(-2px)
 }
 100% {
 transform: translateX(0)
 }
}

.manual-play-button {
width: 50px;
height: 50px;
cursor: pointer;
/*  border: 1px solid red;*/
 display: inline-block;
 -webkit-transition: all 0.5s ease;
}

.manual-play-button:hover .manual-button-triangle {
      stroke-dashoffset: 0;
      opacity: 1;
      stroke: #f8aa28;
      animation: nudge 0.7s ease-in-out;
}

.manual-play-button:hover .manual-button-circle {
      stroke-dashoffset: 0;
      opacity: 1;
}

.manual-play-button p {
    font-size: 72px;
    position: absolute;
    top: 62px;
    margin: 0;
    left: 290px;
    width: 900px;

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
