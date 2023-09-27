import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { getLatestUpdate } from '../../../util/GoogleSheetsFunctions';
import styles from "../../../styles/latestUpdate.module.css";
import { useNavigate } from "react-router-dom";
import LatestUpdateCard from "./LatestUpdateCard";
import { Container } from "@mui/material";

function LatestUpdate(){
    const { session } = useSessionContext();
    const [ latest, setLatest ] = useState(null);
    const navigate = useNavigate({ forceRefresh: true });

    useEffect(() => {
        async function getHistory(){
            getLatestUpdate(session)
            .then((data) => {
                setLatest(data);
            })
        }

        getHistory()
    }
    ,[session]);

    return(
        <Container 
            maxWidth="sm"
            className={styles.latest_contents}
        >
            <h2 
                style={{
                    marginBottom: 10,
                    marginTop: 5,
                }} >
                Recent Update
            </h2>
            {
                latest?
                    <div className={styles.latest_cards} key={"history_card_parent"}>
                        <LatestUpdateCard card={latest} />
                    </div>
                :
                    <div className={styles.null_card}>
                        <p>No Latest data available</p>
                    </div>
                
            }
        </Container>
    )
}

export default LatestUpdate;