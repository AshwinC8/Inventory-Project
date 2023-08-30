import { FormControl, TextField, Autocomplete } from "@mui/material"
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../context/DataProvider';
import { useSessionContext } from '@supabase/auth-helpers-react'
import { getStores } from '../../util/GoogleSheetsFunctions';
import ProductCards from "./ProductCards";
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from "react-router-dom";

const formStyle = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
}

const storeDropdownStyle = {
    width : "80%",
    backgroundColor : "#E5E4E2",
    marginRight : 2
}


function AppendForm(){
    const { historyStoreName, setHistoryStoreName, storeNames, setStoreNames, setForm} = useContext(DataContext)
    const { isLoading, session} = useSessionContext()
    const [ storeName, setStoreName] = useState("")
    const navigate = useNavigate()

    useEffect( () => {
        const updateStoreNames = async () => {
            const values = await getStores(session)
            setStoreNames(values)
        }

        updateStoreNames()        
    },[session])

    const onHistoryClick = () => {
        if(historyStoreName === ""){
            alert("Please Enter the Store Name")
        }else{
            navigate("/History")
        }
    }
    
    
    const handleStoreChange = (event, newStoreName) => {
        setStoreName(newStoreName)
        setForm(
            prevState => ({ 
                ...prevState,
                storeName : newStoreName,
        }))

        setHistoryStoreName(newStoreName)
    }

    return(
        <div style={{width:"100%", marginTop: 20}}>
            <div style={formStyle} >
                <Autocomplete
                        disablePortal
                        id="select-store"
                        sx={storeDropdownStyle}
                        inputValue={storeName}
                        onInputChange={handleStoreChange}
                        options={storeNames}
                        renderInput={(params) => <TextField {...params} label="Store Name" />}
                />
                <button 
                    style={{ display:"flex", flexDirection:"row", alignItems: "center", gap: 5,}}
                    onClick={onHistoryClick}
                >
                    <HistoryIcon/>
                </button>
            </div>
            <ProductCards/>
        </div>
    )
}

export default AppendForm