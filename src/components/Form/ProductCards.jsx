import { useContext, useEffect } from "react"
import { v4 as uuid } from 'uuid'
import { DataContext } from "../../context/DataProvider"
import ProductCard from "./ProductCard"

const productsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",    
}

const addButtonStyle = {
    marginTop: 15
}

function ProductCards(){
    const { productCards, setProductCards} = useContext(DataContext)
    
    useEffect( () => {
        setProductCards([{ id : uuid(), productID: "", productName: "", quantity: ""}])
    },[])

    const addProductCard = () => {
        let updatedCards = productCards.filter(() => true)
        updatedCards.push({ id : uuid(), productID: "", productName: "", quantity: ""})
        setProductCards(updatedCards)
    }
    
    return(
        <div style={productsStyle}>
            {   
                productCards.map( (product, index) => (
                    <ProductCard key={product.id} card={product} index={index+1}/>
                ))
            }
            <button style={addButtonStyle} onClick={addProductCard}>
                Add Product
            </button> 
        </div>
    )
}

export default ProductCards