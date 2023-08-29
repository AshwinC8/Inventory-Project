import { useContext, useState } from "react"
import { DataContext } from "../../context/DataProvider"
import { appendInventory, getProductInfo } from "../../util/GoogleSheetsFunctions"
import { useSession } from "@supabase/auth-helpers-react"
import { Button, Dialog, DialogTitle } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

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

// function AlertBox(props){
//     const {onClose, open, message} = props
//     return(
//         <Dialog
//             open={open}
//             onClose={onClose}
//         >   <h1>meow</h1>
//             <Alert>{message}</Alert>
//         </Dialog>
//     )
// }

function SubmitButton(){
    const session = useSession()
    const {form, productCards, setProductCards} = useContext(DataContext)
    const [open, setOpen] = useState(false)
    const [response, setResponse] = useState(false)
    const [ alertOpen, setAlertOpen] = useState(false)
    let alertMessage = ""

    const handleAlertOpen = () => {
        setAlertOpen(true);
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    }

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
        const quantityFields = document.getElementsByClassName("quantity-field")
        console.log(quantityFields[0].children[1].children[0])
        const length = quantityFields.length



        for(let i=0; i<length ; i++){
            const value = quantityFields[i].children[1].children[0].value
            if(value!=="" && value!==null && value!==0){
                check = true
            }else {
                check = false
            }
        }

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
            const value = await getResponse().then((data) => {setResponse(data)})

            handleCheckoutOpen()
        }
        else{
            if(form.storeName===""){
                alert("Please select the Store Name")
                // handleAlertOpen()
                // alertMessage = "Please enter the Store Name"
            }
            else if(check===false){
                alert("Please fill in the Product Details")
                // handleAlertOpen()
                // alertMessage = "Please fill the Product details"
            }
            // console.log("form = \n" + JSON.stringify(form))
        }
    }

    return(
        <>
            <button style={submitButtonStyle} onClick={submitForm}>
                Submit
            </button>
            
            {/*Checkout box can organised if we define it as another component*/}
            <Dialog onClose={()=>{}} open={open}>
                <DialogTitle 
                    style = {{
                        paddingBottom: 0,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <b>CheckOut</b>
                    <Button 
                        style={{
                            maxHeight: "200px",
                            color: "black",
                            mx: 0,
                            p: 0,
                        }}
                        onClick={handleCheckoutClose}
                    >
                        <CloseIcon/>
                    </Button>
                </DialogTitle>
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
                {/* <AlertBox open={alertOpen} onClose={handleAlertClose} message={alertMessage}/> */}
            </Dialog>
        </>

    )
}

export default SubmitButton