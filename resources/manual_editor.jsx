import React, { Component } from 'react';
import { UnControlled as CodeMirror } from "react-codemirror2";
import PerfectScrollbar from "react-perfect-scrollbar";

const playCSD = (csd) => {
    const cs = window.csound;
    if (cs) {
        cs.audioContext.resume();
        cs.reset();
        cs.setOption("-odac");
        cs.setOption("-+msg_color=false");
        cs.compileCSD(csd);
        cs.start();
    }
}

class ManualEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {changedVal: null};
    }


    render() {
        const initVal = this.props.value;
        const lineCnt = initVal.split(/\r\n|\r|\n/).length;
        const insideIframe = !!window.frameElement;
        // window.parent.postMessage({playCSD: this.state.changedVal || initVal}, '*')
        return (
            <div>
              <div className='manual-button-container'
                   style={{display: insideIframe ? "inherit" : "none"}}
                   onClick={() => playCSD(this.state.changedVal || initVal)}>
                <div className='manual-play-button'>
                  <svg x="0px" y="0px" width="213.7px" height="213.7px" viewBox="0 0 213.7 213.7" enableBackground="new 0 0 213.7 213.7">
                    <circle className='manual-button-circle' fill="none"  strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" cx="106.8" cy="106.8" r="103.3"/>
                    <polygon className='manual-button-triangle' fill="none" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="73.5,62.5 148.5,105.8 73.5,149.1 "/>
                  </svg>
                  <p>Play the example!</p>
                </div>
              </div>
              <PerfectScrollbar style={{height: (22 + ((lineCnt + 1) * 22)), position: "relative"}}>
                <CodeMirror
                  onChange={(editor, data, value) => this.setState({changedVal: value})}
                  options={{
                      mode: 'csound',
                      theme: "monokai",
                      autoCloseBrackets: true,
                      fullScreen: true,
                      lineNumbers: true,
                      lineWrapping: true,
                      matchBrackets: true,
                      viewportMargin: Infinity,
                      readOnly: !insideIframe,
                      nocursor: !insideIframe,

                  }}
                  value={initVal}
                  >
                </CodeMirror>
              </PerfectScrollbar>
            </div>
        )
    }
}

export default ManualEditor;
