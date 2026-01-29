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
// From: Red Tower Advisors, Beam Benefits Dental and Vision Options 03-2026 (55% EE Contribution).pdf
const dentalPlansContributory = [
  {
    carrier: "Beam",
    plan: "SmartPremium Plus 100/80/50-1000",
    preventive: "100%", basic: "80%", major: "50%", ortho: "N/A",
    annualMax: "$1,000", deductible: "$50/$150",
    eeRate: 59.74, esRate: 119.48, ecRate: 173.52, famRate: 233.26
  },
  {
    carrier: "Beam",
    plan: "SmartPremium Select 100/90/60-2000",
    preventive: "100%", basic: "90%", major: "60%", ortho: "N/A",
    annualMax: "$2,000", deductible: "$50/$150",
    eeRate: 76.74, esRate: 153.48, ecRate: 210.59, famRate: 287.33
  },
  {
    carrier: "Beam",
    plan: "SmartPremium Ultra 100/100/60-5000",
    preventive: "100%", basic: "100%", major: "60%", ortho: "N/A",
    annualMax: "$5,000", deductible: "$25/$75",
    eeRate: 85.90, esRate: 171.80, ecRate: 230.72, famRate: 316.62
  },
];

// BEAM DENTAL PLANS - Voluntary (0% contribution required)
// From: Red Tower Advisors, Beam Benefits Dental and Vision Options 03-2026 (Voluntary).pdf
const dentalPlansVoluntary = [
  {
    carrier: "Beam",
    plan: "SmartPremium Plus 100/80/50-1000",
    preventive: "100%", basic: "80%", major: "50%", ortho: "N/A",
    annualMax: "$1,000", deductible: "$50/$150",
    eeRate: 60.97, esRate: 121.94, ecRate: 179.21, famRate: 240.18
  },
  {
    carrier: "Beam",
    plan: "SmartPremium Select 100/90/60-2000",
    preventive: "100%", basic: "90%", major: "60%", ortho: "N/A",
    annualMax: "$2,000", deductible: "$50/$150",
    eeRate: 78.38, esRate: 156.75, ecRate: 217.69, famRate: 296.06
  },
  {
    carrier: "Beam",
    plan: "SmartPremium Ultra 100/100/60-5000",
    preventive: "100%", basic: "100%", major: "60%", ortho: "N/A",
    annualMax: "$5,000", deductible: "$25/$75",
    eeRate: 87.77, esRate: 175.55, ecRate: 238.59, famRate: 326.36
  },
];

// BEAM VISION PLANS - Contributory (55% EE contribution required)
const visionPlansContributory = [
  {
    carrier: "Beam/VSP",
    plan: "VSP Choice Plan #2 ($150)",
    exam: "$10", frames: "$150", contacts: "$150",
    eeRate: 10.72, esRate: 21.43, ecRate: 22.51, famRate: 35.85
  },
  {
    carrier: "Beam/VSP",
    plan: "VSP Choice Plan #3 ($200)",
    exam: "$10", frames: "$200", contacts: "$200",
    eeRate: 12.46, esRate: 24.94, ecRate: 25.99, famRate: 41.47
  },
];

