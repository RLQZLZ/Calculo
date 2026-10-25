import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Automatically register service worker for offline use
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
