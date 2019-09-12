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
