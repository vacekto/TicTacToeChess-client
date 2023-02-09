interface ICrossSVGProps {

}

const CrossSVG: React.FC<ICrossSVGProps> = (props) => {

    return <svg viewBox="0 0 100 100" >
        <line x1="30" y1="30" x2="70" y2="70" strokeWidth="11" strokeLinecap="round" />
        <line x1="30" y1="70" x2="70" y2="30" strokeWidth="11" strokeLinecap="round" />
    </svg>;
};

export default CrossSVG;