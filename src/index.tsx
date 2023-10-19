import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from "./store";
import { createRoot } from 'react-dom/client';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const { NODE_ENV } = process.env;
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <BrowserRouter basename={NODE_ENV && NODE_ENV === "development" ? "" : "/piano-app"}>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);
