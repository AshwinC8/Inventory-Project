// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
// import { createClient } from '@supabase/supabase-js'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GoogleLoginButton from '../components/login/googleButton'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
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
    const supabase = useSupabaseClient()
    const session = useSession()
    const navigate = useNavigate()
    
    useEffect(()=>{
      if(session){
        if(session.hasOwnProperty("provider_token")){
          navigate("/success")
          // return (<Alert severity="error">Session timed out</Alert>)
        }
      }
    },[session])

    console.log(session)

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
  