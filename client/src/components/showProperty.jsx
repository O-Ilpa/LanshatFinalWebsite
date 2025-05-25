import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";

const ShowMachine = () => {
  const [machine, setMachine] = useState();
  const [message, setMessage] = useState("");
  const navigator = useNavigate();

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  useEffect(() => {
    const getMachineWithId = async () => {
      try {
        const machineId = window.location.pathname.split("/")[2];
        const res = await axios.get(`${BACKAPI}/api/machines/${machineId}`);
        if (res.data) {
          setMachine(res.data);
        } else {
          setMessage("Machine not found.");
        }
      } catch (err) {
        setMessage(err.message);
      }
    };
    getMachineWithId();
  }, []);

  if (message !== "") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
            404 - Machine Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-6">{message}</p>
          <div
            onClick={() => navigator("/")}
            className="px-8 py-3 bg-[var(--bg-main)] hover:bg-[#375963] transition-all duration-200 rounded-full text-white font-semibold cursor-pointer"
          >
            Go Back to Home
          </div>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#ccc]">
        <div className="loader w-12 h-12 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-screen-md mx-auto p-6 pt-20 space-y-6">
        <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Machine Details</h2>
          <p className="text-gray-600">Type: {machine.machineType}</p>
          <p className="text-gray-600">Manufacturer: {machine.manufacturer}</p>
          <p className="text-gray-600">Model: {machine.model}</p>
          <p className="text-gray-600">Year: {machine.yearOfConstruction}</p>
          <p className="text-gray-600">Condition: {machine.condition}</p>
          <p className="text-gray-600">Description: {machine.description}</p>
        </div>

        <div className="text-center">
          <div
            onClick={() => navigator("/")}
            className="inline-block px-9 py-3 bg-[var(--bg-main)] hover:bg-[#375963] transition-all duration-200 rounded-full text-white font-semibold cursor-pointer"
          >
            Back to Home
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowMachine;
