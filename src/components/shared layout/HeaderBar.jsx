import { useSupabaseClient } from "@supabase/auth-helpers-react"
import LogoutIcon from '@mui/icons-material/Logout';

const headerStyle = {
    position: "-webkit-sticky", /* Safari */
    position: "sticky",
    top: "0",
    zIndex: "100",
    // overflow: "hidden",
    width : "100%",
    height : "70px",
    display : "flex",
    flexDirection : "row",
    justifyContent: "space-around",
    alignItems: "baseline",
    backgroundColor: "#3a6146"
}


function HeaderBar() {
    const supabase = useSupabaseClient()

    async function signOut(){
        await supabase.auth.signOut()
    }

    return (
        <div style={headerStyle}>
            <h2 style={{color:"white"}} className="navbar-title">Pure Nature Essentials</h2>
            <button style={{padding:"7px"}} onClick={()=>{signOut()}}> 
                <LogoutIcon/> 
            </button>
        </div>
    )
}

export default HeaderBar