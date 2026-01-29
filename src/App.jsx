import React, { useState, useMemo } from "react";

// Medical plans - unchanged from original
const medicalPlans = [
  { carrier: "Health Net", tier: "Silver", plan: "Silver PPO 2500/50", deductible: "$2,500/$5,000", oop: "$9,200/$18,400", pcp: "$50", specialist: "$75", hospital: "40%", eeRate: 5798.26, depRate: 526.45 },
  { carrier: "Anthem BC", tier: "Silver", plan: "Silver PPO 55/2500/45%", deductible: "$2,500/$5,000", oop: "$8,700/$17,400", pcp: "$55", specialist: "$90", hospital: "45%", eeRate: 5814.54, depRate: 527.92 },
  { carrier: "UnitedHealthcare", tier: "Silver", plan: "Select Plus Silver 65/2550/60%", deductible: "$2,550/$5,100", oop: "$9,900/$19,800", pcp: "$65", specialist: "$95", hospital: "40%", eeRate: 5917.2, depRate: 537.24 },
  { carrier: "CaliforniaChoice", tier: "Silver", plan: "Silver PPO C Anthem", deductible: "$1,700/$3,400", oop: "$9,100/$18,200", pcp: "$50", specialist: "$95", hospital: "40%", eeRate: 6142.65, depRate: 557.71 },
  { carrier: "Blue Shield", tier: "Silver", plan: "Silver Full PPO 2550/75", deductible: "$2,550/$5,100", oop: "$9,700/$19,400", pcp: "$75", specialist: "$85", hospital: "40%", eeRate: 6270.28, depRate: 569.3 },
  { carrier: "Covered CA", tier: "Silver", plan: "BSCA Silver 70 PPO 2500/55", deductible: "$2,500/$5,000", oop: "$8,600/$17,200", pcp: "$55", specialist: "$90", hospital: "35%", eeRate: 6814.67, depRate: 618.73 },
  { carrier: "Health Net", tier: "Gold", plan: "Gold PPO 350/25", deductible: "$350/$700", oop: "$7,800/$15,600", pcp: "$25", specialist: "$50", hospital: "20%", eeRate: 6843.43, depRate: 621.34 },
  { carrier: "UnitedHealthcare", tier: "Gold", plan: "Select Plus Gold 35/500/80%", deductible: "$500/$1,000", oop: "$8,800/$17,600", pcp: "$35", specialist: "$65", hospital: "20%", eeRate: 6997.82, depRate: 635.36 },
  { carrier: "Anthem BC", tier: "Gold", plan: "Gold PPO 30/500/20%", deductible: "$500/$1,500", oop: "$7,900/$15,800", pcp: "$30", specialist: "$60", hospital: "20%", eeRate: 7110.8, depRate: 645.62 },
  { carrier: "Blue Shield", tier: "Gold", plan: "Gold Full PPO 500/30", deductible: "$500/$1,000", oop: "$7,900/$15,800", pcp: "$30", specialist: "$60", hospital: "20%", eeRate: 7395.16, depRate: 671.43 },
  { carrier: "CaliforniaChoice", tier: "Gold", plan: "Gold PPO E Anthem", deductible: "$500/$1,500", oop: "$7,700/$15,400", pcp: "$30", specialist: "$60", hospital: "20%", eeRate: 7424.62, depRate: 674.11 },
  { carrier: "Covered CA", tier: "Gold", plan: "BSCA Gold 80 PPO 350/25", deductible: "$350/$700", oop: "$7,800/$15,600", pcp: "$25", specialist: "$50", hospital: "20%", eeRate: 7762.37, depRate: 704.78 },
  { carrier: "Health Net", tier: "Platinum", plan: "Platinum PPO 0/15", deductible: "$0/$0", oop: "$4,500/$9,000", pcp: "$15", specialist: "$30", hospital: "10%", eeRate: 7840.65, depRate: 711.88 },
  { carrier: "Anthem BC", tier: "Platinum", plan: "Platinum PPO 15/40/10%", deductible: "$0/$0", oop: "$3,800/$7,600", pcp: "$15", specialist: "$40", hospital: "10%", eeRate: 8103.73, depRate: 735.77 },
  { carrier: "UnitedHealthcare", tier: "Platinum", plan: "Select Plus Platinum 15/90%", deductible: "$0/$0", oop: "$4,800/$9,600", pcp: "$15", specialist: "$30", hospital: "10%", eeRate: 8286.99, depRate: 752.41 },
  { carrier: "CaliforniaChoice", tier: "Platinum", plan: "Platinum PPO B Anthem", deductible: "$0/$0", oop: "$5,000/$10,000", pcp: "$10", specialist: "$35", hospital: "10%", eeRate: 8449.81, depRate: 767.19 },
  { carrier: "Blue Shield", tier: "Platinum", plan: "Platinum Full PPO 0/10", deductible: "$0/$0", oop: "$4,700/$9,400", pcp: "$10", specialist: "$45", hospital: "10%", eeRate: 8509.02, depRate: 772.57 },
  { carrier: "Covered CA", tier: "Platinum", plan: "BSCA Platinum 90 PPO 0/15", deductible: "$0/$0", oop: "$4,500/$9,000", pcp: "$15", specialist: "$30", hospital: "10%", eeRate: 8684.11, depRate: 788.46 },
];

