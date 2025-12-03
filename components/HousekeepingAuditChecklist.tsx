import React from "react";

// Tailwind CSS for bordered table and structured audit checklist
const auditChecklist = [
  {
    categoriy: "CORRIDORS / STAIRCASES / LIFTS",
    items: [
      "Walls, skirting and ceilings are clean",
      "Ducts, Grills and vents are dust free",
      "Windows, Glass & Mirror are clean",
      "Door & Handles are clean / No finger marks",
      "Electrical fixtures, appliances & Switchboards",
      "Handrails are free of dust and stains",
      "Lift / Staircases are clean",
      "Floor, Corners & edges are cleaned and spotless",
    ],
  },
  {
    categoriy: "RECEPTION & NURSING COUNTER",
    items: [
      "Walls, skirting and ceilings are clean",
      "Furniture & Fixtures are clean and dust free",
      "Soap Dispenser cleaned and refilled",
      "Hand Towel dispenser cleaned and refilled",
      "Wash Basin is cleaned and shiny",
      "Facial tissue are available",
      "Floor, Corners & edges are cleaned and spotless",
      "Waste Bins are cleaned and not overfilled",
    ],
  },
  {
    categoriy: "OFFICES / MEETING OR CONFERENCE ROOMS / DOCTOR'S ROOM",
    items: [
      "Door & Handles are clean / No finger marks",
      "Walls, skirting and ceilings are clean",
      "Windows, Glass & Mirror are clean",
      "Ducts, Grills and vents are dust free",
      "Furniture & Fixtures are clean and dust free",
      "Electrical fixtures, appliances& Switchboards",
      "Floor, Corners & edges are cleaned and spotless",
      "Spotless & shampooed carpet",
      "Waste Bins are cleaned and not overfilled",
      "Facial tissue are available",
    ],
  },
];

export default function HousekeepingAuditChecklist() {
  return (
    <div className="font-sans text-[#1a2d53] bg-white p-8 max-w-4xl mx-auto border border-gray-300">
      {/* Header & Logo row */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {/* Add your logo img here */}
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
          <span className="text-lg font-bold tracking-wide">
            Eurohealth Systems
          </span>
        </div>
        <span className="text-xl font-bold tracking-wide underline">
          HOUSEKEEPING AUDIT CHECKLIST
        </span>
        <div style={{ width: "80px" }} />
      </div>

      {/* Info row */}
      <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
        <div>
          <div>Base Location :</div>
          <div>Wart/Unit/Department:</div>
        </div>
        <div>
          <div>
            Inspected by: <span className="border-b border-gray-400"></span>
          </div>
          <div>
            Date: <span className="border-b border-gray-400"></span>
            &nbsp; Time: <span className="border-b border-gray-400"></span>
          </div>
        </div>
      </div>

      {/* Keys */}
      <div className="text-xs mb-2">
        <div>
          <span className="font-semibold underline">Measurable Standard</span>: Clean is defined as the area is free of dust, stains, rubbish and wetness, looks tidy, neat, orderly and is spotless.
        </div>
        <div className="grid grid-cols-2 gap-x-2 mt-1">
          <div>
            <span className="font-semibold">KEY:</span>
            <span className="ml-2">(✓) Met the Standard</span>
            <span className="ml-2">(✗) Didn't Meet the Standard</span>
            <span className="ml-2">(N/A) Not Applicable</span>
          </div>
          <div>
            <span className="font-semibold">Action Timeframe:</span>
            <span className="ml-2">Immediate (within 24 hrs.)</span>
            <span className="ml-2">Urgent (5 days)</span>
            <span className="ml-2">Ongoing (1 month)</span>
            <span className="ml-2">Open (un specified time due to financial, administrative or engineering constraints)</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-black text-[13px]">
          <thead>
            <tr className="bg-[#eaf1f8]">
              <th className="border border-black px-2 py-1 w-8">#</th>
              <th className="border border-black px-2 py-1 w-1/3">Elements</th>
              <th className="border border-black px-2 py-1">Comments</th>
              <th className="border border-black px-2 py-1 w-12">Out of</th>
              <th className="border border-black px-2 py-1 w-12">Score</th>
              <th className="border border-black px-2 py-1 w-28">Action timeframe</th>
              <th className="border border-black px-2 py-1 w-16">Action Taken Y/N</th>
            </tr>
          </thead>
          <tbody>
            {auditChecklist.map((categoriy, idx) => (
              <React.Fragment key={categoriy.categoriy}>
                {/* categoriy title row */}
                <tr>
                  <td className="border border-black px-2 py-1 font-bold" rowSpan={categoriy.items.length + 1}>
                    {idx + 1}
                  </td>
                  <td className="border border-black px-2 py-1 font-bold" colSpan={6}>
                    {categoriy.categoriy}
                  </td>
                </tr>
                {/* Items */}
                {categoriy.items.map((item, itemIdx) => (
                  <tr key={itemIdx}>
                    <td className="border border-black px-2 py-1">{item}</td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}