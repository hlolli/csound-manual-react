import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
// import { FixedSizeList as List } from 'react-window';
// import { VariableSizeList as List } from 'react-window';
import Fuse from "fuse.js";

const db = [%s];
const opcodes = db.filter(d => d.type === 'opcode');
opcodes.sort(function(a, b){
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
});
const scoregens = db.filter(d => d.type === 'scoregen');
scoregens.sort(function(a, b){
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
});

const filterOptions = {
    shouldSort: true,
    findAllMatches: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "name",
        "short"
    ]
};

class ManualMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {opcodes, scoregens, filterString: ""};
        this.onFilter = this.onFilter.bind(this);
        // this.scrollableBody = React.createRef();
    }

    onFilter(filterString) {
        if (filterString.length < 1) {
            this.props.history.replace(
                this.props.history.location.pathname
            );
            this.setState({...this.state, opcodes: opcodes, scoregens: scoregens, filterString: ""});
        } else {
            const fuse1 = new Fuse(opcodes, filterOptions);
            const opcodeResult = fuse1.search(filterString);

            const fuse2 = new Fuse(scoregens, filterOptions);
            const scoregensResult = fuse2.search(filterString);

            this.setState({...this.state, opcodes: opcodeResult, scoregens: scoregensResult, filterString});
            this.props.history.replace(
                this.props.history.location.pathname + "#" + filterString
            );
        }
    }

    componentWillUnmount() {
        localStorage.setItem(
            "manualmain:scrollpos",
            document.scrollingElement.scrollTop
        );
    }

    componentDidMount() {
        if (this.props.history.location.hash.length > 1) {
            this.onFilter(this.props.history.location.hash.substring(1));
        }

        const lastCursorPos = localStorage.getItem("manualmain:scrollpos");
        if (lastCursorPos.length > 0) {
            document.scrollingElement.scrollTop = Number(lastCursorPos)
        }
    }

    render() {
        const opcodesComp = this.state.opcodes.map((opc, index) => {
            return (
                <Link key={index} to={opc.url} className="manual-main-entry">
                  <div className="manual-main-opcode-container">
                    <span>{opc.name}</span>
                  </div>
                  <p>{opc.short}</p>
                </Link>
            )
        });

        const scoregensComp = this.state.scoregens.map((opc, index) => {
            return (
                <Link key={index} to={opc.url} className="manual-main-entry">
                  <div className="manual-main-opcode-container">
                    <span>{opc.name}</span>
                  </div>
                  <p>{opc.short}</p>
                </Link>
            )
        });

        return (
            <div>
              <h1>The Canonical Csound Reference Manual</h1>
              <DebounceInput
                minLength={1}
                debounceTimeout={300}
                value={this.state.filterString}
                onChange={(evt) => this.onFilter(evt.target.value || "")}
                type="text" className="manual-main-form-control"
                placeholder="Search by name or description"
                />
                {(this.state.opcodes.length > 0) && <h2>Orchestra Opcodes and Operators</h2> }
                {opcodesComp}
                {(this.state.scoregens.length > 0) && <h2>Score Statements and GEN Routines</h2> }
                {scoregensComp}
            </div>
        );
    }
}

export default withRouter(ManualMain);
