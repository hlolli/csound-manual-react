import React, { Component } from 'react';
import { UnControlled as CodeMirror } from "react-codemirror2";
import PerfectScrollbar from "react-perfect-scrollbar";

class ManualEditor extends React.Component {
    render() {
        const initVal = this.props.value;
        const lineCnt = initVal.split(/\r\n|\r|\n/).length;

        return (
            <PerfectScrollbar style={{height: (22 + ((lineCnt + 1) * 22)), position: "relative"}}>
              <CodeMirror
                options={{
                    mode: 'csound',
                    theme: "monokai",
                    autoCloseBrackets: true,
                    fullScreen: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    matchBrackets: true,
                    viewportMargin: Infinity,

                }}
                value={initVal}
                >
              </CodeMirror>
            </PerfectScrollbar>
        )
    }
}

export default ManualEditor;
