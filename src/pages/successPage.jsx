import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionContext } from '@supabase/auth-helpers-react'
import AppendInventoryPage from '../components/Form/AppendInventoryPage'
import HeaderBar from '../components/shared layout/HeaderBar'

const successPageStyle = {
  display: "flex",
  flexDirection : "column",
  margin: "0",
  padding: "0",
}

function Success() {
    const { isLoading, session, error } = useSessionContext()
    const navigate = useNavigate({ forceRefresh: true })
    
    useEffect(()=>{
      let date = new Date()
      let unixTimeStamp = Math.floor(date.getTime()/1000)
      
      if( isLoading===false){
          if(!session){
            navigate("/")
          }
          else if( session.expires_at <= unixTimeStamp){
            navigate("/")
          }
          else if(!session.hasOwnProperty("provider_token")){
            navigate("/")
          }
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
  