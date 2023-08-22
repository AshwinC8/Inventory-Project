import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionContext, useSession} from '@supabase/auth-helpers-react'
import HeaderBar from '../components/shared layout/HeaderBar'
import { getStoreHistory } from '../util/GoogleSheetsFunctions'
import HistoryContents from '../components/history/HistoryContents'

function History() {
    const { isLoading, session, error } = useSessionContext()
    const navigate = useNavigate()

    useEffect(()=>{
      let date = new Date()
      let unixTimeStamp = Math.floor(date.getTime()/1000)
      
      if( isLoading===false ){ 
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
      <div>
        <HeaderBar/>
        <HistoryContents/>
      </div>
    )
  }
  
  export default History
  