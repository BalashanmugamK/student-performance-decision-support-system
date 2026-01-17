// Clean Professional Dashboard UI for Student Performance Decision Support System
// Drop-in layout scaffold. Replace your App.js with this file (or adapt components paths).

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Upload, RefreshCcw, Users, ShieldAlert, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

// Your existing components (keep these paths)
import UploadDataset from "./components/UploadDataset";
import StudentSummary from "./components/StudentSummary";
import RiskOverview from "./components/RiskOverview";
import Recommendations from "./components/Recommendations";
import PredictedGradeChart from "./components/PredictedGradeChart";
import RiskChart from "./components/RiskChart";
import ClassCards from "./components/ClassCards";
import FeedbackAnalytics from "./components/FeedbackAnalytics";
import FeedbackSentimentChart from "./components/FeedbackSentimentChart";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-slate-700" />
            <h1 className="text-xl font-semibold">Student Performance Decision Support System</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2"><Upload className="h-4 w-4" />Upload</Button>
            <Button variant="outline" className="gap-2"><RefreshCcw className="h-4 w-4" />Reset</Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        {/* Left Column */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4"><Users className="h-5 w-5" /><h2 className="font-semibold">Upload Datasets</h2></div>
              <UploadDataset />
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4"><ShieldAlert className="h-5 w-5" /><h2 className="font-semibold">Risk Overview</h2></div>
              <RiskOverview />
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4"><MessageSquare className="h-5 w-5" /><h2 className="font-semibold">Recommendations</h2></div>
              <Recommendations />
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Student Summary</h2>
              <StudentSummary />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6"><h2 className="font-semibold mb-4">Predicted Grades</h2><PredictedGradeChart /></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6"><h2 className="font-semibold mb-4">Risk Distribution</h2><RiskChart /></CardContent></Card>
          </div>

          <Card className="rounded-2xl shadow-sm"><CardContent className="p-6"><h2 className="font-semibold mb-4">Class Cards</h2><ClassCards /></CardContent></Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6"><h2 className="font-semibold mb-4">Feedback Analytics</h2><FeedbackAnalytics /></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6"><h2 className="font-semibold mb-4">Sentiment</h2><FeedbackSentimentChart /></CardContent></Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
