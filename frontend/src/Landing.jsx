import { ArrowRight, Brain, Target, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col pt-20 px-4 md:px-8 max-w-7xl mx-auto items-center text-center">
      {/* Premium Badge */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
        <Sparkles className="w-4 h-4" /> Now Powered by UCI Real-World Datasets
      </div>

      {/* Hero Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Predict Academic Future.<br/>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          With Pinpoint Precision.
        </span>
      </h1>

      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12">
        Nexus AI analyzes hyper-specific behavioral metrics—from sleep patterns to scholarship status—using an advanced Random Forest Regressor to forecast student trajectories in real-time.
      </p>

      {/* CTA Button */}
      <Link 
        to="/dashboard" 
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95 text-lg"
      >
        Launch Dashboard
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        <div className="absolute inset-0 -z-10 bg-white/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
        
        <div className="glass-panel p-8">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">What-If Insights</h3>
          <p className="text-gray-400 leading-relaxed">
            Toggle your weekly study hours or class participation and instantly see how the Random Forest model alters your forecasted trajectory.
          </p>
        </div>

        <div className="glass-panel p-8">
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">13-Factor Analysis</h3>
          <p className="text-gray-400 leading-relaxed">
            We've upgraded from synthetic 4-factor inputs to an intricate 13-feature correlation matrix derived from verified university demographic statistics.
          </p>
        </div>

        <div className="glass-panel p-8">
          <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Production Grade</h3>
          <p className="text-gray-400 leading-relaxed">
            Built on FastAPI and React with continuous background model retraining, ensuring enterprise-grade stability and hyper-fast inference.
          </p>
        </div>

      </div>
    </div>
  );
}
