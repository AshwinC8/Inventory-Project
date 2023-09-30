import { Container, Grid } from '@mui/material';
import AppendForm from './AppendForm';
import { useContext, useEffect } from 'react';
import { DataContext } from '../../context/DataProvider';
import { getProductIDs } from '../../util/GoogleSheetsFunctions';
import { useSessionContext } from '@supabase/auth-helpers-react';
import SubmitButton from './SubmitButton';
import LatestUpdate from './latest_update/LatestUpdate';
import { GoTrueAdminApi } from '@supabase/supabase-js';
import ProductCards from './ProductCards';

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "white"
}

function AppendInventoryPage(){
    const { productCards, setProductIDs, setRemainingPIDs, form, setForm} = useContext(DataContext)
    const { isLoading, session } = useSessionContext()

    useEffect(() => {
        async function updateProductIDs(){
            // console.log(session)
            const values = await getProductIDs(session)
            setProductIDs(values)
            setRemainingPIDs(values)

            
            //initialize form
            let init = [] 
            for(let i=0 ; i<values.length ; i++){
                init.push(productInProductCards(values[i].formattedValue));
            }
            setForm( prevState => ({ 
                    ...prevState,
                    quantities : init,
            }))
        }

        function productInProductCards(productID){
            var result = "";

            productCards.forEach(element => {
                if( element.productID === productID ){
                    result = element.quantity;
                }
            });

            return result;
        }

        updateProductIDs();
    },[session]);

    return(
        <Container maxWidth="sm">
            {/* <h2>Update Store</h2> */}
            <Grid style={containerStyle}>
                <AppendForm />       
                <SubmitButton/>
                <hr style={{
                    width:"97%",
                }}/>
                <LatestUpdate/>
            </Grid>    
        </Container>
    )
}

export default AppendInventoryPage
