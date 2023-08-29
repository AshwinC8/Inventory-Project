import { useContext, useEffect, useState } from "react"
import { Card, InputLabel, Select, MenuItem, FormControl, TextField, Button, Autocomplete, Box } from "@mui/material"
import { useSessionContext } from "@supabase/auth-helpers-react";
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
    display: "grid",
    gridTemplateColumns: "10% 65% 25%",
    gridTemplateRows: "50% 50%",
    gap: 1,
    px: 3
}

const productSelectStyle = {
    zIndex: 10,
    width:"100%",
}

const quantityInputStyle = {
    gridArea: "1/3/2/4",
    width: "100%"
}

const deleteButtonStyle = {
    maxheight: "200px",
    mx: 0.5,
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
    const { isLoading, session} = useSessionContext()
    const [ barcodePrefix, setBarcodePrefix] = useState("890615068")

    useEffect(() => {
        setProductID(card.productID)
        setQuantity(card.quantity)
    }, [])

    //debugging form updates
    useEffect(() => {
        console.log(form)
    }, [form])

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

    const handleProductSelect = (event, newInputValue) => {
        let selectedProduct = { value: "", formattedValue: newInputValue}
        if( newInputValue !== ""){
            const temp = productIDs.find(product => product.formattedValue === newInputValue)
            if( temp !== undefined){
                selectedProduct = temp
            }
        }
        console.log(selectedProduct)

        //ProductCards
        let index = productCards.findIndex( x => x.id === card.id )
        if( index !== -1 ){
            let tempCards = productCards.slice()
            tempCards[index].productID = selectedProduct.formattedValue
            setProductCards(tempCards)
        } 

        //productID
        setProductID(selectedProduct.formattedValue)
        

        //productInfo displayed in card
        async function updateProductInfo(){
            const value = await getProductInfo(session, selectedProduct.value)
            setProductInfo(value)
        }
        //conditions to set info
        if(selectedProduct.value === ""){
            setProductInfo(null)
        }else{
            updateProductInfo()
        }

        //updating form
        productIDs.forEach( (product) => {
            if(product.formattedValue === productID){
                let q = form.quantities.filter(() => true);
                q[product.index] = 0
    
                setForm( prevState => ({ 
                    ...prevState,
                    quantities: q
                }))
            }

            if(product.value === selectedProduct.value){
                let q = form.quantities.filter(() => true);
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
            if(product.formattedValue === productID){
                let q = form.quantities.filter(() => true);
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
                <p style={{
                        gridArea: "1/1/2/2",
                    }}
                >
                    <b>{index}</b>
                </p>
                <div 
                    style={{
                        gridArea: "1/2/2/3",
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                    }}
                >
                    {/* <p>{barcodePrefix}</p> */}
                    <Autocomplete
                            // id="productID-store"
                            sx={productSelectStyle}
                            inputValue={productID}
                            onInputChange={handleProductSelect}
                            options={productIDs}
                            getOptionLabel={(option) => option.formattedValue}
                            renderInput={(params) => <TextField {...params} label="Last 4 digits" />}
                    />
                </div>
                {/* <FormControl>
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
                </FormControl> */}
                {
                    productInfo &&
                    <>
                        <p style={{
                                gridArea: "2/1/3/4",
                                width: "100%",
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                        >
                            { productInfo.productID } -&gt; { productInfo.productName }
                        </p>
                    </>
                }
                {
                    productInfo &&
                        <TextField className="quantity-field" label="Qty" type="number"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={handleQuantityChange}
                            sx={quantityInputStyle}
                        />
                }
            </FormControl>
            <div style={cardFeatureStyle}>
                <Button sx={deleteButtonStyle} onClick={()=>{removeCard()}}>
                    <RemoveCircleOutlineIcon />
                </Button>
            </div>
        </Card>
    )
}

export default ProductCard