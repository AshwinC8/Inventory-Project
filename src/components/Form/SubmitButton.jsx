import { useContext, useState } from "react"
import { DataContext } from "../../context/DataProvider"
import { appendInventory, getProductInfo } from "../../util/GoogleSheetsFunctions"
import { useSession } from "@supabase/auth-helpers-react"
import { Dialog, DialogTitle } from "@mui/material"

const submitButtonStyle = {
    width: "50%",
    maxWidth: "300px",
    height: "50px",
    marginTop: 60,
    marginBottom: 20,
}

const dialogStyle= {
    paddingLeft: 25,
    paddingRight: 25,
    width: "auto",
    height: "auto",
}

function SubmitButton(){
    const session = useSession()
    const {form, productCards, setProductCards} = useContext(DataContext)
    const [open, setOpen] = useState(false)
    const [response, setResponse] = useState(false)
    
    const handleCheckoutOpen = () => {
        const newProductCards = productCards.filter((card) => card.quantity!=="" || card.quantity===null || card.quantity===0)
        setProductCards(newProductCards)
        setOpen(true)
    }
    
    const handleCheckoutClose = () => {
        setOpen(false); 

        // Reloading page may be better as cache gets cleared each time 
        // on the other hand if we reset product card states the transition may be smoother 
        window.location.reload(false);
    }

    function checkQuantities(){
        let check = false

        form.quantities.forEach( element => {
            if(element !== "" || element!==null || element!==0){
                check = true
            }
        })
        return check
    }

    const submitForm = async () => {
        const check = checkQuantities()
        if( form.storeName!=="" && check){

            const date = new Date().toLocaleString()

            //Promise well implemented
            async function getResponse(){
                return await appendInventory(session, date, form.storeName, form.quantities)
            }
            const value = getResponse().then((data) => {setResponse(data)})

            handleCheckoutOpen()
        }
        else{
            // console.log("form = \n" + JSON.stringify(form))
        }
    }

    return(
        <>
            <button style={submitButtonStyle} onClick={submitForm}>
                Submit
            </button>
            
            {/*Checkout box can organised if we define it as another component*/}
            <Dialog  onClose={handleCheckoutClose} open={open}>
                <DialogTitle style={{paddingBottom:0}}><b>CheckOut</b></DialogTitle>
                <div style={dialogStyle}>
                    {  response === true?
                        <>
                            <p><b>Status</b> : Successful Updation</p>
                            <p><b>Store</b> : {form.storeName}</p>
                            <p><b>Items Replenished</b>:</p>
                            {
                                productCards.map((card, index) => (
                                    <p key={card.id}><b>{index+1}</b> : {card.productID} -&gt; {card.productName} -&gt; {card.quantity}</p>     
                                ))
                            }
                        </>
                        :
                        <p><b>Status</b> : Updation <b>Loading</b> OR <b>Failed</b></p>
                    }
                </div>
            </Dialog>
        </>

    )
}

export default SubmitButton