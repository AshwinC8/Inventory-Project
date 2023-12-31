import {createContext, useState} from "react";

export const DataContext = createContext(null);

const DataProvider = ( {children} ) => {
    const [ storeNames, setStoreNames] = useState([])
    const [ productIDs, setProductIDs] = useState([])
    const [ remainingPIDs, setRemainingPIDs ] = useState([])
    const [ productCards, setProductCards ] = useState([])
    const [ historyStoreName, setHistoryStoreName ] = useState("")
    const [ form, setForm] = useState({
        storeName : "",
        date : "",
        quantities : [],
    })

    return (
        <DataContext.Provider value={{
            storeNames,
            setStoreNames,
            productIDs, 
            setProductIDs,
            form, 
            setForm,
            remainingPIDs, 
            setRemainingPIDs, 
            productCards, 
            setProductCards,
            historyStoreName, 
            setHistoryStoreName
        }}>
            { children }
        </DataContext.Provider>
    )
}

export default DataProvider;