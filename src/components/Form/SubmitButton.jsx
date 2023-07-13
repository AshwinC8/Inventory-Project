import { useContext } from "react"
import { DataContext } from "../../context/DataProvider"
import { appendInventory } from "../../util/GoogleSheetsFunctions"
import { useNavigate } from "react-router-dom"
import { useSession } from "@supabase/auth-helpers-react"
import { Alert } from "@mui/material"

const submitButtonStyle = {
    width: "50%",
    maxWidth: "300px",
    height: "50px",
    marginTop: 60,
    marginBottom: 20,
}

function SubmitButton(){
    const session = useSession()
    const navigate = useNavigate()
    const { productIDs, form, setForm} = useContext(DataContext)

    function checkQuantities(){
        let check = false

        form.quantities.forEach( element => {
            console.log(element)
            if(element !== ""){
                check = true
            }
        })
        return check
    }

    const submitForm = () => {
        const check = checkQuantities()
        console.log(check)
        if( form.storeName!=="" && check){
            console.log("form = \n" + JSON.stringify(form))
            const date = new Date().toLocaleString()
            appendInventory(session, date, form.storeName, form.quantities)
            window.location.reload(false)
        }
        else{
            console.log("form = \n" + JSON.stringify(form))
        }
    }

    return(
        <button style={submitButtonStyle} onClick={submitForm}>
            Submit
        </button>

    )
}

export default SubmitButton