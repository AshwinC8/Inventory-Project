import styles from "../../styles/history.module.css"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import { green } from "@mui/material/colors";

function TitleBar(){
    const { historyStoreName, setHistoryStoreName} = useContext(DataContext)
    const navigate = useNavigate({ forceRefresh: true })

    const handleBackClick = () => {
        setHistoryStoreName("")
        navigate("/Dashboard")
    }

    return(
        <div className={styles.title_bar}>
            <Button
                className={styles.back_button} 
                style={{
                    color:"green",
                }}
                onClick={handleBackClick}
            >
                <ArrowBackIcon/>
            </Button>
            <h3> Previous Replenishments</h3>
        </div>
    )
}

export default TitleBar