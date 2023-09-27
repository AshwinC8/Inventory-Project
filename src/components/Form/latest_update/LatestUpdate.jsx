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
            getLatestUpdate(session, 1)
            .then((data) => {
                var list = []
                list.push(data)
                setLatest(list);
            })
        }

        getHistory()
    }
    ,[session]);

    const handleMoreLatest = () => {
        async function getHistory(){
            getLatestUpdate(session, latest.length+1)
            .then((data) => {
                var list = latest.filter(() => true);
                list.push(data);
                setLatest(list);
            });
        }

        getHistory()
    }

    return(
        <Container 
            style={{boxShadow: "none"}}
            maxWidth="sm"
        >
            <div 
                className={styles.latest_contents}
            >
                <p 
                    style={{
                        marginBottom: 10,
                        marginTop: 5,
                    }} >
                    Recent Updates
                </p>
                {
                    latest?
                        <div className={styles.latest_cards} key={"history_card_parent"}>
                            {
                                latest.map((card, index) => (
                                    <LatestUpdateCard card={card} key={index}/>
                                ))
                            }    
                        </div>
                    :
                        <div className={styles.null_card}>
                            <p>No Latest data available</p>
                        </div>
                    
                }
                <button style={{marginTop: 17,alignSelf:"center"}} onClick={handleMoreLatest}>More</button>
            </div>
        </Container>
    )
}

export default LatestUpdate;