// BEAM DENTAL PLANS - Contributory (55% EE contribution required)
const dentalPlansContributory = [
  { carrier: "Beam", plan: "SmartPremium Plus 100/80/50-1000", preventive: "100%", basic: "80%", major: "50%", ortho: "N/A", annualMax: "$1,000", deductible: "$50/$150", eeRate: 59.74, esRate: 119.48, ecRate: 173.52, famRate: 233.26 },
  { carrier: "Beam", plan: "SmartPremium Select 100/90/60-2000", preventive: "100%", basic: "90%", major: "60%", ortho: "N/A", annualMax: "$2,000", deductible: "$50/$150", eeRate: 76.74, esRate: 153.48, ecRate: 210.59, famRate: 287.33 },
  { carrier: "Beam", plan: "SmartPremium Ultra 100/100/60-5000", preventive: "100%", basic: "100%", major: "60%", ortho: "N/A", annualMax: "$5,000", deductible: "$25/$75", eeRate: 85.90, esRate: 171.80, ecRate: 230.72, famRate: 316.62 },
];

// BEAM DENTAL PLANS - Voluntary (0% contribution required)
const dentalPlansVoluntary = [
  { carrier: "Beam", plan: "SmartPremium Plus 100/80/50-1000", preventive: "100%", basic: "80%", major: "50%", ortho: "N/A", annualMax: "$1,000", deductible: "$50/$150", eeRate: 60.97, esRate: 121.94, ecRate: 179.21, famRate: 240.18 },
  { carrier: "Beam", plan: "SmartPremium Select 100/90/60-2000", preventive: "100%", basic: "90%", major: "60%", ortho: "N/A", annualMax: "$2,000", deductible: "$50/$150", eeRate: 78.38, esRate: 156.75, ecRate: 217.69, famRate: 296.06 },
  { carrier: "Beam", plan: "SmartPremium Ultra 100/100/60-5000", preventive: "100%", basic: "100%", major: "60%", ortho: "N/A", annualMax: "$5,000", deductible: "$25/$75", eeRate: 87.77, esRate: 175.55, ecRate: 238.59, famRate: 326.36 },
];

// BEAM VISION PLANS - Contributory (55% EE contribution required)
const visionPlansContributory = [
  { carrier: "Beam/VSP", plan: "VSP Choice Plan #2 ($150)", exam: "$10", frames: "$150", contacts: "$150", eeRate: 10.72, esRate: 21.43, ecRate: 22.51, famRate: 35.85 },
  { carrier: "Beam/VSP", plan: "VSP Choice Plan #3 ($200)", exam: "$10", frames: "$200", contacts: "$200", eeRate: 12.46, esRate: 24.94, ecRate: 25.99, famRate: 41.47 },
];

// BEAM VISION PLANS - Voluntary (0% contribution required)
const visionPlansVoluntary = [
  { carrier: "Beam/VSP", plan: "VSP Choice Plan #2 ($150)", exam: "$10", frames: "$150", contacts: "$150", eeRate: 10.83, esRate: 21.65, ecRate: 22.73, famRate: 36.21 },
  { carrier: "Beam/VSP", plan: "VSP Choice Plan #3 ($200)", exam: "$10", frames: "$200", contacts: "$200", eeRate: 12.58, esRate: 25.20, ecRate: 26.24, famRate: 41.90 },
];

const employees = [
  { name: "Matt Ayres", age: 51, tier: "EE", depCount: 0 },
  { name: "John-Paul Pavao", age: 31, tier: "EE", depCount: 0 },
  { name: "Zulema Morales-Sandoval", age: 24, tier: "EE", depCount: 0 },
  { name: "Bryce Heringer", age: 51, tier: "EE", depCount: 0 },
  { name: "Brian Wong", age: 50, tier: "EE", depCount: 0 },
  { name: "Melissa Wong", age: 50, tier: "EC", depCount: 1 },
];

const medicalRatesByAge = {
  "Health Net": { "Silver": { 51: 1142.98, 31: 710.30, 24: 612.86, 50: 1094.57 }, "Gold": { 51: 1349.01, 31: 838.34, 24: 723.33, 50: 1291.87 }, "Platinum": { 51: 1545.59, 31: 960.50, 24: 828.73, 50: 1480.12 } },
  "Anthem BC": { "Silver": { 51: 1146.19, 31: 712.30, 24: 614.58, 50: 1097.64 }, "Gold": { 51: 1401.72, 31: 871.09, 24: 751.59, 50: 1342.34 }, "Platinum": { 51: 1597.45, 31: 992.73, 24: 856.54, 50: 1529.78 } },
  "Blue Shield": { "Silver": { 51: 1236.03, 31: 768.13, 24: 662.75, 50: 1183.67 }, "Gold": { 51: 1457.77, 31: 905.93, 24: 781.65, 50: 1396.02 }, "Platinum": { 51: 1677.34, 31: 1042.38, 24: 899.38, 50: 1606.29 } },
  "CaliforniaChoice": { "Silver": { 51: 1210.87, 31: 752.49, 24: 649.26, 50: 1159.58 }, "Gold": { 51: 1463.58, 31: 909.54, 24: 784.76, 50: 1401.58 }, "Platinum": { 51: 1665.67, 31: 1035.13, 24: 893.12, 50: 1595.11 } },
  "Covered CA": { "Silver": { 51: 1343.34, 31: 834.82, 24: 720.29, 50: 1286.44 }, "Gold": { 51: 1530.16, 31: 950.91, 24: 820.46, 50: 1465.34 }, "Platinum": { 51: 1711.86, 31: 1063.83, 24: 917.88, 50: 1639.34 } },
  "UnitedHealthcare": { "Silver": { 51: 1166.43, 31: 724.87, 24: 625.43, 50: 1117.02 }, "Gold": { 51: 1379.45, 31: 857.25, 24: 739.65, 50: 1321.01 }, "Platinum": { 51: 1633.57, 31: 1015.18, 24: 875.91, 50: 1564.38 } },
};

