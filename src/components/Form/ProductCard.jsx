import { useContext, useEffect, useState } from "react"
import { Card, InputLabel, Select, MenuItem, FormControl, TextField, useFormControl, Container, Button } from "@mui/material"
import { getProductIDs, getProductInfo } from "../../util/GoogleSheetsFunctions";
import { useSession } from "@supabase/auth-helpers-react";
import { DataContext } from "../../context/DataProvider";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

const productCardStyle = {
    width: "97%", 
    py: 3,
    my: 2, 
    mr:1.5, 
    backgroundColor: "#E5E4E2",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
}

const productFormStyle = {
    width: "100%",
    px: 3
}

const productSelectStyle = {
    width:"100%",
}

const quantityInputStyle = {
    width: "100%"
}

const deleteButtonStyle = {
    maxHeight: "200px",
    mx: 2,
    color: "red"
}

const cardFeatureStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}

function ProductCard({ card, index }){
    const { productIDs, productCards, setProductCards, form, setForm} = useContext(DataContext)
    const [ productID, setProductID] = useState("");
    const [ quantity, setQuantity] = useState(0)
    const [ productInfo, setProductInfo] = useState(null)
    const session = useSession()

    useEffect(() => {
      setProductID(card.productID)
      setQuantity(card.quantity)
    }, [])
    
    function removeCard(){
        const updatedCards = productCards.filter(element => element.id !== card.id)
        console.log(updatedCards)
        setProductCards(updatedCards)
    }

    const handleProductSelect = (event) => {
        // let newPIDs = remainingPIDs
        // if(productID !== ""){
        //     productIDs.forEach( (product) => {if (product.value === productID){newPIDs.push(product)}})
        //     // newPIDs.push(productIDs)
        // }    
        // newPIDs = newPIDs.filter((item) => item.value !== event.target.value)
        // console.log(<button style={deleteButtonStyle}> Delete</button>newPIDs)
        // setRemainingPIDs(newPIDs)
        
        let index = productCards.findIndex( x => x.id === card.id )
        if( index !== -1 ){
            let tempCards = productCards.slice()
            tempCards[index][productID] = event.target.value 
            setProductCards(tempCards)
        } 


        setProductID(event.target.value)
        //whyyy async
        async function updateProductInfo(){
            const value = await getProductInfo(session, event.target.value)
            console.log("info = " + JSON.stringify(value))
            setProductInfo(value)
        }
        updateProductInfo()

        //updating form
        productIDs.forEach( (product) => {
            // console.log(JSON.stringify(product) + "\n" + productID )
            if(product.value === productID){
                let q = form.quantities
                q[product.index] = 0
    
                setForm( prevState => ({ 
                    ...prevState,
                    quantities: q
                }))
            }

            if(product.value === event.target.value){
                let q = form.quantities
                q[product.index] = quantity
    
                setForm( prevState => ({ 
                    ...prevState,
                    quantities: q
                }))
            }
        })
        console.log(form)
    }


    const handleQuantityChange = (event) => {
        let index = productCards.findIndex( x => x.id === card.id )
        if( index !== -1 ){
            let tempCards = productCards.slice()
            tempCards[index][quantity] = event.target.value 
            setProductCards(tempCards)
        } 

        setQuantity(event.target.value)
        //updating form
        productIDs.forEach( (product) => {
            // console.log(JSON.stringify(product) + "\n" + productID )
            if(product.value === productID){
                let q = form.quantities
                q[product.index] = event.target.value
    
                setForm( prevState => ({ 
                        ...prevState,
                        quantities: q
                }))
                console.log(form)
            }
        })
    }

    return(
        <Card sx={productCardStyle}>
            <FormControl id={"form " + card.id} sx={productFormStyle}>
                <FormControl>
                    <InputLabel id="productID">Product ID</InputLabel>
                    <Select
                        labelId="productID"
                        id="productID-select"
                        defaultValue=""
                        value={productID}
                        label="Product ID"
                        sx={productSelectStyle}
                        onChange={handleProductSelect}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {   
                            productIDs.map( (productID) => (
                                <MenuItem key={productID.index} value={productID.value}>{productID.value.slice(-4)}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                {
                    productInfo &&
                    <>
                        <p>ID : { productInfo.productID}</p>
                        <p>Product : { productInfo.productName}</p>
                        <p>Quantity : { productInfo.quantity}</p>
                    </>
                }
                {
                    productID &&
                        <TextField id="outlined-number" label="Quantity" type="number"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleQuantityChange}
                            sx={quantityInputStyle}
                        />
                }
            </FormControl>
            <div style={cardFeatureStyle}>
                <p><b>{index}</b></p>
                <Button sx={deleteButtonStyle} onClick={()=>{removeCard()}}>
                    <RemoveCircleOutlineIcon />
                </Button>
            </div>
        </Card>
    )
}

export default ProductCard