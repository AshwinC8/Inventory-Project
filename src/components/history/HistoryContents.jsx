import { Container } from "@mui/material";
import styles from "../../styles/history.module.css"
import TitleBar from "./TitleBar";
import { useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import HistoryCards from "./HistoryCards";

function HistoryContents(){
    const { historyStoreName } = useContext(DataContext)

    return (
        <Container 
            maxWidth="sm"
            className={styles.history_contents}
        >
            <TitleBar/>
            <h2>{historyStoreName}</h2>
            <HistoryCards/>
        </Container>
    )
}

export default HistoryContents;