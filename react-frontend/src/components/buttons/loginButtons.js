import { FcGoogle } from 'react-icons/fc'
import BasicButton from "./common"
import { Link } from "react-router-dom"

function GoogleOAuth2Button ({onClick}) {
    return (
        <BasicButton
            IconElement={() => <FcGoogle className="mx-2" />}
            text={"Continue with Google"}
            className={"btn-light"}
            onClick={onClick}
        />
    )
}

function LoginButton ({onClick, textContent}) {
    return (
        <BasicButton
            type="submit"
            text={textContent}
            className={"btn-light"}
            onClick={onClick}
            style={{backgroundColor:"#0d6efd", color: "white"}}
        />
    )
}

function LogoutButton ({onClick, textContent}) {
    return (
        <BasicButton
            type="button"
            text={textContent}
            className={"btn-light"}
            onClick={onClick}
            style={{backgroundColor:"rgba(255, 255, 255, 0.166)", color: "white"}}
        />
    )
}

function LinkButton ({previousText, linkText, route}) {
    return (
        <p className='mt-4'>
            {previousText}
            <Link to={route} className='mx-2'>
                {linkText}
            </Link>
        </p>
    )
}

export {
    LoginButton,
    GoogleOAuth2Button,
    LogoutButton,
    LinkButton
}