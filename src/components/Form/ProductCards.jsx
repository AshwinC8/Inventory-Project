import { Button } from "@mui/material"
import { v4 as uuid } from 'uuid'
import ProductCard from "./ProductCard"
import { useContext, useEffect } from "react"
import { DataContext } from "../../context/DataProvider"
import AddBoxIcon from '@mui/icons-material/AddBox'

const productsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",    
}

const addButtonStyle = {
    // maxWidth : "200px",
    marginTop: 15
}

function ProductCards(){
    const { productCards, setProductCards} = useContext(DataContext)
    
    useEffect( () => {
        setProductCards([{ id : uuid(), productID: "", quantity: ""}])
    },[])

    const addProductCard = () => {
        let updatedCards = productCards.filter(() => true)
        updatedCards.push({ id : uuid(), productID: "", quantity: ""})
        setProductCards(updatedCards)
        console.log(updatedCards)
    }
    
    return(
        <div style={productsStyle}>
            {   
                productCards.map( (product, index) => (
                    <ProductCard key={product.id} card={product} index={index+1}/>
                ))
            }
            {/* style={{ width: "60%",}} sx={{ p: 1.5, px:2 }} variant="outlined" */}
            <button style={addButtonStyle} onClick={addProductCard}>
                Add Product
            </button> 
        </div>
    )
}

export default ProductCards