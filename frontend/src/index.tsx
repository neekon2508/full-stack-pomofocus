import App from 'App';
import 'index.css';
import ReactDOM from "react-dom/client"
const getPageTitle = () => {

    const nodeEnv = process.env.NODE_ENV || 'local';

    switch (nodeEnv) {
        case 'local':
            return 'PomoFocus App (Local)';
        case 'dev':
            return 'PomoFocus App (DEV)';
        case 'prd':
            return 'PomoFocus App';
        default:
            return 'PomoFocus App (Local)';
    }
    document.title = getPageTitle();

    ReactDOM
}