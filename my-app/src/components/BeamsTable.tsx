"use client"
import { Beam } from "@/store"

export function BeamsTable({ beams }: { beams: Beam[] }) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">Beam Number</th>
          <th className="border px-4 py-2">Total Meters</th>
          <th className="border px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {beams.map((beam, i) => (
          <tr key={beam._id || i}>
            <td className="border px-4 py-2">{beam.beamNumber}</td>
            <td className="border px-4 py-2">{beam.totalMeters}</td>
            <td className="border px-4 py-2">
              <span className={`px-2 py-1 text-xs rounded ${
                beam.isClosed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {beam.isClosed ? 'Closed' : 'Open'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}