import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useSupabaseClient } from '@supabase/auth-helpers-react'


const googleLogoStyle = {
  color: "#3a6146",
  paddingRight: "15",
}

const loginButtonStyle = {
  // display: "flex",
  // flexDirection: "row",
  // alignItems: "center",
  // justifyContent: "center",
  width:"60%",
  height: "50px", 
  maxWidth: "300px",
  marginBottom : "20px",
}

function GoogleLoginButton() {
    const supabase = useSupabaseClient()

    async function googleSignIn(){
      const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
          }
      })

      if(error){
        alert("Error logging in to Google provider with Supabase")
        console.error(error)
      }
    }

    return (
        <button style={loginButtonStyle} onClick={() => { googleSignIn() } }>
            <FontAwesomeIcon icon={faGoogle} style={googleLogoStyle} />
            Sign In with Google
        </button>
    )
  }
  
export default GoogleLoginButton