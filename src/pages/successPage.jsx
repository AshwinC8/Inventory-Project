import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession} from '@supabase/auth-helpers-react'
import AppendInventoryPage from '../components/Form/AppendInventoryPage'
import HeaderBar from '../components/shared layout/HeaderBar'

const successPageStyle = {
  display: "flex",
  flexDirection : "column",
  margin: "0",
  padding: "0",
}

function Success() {
    const session = useSession()
    const navigate = useNavigate()

    useEffect(()=>{
      if(!session){
        navigate("/")
      }
      else if(!session.hasOwnProperty("provider_token")){
        navigate("/")
      }
    },[session])

    return (
      <div style={successPageStyle}>
        <HeaderBar/>
        <AppendInventoryPage/>
      </div>
    )
  }
  
  export default Success
  