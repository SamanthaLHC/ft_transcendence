import React from 'react';
// import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client' 
import { BrowserRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import App from './components/app/App';

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!);
root.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>
);

reportWebVitals();
