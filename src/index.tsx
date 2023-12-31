import 'tailwindcss/tailwind.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './store'
import { GoogleOAuthProvider } from '@react-oauth/google';
import constants from "./constants";
import './index.css';
import PurchaseV2 from './components/uxcore/purchasev2';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // @ts-ignore
  <GoogleOAuthProvider clientId={constants.GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <Provider store={store}>
        {/* <PurchaseV2 /> */}
        <App />
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// import { Provider } from 'react-redux'
// import store from './store'
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import constants from "./constants";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
  // <GoogleOAuthProvider clientId={constants.GOOGLE_CLIENT_ID}>
  //   <React.StrictMode>
  //     <Provider store={store}>
  //       <App />
  //     </Provider>
  //   </React.StrictMode>
  // </GoogleOAuthProvider>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
