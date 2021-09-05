import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux'
import {Main} from 'src/pages/main';
import {storeMain} from 'src/configureStore';

// import App from './App';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={storeMain}>
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
