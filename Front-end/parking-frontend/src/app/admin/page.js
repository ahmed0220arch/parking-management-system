"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Icon components
const CarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
);

const ParkingCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
);

const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const PlusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
);

const PencilIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

const Trash2Icon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const XIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
);

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [spots, setSpots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ spotNumber: "", floor: "1", imageUrl: "" });
  const [editingSpot, setEditingSpot] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "ROLE_ADMIN") {
      alert("Access denied! Admin only.");
      router.push("/login");
      return;
    }
    
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [usersRes, spotsRes, reservationsRes] = await Promise.all([
        fetch("http://localhost:8081/api/users"),
        fetch("http://localhost:8081/api/spots"),
        fetch("http://localhost:8081/api/reservations")
      ]);
      
      const usersData = await usersRes.json();
      const spotsData = await spotsRes.json();
      const reservationsData = await reservationsRes.json();
      
      setUsers(usersData);
      setSpots(spotsData);
      setReservations(reservationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddSpot = async (e) => {
    e.preventDefault();
    if (!formData.spotNumber.trim()) return;

    try {
      if (editingSpot) {
        await fetch(`http://localhost:8081/api/spots/${editingSpot.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        setEditingSpot(null);
      } else {
        await fetch("http://localhost:8081/api/spots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setFormData({ spotNumber: "", floor: "1", imageUrl: "" });
      fetchData();
    } catch (error) {
      console.error("Error saving spot:", error);
    }
  };

  const handleEditSpot = (spot) => {
    setEditingSpot(spot);
    setFormData({ 
      spotNumber: spot.spotNumber, 
      floor: spot.floor.toString(), 
      imageUrl: spot.imageUrl || "" 
    });
  };

  const handleDeleteSpot = async (id) => {
    if (!confirm("Delete this spot?")) return;
    try {
      await fetch(`http://localhost:8081/api/spots/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting spot:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSpot(null);
    setFormData({ spotNumber: "", floor: "1", imageUrl: "" });
  };

  const handleDeleteReservation = async (id) => {
    if (!confirm("Delete this reservation? This will free up the parking spot.")) return;
    try {
      await fetch(`http://localhost:8081/api/reservations/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
            <CarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Parking Management System</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="border border-gray-200 bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spots</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{spots.length}</p>
                  <p className="mt-1 text-xs text-gray-500">Available parking spots</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <ParkingCircleIcon className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Registered Users</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{users.length}</p>
                  <p className="mt-1 text-xs text-gray-500">Active user accounts</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <UsersIcon className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Reservations</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{reservations.length}</p>
                  <p className="mt-1 text-xs text-gray-500">Currently parked vehicles</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <CalendarIcon className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Spot Form and Users Table */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Add Spot Form */}
          <div className="border border-gray-200 bg-white rounded-lg shadow-sm">
            <div className="p-6 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <PlusIcon className="h-5 w-5 text-emerald-500" />
                {editingSpot ? "Edit Spot" : "Add New Spot"}
              </h2>
            </div>
            <div className="p-6 pt-0">
              <form onSubmit={handleAddSpot} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="spotNumber" className="text-sm text-gray-600 block">
                      Spot Number
                    </label>
                    <input
                      id="spotNumber"
                      value={formData.spotNumber}
                      onChange={(e) => setFormData({...formData, spotNumber: e.target.value})}
                      placeholder="e.g., A-1"
                      className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="floor" className="text-sm text-gray-600 block">
                      Floor
                    </label>
                    <input
                      id="floor"
                      type="number"
                      min="1"
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                      className="w-full border border-gray-300 bg-white text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="imageUrl" className="text-sm text-gray-600 block">
                    Image URL (optional)
                  </label>
                  <input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                  >
                    {editingSpot ? "Update Spot" : "Add Spot"}
                  </button>
                  {editingSpot && (
                    <button 
                      type="button" 
                      onClick={handleCancelEdit} 
                      className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <XIcon className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-gray-200 bg-white rounded-lg shadow-sm">
            <div className="p-6 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <UsersIcon className="h-5 w-5 text-emerald-500" />
                Registered Users
              </h2>
            </div>
            <div className="p-6 pt-0">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Username</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "ROLE_ADMIN" 
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Parking Spots Table */}
        <div className="border border-gray-200 bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 pb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ParkingCircleIcon className="h-5 w-5 text-emerald-500" />
              Parking Spots
            </h2>
          </div>
          <div className="p-6 pt-0">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Spot Number</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Floor</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {spots.map((spot) => (
                    <tr key={spot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{spot.spotNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Floor {spot.floor}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditSpot(spot)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-emerald-500 hover:bg-gray-100 rounded inline-flex items-center justify-center transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSpot(spot.id)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded inline-flex items-center justify-center transition-colors"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active Reservations Table */}
        <div className="border border-gray-200 bg-white rounded-lg shadow-sm">
          <div className="p-6 pb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <CalendarIcon className="h-5 w-5 text-emerald-500" />
              Active Reservations
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {reservations.length} active
              </span>
            </h2>
          </div>
          <div className="p-6 pt-0">
            <div className="rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Spot</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Car Model</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">License Plate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Owner Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Start Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">End Time</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {reservation.parkingSpot?.spotNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <CarIcon className="h-4 w-4 text-gray-400" />
                          {reservation.vehicle?.model || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-900">
                          {reservation.vehicle?.licensePlate}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{reservation.vehicle?.ownerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(reservation.startTime).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(reservation.endTime).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteReservation(reservation.id)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded inline-flex items-center justify-center transition-colors"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}