import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.scss";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { Helmet, HelmetProvider } from 'react-helmet-async';

const subdomain = window.location.host.split('.')[0];
const formattedSubdomain = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <HelmetProvider>
    <Provider store={store}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{formattedSubdomain}</title>
      </Helmet>
      <App />
    </Provider>
  </HelmetProvider>
  // </React.StrictMode>
);
