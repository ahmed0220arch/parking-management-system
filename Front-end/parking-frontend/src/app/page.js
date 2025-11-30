"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Icons as components
const CarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
);

const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

// Images from your public folder
const localImages = [
  "/spot1.jpg",
  "/spot2.jpg",
  "/spot3.avif",
  "/spot4.jpg"
];

function ParkingCard({ spot, index, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  // Cycle through local images based on the spot index
  const imageSrc = localImages[index % localImages.length];

  const status = spot.occupied ? "occupied" : "available";

  const statusStyles = {
    available: "bg-accent/15 text-accent border-accent/30",
    occupied: "bg-destructive/15 text-destructive border-destructive/30",
    reserved: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  };

  const statusLabels = {
    available: "Available",
    occupied: "Occupied",
    reserved: "Reserved",
  };

  return (
    <div
      onClick={() => !spot.occupied && onSelect(spot)}
      className={`group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 ease-out ${!spot.occupied ? 'cursor-pointer' : 'cursor-not-allowed opacity-90'}`}
      style={{
        animationDelay: `${index * 100}ms`,
        transform: isHovered && !spot.occupied ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: isHovered && !spot.occupied ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)" : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={`Spot ${spot.spotNumber}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: isHovered && !spot.occupied ? "scale(1.1)" : "scale(1)",
          }}
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent transition-opacity duration-500"
          style={{ opacity: isHovered ? 1 : 0.6 }}
        />

        {/* Status Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 ${statusStyles[status]}`}
          style={{
            transform: isHovered ? "translateY(0)" : "translateY(-4px)",
            opacity: isHovered ? 1 : 0.9,
          }}
        >
          {statusLabels[status]}
        </div>

        {/* Animated Icon */}
        <div
          className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 transition-all duration-500"
          style={{
            transform: isHovered ? "rotate(0deg) scale(1)" : "rotate(-10deg) scale(0.9)",
          }}
        >
          <CarIcon className="h-5 w-5 text-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{spot.floor || "Ground Floor"}</span>
        </div>

        <h3
          className="text-xl font-semibold text-card-foreground tracking-tight transition-all duration-300"
          style={{
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
          }}
        >
          Spot {spot.spotNumber}
        </h3>

        {/* Animated underline */}
        <div
          className="mt-4 h-1 bg-accent rounded-full transition-all duration-500 ease-out"
          style={{
            width: isHovered ? "100%" : "0%",
          }}
        />
      </div>

      {/* Corner accent */}
      <div
        className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-accent/10 transition-all duration-700"
        style={{
          transform: isHovered ? "scale(3)" : "scale(1)",
        }}
      />
    </div>
  );
}

export default function Home() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [formData, setFormData] = useState({ 
    licensePlate: "", 
    model: "", 
    ownerName: "", 
    startTime: "", 
    endTime: "" 
  });
  const router = useRouter();

  const fetchSpots = () => {
    fetch("http://localhost:8081/api/spots")
      .then((res) => res.json())
      .then((data) => {
        setSpots(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetchSpots();
  }, [router]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const vehicleRes = await fetch("http://localhost:8081/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const vehicle = await vehicleRes.json();

      const bookingRes = await fetch(
        `http://localhost:8081/api/reservations?vehicleId=${vehicle.id}&spotId=${selectedSpot.id}&startTime=${formData.startTime}&endTime=${formData.endTime}`,
        { method: "POST" }
      );

      if (bookingRes.ok) {
        alert("Booking Successful!");
        setSelectedSpot(null);
        fetchSpots();
      } else {
        alert("Booking Failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-foreground">
                <CarIcon className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">ParkHub</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
              <a href="#" className="text-sm font-medium text-foreground">Spots</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Live Updates
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4 text-balance">
          Manage your parking
          <br />
          <span className="text-muted-foreground">with ease</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Real-time monitoring and management of all your parking spots in one place.
        </p>
      </section>

      {/* Cards Grid */}
      <section className="container mx-auto px-6 pb-20">
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot, index) => (
              <ParkingCard key={spot.id} spot={spot} index={index} onSelect={setSelectedSpot} />
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            
            <div className="bg-muted p-8 text-foreground relative overflow-hidden border-b border-border">
              <h2 className="text-2xl font-bold relative z-10">Confirm Booking</h2>
              <p className="text-muted-foreground mt-1 relative z-10">Spot {selectedSpot.spotNumber} • {selectedSpot.floor}</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Start Time</label>
                    <input 
                      type="datetime-local"
                      required 
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">End Time</label>
                    <input 
                      type="datetime-local"
                      required 
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vehicle Details</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      required 
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="License Plate"
                      onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                    />
                    <input 
                      required 
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      placeholder="Car Model"
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Owner Information</label>
                  <input 
                    required 
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="Full Name"
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setSelectedSpot(null)} 
                    className="flex-1 px-6 py-4 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all transform hover:-translate-y-0.5"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}