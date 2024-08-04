// dashboard/crowd/CrowdPage.jsx


"use client"

import React from "react";
import ShelterComponent from "../_components/ShelterComponent";
import LocationCards from "../_components/LocationCards";
import CrowdMapComponent from "../_components/CrowdMapComponent";

const CrowdPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 justify-center w-full px-[4%] py-[2%]">
      <div className="w-full col-span-1 md:col-span-2">
        <ShelterComponent />
      </div>
      <div className="w-full col-span-1 md:col-span-3">
        <CrowdMapComponent/>
      </div>
      <div className="w-full col-span-1 md:col-span-2">
        <LocationCards />
      </div>
    </div>
  );
};

export default CrowdPage;
