import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import ProductsHandled from "../components/ProductsHandled";
import FreightTabs from "../components/FreightTabs";
import WhyChooseUs from "../components/WhyChooseUs";
import QuoteForm from "../components/QuoteForm";
import Tracking from "../components/Tracking";
import Footer from "../components/Footer";

function Home() {
    return (
        <main className="min-h-screen bg-white text-slate-950">
            <Navbar />
            <Hero />
            <Services />
            <About />
            <ProductsHandled />
            <FreightTabs />
            <WhyChooseUs />
            <QuoteForm />
            <Tracking />
            <Footer />
        </main>
    );
}

export default Home;