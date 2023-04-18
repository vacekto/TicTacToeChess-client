interface ICrossSVGProps {

}

const CrossSVG: React.FC<ICrossSVGProps> = () => {

    return <svg viewBox="0 0 100 100" className="CrossSVG">
        <line x1="10" y1="10" x2="90" y2="90" strokeWidth="14" strokeLinecap="round" />
        <line x1="10" y1="90" x2="90" y2="10" strokeWidth="14" strokeLinecap="round" />
    </svg>;
};

export default CrossSVG;