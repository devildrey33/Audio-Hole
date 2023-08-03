import './style.css'
import ReactDOM from 'react-dom/client'
import UserInterface from './UserInterface';
import { StrictMode } from 'react';

const root = ReactDOM.createRoot(document.querySelector('#root'));

//root.render(<UserInterface />);

root.render(
    <StrictMode>
        <UserInterface /> 
    </StrictMode>
);