import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, CalendarCheck, Activity, ServerCrash, Zap, History, User, Building, Landmark, Bus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimatedNumber = ({ value, colorClass }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 800; // ms
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeProgress;
      
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className={`text-7xl font-bold tracking-tighter ${colorClass}`} style={{ fontFamily: "Inter, sans-serif" }}>
      {displayValue.toFixed(1)}
    </span>
  );
};

// Reusable components for inputs
const CustomSelect = ({ label, icon: Icon, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-gray-300 font-medium text-xs uppercase tracking-wider">
      {Icon && <Icon className="w-3.5 h-3.5 text-indigo-400"/>} {label}
    </label>
    <select 
      value={value} 
      onChange={onChange}
      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
    >
      {options.map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
    </select>
  </div>
);

const CustomToggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 hover:bg-black/40 transition-colors">
    <span className="text-gray-300 font-medium text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500"></div>
    </label>
  </div>
);

export default function Dashboard() {
  const [formData, setFormData] = useState({
    Student_Age: "19-22",
    Sex: "Female",
    High_School_Type: "State",
    Scholarship: "50%",
    Additional_Work: "Yes",
    Sports_activity: "No",
    Transportation: "Bus",
    Weekly_Study_Hours: 10,
    Attendance: "Always",
    Reading: "Yes",
    Notes: "Yes",
    Listening_in_Class: "Yes",
    Project_work: "No"
  });

  const [prediction, setPrediction] = useState(0);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [aiInsight, setAiInsight] = useState("Analyzing massive feature matrix for optimal strategy...");

  const fetchPrediction = async (data) => {
    const res = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.predicted_score;
  };

  useEffect(() => {
    fetch('http://localhost:8000/model-info')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Failed to fetch model info:", err));
      
    const saved = localStorage.getItem('predictionHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setError(null);
        const corePred = await fetchPrediction(formData);
        setPrediction(corePred);

        // --- "What If" Analysis Engine (Adapted for new features) ---
        const hypStudy = { ...formData, Weekly_Study_Hours: Math.min(formData.Weekly_Study_Hours + 5, 40) };
        const hypAtt = { ...formData, Attendance: "Always" };
        const hypSch = { ...formData, Scholarship: "100%" };
        
        const [predStudy, predAtt, predSch] = await Promise.all([
          fetchPrediction(hypStudy),
          formData.Attendance !== "Always" ? fetchPrediction(hypAtt) : Promise.resolve(corePred),
          formData.Scholarship !== "100%" ? fetchPrediction(hypSch) : Promise.resolve(corePred)
        ]);

        const studyDelta = predStudy - corePred;
        const attDelta = predAtt - corePred;
        const schDelta = predSch - corePred;

        if (corePred >= 95) {
          setAiInsight("You're in the elite bracket! At this rate you're statistically guaranteed an AA.");
        } else if (attDelta > studyDelta && attDelta > schDelta && attDelta > 1.0) {
          setAiInsight(`Focus on class! Switching attendance to 'Always' boosts your score by +${attDelta.toFixed(1)} pts.`);
        } else if (studyDelta > 1.0 && studyDelta > schDelta) {
          setAiInsight(`Hit the books! 5 more study hours/week adds +${studyDelta.toFixed(1)} pts to your score.`);
        } else if (schDelta > 1.0) {
           setAiInsight(`Financial stability matters. Securing a 100% scholarship would organically boost performance predictives by +${schDelta.toFixed(1)} pts.`);
        } else if (formData.Notes === "No" || formData.Listening_in_Class === "No") {
           setAiInsight("Start taking active notes and listening in class. Small habits radically alter the Random Forest trajectory.");
        } else {
          setAiInsight("Your inputs are stable. Focus on minor iterative improvements across reading and projects.");
        }

      } catch (err) {
        setError("Unable to connect to ML prediction server.");
      }
    }, 400); 
    return () => clearTimeout(timer);
  }, [formData]);

  const saveToHistory = () => {
    if (prediction > 0) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newEntry = { ...formData, prediction: parseFloat(prediction.toFixed(1)), time, id: Date.now() };
      const updated = [newEntry, ...history].slice(0, 10);
      setHistory(updated);
      localStorage.setItem('predictionHistory', JSON.stringify(updated));
    }
  };

  const featureData = metrics?.feature_importance 
    ? Object.keys(metrics.feature_importance).slice(0, 10).map(k => ({
        name: k.replace('_', ' '),
        value: Number((metrics.feature_importance[k] * 100).toFixed(1))
      }))
    : [];

  const getScoreColor = (score) => {
    if (score >= 87) return 'text-emerald-400'; // BA and above
    if (score >= 70) return 'text-yellow-400'; // CC and above
    return 'text-red-400'; // DC and below
  };
  
  const getScoreGlow = (score) => {
    if (score >= 87) return 'bg-emerald-500/20';
    if (score >= 70) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return "AA";
    if (score >= 85) return "BA";
    if (score >= 80) return "BB";
    if (score >= 75) return "CB";
    if (score >= 70) return "CC";
    if (score >= 65) return "DC";
    if (score >= 60) return "DD";
    return "Fail";
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-xl backdrop-blur-md z-50 relative">
          <p className="text-gray-300 font-semibold text-sm">{payload[0].payload.name}</p>
          <p className="text-indigo-400 text-xs mt-1">Impact factor: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel p-6 -mt-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
               Nexus ML
             </h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Real-time prediction trained on UCI dataset</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4 items-center">
          <Link to="/" className="text-gray-400 hover:text-white text-sm font-medium mr-4 transition-colors">← Back to Home</Link>
          {metrics && (
            <div className="flex gap-4 text-xs font-mono text-gray-300">
              <span className="bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                R² {parseFloat(metrics.metrics.R2).toFixed(3)}
              </span>
              <span className="bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                {metrics.best_model} Engine
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SCROLLABLE INPUTS */}
        <div className="xl:col-span-4 glass-panel p-6 flex flex-col gap-5 h-full max-h-[800px] overflow-y-auto stylish-scrollbar">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-4 flex items-center gap-2 shrink-0">
            <Activity className="w-5 h-5 text-indigo-400"/>
            Demographics & Academic Inputs
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect label="Age Bracket" icon={User} value={formData.Student_Age} onChange={(e) => setFormData({...formData, Student_Age: e.target.value})} options={["18", "19-22", "23-27"]} />
            <CustomSelect label="Gender" icon={User} value={formData.Sex} onChange={(e) => setFormData({...formData, Sex: e.target.value})} options={["Male", "Female"]} />
            <CustomSelect label="High School" icon={Building} value={formData.High_School_Type} onChange={(e) => setFormData({...formData, High_School_Type: e.target.value})} options={["State", "Private", "Other"]} />
            <CustomSelect label="Scholarship" icon={Landmark} value={formData.Scholarship} onChange={(e) => setFormData({...formData, Scholarship: e.target.value})} options={["None", "25%", "50%", "75%", "100%"]} />
            <CustomSelect label="Attendance" icon={CalendarCheck} value={formData.Attendance} onChange={(e) => setFormData({...formData, Attendance: e.target.value})} options={["Always", "Sometimes", "Never"]} />
            <CustomSelect label="Transport" icon={Bus} value={formData.Transportation} onChange={(e) => setFormData({...formData, Transportation: e.target.value})} options={["Bus", "Private"]} />
          </div>

          <div className="space-y-3 mt-2">
             <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-gray-300 font-medium uppercase tracking-wider text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400"/> Weekly Study Hours
                </label>
                <div className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {formData.Weekly_Study_Hours}h
                </div>
              </div>
              <input type="range" min="0" max="40" step="1"
                value={formData.Weekly_Study_Hours}
                onChange={(e) => setFormData({...formData, Weekly_Study_Hours: parseFloat(e.target.value)})}
                className="w-full transition-all"
                style={{ backgroundSize: `${(formData.Weekly_Study_Hours / 40) * 100}% 100%` }}
              />
          </div>

          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mt-4 mb-1">Behavioral Toggles</p>
          <div className="grid grid-cols-2 gap-3">
             <CustomToggle label="Takes Notes" checked={formData.Notes === "Yes"} onChange={(e) => setFormData({...formData, Notes: e.target.checked ? "Yes" : "No"})} />
             <CustomToggle label="Listens in Class" checked={formData.Listening_in_Class === "Yes"} onChange={(e) => setFormData({...formData, Listening_in_Class: e.target.checked ? "Yes" : "No"})} />
             <CustomToggle label="Reads Regularly" checked={formData.Reading === "Yes"} onChange={(e) => setFormData({...formData, Reading: e.target.checked ? "Yes" : "No"})} />
             <CustomToggle label="Plays Sports" checked={formData.Sports_activity === "Yes"} onChange={(e) => setFormData({...formData, Sports_activity: e.target.checked ? "Yes" : "No"})} />
             <CustomToggle label="Works Job" checked={formData.Additional_Work === "Yes"} onChange={(e) => setFormData({...formData, Additional_Work: e.target.checked ? "Yes" : "No"})} />
             <CustomToggle label="Does Projects" checked={formData.Project_work === "Yes"} onChange={(e) => setFormData({...formData, Project_work: e.target.checked ? "Yes" : "No"})} />
          </div>

          <button 
            onClick={saveToHistory}
            className="w-full mt-6 py-3 shrink-0 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 border border-indigo-400/50 font-bold text-white transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            <History className="w-4 h-4"/> Snapshot
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 flex flex-col justify-between relative overflow-hidden h-64 border-t-2 border-t-indigo-400/30 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
              <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-colors duration-1000 ${getScoreGlow(prediction)}`}></div>
              
              <div className="flex justify-between items-start z-10">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Expected Target Outcome</p>
                <div className="px-3 py-1 bg-black/60 rounded-lg border border-white/10 font-mono text-xl font-bold text-white drop-shadow-md">
                   Grade: {getLetterGrade(prediction)}
                </div>
              </div>
              
              {error ? (
                  <div className="flex items-center gap-3 text-red-400 bg-red-900/30 p-4 rounded-xl z-10 border border-red-500/20 backdrop-blur-sm">
                    <ServerCrash className="w-6 h-6"/> {error}
                  </div>
              ) : (
                  <div className="flex items-baseline gap-2 z-10 drop-shadow-xl my-3">
                    <AnimatedNumber value={prediction} colorClass={`drop-shadow-2xl ${getScoreColor(prediction)}`} />
                    <span className="text-xl text-gray-500 font-medium">pts</span>
                  </div>
              )}

               <div className="z-10 bg-black/40 px-4 py-2 rounded-lg border border-white/5 inline-block self-start tabular-nums">
                {prediction >= 80 ? <span className="text-emerald-400 font-medium flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Solid Trajectory</span>
                  : prediction >= 60 ? <span className="text-yellow-400 font-medium flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div> Passing, but at risk</span> 
                  : <span className="text-red-400 font-medium flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Failing Trajectory</span>}
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col h-64 relative bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 border border-indigo-500/30">
                  <Zap className="w-5 h-5"/>
                </div>
                <h3 className="text-gray-200 font-bold tracking-wide">AI Strategy Insight</h3>
              </div>
              
              <div className="flex-1 flex items-center">
                <p className="text-lg text-indigo-100 font-medium leading-relaxed italic border-l-2 border-indigo-500/50 pl-4 py-2">
                  "{aiInsight}"
                </p>
              </div>
              <p className="text-gray-500 text-xs mt-auto font-mono uppercase">What-if Engine Active</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
            <div className="lg:col-span-2 glass-panel p-5 flex flex-col h-full">
              <h3 className="text-gray-300 text-sm font-bold mb-4 tracking-wide uppercase pl-2">Top 10 Feature Drivers</h3>
              <div className="flex-1 w-full min-h-0">
                {featureData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={140} axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                         {featureData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500 text-sm animate-pulse">Synchronizing Model Weights...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-5 flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-300 text-sm font-bold tracking-wide uppercase">Audit Log</h3>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 font-mono">{history.length}/10</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 stylish-scrollbar">
                {history.length > 0 ? history.map((item) => (
                  <div key={item.id} className="bg-black/30 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono text-gray-500">{item.time}</span>
                      <span className={`font-bold text-lg ${getScoreColor(item.prediction)}`}>{item.prediction}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                      <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{item.Student_Age}</span>
                      <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Std: {item.Weekly_Study_Hours}h</span>
                      <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Att: {item.Attendance}</span>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-2 opacity-50">
                    <History className="w-8 h-8"/>
                    <p className="text-sm">Snapshots will appear here</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
