import { useState } from "react"
import { LoginPage, RegisterPage, HomePage, SuccessLoginPage, BookingFormInfo } from 'views'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import logo from "assets/logo.svg"
import { BookingFormInfoProvider } from "provider/bookingFormInfo"

function Footer() {
    return (
        <footer>
            <small>Powered by Booked</small>
            <br></br>
            <br></br>
            <img src={logo} className="App-logo" alt="logo" />
        </footer>
    )
}

function App() {

    let [loggedIn, setLoggedIn] = useState(null)
    
    function handleLogin(){
        setLoggedIn(true)
    }
    function handleLogout(){
        setLoggedIn(false)
    }

    return (
        <div className='App-body'>
            <BrowserRouter>
                <BookingFormInfoProvider>
                    <Routes>
                        <Route index element={<LoginPage handleLogin={handleLogin}/>} />
                        <Route path="login" element={<LoginPage handleLogin={handleLogin}/>} />
                        <Route path="login/success" element={<SuccessLoginPage/>} />
                        <Route path="register" element={<RegisterPage/>} />
                        <Route path="home" element={ !loggedIn ? <Navigate to={"/login"} /> : <HomePage handleLogout={handleLogout}/>} />
                        <Route path="*" element={<h1>404 Not found</h1>} />
                        <Route path="bookingform/:id" element = {<BookingFormInfo/>} />
                        <Route path="editbookingform/:id" element = {<p>edit booking form</p>} />
                    </Routes>
                </BookingFormInfoProvider>
            </BrowserRouter>
            <Footer />
        </div>
    )
}

export default App
