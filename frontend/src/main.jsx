import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js' 
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'
import 'react-tagsinput/react-tagsinput.css'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store/index.js'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ToastContainer position='top-right'/>
      <div className="container">
        <div className="card mb-4 bg-light">
          <App />
        </div>
      </div>
    </PersistGate>
  </Provider>,
)
