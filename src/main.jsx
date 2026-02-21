import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from "./app/store.js"
import { Provider } from 'react-redux'
import {BrowserRouter} from "react-router-dom";
import { onAuthChanged } from "./utils/firebase";
import { setUser, logout } from "./features/authSlice";

// attach firebase auth listener to keep redux in sync
onAuthChanged((user) => {
  if (user) {
    store.dispatch(
      setUser({ uid: user.uid, email: user.email })
    );
  } else {
    store.dispatch(logout());
  }
});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
