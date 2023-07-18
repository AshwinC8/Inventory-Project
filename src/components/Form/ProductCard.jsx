import { useContext, useEffect, useState } from "react"
import { Card, InputLabel, Select, MenuItem, FormControl, TextField, Button, Autocomplete, Box } from "@mui/material"
import { useSession } from "@supabase/auth-helpers-react";
import { DataContext } from "../../context/DataProvider";
import { getProductInfo } from "../../util/GoogleSheetsFunctions";
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
    const [ productIDLabel, setProductIDLabel] = useState("")
    const [ productIDValue, setProductIDValue] = useState("")
    const session = useSession()

    useEffect(() => {
        setProductID(card.productID)
        setQuantity(card.quantity)
    }, [])

    //updates the card product name onto the card details(i.e productCards state)
    useEffect(() => {
        if(productInfo) {
            let index = productCards.findIndex( x => x.id === card.id )
            if( index !== -1 ){
                let tempCards = productCards.slice()
                tempCards[index].productName = productInfo.productName
                setProductCards(tempCards)
            } 
        }
    },[productInfo])
    
    
    function removeCard(){
        const updatedCards = productCards.filter(element => element.id !== card.id)
        setProductCards(updatedCards)
    }

    const handleProductSelect = (event) => {
        const newValue = { value : event.target.value }

        setProductIDValue(newValue)
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
            tempCards[index].productID = newValue.value
            setProductCards(tempCards)
        } 

        setProductID(newValue.value)
        
        //whyyy async
        async function updateProductInfo(){
            const value = await getProductInfo(session, newValue.value)
            setProductInfo(value)
        }
        updateProductInfo()

        //updating form
        productIDs.forEach( (product) => {
            if(product.value === productID){
                let q = form.quantities
                q[product.index] = 0
    
                setForm( prevState => ({ 
                    ...prevState,
                    quantities: q
                }))
            }

            if(product.value === newValue.value){
                let q = form.quantities
                q[product.index] = quantity
    
                setForm( prevState => ({ 
                    ...prevState,
                    quantities: q
                }))
            }
        })
    }


    const handleQuantityChange = (event) => {
        let index = productCards.findIndex( x => x.id === card.id )
        if( index !== -1 ){
            let tempCards = productCards.slice()
            tempCards[index].quantity = event.target.value 
            setProductCards(tempCards)
        } 

        setQuantity(event.target.value)

        //updating form
        productIDs.forEach( (product) => {
            if(product.value === productID){
                let q = form.quantities
                q[product.index] = event.target.value
    
                setForm( prevState => ({ 
                        ...prevState,
                        quantities: q
                }))
            }
        })
    }

    return(
        <Card sx={productCardStyle}>
            <FormControl id={"form " + card.id} sx={productFormStyle}>
                {/* <FormControl>
                    <Autocomplete
                        id="select-product"
                        sx={productSelectStyle}
                        // defaultValue={""}
                        value={productIDValue}
                        onChange={handleProductSelect}
                        inputValue={productIDLabel}
                        onInputChange={(event, newInputValue)=>{setProductIDLabel(newInputValue)}}
                        options={productIDs}
                        // isOptionEqualToValue={(option, value) => option === value}
                        getOptionSelected={(option) => option.formattedValue}
                        renderOption={(props, option) => (
                            <Box component='li' {...props}>
                                {option.formattedValue} 
                            </Box>
                        )}
                        renderInput={(params) => <TextField {...params} label="Last 4 digits of Barcode"/>}
                    />
                </FormControl> */}
                <FormControl>
                    <InputLabel id="productID">Last 4 digits of Barcode</InputLabel>
                    <Select
                        labelId="productID"
                        id="productID-select"
                        defaultValue=""
                        value={productID}
                        label="Last 4 digits of Barcode"
                        sx={productSelectStyle}
                        onChange={handleProductSelect}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {   
                            productIDs.map( (productID) => (
                                <MenuItem key={productID.index} value={productID.value}>{productID.formattedValue}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                {
                    productInfo &&
                    <>
                        <p>{ productInfo.productID } -&gt; { productInfo.productName }</p>
                        {/* <p><b>ID</b> : { productInfo.productID}</p>
                        <p><b>Product</b> : { productInfo.productName}</p>
                        <p><b>Quantity</b> : { productInfo.quantity}</p> */}
                    </>
                }
                {
                    productID &&
                        <TextField id="outlined-number" label="Quantity Replenished" type="number"
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