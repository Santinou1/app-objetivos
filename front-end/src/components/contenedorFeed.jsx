import { useParams } from "react-router-dom";
import Feed from "../pages/Feed";
import FeedCertificaciones from "../pages/FeedCertificaciones";
function ContenedorFeed(){
    const {tipo} = useParams();
    	
    return(
        <>
            {
                tipo === 'objetivos' ? <Feed/> : <FeedCertificaciones />
            }
        </>
    );
}
export default ContenedorFeed;