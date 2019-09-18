import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import Fuse from "fuse.js";

const opcodes = [%s];

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
        this.state = {opcodes, filterString: ""};
        this.onFilter = this.onFilter.bind(this);
        // this.scrollableBody = React.createRef();
    }

    onFilter(filterString) {
        if (filterString.length < 1) {
            this.props.history.replace(
                this.props.history.location.pathname
            );
            this.setState({...this.state, opcodes: opcodes, filterString: ""});
        } else {
            const fuse = new Fuse(opcodes, filterOptions);
            const result = fuse.search(filterString);
            this.setState({...this.state, opcodes: result, filterString});
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
                <h2>III Reference</h2>
                {opcodesComp}
            </div>
        );
    }
}

export default withRouter(ManualMain);
