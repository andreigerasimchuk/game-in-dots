import React from 'react';
import ReactDOM from 'react-dom';
import { DataContainer } from './containers/data-container';


const App = () => (<DataContainer />);

ReactDOM.render(<App />, document.getElementById('react-root'));
