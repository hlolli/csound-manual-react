import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import Fuse from "fuse.js";

const opcodes = [%s];

const filterOptions = {
    shouldSort: true,
    threshold: 0.6,
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
        this.state = {opcodes};
        this.onFilter = this.onFilter.bind(this);
    }

    onFilter(evt) {
        const filterString = evt.target.value || "";
        if (filterString.length < 1) {
            this.setState({...this.state, opcodes: opcodes});
        } else {
            const fuse = new Fuse(opcodes, filterOptions);
            const result = fuse.search(filterString);
            this.setState({...this.state, opcodes: result});
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
                onChange={this.onFilter}
                type="text" className="manual-main-form-control"
                placeholder="Search by name or description"
                />
              <h2>III Reference</h2>
              {opcodesComp}
            </div>
        );
    }
}

export default ManualMain;
