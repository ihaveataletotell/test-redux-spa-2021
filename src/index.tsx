import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {app} from 'src/configureStore';
import {Provider} from 'react-redux'
import {Main} from 'src/pages/Main';

// import App from './App';
// import reportWebVitals from './reportWebVitals';

app.startHeartbeat();

ReactDOM.render(
  <Provider store={app.storeMain}>
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
