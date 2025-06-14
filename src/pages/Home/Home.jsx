import Navbar from "../../components/layout/NavegationBar/NavegationBar.jsx";
import HeroSection from "../../components/layout/Hero/HeroSection.jsx";
import FeaturesSection from "../../components/layout/Features/FeaturesSection.jsx";
import PricingSection from "../../components/layout/Pricing/PricingSection.jsx";
import NewsletterSection from "../../components/layout/Newsletter/NewsletterSection.jsx";
import ContactSection from "../../components/layout/Contact/ContactSection.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";


function Home() {
    return (
      <>
        <Navbar></Navbar>
        <main>
           <HeroSection></HeroSection>
          <FeaturesSection></FeaturesSection>
          <PricingSection></PricingSection> 
          <NewsletterSection></NewsletterSection>
          <ContactSection></ContactSection>
        </main>     
        <Footer></Footer>
      </>
    )
  
}

export default Home;