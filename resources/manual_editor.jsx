import React, { Component } from 'react';
import { UnControlled as CodeMirror } from "react-codemirror2";
import PerfectScrollbar from "react-perfect-scrollbar";

const assets = [
    "01hpschd.sf2",
    "07AcousticGuitar.sf2",
    "128,8-cylinderX",
    "128,8-gridX",
    "128,8-torus",
    "128,8-torusX",
    "128-left_rightX",
    "128-spiral-8,16,128,2,1over2",
    "128-stringcircular",
    "128-stringcircularX",
    "128-stringX",
    "19Trumpet.sf2",
    "22Bassoon.sf2",
    "ahh.aiff",
    "ahhc.aiff",
    "beats.ats",
    "beats.mp3",
    "beats.wav",
    "cage.ats",
    "Church.wav",
    "clarinet.sdif",
    "cylinder-128,8",
    "eee.aiff",
    "eeec.aiff",
    "fdl.txt",
    "fibonacci.txt",
    "fluid-2.orc",
    "fluidAllOut.orc",
    "fluid.orc",
    "flute.aiff",
    "fox.ats",
    "fox.mtx.wav",
    "fox.wav",
    "fwavblnk.aiff",
    "hrtf-44100-left.dat",
    "hrtf-44100-right.dat",
    "HRTFcompact",
    "impuls20.aiff",
    "ir.wav",
    "kickroll.het",
    "kickroll.wav",
    "mandpluk.aiff",
    "marmstk1.wav",
    "mary.wav",
    "meow.sdif",
    "midichn_advanced.mid",
    "move",
    "move2",
    "my.orc",
    "ooo.aiff",
    "opcode1.xml",
    "opcodes1.xml",
    "pgmassign_advanced.mid",
    "polyaft.mid",
    "rv_mono.wav",
    "rv_stereo.wav",
    "schottstaedt.orc",
    "sf_GMbank.sf2",
    "sing.wav",
    "spectrum.txt",
    "string-128.matrix",
    "sym10.txt",
    "table1.inc",
    "test1.png",
    "test2.png",
    "twopeaks.aiff",
    "websocket.html",
]

function get(asset) {
    return new Promise((accept, reject) => {
        var req = new XMLHttpRequest();
        req.open("GET", "/manual/" + asset , true);
        req.responseType = "arraybuffer";

        req.onload = function(event) {
            var resp = req.response;
            if(resp) {
                accept([asset, resp]);
            }
        };

        req.send(null);
    });
}


class ManualEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {changedVal: null, logs: ""};
        this.playCSD = this.playCSD.bind(this);
        this.messageCallback = this.messageCallback.bind(this);
    }

    messageCallback(msg) {
        this.setState({...this.state, logs: this.state.logs + "\n" + msg});
    }

    playCSD(csd) {
        const cs = window.csound;
        const promises = [];
        if (cs) {
            cs.setMessageCallback(this.messageCallback);
            assets.forEach(asset => {
                if (csd.match(asset)) {
                    promises.push(get(asset, ));
                }
            })
            Promise.all(promises).then(resp => {
                resp.forEach(r => {
                    cs.writeToFS(r[0], r[1]);
                });
                cs.audioContext.resume();
                cs.reset();
                cs.setOption("-odac");
                cs.setOption("-+msg_color=false");
                cs.compileCSD(csd);
                cs.start();
            })
        }
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
                   onClick={() => {
                       this.setState({...this.state, logs: ""});
                       this.playCSD(this.state.changedVal || initVal);
                }}>
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
              {(this.state.logs.length > 0) &&<pre style={{backgroundColor: "black"}}>{this.state.logs}</pre>}
            </div>
        )
    }
}

export default ManualEditor;