const medicalDepRates = {
  "Health Net": { "Silver": 526.45, "Gold": 621.34, "Platinum": 711.88 },
  "Anthem BC": { "Silver": 527.92, "Gold": 645.62, "Platinum": 735.77 },
  "Blue Shield": { "Silver": 569.30, "Gold": 671.43, "Platinum": 772.57 },
  "CaliforniaChoice": { "Silver": 557.71, "Gold": 674.11, "Platinum": 767.19 },
  "Covered CA": { "Silver": 618.73, "Gold": 704.78, "Platinum": 788.46 },
  "UnitedHealthcare": { "Silver": 537.24, "Gold": 635.36, "Platinum": 752.41 },
};

// Proposal document links
const proposalDocuments = [
  { title: "Executive Summary", description: "Benefits package overview", url: "#", icon: "📋" },
  { title: "Medical Comparison", description: "Side-by-side plan analysis", url: "#", icon: "🏥" },
  { title: "Dental & Vision", description: "Beam coverage details", url: "#", icon: "🦷" },
  { title: "Implementation", description: "Key dates and timeline", url: "#", icon: "📅" },
  { title: "Compliance", description: "ACA & ERISA requirements", url: "#", icon: "✅" },
];

const tierColors = {
  Silver: { badge: "bg-slate-500" },
  Gold: { badge: "bg-amber-500" },
  Platinum: { badge: "bg-violet-500" },
};

const formatCurrency = (num) => num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

// Section Header Component
function SectionHeader({ icon, title, subtitle, color = "slate", badge = null }) {
  const colors = {
    slate: "text-slate-300",
    blue: "text-blue-400",
    pink: "text-pink-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex items-center gap-3">
          <h2 className={`text-xl font-semibold ${colors[color]}`}>{title}</h2>
          {badge}
        </div>
      </div>
      {subtitle && <p className="text-sm text-slate-500 ml-10">{subtitle}</p>}
      <div className={`h-px bg-gradient-to-r from-${color}-500/50 to-transparent mt-2`}></div>
    </div>
  );
}

