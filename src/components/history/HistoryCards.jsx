import { useSessionContext } from "@supabase/auth-helpers-react";
import { useContext, useEffect, useState } from "react";
import { getStoreHistory } from '../../util/GoogleSheetsFunctions'
import { DataContext } from "../../context/DataProvider";
import { CircularProgress, colors } from "@mui/material";
import styles from "../../styles/history.module.css"
import HistoryCard from "./HistoryCard";
import { useNavigate } from "react-router-dom";

function HistoryCards(){
    const { session } = useSessionContext()
    const { historyStoreName } = useContext(DataContext)
    const [ history, setHistory ] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        async function getHistory(){
            getStoreHistory(session, historyStoreName)
            .then((data) => {
                setHistory(data)
            })
        }

        getHistory()
    }
    ,[session])

    useEffect(() => {
        if( historyStoreName === "" ){
            alert("Please go back to the form and select the Store")
            navigate("/Dashboard")
        }
    }
    , [historyStoreName])

    return(
        <div>
            {
                history? 
                    <div className={styles.history_cards} key={"history_card_parent"}>
                        {
                            history.map( (card, index) => (
                                <HistoryCard card={card} key={card.productID}/>
                            ))
                        }
                    </div>
                :
                    <div className={styles.loading_card}>
                        <CircularProgress color="success" /> 
                        <p 
                            style={{
                                opacity: 0.5,
                            }
                        }>
                            Please reload or logout and login again if the details hasnt arrived in 5 mins  
                        </p>       
                    </div>
            }
        </div>
    )
}

export default HistoryCards;