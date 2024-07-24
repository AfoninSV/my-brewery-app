import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Gravity from './components/Gravity';
import Scans from './components/Scans';
import Invoices from './components/Invoices';
import MBW from './components/Mbw';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {path: "/",
  element: <App/>},

  {path: "/scanner",
  element: <Scans />},

  {path: "/gravity",
  element: <Gravity/>},

  {path: "/invoices/today",
  element: <Invoices />},

  {path: "/invoices/tomorrow",
  element: <Invoices tomorrow={true}/>},

  {path: "/mbw",
  element: <MBW />}
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
