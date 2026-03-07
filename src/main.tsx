import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx loaded');
if (typeof process !== 'undefined' && process.stdout) {
  process.stdout.write('main.tsx loaded (server)\n');
}

createRoot(document.getElementById("root")!).render(<App />);
