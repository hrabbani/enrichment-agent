import { useEffect, useState } from "react";
import { Lead } from "../types/types";
import axios from "axios";

const columns: { id: keyof Lead; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "company", label: "Company" },
  { id: "email", label: "Email" },
  { id: "domain", label: "Domain" },
  { id: "enriched_data", label: "Enriched Data" },
];

// const rows: Lead[] = [
//   {
//     id: "274a4e55-4e01-41f8-bfb3-4c7d36e2dabc",
//     name: "Humza Rabbani",
//     company: "Clay",
//     email: "humza.rabbani@gmail.com",
//     status: "new",
//     enriched_data: null,
//     created_at: "2025-05-05T21:55:31.197Z",
//     updated_at: "2025-05-05T21:55:31.197Z",
//   },
//   {
//     id: "2c323f16-c791-45b8-a320-2a301ab868a0",
//     name: "Raza Rabbani",
//     company: "Pivotal",
//     email: null,
//     status: "new",
//     enriched_data: null,
//     created_at: "2025-05-05T22:38:23.695Z",
//     updated_at: "2025-05-05T22:38:23.695Z",
//   },
// ];

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/leads");
        setLeads(response.data);
      } catch (err) {
        console.log("Error fetching leads", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) return <p>Fetching leads...</p>;

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {columns.map((column) => (
            <th scope="col" className="px-6 py-3" key={column.id}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            {columns.map((column) => (
              <td className="px-6 py-4" key={column.id}>
                {lead[column.id]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
