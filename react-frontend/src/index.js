import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './scss/_main.scss'

const root = ReactDOM.createRoot(document.getElementById('root'))

let avoidRenderingTwice = true

if (avoidRenderingTwice) {
    root.render(<App />)
} else {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
}

        

    

