import '../styles/Watermark.css';
import logo from '../images/agLogo.png';

function Watermark() {
    return (
        <div className="watermark-container">
            <img src={logo} alt="Marca de agua" className="watermark-image" />
        </div>
    );
}

export default Watermark;
