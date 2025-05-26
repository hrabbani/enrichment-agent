import { useEffect, useState } from "react";
import { Lead } from "../types/types";
import axios from "axios";

const columns: { id: keyof Lead | "action"; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "company", label: "Company" },
  { id: "email", label: "Email" },
  { id: "domain", label: "Domain" },
  { id: "enriched_data", label: "Enriched Data" },
  { id: "action", label: "Action" },
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
  const [enrichingLeads, setEnrichingLeads] = useState<Set<string>>(new Set());
  const [enrichmentPrompt, setEnrichmentPrompt] = useState("");

  const enrichLead = async (leadId: string) => {
    if (!enrichmentPrompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    const leadToEnrich = leads.find((lead) => lead.id == leadId);

    setEnrichingLeads((current_state) => new Set(current_state).add(leadId));

    try {
      const response = await axios.post(
        `http://localhost:3000/api/leads/${leadId}/enrich`,
        {
          prompt: enrichmentPrompt,
          leadData: {
            name: leadToEnrich?.name,
            company: leadToEnrich?.company,
          },
        }
      );

      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === leadId ? response.data : lead))
      );
    } catch (err) {
      console.log("Error enriching lead", err);
    } finally {
      setEnrichingLeads((current_state) => {
        const newSet = new Set(current_state);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const enrichAllLeads = async () => {
    if (!enrichmentPrompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    await leads.map((lead) => enrichLead(lead.id));
  };

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

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) return <p>Fetching leads...</p>;

  return (
    <div>
      {/* Enrichment Controls */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enrichment Prompt
            </label>
            <input
              type="text"
              onChange={(e) => setEnrichmentPrompt(e.target.value)}
              placeholder="Enter enrichment instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={enrichAllLeads}
            disabled={!enrichmentPrompt.trim()}
          >
            Enrich All
          </button>
        </div>
      </div>
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
            <tr
              key={lead.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
            >
              {columns.map((column) => (
                <td className="px-6 py-4" key={column.id}>
                  {column.id === "action" ? (
                    <button
                      onClick={() => enrichLead(lead.id)}
                      disabled={
                        !enrichmentPrompt.trim() || enrichingLeads.has(lead.id)
                      }
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrichingLeads.has(lead.id) ? "Enriching..." : "Enrich"}
                    </button>
                  ) : (
                    lead[column.id as keyof Lead]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