// Confirmation Modal Component
function ConfirmationModal({ isOpen, onClose, selections, costs, dentalType, visionType }) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl border-2 border-emerald-500 shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">Selection Confirmed!</h3>
          <p className="text-slate-400 mb-6">
            Thank you for confirming your benefits selections. Your broker will be in touch within 1 business day.
          </p>
          <button
            onClick={() => { setIsSubmitted(false); onClose(); }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-600 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-semibold text-white">Confirm Your Selections</h3>
              <p className="text-slate-400 mt-1">Review your choices and submit to proceed</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Selected Plans</h4>
          <div className="space-y-3">
            {selections.medical ? (
              <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-700">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                  <div>
                    <p className="font-medium text-white">Medical</p>
                    <p className="text-sm text-slate-400">{selections.medical.carrier} {selections.medical.tier}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600 text-slate-500">
                No medical plan selected
              </div>
            )}

            {selections.dental ? (
              <div className="p-3 rounded-lg bg-pink-900/30 border border-pink-700">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                  <div>
                    <p className="font-medium text-white">Dental <span className={`text-xs px-1.5 py-0.5 rounded ml-2 ${dentalType === "contributory" ? "bg-emerald-700" : "bg-amber-700"}`}>{dentalType}</span></p>
                    <p className="text-sm text-slate-400">{selections.dental.plan}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600 text-slate-500">
                No dental plan selected
              </div>
            )}

            {selections.vision ? (
              <div className="p-3 rounded-lg bg-cyan-900/30 border border-cyan-700">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                  <div>
                    <p className="font-medium text-white">Vision <span className={`text-xs px-1.5 py-0.5 rounded ml-2 ${visionType === "contributory" ? "bg-emerald-700" : "bg-amber-700"}`}>{visionType}</span></p>
                    <p className="text-sm text-slate-400">{selections.vision.plan}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600 text-slate-500">
                No vision plan selected
              </div>
            )}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-slate-900/50 border border-slate-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Monthly Employer Cost</p>
                <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(costs.employerMonthly)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Annual Employer Cost</p>
                <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(costs.employerMonthly * 12)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Your Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Full Name *</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email Address *</label>
              <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Questions or Notes (Optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any questions or special requests?" rows={3}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="p-6 flex gap-4">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors">
            Go Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!clientName || !clientEmail || (!selections.medical && !selections.dental && !selections.vision) || isSubmitting}
            className="flex-1 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Selections
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContributionSlider({ label, value, onChange, color, compact = false }) {
  return (
    <div className={compact ? "flex-1 min-w-[140px]" : "flex-1 min-w-[200px]"}>
      <div className="flex justify-between items-center mb-1">
        <label className={`text-xs uppercase tracking-wider ${color}`}>{label}</label>
        <span className={`font-medium ${compact ? 'text-sm' : 'text-lg'}`}>{value}%</span>
      </div>
      <input type="range" min="0" max="100" step="5" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
    </div>
  );
}

function ContributionSection({ title, color, eeValue, depValue, onEeChange, onDepChange, borderColor }) {
  return (
    <div className={`p-4 rounded-lg bg-slate-800/40 border-2 ${borderColor} shadow-lg`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      </div>
      <div className="flex gap-4">
        <ContributionSlider label="EE" value={eeValue} onChange={onEeChange} color="text-emerald-400" compact />
        <ContributionSlider label="Dep" value={depValue} onChange={onDepChange} color="text-cyan-400" compact />
      </div>
    </div>
  );
}

function RatingTypeToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5 bg-slate-800 rounded-lg p-0.5">
      <button onClick={() => onChange("contributory")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${value === "contributory" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
        Contributory
      </button>
      <button onClick={() => onChange("voluntary")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${value === "voluntary" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
        Voluntary
      </button>
    </div>
  );
}

export default function App() {
  const [selectedMedical, setSelectedMedical] = useState(null);
  const [selectedDental, setSelectedDental] = useState(null);
  const [selectedVision, setSelectedVision] = useState(null);
  const [tierFilter, setTierFilter] = useState("All");
  const [carrierFilter, setCarrierFilter] = useState("All");
  const [sortBy, setSortBy] = useState("employerCost");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [dentalRatingType, setDentalRatingType] = useState("contributory");
  const [visionRatingType, setVisionRatingType] = useState("contributory");

  const [medEeContrib, setMedEeContrib] = useState(100);
  const [medDepContrib, setMedDepContrib] = useState(0);
  const [denEeContrib, setDenEeContrib] = useState(55);
  const [denDepContrib, setDenDepContrib] = useState(0);
  const [visEeContrib, setVisEeContrib] = useState(55);
  const [visDepContrib, setVisDepContrib] = useState(0);

  const handleDentalRatingChange = (type) => {
    setDentalRatingType(type);
    setSelectedDental(null);
    setDenEeContrib(type === "contributory" ? 55 : 0);
  };

  const handleVisionRatingChange = (type) => {
    setVisionRatingType(type);
    setSelectedVision(null);
    setVisEeContrib(type === "contributory" ? 55 : 0);
  };

  const activeDentalPlans = dentalRatingType === "contributory" ? dentalPlansContributory : dentalPlansVoluntary;
  const activeVisionPlans = visionRatingType === "contributory" ? visionPlansContributory : visionPlansVoluntary;

  const carriers = useMemo(() => ["All", ...new Set(medicalPlans.map(p => p.carrier))], []);

  const employeeCosts = useMemo(() => {
    if (!selectedMedical) return null;
    const carrier = selectedMedical.carrier;
    const tier = selectedMedical.tier;
    const medDepRate = medicalDepRates[carrier]?.[tier] || 0;

    return employees.map(emp => {
      const medicalEE = medicalRatesByAge[carrier]?.[tier]?.[emp.age] || 0;
      const medicalDepTotal = emp.depCount > 0 ? medDepRate : 0;
      let dentalRate = selectedDental ? (emp.tier === "EC" ? selectedDental.ecRate : selectedDental.eeRate) : 0;
      let visionRate = selectedVision ? (emp.tier === "EC" ? selectedVision.ecRate : selectedVision.eeRate) : 0;

      const medErPaysEE = medicalEE * (medEeContrib / 100);
      const medErPaysDep = medicalDepTotal * (medDepContrib / 100);
      const medEePays = (medicalEE - medErPaysEE) + (medicalDepTotal - medErPaysDep);
      const denErPays = dentalRate * (denEeContrib / 100);
      const denEePays = dentalRate - denErPays;
      const visErPays = visionRate * (visEeContrib / 100);
      const visEePays = visionRate - visErPays;

      const totalPremium = medicalEE + medicalDepTotal + dentalRate + visionRate;
      const employerTotal = medErPaysEE + medErPaysDep + denErPays + visErPays;
      const employeePays = medEePays + denEePays + visEePays;

      return { ...emp, medicalEE, medicalDep: medicalDepTotal, medicalErPays: medErPaysEE + medErPaysDep, medicalEePays: medEePays,
        dentalRate, dentalErPays: denErPays, dentalEePays: denEePays, visionRate, visionErPays: visErPays, visionEePays: visEePays,
        totalPremium, employerTotal, employeePays };
    });
  }, [selectedMedical, selectedDental, selectedVision, medEeContrib, medDepContrib, denEeContrib, visEeContrib]);

  const medicalWithCosts = useMemo(() => {
    return medicalPlans.map(plan => {
      const carrier = plan.carrier;
      const tier = plan.tier;
      let eeTotal = 0, depTotal = 0;
      employees.forEach(emp => {
        eeTotal += medicalRatesByAge[carrier]?.[tier]?.[emp.age] || 0;
        if (emp.depCount > 0) depTotal += medicalDepRates[carrier]?.[tier] || 0;
      });
      const total = eeTotal + depTotal;
      const employerCost = (eeTotal * medEeContrib / 100) + (depTotal * medDepContrib / 100);
      return { ...plan, eeTotal, depTotal, total, employerCost, employeeCost: total - employerCost };
    });
  }, [medEeContrib, medDepContrib]);

  const filteredMedical = useMemo(() => {
    let plans = [...medicalWithCosts];
    if (tierFilter !== "All") plans = plans.filter(p => p.tier === tierFilter);
    if (carrierFilter !== "All") plans = plans.filter(p => p.carrier === carrierFilter);
    if (sortBy === "employerCost") plans.sort((a, b) => a.employerCost - b.employerCost);
    else if (sortBy === "total") plans.sort((a, b) => a.total - b.total);
    else if (sortBy === "carrier") plans.sort((a, b) => a.carrier.localeCompare(b.carrier));
    else if (sortBy === "tier") plans.sort((a, b) => ({ Silver: 1, Gold: 2, Platinum: 3 }[a.tier] - { Silver: 1, Gold: 2, Platinum: 3 }[b.tier]));
    return plans;
  }, [medicalWithCosts, tierFilter, carrierFilter, sortBy]);

  const calcDentalCosts = (plan) => {
    if (!plan) return { total: 0, employerCost: 0, employeeCost: 0 };
    const total = (plan.eeRate * 5) + plan.ecRate;
    const employerCost = total * (denEeContrib / 100);
    return { total, employerCost, employeeCost: total - employerCost };
  };

  const calcVisionCosts = (plan) => {
    if (!plan) return { total: 0, employerCost: 0, employeeCost: 0 };
    const total = (plan.eeRate * 5) + plan.ecRate;
    const employerCost = total * (visEeContrib / 100);
    return { total, employerCost, employeeCost: total - employerCost };
  };

  const packageCosts = useMemo(() => {
    if (!employeeCosts) return { totalMonthly: 0, employerMonthly: 0, employeeMonthly: 0, medEr: 0, denEr: 0, visEr: 0 };
    return employeeCosts.reduce((acc, emp) => ({
      totalMonthly: acc.totalMonthly + emp.totalPremium, employerMonthly: acc.employerMonthly + emp.employerTotal,
      employeeMonthly: acc.employeeMonthly + emp.employeePays, medEr: acc.medEr + emp.medicalErPays,
      denEr: acc.denEr + emp.dentalErPays, visEr: acc.visEr + emp.visionErPays,
    }), { totalMonthly: 0, employerMonthly: 0, employeeMonthly: 0, medEr: 0, denEr: 0, visEr: 0 });
  }, [employeeCosts]);

  const sortedDentalPlans = useMemo(() => [...activeDentalPlans].map(plan => ({ ...plan, ...calcDentalCosts(plan) })).sort((a, b) => a.employerCost - b.employerCost), [activeDentalPlans, denEeContrib]);
  const sortedVisionPlans = useMemo(() => [...activeVisionPlans].map(plan => ({ ...plan, ...calcVisionCosts(plan) })).sort((a, b) => a.employerCost - b.employerCost), [activeVisionPlans, visEeContrib]);

  const applyScenario = (med, den, vis, denType, visType) => {
    setMedEeContrib(med.ee); setMedDepContrib(med.dep);
    setDenEeContrib(den.ee); setDenDepContrib(den.dep);
    setVisEeContrib(vis.ee); setVisDepContrib(vis.dep);
    if (denType) { setDentalRatingType(denType); setSelectedDental(null); }
    if (visType) { setVisionRatingType(visType); setSelectedVision(null); }
  };

  const scenarios = [
    { label: "100% Med / 55% D&V (Contrib)", med: {ee:100,dep:0}, den: {ee:55,dep:0}, vis: {ee:55,dep:0}, denType: "contributory", visType: "contributory" },
    { label: "100% Med / Voluntary D&V", med: {ee:100,dep:0}, den: {ee:0,dep:0}, vis: {ee:0,dep:0}, denType: "voluntary", visType: "voluntary" },
    { label: "100% All EE", med: {ee:100,dep:0}, den: {ee:100,dep:0}, vis: {ee:100,dep:0}, denType: "contributory", visType: "contributory" },
  ];

  const hasSelections = selectedMedical || selectedDental || selectedVision;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <ConfirmationModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}
        selections={{ medical: selectedMedical, dental: selectedDental, vision: selectedVision }}
        costs={packageCosts} dentalType={dentalRatingType} visionType={visionRatingType} />

      {/* Header */}
      <header className="bg-slate-900 border-b-2 border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-wide mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent" style={{ fontFamily: "Georgia, serif" }}>
              RED TOWER ADVISORS
            </h1>
            <p className="text-slate-400 text-lg">Employee Benefits Proposal</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Effective: March 1, 2026
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                San Carlos, CA
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                6 Employees + 1 Dependent
              </span>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/50">
              <span className="text-amber-400 text-xs font-medium">BEAM DENTAL & VISION ONLY</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Proposal Documents */}
        <section className="mb-10">
          <SectionHeader icon="📁" title="Proposal Materials" subtitle="Click to view detailed documentation" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {proposalDocuments.map((doc, i) => (
              <a key={i} href={doc.url} className="p-4 rounded-xl bg-slate-900 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all group">
                <div className="text-3xl mb-2">{doc.icon}</div>
                <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{doc.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Rating Type Explainer */}
        <section className="mb-10">
          <SectionHeader icon="ℹ️" title="Contribution Rating Types" subtitle="Understanding Contributory vs Voluntary plans" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-900/20 border-2 border-emerald-700/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-600 text-white">Contributory</span>
              </div>
              <p className="text-sm text-slate-400">Employer contributes <span className="text-emerald-400 font-semibold">at least 55%</span> of employee premium. Lower rates due to guaranteed participation.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-900/20 border-2 border-amber-700/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-xs font-bold bg-amber-600 text-white">Voluntary</span>
              </div>
              <p className="text-sm text-slate-400"><span className="text-amber-400 font-semibold">No employer contribution required</span>. Slightly higher rates. Employee pays 100% unless employer chooses to contribute.</p>
            </div>
          </div>
        </section>

        {/* Contribution Strategy */}
        <section className="mb-10">
          <SectionHeader icon="💰" title="Contribution Strategy" subtitle="Adjust employer contribution percentages" color="emerald" />
          <div className="p-6 rounded-xl bg-slate-900 border-2 border-slate-700">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <ContributionSection title="Medical" color="bg-blue-500" borderColor="border-blue-600" eeValue={medEeContrib} depValue={medDepContrib} onEeChange={setMedEeContrib} onDepChange={setMedDepContrib} />
              <div className="p-4 rounded-lg bg-slate-800/40 border-2 border-pink-600 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    <h4 className="text-sm font-semibold text-slate-200">Dental</h4>
                  </div>
                  <RatingTypeToggle value={dentalRatingType} onChange={handleDentalRatingChange} />
                </div>
                <ContributionSlider label="EE" value={denEeContrib} onChange={setDenEeContrib} color="text-emerald-400" compact />
                {dentalRatingType === "contributory" && denEeContrib < 55 && (
                  <p className="mt-2 text-xs text-amber-400">⚠️ Contributory requires min 55%</p>
                )}
              </div>
              <div className="p-4 rounded-lg bg-slate-800/40 border-2 border-cyan-600 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                    <h4 className="text-sm font-semibold text-slate-200">Vision</h4>
                  </div>
                  <RatingTypeToggle value={visionRatingType} onChange={handleVisionRatingChange} />
                </div>
                <ContributionSlider label="EE" value={visEeContrib} onChange={setVisEeContrib} color="text-emerald-400" compact />
                {visionRatingType === "contributory" && visEeContrib < 55 && (
                  <p className="mt-2 text-xs text-amber-400">⚠️ Contributory requires min 55%</p>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-3">Quick Scenarios:</p>
              <div className="flex flex-wrap gap-2">
                {scenarios.map(s => (
                  <button key={s.label} onClick={() => applyScenario(s.med, s.den, s.vis, s.denType, s.visType)}
                    className="px-4 py-2 rounded-lg text-sm bg-slate-800 border border-slate-600 hover:border-emerald-500 hover:bg-slate-700 transition-all">
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cost Summary */}
        <section className="mb-10">
          <SectionHeader icon="📊" title="Cost Summary" subtitle="Total package costs based on selections" color="emerald" />
          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Premium</p>
                <p className="text-3xl font-bold">{formatCurrency(packageCosts.totalMonthly)}</p>
                <p className="text-slate-500 text-sm">{formatCurrency(packageCosts.totalMonthly * 12)}/yr</p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-900/30 border border-emerald-700">
                <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">Employer Cost</p>
                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(packageCosts.employerMonthly)}</p>
                <p className="text-emerald-300/70 text-sm font-medium">{formatCurrency(packageCosts.employerMonthly * 12)}/yr</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-900/30 border border-orange-700">
                <p className="text-orange-400 text-xs uppercase tracking-wider mb-1">Employee Cost</p>
                <p className="text-3xl font-bold text-orange-400">{formatCurrency(packageCosts.employeeMonthly)}</p>
                <p className="text-orange-300/70 text-sm">{formatCurrency(packageCosts.employeeMonthly * 12)}/yr</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Employer Breakdown</p>
                <div className="text-sm space-y-1 mt-2">
                  <div className="flex justify-between"><span className="text-blue-400">Medical:</span><span>{formatCurrency(packageCosts.medEr)}</span></div>
                  <div className="flex justify-between"><span className="text-pink-400">Dental:</span><span>{formatCurrency(packageCosts.denEr)}</span></div>
                  <div className="flex justify-between"><span className="text-cyan-400">Vision:</span><span>{formatCurrency(packageCosts.visEr)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Package & CTA */}
        {hasSelections && (
          <section className="mb-10">
            <div className="p-6 rounded-xl bg-slate-900 border-2 border-emerald-600 shadow-lg shadow-emerald-900/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your Selected Package</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedMedical && (
                      <span className="px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-600 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        {selectedMedical.carrier} {selectedMedical.tier}
                        <button onClick={() => setSelectedMedical(null)} className="ml-1 text-blue-400 hover:text-white">×</button>
                      </span>
                    )}
                    {selectedDental && (
                      <span className="px-3 py-1.5 rounded-full bg-pink-900/50 border border-pink-600 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                        Beam Dental
                        <span className={`text-xs px-1 py-0.5 rounded ${dentalRatingType === "contributory" ? "bg-emerald-700" : "bg-amber-700"}`}>{dentalRatingType === "contributory" ? "C" : "V"}</span>
                        <button onClick={() => setSelectedDental(null)} className="ml-1 text-pink-400 hover:text-white">×</button>
                      </span>
                    )}
                    {selectedVision && (
                      <span className="px-3 py-1.5 rounded-full bg-cyan-900/50 border border-cyan-600 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        Beam Vision
                        <span className={`text-xs px-1 py-0.5 rounded ${visionRatingType === "contributory" ? "bg-emerald-700" : "bg-amber-700"}`}>{visionRatingType === "contributory" ? "C" : "V"}</span>
                        <button onClick={() => setSelectedVision(null)} className="ml-1 text-cyan-400 hover:text-white">×</button>
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => setShowConfirmModal(true)}
                  className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-lg shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Confirm Selections
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Employee Cost Breakdown */}
        {employeeCosts && (
          <section className="mb-10">
            <SectionHeader icon="👥" title="Per-Employee Breakdown" subtitle="Monthly cost details for each employee" />
            <div className="rounded-xl bg-slate-900 border-2 border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="text-left py-4 px-4">Employee</th>
                      <th className="text-center py-4 px-2">Age</th>
                      <th className="text-center py-4 px-2">Tier</th>
                      <th className="text-right py-4 px-2 text-blue-400">Medical</th>
                      <th className="text-right py-4 px-2 text-pink-400">Dental</th>
                      <th className="text-right py-4 px-2 text-cyan-400">Vision</th>
                      <th className="text-right py-4 px-2">Total</th>
                      <th className="text-right py-4 px-2 text-emerald-400">ER Pays</th>
                      <th className="text-right py-4 px-4 text-orange-400">EE Pays</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeCosts.map((emp, i) => (
                      <tr key={i} className={`border-t border-slate-800 ${emp.tier === "EC" ? 'bg-cyan-950/20' : ''}`}>
                        <td className="py-4 px-4 font-medium">{emp.name}</td>
                        <td className="text-center py-4 px-2 text-slate-400">{emp.age}</td>
                        <td className="text-center py-4 px-2">
                          <span className={`text-xs px-2 py-1 rounded ${emp.tier === "EC" ? 'bg-cyan-800 text-cyan-200' : 'bg-slate-700 text-slate-300'}`}>
                            {emp.tier === "EC" ? "EE+Child" : "EE Only"}
                          </span>
                        </td>
                        <td className="text-right py-4 px-2">{formatCurrency(emp.medicalEE + emp.medicalDep)}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(emp.dentalRate)}</td>
                        <td className="text-right py-4 px-2">{formatCurrency(emp.visionRate)}</td>
                        <td className="text-right py-4 px-2 font-medium">{formatCurrency(emp.totalPremium)}</td>
                        <td className="text-right py-4 px-2 text-emerald-400 font-medium">{formatCurrency(emp.employerTotal)}</td>
                        <td className="text-right py-4 px-4 text-orange-400 font-medium">{formatCurrency(emp.employeePays)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-800 font-semibold">
                      <td className="py-4 px-4" colSpan={6}>MONTHLY TOTAL</td>
                      <td className="text-right py-4 px-2">{formatCurrency(packageCosts.totalMonthly)}</td>
                      <td className="text-right py-4 px-2 text-emerald-400">{formatCurrency(packageCosts.employerMonthly)}</td>
                      <td className="text-right py-4 px-4 text-orange-400">{formatCurrency(packageCosts.employeeMonthly)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Medical Plans */}
        <section className="mb-10">
          <SectionHeader icon="🏥" title="Medical Plans" subtitle={`${medEeContrib}% EE / ${medDepContrib}% Dependent contribution`} color="blue" />
          <div className="flex flex-wrap gap-3 mb-6">
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-800 border-2 border-slate-600 text-sm focus:outline-none focus:border-blue-500">
              <option value="All">All Tiers</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
            <select value={carrierFilter} onChange={(e) => setCarrierFilter(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-800 border-2 border-slate-600 text-sm focus:outline-none focus:border-blue-500">
              {carriers.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-800 border-2 border-slate-600 text-sm focus:outline-none focus:border-blue-500">
              <option value="employerCost">Sort by Employer Cost</option>
              <option value="total">Sort by Total Premium</option>
              <option value="carrier">Sort by Carrier</option>
              <option value="tier">Sort by Tier</option>
            </select>
          </div>
          <div className="grid gap-4">
            {filteredMedical.map((plan, i) => {
              const colors = tierColors[plan.tier];
              const isSelected = selectedMedical?.plan === plan.plan && selectedMedical?.carrier === plan.carrier;
              const isLowest = i === 0 && sortBy === "employerCost";
              return (
                <div key={`${plan.carrier}-${plan.plan}`} onClick={() => setSelectedMedical(isSelected ? null : plan)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? "bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-900/30" : "bg-slate-900 border-slate-700 hover:border-slate-500"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${colors.badge}`}>{plan.tier}</span>
                      <span className="font-semibold text-lg">{plan.carrier}</span>
                      {isLowest && <span className="px-2 py-1 rounded text-xs bg-emerald-600 text-white font-medium">Lowest ER Cost</span>}
                      {isSelected && <span className="px-2 py-1 rounded text-xs bg-blue-600 text-white font-medium">Selected</span>}
                    </div>
                    <div className="text-right flex gap-8 items-center">
                      <div><p className="text-slate-500 text-xs">Total</p><p className="text-xl font-medium">{formatCurrency(plan.total)}</p></div>
                      <div><p className="text-emerald-500 text-xs">Employer</p><p className="text-xl font-bold text-emerald-400">{formatCurrency(plan.employerCost)}</p></div>
                      <div><p className="text-orange-500 text-xs">Employee</p><p className="text-xl font-medium text-orange-400">{formatCurrency(plan.employeeCost)}</p></div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div><span className="text-slate-500">Deductible:</span> <span className="text-white font-medium">{plan.deductible}</span></div>
                    <div><span className="text-slate-500">OOP Max:</span> <span className="text-white font-medium">{plan.oop}</span></div>
                    <div><span className="text-slate-500">PCP:</span> <span className="text-white font-medium">{plan.pcp}</span></div>
                    <div><span className="text-slate-500">Specialist:</span> <span className="text-white font-medium">{plan.specialist}</span></div>
                    <div><span className="text-slate-500">Hospital:</span> <span className="text-white font-medium">{plan.hospital}</span></div>
                    <div className="text-slate-400 text-xs self-center">{plan.plan}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dental Plans */}
        <section className="mb-10">
          <SectionHeader icon="🦷" title="Dental Plans" color="pink"
            badge={<span className={`px-2 py-1 rounded text-xs font-bold ${dentalRatingType === "contributory" ? "bg-emerald-600" : "bg-amber-600"}`}>{dentalRatingType === "contributory" ? "Contributory" : "Voluntary"}</span>}
            subtitle={`${denEeContrib}% EE contribution • Beam SmartPremium plans`} />
          <div className="flex justify-end mb-4"><RatingTypeToggle value={dentalRatingType} onChange={handleDentalRatingChange} /></div>
          <div className="grid gap-4">
            {sortedDentalPlans.map((plan, i) => {
              const isSelected = selectedDental?.plan === plan.plan;
              const isLowest = i === 0;
              return (
                <div key={plan.plan} onClick={() => setSelectedDental(isSelected ? null : plan)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? "bg-pink-950/40 border-pink-500 shadow-lg shadow-pink-900/30" : "bg-slate-900 border-slate-700 hover:border-slate-500"}`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-lg">{plan.carrier}</p>
                        {isLowest && <span className="px-2 py-0.5 rounded text-xs bg-emerald-600 text-white">Lowest</span>}
                        {isSelected && <span className="px-2 py-0.5 rounded text-xs bg-pink-600 text-white">Selected</span>}
                      </div>
                      <p className="text-sm text-slate-400">{plan.plan}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-lg">{formatCurrency(plan.employerCost)}<span className="text-xs text-slate-400 font-normal"> /mo</span></p>
                      <p className="text-orange-400 text-sm">{formatCurrency(plan.employeeCost)} EE</p>
                    </div>
                  </div>
                  <div className="mb-4 p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500 mb-2">Monthly Rates:</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center"><p className="text-slate-500 text-xs">EE Only</p><p className="font-semibold">{formatCurrency(plan.eeRate)}</p></div>
                      <div className="text-center"><p className="text-slate-500 text-xs">+Spouse</p><p className="font-semibold">{formatCurrency(plan.esRate)}</p></div>
                      <div className="text-center"><p className="text-slate-500 text-xs">+Child</p><p className="font-semibold">{formatCurrency(plan.ecRate)}</p></div>
                      <div className="text-center"><p className="text-slate-500 text-xs">Family</p><p className="font-semibold">{formatCurrency(plan.famRate)}</p></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 text-sm">
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500 text-xs">Prev</p><p className="font-semibold">{plan.preventive}</p></div>
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500 text-xs">Basic</p><p className="font-semibold">{plan.basic}</p></div>
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500 text-xs">Major</p><p className="font-semibold">{plan.major}</p></div>
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500 text-xs">Ortho</p><p className="font-semibold">{plan.ortho}</p></div>
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500 text-xs">Max</p><p className="font-semibold">{plan.annualMax}</p></div>
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500 text-xs">Ded</p><p className="font-semibold text-xs">{plan.deductible}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vision Plans */}
        <section className="mb-10">
          <SectionHeader icon="👁️" title="Vision Plans" color="cyan"
            badge={<span className={`px-2 py-1 rounded text-xs font-bold ${visionRatingType === "contributory" ? "bg-emerald-600" : "bg-amber-600"}`}>{visionRatingType === "contributory" ? "Contributory" : "Voluntary"}</span>}
            subtitle={`${visEeContrib}% EE contribution • Beam/VSP plans`} />
          <div className="flex justify-end mb-4"><RatingTypeToggle value={visionRatingType} onChange={handleVisionRatingChange} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedVisionPlans.map((plan, i) => {
              const isSelected = selectedVision?.plan === plan.plan;
              const isLowest = i === 0;
              return (
                <div key={plan.plan} onClick={() => setSelectedVision(isSelected ? null : plan)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? "bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-900/30" : "bg-slate-900 border-slate-700 hover:border-slate-500"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{plan.carrier}</p>
                        {isLowest && <span className="px-2 py-0.5 rounded text-xs bg-emerald-600 text-white">Lowest</span>}
                        {isSelected && <span className="px-2 py-0.5 rounded text-xs bg-cyan-600 text-white">Selected</span>}
                      </div>
                      <p className="text-sm text-slate-400">{plan.plan}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">{formatCurrency(plan.employerCost)}</p>
                      <p className="text-orange-400 text-xs">{formatCurrency(plan.employeeCost)} EE</p>
                    </div>
                  </div>
                  <div className="mb-3 p-2 rounded-lg bg-slate-800/50">
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center"><p className="text-slate-500">EE</p><p className="font-semibold">{formatCurrency(plan.eeRate)}</p></div>
                      <div className="text-center"><p className="text-slate-500">+Spouse</p><p className="font-semibold">{formatCurrency(plan.esRate)}</p></div>
                      <div className="text-center"><p className="text-slate-500">+Child</p><p className="font-semibold">{formatCurrency(plan.ecRate)}</p></div>
                      <div className="text-center"><p className="text-slate-500">Family</p><p className="font-semibold">{formatCurrency(plan.famRate)}</p></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500">Exam</p><p className="font-semibold">{plan.exam}</p></div>
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500">Frames</p><p className="font-semibold">{plan.frames}</p></div>
                    <div className="text-center p-2 rounded-lg bg-slate-800 border border-slate-700"><p className="text-slate-500">Contacts</p><p className="font-semibold">{plan.contacts}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t-2 border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Presented by <span className="text-white font-medium">Caffrey Insurance Solutions, Inc.</span></p>
          <p className="text-slate-500 text-xs">License# 0H66348 • Quote ID: Beam 725527</p>
          <p className="text-slate-600 text-xs mt-4">Rates are preliminary and subject to carrier approval. All rates monthly for 12 pay periods.</p>
        </div>
      </footer>

      {/* Floating CTA */}
      {hasSelections && (
        <div className="fixed bottom-6 right-6 z-40">
          <button onClick={() => setShowConfirmModal(true)}
            className="px-6 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-2xl shadow-emerald-900/50 transition-all hover:scale-105 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Confirm Selections
          </button>
        </div>
      )}
    </div>
  );
}
