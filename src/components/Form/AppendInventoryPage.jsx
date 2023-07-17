import { Container, Grid } from '@mui/material';
import AppendForm from './AppendForm';
import { useContext, useEffect } from 'react';
import { DataContext } from '../../context/DataProvider';
import { getProductIDs } from '../../util/GoogleSheetsFunctions';
import { useSession } from '@supabase/auth-helpers-react';
import SubmitButton from './SubmitButton';

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "white"
}

function AppendInventoryPage(){
    const {  setProductIDs, setRemainingPIDs, setForm} = useContext(DataContext)
    const session = useSession()

    useEffect(() => {
        async function updateProductIDs(){
            const value = await getProductIDs(session)
            setProductIDs(value)
            setRemainingPIDs(value)

            //initialize form
            let init = [] 
            for(let i=0 ; i<value.length ; i++){
                init.push("")
            }
            setForm( prevState => ({ 
                    ...prevState,
                    quantities : init,
            }))
        }

        updateProductIDs()
    },[])

    return(
        <Container maxWidth="sm">
            <h2>Update Store</h2>
            <Grid style={containerStyle}>
                <AppendForm />       
                <SubmitButton/>
            </Grid>    
        </Container>
    )
}

export default AppendInventoryPage
