import { useEffect, useState } from "react";
import { getRiskOverview } from "../api";
import StatCard from "../components/StatCard";
import StudentTable from "../components/StudentTable";
import PredictedGradeChart from "../components/PredictedGradeChart";

function Dashboard() {
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    getRiskOverview().then((res) => setRisk(res.data));
  }, []);

  if (!risk) return null;

  return (
    <div className="space-y-8">
      {/* SECTION: CLASS HEALTH */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Class Health Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="High Risk" value={risk["High Risk"]} color="red" />
          <StatCard title="Medium Risk" value={risk["Medium Risk"]} color="yellow" />
          <StatCard title="Low Risk" value={risk["Low Risk"]} color="green" />
        </div>
      </section>

      {/* SECTION: DISTRIBUTION */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Predicted Grade Distribution</h2>
        <PredictedGradeChart />
      </section>

      {/* SECTION: STUDENTS */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Students Requiring Academic Attention
        </h2>
        <StudentTable />
      </section>
    </div>
  );
}

export default Dashboard;
