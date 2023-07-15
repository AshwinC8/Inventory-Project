import { FormControl,InputLabel, Select, MenuItem, Autocomplete } from "@mui/material"
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
    const { storeNames, setStoreNames, productCards, setProductCards, setForm} = useContext(DataContext)
    const session = useSession()
    const [ storeName, setStoreName] = useState("")


    useEffect( () => {
        const updateStoreNames = async () => {
            const values = await getStores(session)
            setStoreNames(values)
        }

        updateStoreNames()        
    },[])
    
    
    const handleStoreChange = (event) => {
        setStoreName(event.target.value)
        setForm(
            prevState => ({ 
                ...prevState,
                storeName : event.target.value,
        }))
    }

    return(
        <FormControl sx={formStyle} >
            <Autocomplete
                    disablePortal
                    id="select-box"
                    options={storeName}
                    sx={storeDropdownStyle}
                    renderInput={(params) => <TextField {...params} label="Store Name" />}
            />
            {/* <InputLabel id="store">Store</InputLabel>
            <Select
                labelId="store"
                id="store-name"
                value={storeName}
                label="Store"
                sx={storeDropdownStyle}
                onChange={handleStoreChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {   
                    storeNames.map( (store) => (
                        <MenuItem key={store.index} value={store.value}>{store.value}</MenuItem>
                    ))
                }
            </Select> */}
            <ProductCards/>
        </FormControl>
    )
}

export default AppendForm