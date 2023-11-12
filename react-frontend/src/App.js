import { useState } from "react"
import { LoginPage, RegisterPage, HomePage, SuccessLoginPage, BookingFormInfo } from 'views'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BookingFormInfoProvider } from "provider/bookingFormInfo"
import './scss/_main.scss'

function Footer() {

    return (
        <footer className="footer">
            <small>Powered by Booked</small>
            <br></br>
            <br></br>
            <svg width="267" height="243" viewBox="0 0 267 243" fill="white" className = "/* color for svg file */" xmlns="http://www.w3.org/2000/svg">
                <path d="M266.672 120.403C266.659 134.733 266.359 148.571 266.746 162.39C266.971 170.411 263.794 176.681 258.47 181.968C248.221 192.146 235.353 197.696 222.041 202.876C204.432 209.727 185.699 213.746 169.138 223.164C162.528 226.923 156.498 231.731 150.333 236.239C138.818 244.657 129.775 244.803 117.672 237.338C109.881 232.533 103.465 225.854 95.2613 221.646C87.0596 217.438 78.2912 214.76 69.5877 211.995C51.0056 206.092 32.5572 199.547 16.0369 189.3C6.9437 183.661 0.377382 174.529 0.391146 162.409C0.430208 128.084 0.744051 93.7492 0.00735736 59.4387C-0.296385 45.2917 8.83438 33.7953 21.8818 28.9399C26.9098 27.0688 32.0134 25.7048 37.3153 25.1172C40.0515 24.814 41.8244 23.8652 42.7974 21C48.9005 3.0285 67.8683 -1.57633 82.2821 0.507537C99.7746 3.03647 115.511 9.94617 129.089 21.2773C132.334 23.985 134.426 23.9846 137.621 21.5569C147.588 13.9861 158.141 7.27631 170.241 3.68008C183.174 -0.163637 196.386 -2.4053 209.079 4.22833C216.255 7.97861 221.151 14.5333 225.117 21.42C226.899 24.5136 228.345 26.3332 232.159 26.2706C245.666 26.049 255.386 33.4076 263.622 43.0399C266.642 46.5716 266.638 51.4182 266.651 55.9181C266.708 77.2462 266.674 98.5746 266.672 120.403ZM146.817 59.3128C148.044 58.1877 149.241 57.028 150.502 55.9428C161.467 46.5076 173.116 38.5319 188.076 36.7762C192.648 36.2396 197.28 35.2652 201.545 33.2862C205.632 31.3893 206.347 28.9599 203.596 25.4586C199.776 20.5984 195.152 17.9012 188.44 19.145C184.152 19.9396 179.857 20.768 176.037 22.6114C169.606 25.7146 161.925 26.3128 156.48 31.0463C149.695 36.9456 142.01 41.6738 135.495 47.873C134.228 49.0792 132.699 50.2991 131.254 48.4605C128.115 44.4683 123.528 42.2332 120.011 38.6613C107.214 25.6607 91.1994 20.2306 73.2964 19.5189C70.1104 19.3922 67.3928 20.4732 65.0919 22.5451C62.2327 25.1198 61.4865 28.7756 62.1729 32.1327C62.8441 35.4152 66.3663 33.8454 68.6406 34.1978C87.2677 37.0843 104.06 43.5892 117.615 57.3813C125.521 65.4259 133.45 68.5915 143.683 61.2908C144.492 60.7131 145.397 60.2677 146.817 59.3128ZM118.451 193.865C101.983 185.258 84.9031 178.705 66.0908 177.455C62.7151 177.23 60.372 177.525 59.9715 181.183C59.5815 184.745 58.6844 188.613 63.7249 190.149C71.0376 192.378 78.2808 194.835 85.5412 197.233C99.2001 201.743 112.173 207.476 122.925 217.434C130.398 224.354 134.671 224.366 142.532 217.842C154.718 207.728 168.285 200.504 183.726 196.502C190.537 194.737 197.88 193.681 203.531 188.755C205.37 187.153 207.691 185.617 206.872 182.589C206.064 179.598 203.924 177.751 201.03 176.964C198.432 176.258 195.743 176.365 193.126 177.077C188.794 178.255 184.364 179.179 180.173 180.742C168.558 185.074 156.501 188.028 146.096 195.642C132.218 205.796 134.023 208.251 118.451 193.865Z"/>
            </svg>
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
        <div className='app wild-background'>
            <BrowserRouter>
                <BookingFormInfoProvider>
                    <div className='content'>
                        <Routes>
                            <Route index element={<LoginPage handleLogin={handleLogin}/>} />
                            <Route path="login" element={<LoginPage handleLogin={handleLogin}/>} />
                            <Route path="login/success" element={<SuccessLoginPage/>} />
                            <Route path="register" element={<RegisterPage/>} />
                            <Route path="home" element={ !loggedIn ? <Navigate to={"/login"} /> : <HomePage handleLogout={handleLogout}/>} />
                            <Route path="*" element={<h1>404 Not found</h1>} />
                            <Route path="bookingform/:id" element = {<BookingFormInfo handleLogin = {handleLogin} handleLogout={handleLogout}/>} />
                            <Route path="editbookingform/:id" element = {<p>edit booking form</p>} />
                        </Routes>
                    </div>
                </BookingFormInfoProvider>
            </BrowserRouter>
            <br></br>
            <Footer />
            <br></br>
        </div>
    )
}

export default App
