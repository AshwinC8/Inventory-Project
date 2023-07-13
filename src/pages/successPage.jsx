import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'
import { getStores, getProductIDs, getProductInfo, appendInventory} from '../util/GoogleSheetsFunctions'
import AppendInventoryPage from '../components/Form/AppendInventoryPage'
import HeaderBar from '../components/HeaderBar'

const successPageStyle = {
  // width : "100%",
  display: "flex",
  flexDirection : "column",
  margin: "0",
  padding: "0",
}

function Success() {
    const session = useSession()
    const navigate = useNavigate()

    useEffect(()=>{
      console.log(session)
      if(!session){
        navigate("/")
      }
      else if(!session.hasOwnProperty("provider_token")){
        navigate("/")
      }
      // else{
      //   const date = new Date().toLocaleString()
      //   getStores(session)
      //   getProductIDs(session)
      //   getProductInfo(session, "8906150680001")
      //   appendInventory(session, date, "Store 1", [ 1, 2 ,3, 4, 5, 6, 7])
      // }
    },[session])

    return (
      <div style={successPageStyle}>
        <HeaderBar/>
        <AppendInventoryPage/>
      </div>
    )
  }
  
  export default Success
  