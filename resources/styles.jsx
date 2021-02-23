import React, { Component } from "react";

const common = (theme) => `
  body {
     background-color: ${theme ? theme.background : "black"};
  }
  #root {
    top: 0;
    background-color: ${theme ? theme.background : "black"};
    color: ${theme ? theme.textColor : "white"};
    padding: 8px;
    font-weight: 100;
    letter-spacing: 1.2px;
}

  // #root > div {
  //   width: calc(100vw - 32px)!important;
  // }

.scrollbar-container ps {
   height: auto!important;
}

.CodeMirror {
   height: auto!important;
    font-size: 15px;
}

 .manual-wrapper {
    max-width: 800px;
    margin: 0 auto;
    overflow-x: hidden;
}

.manual-header a:hover {
   text-decoration: underline;
   cursor: pointer;
}

  a {
    color: ${theme ? theme.textColor : "white"};
  }
  h1 {
    font-weight: 500;
    color: ${theme ? theme.altTextColor : "white"};
    font-size: 24px;
}

  h2 {
    font-weight: 500;
    color: ${theme ? theme.altTextColor : "white"};
    font-size: 20px;
}

  .manual-refsect1 h1 {
    font-weight: 100;
    color: ${theme ? theme.altTextColor : "white"};
}
  .manual-synopsis {
    font-weight: 100;
    font-size: 14px;
    color: rgb(255,255,255);
    background-color: ${theme ? theme.highlightBackground : "black"};
    padding: 10px 2em;
}

thead {
    font-weight: 700!important;
}
 .manual-command {
   color: ${theme ? theme.opcode : "white"};
   font-weight: 900;
}

.flexible-modal {
  position: fixed;
  border: 1px solid #ccc;
  background: white;
  z-index: 1000;
  padding-top: 12px;
}
.flexible-modal-mask {
  position: fixed;
  height: 100%;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index: -1;
}
.flexible-modal-resizer {
  position:absolute;
  right: 12px;
  bottom: 2px;
  cursor:se-resize;
  margin:5px;
  border-bottom: solid 2px #333;
  border-right: solid 2px #333;
}
.flexible-modal-drag-area{
  height: 50px;
  position:absolute;
  right:0;
  top:0;
  cursor:move;
}


.manual-logs {
   background-color: ${theme ? theme.disabledTextColor : "white"};
   color: ${theme ? theme.textColor : "white"};
   width: 100%;
   height: 100%;
   overflow-y: scroll;
   overflow-x: hidden;
   padding: 0 12px;
   margin: 0;
   font-size: 12px;
   white-space: pre-line;
   box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
        0px 4px 5px 0px rgba(0, 0, 0, 0.14),
        0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    scrollbar-width: thin;
    scrollbar-color: ${theme.scrollbar} transparent;
}

body::-webkit-scrollbar,
.manual-logs::-webkit-scrollbar {
  width: 8px;
}

body:scrollbar-track,
body::-webkit-scrollbar-track
.manual-logs:scrollbar-track,
.manual-logs::-webkit-scrollbar-track {
  background: transparent;
}
body::-webkit-scrollbar-thumb,
.manual-logs::-webkit-scrollbar-thumb {
  background-color: ${theme.scrollbar};
  width: 6px;
  border-radius: 6px;
  border: 3px solid transparent;
}

body::-webkit-scrollbar-thumb,
.manual-logs::-webkit-scrollbar-thumb {
  background-color: ${theme.scrollbar};
  width: 6px;
  border-radius: 6px;
  border: 3px solid transparent;
  opacity: 0.8;
}

body::-webkit-scrollbar-track,
.manual-logs::-webkit-scrollbar-track {
  background: ${theme.highlightBackgroundAlt};
}

body:hover,.manual-logs:hover {
   -webkit-transition: all 0.2s ease;
   transition: all 0.2s ease;
   opacity: 1;
   scrollbar-color: ${theme.scrollbar};
}

.manual-para {
   margin: 12px 0;
}

.manual-caption {
  display: none;
}

.manual-example {
  position: relative;
}

.manual-example .cm-s-monokai.CodeMirror,.CodeMirror-gutters {
  background-color: rgba(139,140,134,0.1)!important;
}

.manual-example-code {
    font-weight: 100;
    color: rgb(255,255,255);
    background-color: ${theme ? theme.highlightBackground : "black"};
    padding: 10px 2em;
}
 .manual-screen {
    font-weight: 100;
    color: ${theme ? theme.textColor : "white"};
    background-color: ${theme ? theme.highlightBackground : "black"};
    padding: 10px 2em;
}

.manual-main-entry {
   display: block;
   font-size: 14px;
   text-decoration: none;
   margin: 3px 0;
   white-space: nowrap;
   text-overflow: ellipsis;
   overflow: hidden;
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
  display: flex;
  position: relative;
  margin: 12px 0;
  flex-direction: row;
  justify-content: space-between;
  height: 72px;
}

.manual-button-container svg {
  width: 72px;
  height: 72px;
}

.copy-btn-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    margin-top: 12px;
    z-index: 100;
    width: 72px;
    right: 0;
}

.copy-btn {
  width: 100%;
  background-color: transparent;
  background-image: none;
  border: 1px solid ${theme ? theme.buttonBackground : "white"};
  border-radius: 50%;
  cursor: pointer;
  margin-right: 12px;
  padding: 6px;
}

.copy-btn svg {
  fill: ${theme ? theme.buttonBackground : "white"};
  stroke-dasharray: 650;
  stroke-dashoffset: 650;
  -webkit-transition: all 0.5s ease-in-out;
  opacity: 0.3;
}

.copy-btn:hover svg {
  -webkit-transition: all 0.5s ease-in-out;
  fill: white;
  opacity: 0.3;
}


.manual-button-circle {
  stroke: ${theme ? theme.buttonBackground : "white"};
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
width: 100%;
height: 100%;
cursor: pointer;
 display: flex;
 -webkit-transition: all 0.5s ease;
flex-direction: row;
align-content: center;
}

.manual-play-button:hover .manual-button-triangle {
      stroke-dashoffset: 0;
      opacity: 1;
      stroke: ${theme ? theme.altButtonBackground : "white"};
      animation: nudge 0.7s ease-in-out;
}

.manual-play-button:hover .manual-button-circle {
      stroke-dashoffset: 0;
      opacity: 1;
}

.manual-play-button p {
    font-size: 32px;
    position: relative;
    align-self: center;
    margin-left: 12px;
}

.CodeMirror-wrap {
  border: 1px solid;
}
.close-console {
  width: 12px;
  height: 12px;
  display: block;
  position: absolute;
  right: 6px;
  top: -3px;
  z-index: 100;
  cursor: pointer;
}

.close-console svg > path {
  fill: ${theme ? theme.buttonBackground : "black"}!important;
}

.close-console:hover svg > path {
  opacity: 0.8;
}

`;

class ManualStyles extends Component {
  render() {
    const theme = this.props.theme;
    return <style>{common(theme)}</style>;
  }
}

export default ManualStyles;