// BEAM VISION PLANS - Voluntary (0% contribution required)
const visionPlansVoluntary = [
  {
    carrier: "Beam/VSP",
    plan: "VSP Choice Plan #2 ($150)",
    exam: "$10", frames: "$150", contacts: "$150",
    eeRate: 10.83, esRate: 21.65, ecRate: 22.73, famRate: 36.21
  },
  {
    carrier: "Beam/VSP",
    plan: "VSP Choice Plan #3 ($200)",
    exam: "$10", frames: "$200", contacts: "$200",
    eeRate: 12.58, esRate: 25.20, ecRate: 26.24, famRate: 41.90
  },
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

const tierColors = {
  Silver: { badge: "bg-slate-500" },
  Gold: { badge: "bg-amber-500" },
  Platinum: { badge: "bg-violet-500" },
};

const formatCurrency = (num) => num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function ContributionSlider({ label, value, onChange, color, compact = false }) {
  return (
    <div className={compact ? "flex-1 min-w-[140px]" : "flex-1 min-w-[200px]"}>
      <div className="flex justify-between items-center mb-1">
        <label className={`text-xs uppercase tracking-wider ${color}`}>{label}</label>
        <span className={`font-medium ${compact ? 'text-sm' : 'text-lg'}`}>{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      {!compact && (
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}

function ContributionSection({ title, icon, color, eeValue, depValue, onEeChange, onDepChange, borderColor }) {
  return (
    <div className={`p-4 rounded-lg bg-slate-800/40 border ${borderColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <h4 className="text-sm font-medium text-slate-300">{title}</h4>
      </div>
      <div className="flex gap-4">
        <ContributionSlider
          label="EE"
          value={eeValue}
          onChange={onEeChange}
          color="text-emerald-400"
          compact
        />
        <ContributionSlider
          label="Dep"
          value={depValue}
          onChange={onDepChange}
          color="text-cyan-400"
          compact
        />
      </div>
    </div>
  );
}

function RatingTypeToggle({ value, onChange, benefitType }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange("contributory")}
        className={`px-3 py-1.5 rounded-l-lg text-xs font-medium transition-all ${
          value === "contributory"
            ? "bg-emerald-600 text-white"
            : "bg-slate-700 text-slate-400 hover:bg-slate-600"
        }`}
      >
        Contributory
      </button>
      <button
        onClick={() => onChange("voluntary")}
        className={`px-3 py-1.5 rounded-r-lg text-xs font-medium transition-all ${
          value === "voluntary"
            ? "bg-amber-600 text-white"
            : "bg-slate-700 text-slate-400 hover:bg-slate-600"
        }`}
      >
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

  // Rating type selection for dental/vision
  const [dentalRatingType, setDentalRatingType] = useState("contributory");
  const [visionRatingType, setVisionRatingType] = useState("contributory");

  // Separate contribution percentages for each benefit type
  const [medEeContrib, setMedEeContrib] = useState(100);
  const [medDepContrib, setMedDepContrib] = useState(0);
  const [denEeContrib, setDenEeContrib] = useState(55);  // Default to 55% for contributory
  const [denDepContrib, setDenDepContrib] = useState(0);
  const [visEeContrib, setVisEeContrib] = useState(55);  // Default to 55% for contributory
  const [visDepContrib, setVisDepContrib] = useState(0);

  // Auto-adjust contribution when rating type changes
  const handleDentalRatingChange = (type) => {
    setDentalRatingType(type);
    setSelectedDental(null); // Clear selection when switching
    if (type === "contributory") {
      setDenEeContrib(55);
    } else {
      setDenEeContrib(0);
    }
  };

  const handleVisionRatingChange = (type) => {
    setVisionRatingType(type);
    setSelectedVision(null); // Clear selection when switching
    if (type === "contributory") {
      setVisEeContrib(55);
    } else {
      setVisEeContrib(0);
    }
  };

  // Get active dental/vision plans based on rating type
  const activeDentalPlans = dentalRatingType === "contributory" ? dentalPlansContributory : dentalPlansVoluntary;
  const activeVisionPlans = visionRatingType === "contributory" ? visionPlansContributory : visionPlansVoluntary;

  const carriers = useMemo(() => ["All", ...new Set(medicalPlans.map(p => p.carrier))], []);

  // Calculate per-employee costs with 4-tier dental/vision rates
  const employeeCosts = useMemo(() => {
    if (!selectedMedical) return null;

    const carrier = selectedMedical.carrier;
    const tier = selectedMedical.tier;
    const medDepRate = medicalDepRates[carrier]?.[tier] || 0;

    return employees.map(emp => {
      const medicalEE = medicalRatesByAge[carrier]?.[tier]?.[emp.age] || 0;
      const medicalDepTotal = emp.depCount > 0 ? medDepRate : 0;

      // Dental: use tier-based rate (EE or EC)
      let dentalRate = 0;
      if (selectedDental) {
        dentalRate = emp.tier === "EC" ? selectedDental.ecRate : selectedDental.eeRate;
      }

      // Vision: use tier-based rate (EE or EC)
      let visionRate = 0;
      if (selectedVision) {
        visionRate = emp.tier === "EC" ? selectedVision.ecRate : selectedVision.eeRate;
      }

      // Calculate employer/employee split for each benefit type
      const medErPaysEE = medicalEE * (medEeContrib / 100);
      const medErPaysDep = medicalDepTotal * (medDepContrib / 100);
      const medEePays = (medicalEE - medErPaysEE) + (medicalDepTotal - medErPaysDep);

      // For dental/vision, the rate is composite (includes dependents for EC tier)
      const denErPays = dentalRate * (denEeContrib / 100);
      const denEePays = dentalRate - denErPays;

      const visErPays = visionRate * (visEeContrib / 100);
      const visEePays = visionRate - visErPays;

      const totalPremium = medicalEE + medicalDepTotal + dentalRate + visionRate;
      const employerTotal = medErPaysEE + medErPaysDep + denErPays + visErPays;
      const employeePays = medEePays + denEePays + visEePays;

      return {
        ...emp,
        medicalEE,
        medicalDep: medicalDepTotal,
        medicalErPays: medErPaysEE + medErPaysDep,
        medicalEePays: medEePays,
        dentalRate,
        dentalErPays: denErPays,
        dentalEePays: denEePays,
        visionRate,
        visionErPays: visErPays,
        visionEePays: visEePays,
        totalPremium,
        employerTotal,
        employeePays
      };
    });
  }, [selectedMedical, selectedDental, selectedVision, medEeContrib, medDepContrib, denEeContrib, visEeContrib]);

  // Medical plans with costs
  const medicalWithCosts = useMemo(() => {
    return medicalPlans.map(plan => {
      const carrier = plan.carrier;
      const tier = plan.tier;
      let eeTotal = 0;
      let depTotal = 0;

      employees.forEach(emp => {
        eeTotal += medicalRatesByAge[carrier]?.[tier]?.[emp.age] || 0;
        if (emp.depCount > 0) {
          depTotal += medicalDepRates[carrier]?.[tier] || 0;
        }
      });

      const total = eeTotal + depTotal;
      const employerCost = (eeTotal * medEeContrib / 100) + (depTotal * medDepContrib / 100);
      const employeeCost = total - employerCost;

      return { ...plan, eeTotal, depTotal, total, employerCost, employeeCost };
    });
  }, [medEeContrib, medDepContrib]);

  const filteredMedical = useMemo(() => {
    let plans = [...medicalWithCosts];
    if (tierFilter !== "All") plans = plans.filter(p => p.tier === tierFilter);
    if (carrierFilter !== "All") plans = plans.filter(p => p.carrier === carrierFilter);

    if (sortBy === "employerCost") plans.sort((a, b) => a.employerCost - b.employerCost);
    else if (sortBy === "total") plans.sort((a, b) => a.total - b.total);
    else if (sortBy === "carrier") plans.sort((a, b) => a.carrier.localeCompare(b.carrier));
    else if (sortBy === "tier") {
      const tierOrder = { Silver: 1, Gold: 2, Platinum: 3 };
      plans.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
    }
    return plans;
  }, [medicalWithCosts, tierFilter, carrierFilter, sortBy]);

  // Dental/vision costs calculation for group totals
  const calcDentalCosts = (plan) => {
    if (!plan) return { total: 0, employerCost: 0, employeeCost: 0 };
    // 5 EE + 1 EC
    const total = (plan.eeRate * 5) + plan.ecRate;
    const employerCost = total * (denEeContrib / 100);
    return { total, employerCost, employeeCost: total - employerCost };
  };

  const calcVisionCosts = (plan) => {
    if (!plan) return { total: 0, employerCost: 0, employeeCost: 0 };
    // 5 EE + 1 EC
    const total = (plan.eeRate * 5) + plan.ecRate;
    const employerCost = total * (visEeContrib / 100);
    return { total, employerCost, employeeCost: total - employerCost };
  };

  // Package totals
  const packageCosts = useMemo(() => {
    if (!employeeCosts) {
      return { totalMonthly: 0, employerMonthly: 0, employeeMonthly: 0, medEr: 0, denEr: 0, visEr: 0 };
    }

    return employeeCosts.reduce((acc, emp) => ({
      totalMonthly: acc.totalMonthly + emp.totalPremium,
      employerMonthly: acc.employerMonthly + emp.employerTotal,
      employeeMonthly: acc.employeeMonthly + emp.employeePays,
      medEr: acc.medEr + emp.medicalErPays,
      denEr: acc.denEr + emp.dentalErPays,
      visEr: acc.visEr + emp.visionErPays,
    }), { totalMonthly: 0, employerMonthly: 0, employeeMonthly: 0, medEr: 0, denEr: 0, visEr: 0 });
  }, [employeeCosts]);

  // Sorted plans with costs
  const sortedDentalPlans = useMemo(() => {
    return [...activeDentalPlans].map(plan => ({ ...plan, ...calcDentalCosts(plan) })).sort((a, b) => a.employerCost - b.employerCost);
  }, [activeDentalPlans, denEeContrib]);

  const sortedVisionPlans = useMemo(() => {
    return [...activeVisionPlans].map(plan => ({ ...plan, ...calcVisionCosts(plan) })).sort((a, b) => a.employerCost - b.employerCost);
  }, [activeVisionPlans, visEeContrib]);

  // Quick scenario presets
  const applyScenario = (med, den, vis, denType, visType) => {
    setMedEeContrib(med.ee); setMedDepContrib(med.dep);
    setDenEeContrib(den.ee); setDenDepContrib(den.dep);
    setVisEeContrib(vis.ee); setVisDepContrib(vis.dep);
    if (denType) handleDentalRatingChange(denType);
    if (visType) handleVisionRatingChange(visType);
  };

  const scenarios = [
    { label: "100% Med / 55% D&V (Contrib)", med: {ee:100,dep:0}, den: {ee:55,dep:0}, vis: {ee:55,dep:0}, denType: "contributory", visType: "contributory" },
    { label: "100% Med / 0% D&V (Voluntary)", med: {ee:100,dep:0}, den: {ee:0,dep:0}, vis: {ee:0,dep:0}, denType: "voluntary", visType: "voluntary" },
    { label: "100% All EE / 0% Dep", med: {ee:100,dep:0}, den: {ee:100,dep:0}, vis: {ee:100,dep:0}, denType: "contributory", visType: "contributory" },
    { label: "100% Everything", med: {ee:100,dep:100}, den: {ee:100,dep:100}, vis: {ee:100,dep:100}, denType: "contributory", visType: "contributory" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extralight tracking-wide mb-2" style={{ fontFamily: "Georgia, serif" }}>
          RED TOWER ADVISORS
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">Benefits Package Builder • Effective 3/1/2026</p>
        <p className="text-slate-500 text-xs mt-1">San Carlos, CA • 6 Employees + 1 Dependent</p>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/50">
          <span className="text-amber-400 text-xs font-medium">BEAM DENTAL & VISION ONLY</span>
        </div>
      </header>

      {/* Rating Type Explainer */}
      <div className="mb-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Contribution Rating Types
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-700/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-600 text-white">Contributory</span>
            </div>
            <p className="text-xs text-slate-400">
              Employer must contribute <span className="text-emerald-400 font-medium">at least 55%</span> of employee premium.
              Lower rates due to guaranteed employer participation.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-900/20 border border-amber-700/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-600 text-white">Voluntary</span>
            </div>
            <p className="text-xs text-slate-400">
              <span className="text-amber-400 font-medium">No employer contribution required</span>.
              Slightly higher rates. Employee pays 100% (unless employer chooses to contribute).
            </p>
          </div>
        </div>
      </div>

      {/* Contribution Controls */}
      <div className="mb-6 p-5 rounded-xl bg-slate-800/60 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Employer Contribution Strategy
        </h3>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <ContributionSection
            title="Medical"
            color="bg-blue-500"
            borderColor="border-blue-700/50"
            eeValue={medEeContrib}
            depValue={medDepContrib}
            onEeChange={setMedEeContrib}
            onDepChange={setMedDepContrib}
          />
          <div className="p-4 rounded-lg bg-slate-800/40 border border-pink-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                <h4 className="text-sm font-medium text-slate-300">Dental</h4>
              </div>
              <RatingTypeToggle value={dentalRatingType} onChange={handleDentalRatingChange} />
            </div>
            <div className="flex gap-4">
              <ContributionSlider
                label="EE"
                value={denEeContrib}
                onChange={setDenEeContrib}
                color="text-emerald-400"
                compact
              />
            </div>
            {dentalRatingType === "contributory" && denEeContrib < 55 && (
              <p className="mt-2 text-xs text-amber-400">⚠️ Contributory requires min 55% EE contribution</p>
            )}
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40 border border-cyan-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                <h4 className="text-sm font-medium text-slate-300">Vision</h4>
              </div>
              <RatingTypeToggle value={visionRatingType} onChange={handleVisionRatingChange} />
            </div>
            <div className="flex gap-4">
              <ContributionSlider
                label="EE"
                value={visEeContrib}
                onChange={setVisEeContrib}
                color="text-emerald-400"
                compact
              />
            </div>
            {visionRatingType === "contributory" && visEeContrib < 55 && (
              <p className="mt-2 text-xs text-amber-400">⚠️ Contributory requires min 55% EE contribution</p>
            )}
          </div>
        </div>

        {/* Quick Scenarios */}
        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Quick scenarios:</p>
          <div className="flex flex-wrap gap-2">
            {scenarios.map(s => (
              <button
                key={s.label}
                onClick={() => applyScenario(s.med, s.den, s.vis, s.denType, s.visType)}
                className="px-3 py-1.5 rounded text-xs bg-slate-700 hover:bg-slate-600 transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 backdrop-blur">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Premium</p>
            <p className="text-2xl font-light">{formatCurrency(packageCosts.totalMonthly)}</p>
            <p className="text-slate-500 text-xs">{formatCurrency(packageCosts.totalMonthly * 12)}/yr</p>
          </div>
          <div className="bg-emerald-900/30 rounded-lg p-3 -m-1">
            <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">Employer Cost</p>
            <p className="text-2xl font-light">{formatCurrency(packageCosts.employerMonthly)}</p>
            <p className="text-emerald-300 text-xs font-medium">{formatCurrency(packageCosts.employerMonthly * 12)}/yr</p>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-3 -m-1">
            <p className="text-orange-400 text-xs uppercase tracking-wider mb-1">Employee Cost</p>
            <p className="text-2xl font-light">{formatCurrency(packageCosts.employeeMonthly)}</p>
            <p className="text-orange-300 text-xs">{formatCurrency(packageCosts.employeeMonthly * 12)}/yr</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">ER Cost Breakdown</p>
            <div className="text-sm space-y-0.5">
              <div className="flex justify-between"><span className="text-blue-400">Medical:</span><span>{formatCurrency(packageCosts.medEr)}</span></div>
              <div className="flex justify-between"><span className="text-pink-400">Dental:</span><span>{formatCurrency(packageCosts.denEr)}</span></div>
              <div className="flex justify-between"><span className="text-cyan-400">Vision:</span><span>{formatCurrency(packageCosts.visEr)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Plans Summary */}
      {(selectedMedical || selectedDental || selectedVision) && (
        <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Selected Package</p>
          <div className="flex flex-wrap gap-3">
            {selectedMedical && (
              <span className="px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-700 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                {selectedMedical.carrier} {selectedMedical.tier}
                <button onClick={() => setSelectedMedical(null)} className="ml-1 text-blue-400 hover:text-white">×</button>
              </span>
            )}
            {selectedDental && (
              <span className="px-3 py-1.5 rounded-full bg-pink-900/50 border border-pink-700 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                {selectedDental.plan}
                <span className={`text-xs px-1.5 py-0.5 rounded ${dentalRatingType === "contributory" ? "bg-emerald-700" : "bg-amber-700"}`}>
                  {dentalRatingType === "contributory" ? "Contrib" : "Vol"}
                </span>
                <button onClick={() => setSelectedDental(null)} className="ml-1 text-pink-400 hover:text-white">×</button>
              </span>
            )}
            {selectedVision && (
              <span className="px-3 py-1.5 rounded-full bg-cyan-900/50 border border-cyan-700 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                {selectedVision.plan}
                <span className={`text-xs px-1.5 py-0.5 rounded ${visionRatingType === "contributory" ? "bg-emerald-700" : "bg-amber-700"}`}>
                  {visionRatingType === "contributory" ? "Contrib" : "Vol"}
                </span>
                <button onClick={() => setSelectedVision(null)} className="ml-1 text-cyan-400 hover:text-white">×</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Per-Employee Breakdown */}
      {employeeCosts && (
        <div className="mb-8 p-5 rounded-xl bg-slate-800/60 border border-slate-700">
          <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Per-Employee Monthly Cost Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                  <th className="text-left py-3 px-2">Employee</th>
                  <th className="text-center py-3 px-2">Age</th>
                  <th className="text-center py-3 px-2">Tier</th>
                  <th className="text-right py-3 px-2 text-blue-400">Medical</th>
                  <th className="text-right py-3 px-2 text-pink-400">Dental</th>
                  <th className="text-right py-3 px-2 text-cyan-400">Vision</th>
                  <th className="text-right py-3 px-2">Total</th>
                  <th className="text-right py-3 px-2 text-emerald-400">ER Pays</th>
                  <th className="text-right py-3 px-2 text-orange-400">EE Pays</th>
                </tr>
              </thead>
              <tbody>
                {employeeCosts.map((emp, i) => (
                  <tr key={i} className={`border-b border-slate-700/50 ${emp.tier === "EC" ? 'bg-cyan-900/10' : ''}`}>
                    <td className="py-3 px-2">
                      <span className="font-medium">{emp.name}</span>
                    </td>
                    <td className="text-center py-3 px-2 text-slate-400">{emp.age}</td>
                    <td className="text-center py-3 px-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${emp.tier === "EC" ? "bg-cyan-800 text-cyan-300" : "bg-slate-700 text-slate-300"}`}>
                        {emp.tier === "EC" ? "EE+Child" : "EE Only"}
                      </span>
                    </td>
                    <td className="text-right py-3 px-2">
                      <div>{formatCurrency(emp.medicalEE + emp.medicalDep)}</div>
                      {emp.medicalDep > 0 && <div className="text-xs text-slate-500">({formatCurrency(emp.medicalEE)} + {formatCurrency(emp.medicalDep)})</div>}
                    </td>
                    <td className="text-right py-3 px-2">{formatCurrency(emp.dentalRate)}</td>
                    <td className="text-right py-3 px-2">{formatCurrency(emp.visionRate)}</td>
                    <td className="text-right py-3 px-2 font-medium">{formatCurrency(emp.totalPremium)}</td>
                    <td className="text-right py-3 px-2 text-emerald-400 font-medium">{formatCurrency(emp.employerTotal)}</td>
                    <td className="text-right py-3 px-2 text-orange-400 font-medium">{formatCurrency(emp.employeePays)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-600 font-medium">
                  <td className="py-3 px-2" colSpan={6}>TOTAL</td>
                  <td className="text-right py-3 px-2">{formatCurrency(packageCosts.totalMonthly)}</td>
                  <td className="text-right py-3 px-2 text-emerald-400">{formatCurrency(packageCosts.employerMonthly)}</td>
                  <td className="text-right py-3 px-2 text-orange-400">{formatCurrency(packageCosts.employeeMonthly)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Medical Plans */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-light tracking-wide flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Medical Plans
            <span className="text-xs text-slate-500 ml-2">({medEeContrib}% EE / {medDepContrib}% Dep)</span>
          </h2>
          <div className="flex gap-3 flex-wrap">
            <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500">
              <option value="All">All Tiers</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
            <select value={carrierFilter} onChange={(e) => setCarrierFilter(e.target.value)} className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500">
              {carriers.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500">
              <option value="employerCost">Sort by Employer Cost</option>
              <option value="total">Sort by Total Premium</option>
              <option value="carrier">Sort by Carrier</option>
              <option value="tier">Sort by Tier</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredMedical.map((plan, i) => {
            const colors = tierColors[plan.tier];
            const isSelected = selectedMedical?.plan === plan.plan && selectedMedical?.carrier === plan.carrier;
            const isLowest = i === 0 && sortBy === "employerCost";
            return (
              <div
                key={`${plan.carrier}-${plan.plan}`}
                onClick={() => setSelectedMedical(isSelected ? null : plan)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected ? "bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20" : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${colors.badge}`}>{plan.tier}</span>
                    <span className="font-medium">{plan.carrier}</span>
                    {isLowest && <span className="px-2 py-0.5 rounded text-xs bg-emerald-600 text-white">Lowest ER Cost</span>}
                  </div>
                  <div className="text-right flex gap-6 items-center">
                    <div>
                      <p className="text-slate-500 text-xs">Total</p>
                      <p className="text-lg">{formatCurrency(plan.total)}</p>
                    </div>
                    <div>
                      <p className="text-emerald-500 text-xs">Employer</p>
                      <p className="text-lg text-emerald-400">{formatCurrency(plan.employerCost)}</p>
                    </div>
                    <div>
                      <p className="text-orange-500 text-xs">Employee</p>
                      <p className="text-lg text-orange-400">{formatCurrency(plan.employeeCost)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                  <div><span className="text-slate-500">Deductible:</span> <span className="text-slate-300">{plan.deductible}</span></div>
                  <div><span className="text-slate-500">OOP Max:</span> <span className="text-slate-300">{plan.oop}</span></div>
                  <div><span className="text-slate-500">PCP:</span> <span className="text-slate-300">{plan.pcp}</span></div>
                  <div><span className="text-slate-500">Specialist:</span> <span className="text-slate-300">{plan.specialist}</span></div>
                  <div><span className="text-slate-500">Hospital:</span> <span className="text-slate-300">{plan.hospital}</span></div>
                  <div className="text-slate-400 text-xs self-center truncate">{plan.plan}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dental Plans */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-light tracking-wide flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            Dental Plans
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${dentalRatingType === "contributory" ? "bg-emerald-600" : "bg-amber-600"}`}>
              {dentalRatingType === "contributory" ? "Contributory" : "Voluntary"}
            </span>
            <span className="text-xs text-slate-500">({denEeContrib}% EE)</span>
          </h2>
          <RatingTypeToggle value={dentalRatingType} onChange={handleDentalRatingChange} />
        </div>

        {/* Rate Tier Legend */}
        <div className="mb-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700">
          <p className="text-xs text-slate-400 mb-2">Monthly Rates by Tier:</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="text-slate-300"><span className="text-slate-500">EE Only:</span> Employee Only</span>
            <span className="text-slate-300"><span className="text-slate-500">EE+Spouse:</span> Employee + Spouse</span>
            <span className="text-slate-300"><span className="text-slate-500">EE+Child:</span> Employee + Children</span>
            <span className="text-slate-300"><span className="text-slate-500">Family:</span> Employee + Spouse + Children</span>
          </div>
        </div>

        <div className="grid gap-3">
          {sortedDentalPlans.map((plan, i) => {
            const isSelected = selectedDental?.plan === plan.plan;
            const isLowest = i === 0;
            return (
              <div
                key={`${plan.carrier}-${plan.plan}`}
                onClick={() => setSelectedDental(isSelected ? null : plan)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected ? "bg-pink-900/30 border-pink-500 shadow-lg shadow-pink-500/20" : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{plan.carrier}</p>
                      {isLowest && <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-600 text-white">Lowest</span>}
                    </div>
                    <p className="text-sm text-slate-400">{plan.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-lg">{formatCurrency(plan.employerCost)}<span className="text-xs text-slate-400"> ER/mo</span></p>
                    <p className="text-orange-400 text-sm">{formatCurrency(plan.employeeCost)}<span className="text-xs text-slate-400"> EE/mo</span></p>
                    <p className="text-slate-500 text-xs">{formatCurrency(plan.total)} total</p>
                  </div>
                </div>

                {/* Rate Tiers */}
                <div className="mb-3 p-3 rounded bg-slate-700/30">
                  <p className="text-xs text-slate-500 mb-2">Monthly Rates:</p>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-slate-500 text-xs">EE Only</p>
                      <p className="font-medium">{formatCurrency(plan.eeRate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs">EE+Spouse</p>
                      <p className="font-medium">{formatCurrency(plan.esRate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs">EE+Child</p>
                      <p className="font-medium">{formatCurrency(plan.ecRate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-xs">Family</p>
                      <p className="font-medium">{formatCurrency(plan.famRate)}</p>
                    </div>
                  </div>
                </div>

                {/* Coverage Details */}
                <div className="grid grid-cols-6 gap-2 text-sm">
                  <div className="text-center p-2 rounded bg-slate-700/50">
                    <p className="text-slate-500 text-xs">Prev</p>
                    <p className="font-medium">{plan.preventive}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-slate-700/50">
                    <p className="text-slate-500 text-xs">Basic</p>
                    <p className="font-medium">{plan.basic}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-slate-700/50">
                    <p className="text-slate-500 text-xs">Major</p>
                    <p className="font-medium">{plan.major}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-slate-700/50">
                    <p className="text-slate-500 text-xs">Ortho</p>
                    <p className="font-medium">{plan.ortho}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-slate-700/50">
                    <p className="text-slate-500 text-xs">Max</p>
                    <p className="font-medium">{plan.annualMax}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-slate-700/50">
                    <p className="text-slate-500 text-xs">Ded</p>
                    <p className="font-medium text-xs">{plan.deductible}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vision Plans */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-light tracking-wide flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
            Vision Plans
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${visionRatingType === "contributory" ? "bg-emerald-600" : "bg-amber-600"}`}>
              {visionRatingType === "contributory" ? "Contributory" : "Voluntary"}
            </span>
            <span className="text-xs text-slate-500">({visEeContrib}% EE)</span>
          </h2>
          <RatingTypeToggle value={visionRatingType} onChange={handleVisionRatingChange} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {sortedVisionPlans.map((plan, i) => {
            const isSelected = selectedVision?.plan === plan.plan;
            const isLowest = i === 0;
            return (
              <div
                key={`${plan.carrier}-${plan.plan}`}
                onClick={() => setSelectedVision(isSelected ? null : plan)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected ? "bg-cyan-900/30 border-cyan-500 shadow-lg shadow-cyan-500/20" : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{plan.carrier}</p>
                      {isLowest && <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-600 text-white">Lowest</span>}
                    </div>
                    <p className="text-sm text-slate-400">{plan.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400">{formatCurrency(plan.employerCost)}<span className="text-xs text-slate-400"> ER</span></p>
                    <p className="text-orange-400 text-sm">{formatCurrency(plan.employeeCost)}<span className="text-xs text-slate-400"> EE</span></p>
                  </div>
                </div>

                {/* Rate Tiers */}
                <div className="mb-3 p-2 rounded bg-slate-700/30">
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-slate-500">EE</p>
                      <p className="font-medium">{formatCurrency(plan.eeRate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500">+Spouse</p>
                      <p className="font-medium">{formatCurrency(plan.esRate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500">+Child</p>
                      <p className="font-medium">{formatCurrency(plan.ecRate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500">Family</p>
                      <p className="font-medium">{formatCurrency(plan.famRate)}</p>
                    </div>
                  </div>
                </div>

                {/* Coverage */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-1.5 rounded bg-slate-700/50">
                    <p className="text-slate-500">Exam</p>
                    <p>{plan.exam}</p>
                  </div>
                  <div className="text-center p-1.5 rounded bg-slate-700/50">
                    <p className="text-slate-500">Frames</p>
                    <p>{plan.frames}</p>
                  </div>
                  <div className="text-center p-1.5 rounded bg-slate-700/50">
                    <p className="text-slate-500">Contacts</p>
                    <p>{plan.contacts}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-8 text-center text-slate-500 text-xs">
        <p>Quote ID: Beam 725527</p>
        <p>Presented by Caffrey Insurance Solutions, Inc. • License# 0H66348</p>
        <p className="mt-1">Rates are preliminary and subject to carrier approval. All rates monthly for 12 pay periods.</p>
        <p className="mt-2 text-amber-500/70">LOCAL TESTING VERSION - Beam Dental & Vision Only</p>
      </footer>
    </div>
  );
}
