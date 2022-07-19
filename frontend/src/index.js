import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51INowtBvRwHUiPD96mG208wgpPjFuiM3Cf4zs9okCmKwAGrGSSXJhnjP7phCLsmqHjipiLcD2fcB0zLESzvCpdIp00MeanOVre');

if(process.env.NODE_ENV && process.env.NODE_ENV == "development"){
    window.api_prefix = "";
}else{
    window.api_prefix = "https://api.joincambio.com";
}

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Elements>,
  document.getElementById('root')
);
// serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

