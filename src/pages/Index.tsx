import Header from "@/components/Header";
import Hero from "@/sections/Hero";
import Gallery from "@/sections/Gallery";
import Trainer from "@/sections/Trainer";
import Plans from "@/sections/Plans";
import FAQ from "@/sections/FAQ";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Trainer />
        <Plans />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
