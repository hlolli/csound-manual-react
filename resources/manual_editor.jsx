import React, { Component } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactModal from "@hlolli/react-modal-resizable-draggable";
import ReactTooltip from "react-tooltip";

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
  "beats.ogg",
  "beats.wav",
  "cage.ats",
  "Church.wav",
  "clarinet.sdif",
  "cylinder-128,8",
  "eee.aiff",
  "eeec.aiff",
  "fdl.txt",
  "fibonacci.txt",
  "finneganswake1.flac",
  "fluid-2.orc",
  "fluidAllOut.orc",
  "fluid.orc",
  "flute.aiff",
  "flutec3.wav",
  "flute-C-octave0.wav",
  "fox.ats",
  "fox.mtx.wav",
  "fox_nopoles.lpc",
  "fox_poles.lpc",
  "fox.pvx",
  "fox.wav",
  "fwavblnk.aiff",
  "hrtf-44100-left.dat",
  "hrtf-44100-right.dat",
  "HRTFcompact",
  "image.png",
  "impuls20.aiff",
  "ir.wav",
  "kickroll.het",
  "kickroll.wav",
  "makecsd.py",
  "mandpluk.aiff",
  "marmstk1.wav",
  "mary.wav",
  "meow.sdif",
  "midichn_advanced.mid",
  "midiChords.mid",
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
  "saxophone-alto-C-octave0.wav",
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
  "wave.wav",
  "websocket.html",
];

function get(asset) {
  return new Promise((accept, reject) => {
    var req = new XMLHttpRequest();
    req.open("GET", "/manual-assets/" + asset, true);
    req.responseType = "arraybuffer";

    req.onload = function (event) {
      var resp = req.response;
      if (resp) {
        accept([asset, new Uint8Array(resp)]);
      }
    };

    req.send(null);
  });
}

function ClipboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 2c-1.26 0-2.15.89-2.59 2H5v25h22V4h-8.41c-.44-1.11-1.33-2-2.59-2zm0 2c.55 0 1 .45 1 1v1h3v2h-8V6h3V5c0-.55.45-1 1-1zM7 6h3v4h12V6h3v21H7V6zm2 7v2h2v-2H9zm4 0v2h10v-2H13zm-4 4v2h2v-2H9zm4 0v2h10v-2H13zm-4 4v2h2v-2H9zm4 0v2h10v-2H13z"></path>
    </svg>
  );
}

class ManualEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changedVal: null,
      logs: "",
      isPlaying: false,
      isStop: true,
      isLoading: false,
      cs: null,
    };
    this.playCSD = this.playCSD.bind(this);
    this.messageCallback = this.messageCallback.bind(this);
  }

  messageCallback(msg) {
    this.setState({ ...this.state, logs: this.state.logs + "\n" + msg });
    document
      .querySelectorAll(".manual-logs")
      .forEach((el) => el.scrollTo(0, el.scrollHeight));
  }

  playCSD(csd) {
    if (this.state.isLoading) {
      return;
    } else if (this.state.isPlaying && this.state.cs) {
      this.state.cs.pause();
      return;
    } else if (!this.state.isPlaying && !this.state.isStop) {
      this.state.cs.resume();
      return;
    } else if (this.state.cs) {
      return;
    }

    const Csound = this.props.Csound;

    const promises = [];
    Csound &&
      Csound().then((cs) => {
        if (cs) {
          cs.on("message", this.messageCallback);
          cs.on("realtimePerformanceEnded", () => {
            this.setState({
              ...this.state,
              isPlaying: false,
              isStop: true,
              isLoading: false,
              cs: null,
            });
            cs.terminateInstance();
          });
          cs.on("play", () =>
            this.setState({
              ...this.state,
              isPlaying: true,
              isStop: false,
              isLoading: false,
            })
          );
          cs.on("pause", () =>
            this.setState({
              ...this.state,
              isPlaying: false,
              isStop: false,
              isLoading: false,
            })
          );
          assets.forEach((asset) => {
            if (csd.match(asset)) {
              promises.push(get(asset));
            }
          });
          Promise.all(promises).then(async (resp) => {
            for (const r of resp) {
              await cs.fs.writeFileSync(r[0], r[1]);
            }
            // cs.audioContext.resume();
            // cs.resetIfNeeded();
            await cs.setOption("-odac");
            await cs.setOption("-+msg_color=false");
            await cs.compileCsdText(csd);
            this.setState({
              ...this.state,
              cs,
            });
            await cs.start();
          });
        }
      });
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }
  render() {
    const initVal = this.props.value;
    const lineCnt = initVal.split(/\r\n|\r|\n/).length;

    return (
      <div>
        <ReactTooltip />
        <ReactModal
          initWidth={document.scrollingElement.scrollWidth * 0.8}
          initHeight={200}
          left={
            document.scrollingElement.scrollWidth -
            document.scrollingElement.scrollWidth * 0.8
          }
          top={document.scrollingElement.clientHeight - 200}
          isOpen={
            this.props.currentExample === this.props.exampleName &&
            this.state.logs.length > 0
          }
        >
          <pre className="manual-logs">{this.state.logs}</pre>
        </ReactModal>
        <div className="manual-button-container">
          <div
            className="manual-play-button"
            onClick={() => {
              if (this.state.isStop) {
                this.setState({ ...this.state, logs: "", isLoading: true });
                this.props.setCurrentExample(this.props.exampleName);
              }

              this.playCSD(this.state.changedVal || initVal);
            }}
          >
            {this.state.isPlaying && !this.state.isStop ? (
              <svg
                viewBox="0 0 256 256"
                x="0px"
                y="0px"
                width="140px"
                height="140px"
                style={{ marginTop: 42 }}
              >
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M46.677 64.652c0-9.362 7.132-17.387 16.447-17.394 9.315-.007 24.677.007 34.55.007 9.875 0 17.138 7.594 17.138 16.998 0 9.403-.083 119.094-.083 127.82 0 8.726-7.58 16.895-16.554 16.837-8.975-.058-25.349.115-34.963.058-9.614-.058-16.646-7.74-16.646-17.254 0-9.515.11-117.71.11-127.072zm91.423.025c.027-9.804 7.518-17.541 17.125-17.689 9.606-.147 25.283.148 35.004.148 9.72 0 17.397 8.52 17.397 17.77s-.178 117.809-.178 127c0 9.192-7.664 17.12-16.323 17.072-8.66-.05-26.354 0-34.991.048-8.638.05-17.98-8.582-18.007-17.783-.027-9.201-.055-116.763-.027-126.566z"
                    fill="#000"
                  />
                  <path
                    d="M61.436 65.47l4.997-4.056s23.009-.395 25.796 0c2.786.396 7.085.918 7.085 4.66s.163 118.766.082 123.248c-.082 4.483-4.22 6.142-7.167 6.142-2.948 0-21.044.047-24.402-.47-3.357-.518-6.48-.286-6.48-5.833 0-5.547.089-123.691.089-123.691zm93.581-.239l4.997-4.055s23.01-.396 25.796 0c2.787.395 7.086.918 7.086 4.66s.162 118.766.081 123.248c-.08 4.482-4.22 6.142-7.167 6.142s-21.043.047-24.401-.471c-3.358-.518-6.48-.285-6.48-5.832s.088-123.692.088-123.692z"
                    fill={this.props.theme.altButtonBackground || "#FFF"}
                  />
                </g>
              </svg>
            ) : (
              <svg
                x="0px"
                y="0px"
                width="213.7px"
                height="213.7px"
                viewBox="0 0 213.7 213.7"
                enableBackground="new 0 0 213.7 213.7"
              >
                <circle
                  className="manual-button-circle"
                  fill="none"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  cx="106.8"
                  cy="106.8"
                  r="103.3"
                />
                <polygon
                  className="manual-button-triangle"
                  fill="none"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  points="73.5,62.5 148.5,105.8 73.5,149.1 "
                />
              </svg>
            )}

            <p>Play the example!</p>
          </div>
        </div>
        <CopyToClipboard
          text={this.state.changedVal || initVal}
          onCopy={() =>
            window.postMessage(
              { text: "Example was copied to clipboard!" },
              "*"
            )
          }
        >
          <div
            className="copy-btn-container"
            data-tip={`Copy the example to clipboard!`}
          >
            <button className="copy-btn">
              <ClipboardIcon />
            </button>
          </div>
        </CopyToClipboard>
        <CodeMirror
          onChange={(editor, data, value) =>
            this.setState({ changedVal: value })
          }
          options={{
            mode: "csound",
            autoCloseBrackets: true,
            fullScreen: true,
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            viewportMargin: Infinity,
            readOnly: false,
            nocursor: false,
          }}
          value={initVal}
        ></CodeMirror>
      </div>
    );
  }
}

export default ManualEditor;
