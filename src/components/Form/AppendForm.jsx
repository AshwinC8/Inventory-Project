import { FormControl, TextField, Autocomplete } from "@mui/material"
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../context/DataProvider';
import { useSession } from '@supabase/auth-helpers-react'
import { getStores } from '../../util/GoogleSheetsFunctions';
import ProductCards from "./ProductCards";

const formStyle = {
    width: "100%",
}

const storeDropdownStyle = {
    width : "97%",
    backgroundColor : "#E5E4E2"
}


function AppendForm(){
    const { storeNames, setStoreNames, setForm} = useContext(DataContext)
    const session = useSession()
    const [ storeName, setStoreName] = useState("")


    useEffect( () => {
        const updateStoreNames = async () => {
            const values = await getStores(session)
            setStoreNames(values)
        }

        updateStoreNames()        
    },[])
    
    
    const handleStoreChange = (event, newStoreName) => {
        setStoreName(newStoreName)
        setForm(
            prevState => ({ 
                ...prevState,
                storeName : newStoreName,
        }))
    }

    return(
        <FormControl sx={formStyle} >
            <Autocomplete
                    disablePortal
                    id="select-store"
                    sx={storeDropdownStyle}
                    inputValue={storeName}
                    onInputChange={handleStoreChange}
                    options={storeNames}
                    renderInput={(params) => <TextField {...params} label="Store Name" />}
            />
            <ProductCards/>
        </FormControl>
    )
}

export default AppendForm