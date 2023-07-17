import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GoogleLoginButton from '../components/login/googleButton'
import { useSession } from '@supabase/auth-helpers-react'
import Logo from '../assets/pure-naturals-essentials.svg'


const loginPage = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems : "center", 
}

const logoStyle = {
  height: "70%",
  width: "100%",
  maxWidth: "500px"
}


function Login() {
    const session = useSession()
    const navigate = useNavigate()
    
    useEffect(()=>{
      if(session){
        if(session.hasOwnProperty("provider_token")){
          navigate("/Dashboard")
        }
      }
    },[session])


    return (
      <>
        <div style={loginPage}>          
          <img src={Logo} alt="Pure Nature Essentials" style={logoStyle}/>
          <GoogleLoginButton/>
        </div>
      </>
    )
  }
  
  export default Login
  