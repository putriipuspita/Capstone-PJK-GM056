import NavigasiLanding from './Navbar';
import BagianHero from './Hero';
import BagianFitur from './Fitur';
import BagianCaraKerja from './CaraKerja';
import BagianTestimoni from './Testimoni';

export default function HalamanUtamaLanding() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <NavigasiLanding />
      <BagianHero />
      <BagianFitur />
      <BagianCaraKerja />
      <BagianTestimoni />

      {/* Footer*/}
      <footer className="bg-navbar text-white py-3 px-[5%] text-center border-t border-white/5 relative z-10">
        <p className="opacity-60 text-[0.85rem]">
          &copy; Copyright Capstone Pijak 2026
        </p>
      </footer>
    </div>
  );
}
