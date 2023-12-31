import { Card } from "@mui/material";
import styles from "../../../styles/latestUpdate.module.css";

function LatestUpdateCard({card}) {
    var backgroundColors=[ "#F3FDE8", "#D4E2D4"]

    return (
        <Card className={styles.latest_card}>
            <div className={styles.card_title}>
                <h4 style={{textAlign: "center", marginTop: 3, marginBottom: 3 }}>{card.storeName}</h4>
            </div>
            <div className={styles.card_title}>
                <h4 style={{textAlign: "center", marginTop: 3, marginBottom: 3 }}>{card.timestamp}</h4>
            </div>
            {
                card.products.map((product, index) => (
                    <div 
                        key={product.productId} 
                        style={{
                            paddingLeft: "10px",
                            backgroundColor: backgroundColors[index%2],
                        }}
                    > 
                        <p style={{fontSize:"small"}}>{product.productId.slice(9,)} -&gt; {product.productName} -&gt; <b>{product.quantityReplenished}</b></p>
                    </div>
                ))
            }
        </Card>
    )
}

export default LatestUpdateCard;