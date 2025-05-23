import LeadsTable from "../components/LeadsTable";
import LeadsForm from "../components/LeadsForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Leads
      <LeadsTable></LeadsTable>
      <LeadsForm />
    </div>
  );
}
