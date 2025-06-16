import centinela from '../../assets/centinela-icon.svg';

const AuthLayout = () => {
return (
<div className="text-center text-white" >
        
    <div className="mb-8">
        <img src={centinela} alt="Centila Icon" className="w-90 mx-auto mb-4" />
    </div>
    
    <p className="text-xl mb-6">Monitoreo inteligente para tu negocio</p>
</div>
);
};

export default AuthLayout;