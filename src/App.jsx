import React, { useState, useMemo } from "react";

// Anthem BC Medical Plans ONLY
const medicalPlans = [
  {
    carrier: "Anthem BC",
    tier: "Silver",
    plan: "Anthem Silver PPO 55/2500/45% (8V9X)",
    deductible: "$2,500/$5,000",
    oop: "$8,700/$17,400",
    pcp: "$55",
    specialist: "$90",
    hospital: "45%",
    rx: "$15/$70/$110/30%"
  },
  {
    carrier: "Anthem BC",
    tier: "Gold",
    plan: "Anthem Gold PPO 30/500/20% (94JT)",
    deductible: "$500/$1,500",
    oop: "$7,900/$15,800",
    pcp: "$30",
    specialist: "$60",
    hospital: "20%",
    rx: "$10/$50/$90/30%"
  },
  {
    carrier: "Anthem BC",
    tier: "Platinum",
    plan: "Anthem Platinum PPO 15/40/10% (94HX)",
    deductible: "$0/$0",
    oop: "$3,800/$7,600",
    pcp: "$15",
    specialist: "$40",
    hospital: "10%",
    rx: "$5/$30/$50/30%"
  },
];

// Single Beam/VSP Vision Plan
const visionPlan = {
  carrier: "Beam/VSP",
  plan: "VSP 2 Single Option Employer Paid",
  exam: "$10 copay",
  lenses: "Covered after $10 copay",
  frames: "$150 allowance",
  contacts: "$150 allowance (after 15% fitting)",
  frequency: "12/12/12 months",
  eeRate: 8.55,
  esRate: 17.11,
  ecRate: 14.92,
  famRate: 23.47,
};

// Employees with age-based medical rates
const employees = [
  { name: "Matt Ayres", age: 51, tier: "EE", depCount: 0 },
  { name: "John-Paul Pavao", age: 31, tier: "EE", depCount: 0 },
  { name: "Zulema Morales-Sandoval", age: 24, tier: "EE", depCount: 0 },
  { name: "Bryce Heringer", age: 51, tier: "EE", depCount: 0 },
  { name: "Brian Wong", age: 50, tier: "EE", depCount: 0 },
  { name: "Melissa Wong", age: 50, tier: "EC", depCount: 1 },
];

// Age-based medical rates for Anthem BC
const medicalRatesByAge = {
  "Silver": { 51: 1146.19, 31: 712.30, 24: 614.58, 50: 1097.64 },
  "Gold": { 51: 1401.72, 31: 871.09, 24: 751.59, 50: 1342.34 },
  "Platinum": { 51: 1597.45, 31: 992.73, 24: 856.54, 50: 1529.78 },
};

// Dependent rates by tier
const medicalDepRates = {
  "Silver": 527.92,
  "Gold": 645.62,
  "Platinum": 735.77,
};

const tierColors = {
  Silver: { badge: "bg-slate-500", border: "border-slate-500", bg: "bg-slate-900/50" },
  Gold: { badge: "bg-amber-500", border: "border-amber-500", bg: "bg-amber-900/20" },
  Platinum: { badge: "bg-violet-500", border: "border-violet-500", bg: "bg-violet-900/20" },
};

const formatCurrency = (num) => num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function SectionHeader({ icon, title, subtitle, color = "slate" }) {
  const colors = {
    slate: "text-slate-300",
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h2 className={`text-xl font-semibold ${colors[color]}`}>{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-slate-500 ml-10">{subtitle}</p>}
      <div className={`h-px bg-gradient-to-r from-${color}-500/50 to-transparent mt-2`}></div>
    </div>
  );
}

function ContributionSlider({ label, value, onChange, color }) {
  return (
    <div className="flex-1 min-w-[140px]">
      <div className="flex justify-between items-center mb-1">
        <label className={`text-xs uppercase tracking-wider ${color}`}>{label}</label>
        <span className="font-medium text-lg">{value}%</span>
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
    </div>
  );
}

export default function App() {
  const [selectedMedical, setSelectedMedical] = useState(null);
  const [includeVision, setIncludeVision] = useState(true);

  // Contribution sliders
  const [medEeContrib, setMedEeContrib] = useState(100);
  const [medDepContrib, setMedDepContrib] = useState(0);
  const [visEeContrib, setVisEeContrib] = useState(100);

  // Calculate medical costs for each plan
  const medicalWithCosts = useMemo(() => {
    return medicalPlans.map(plan => {
      const tier = plan.tier;
      let eeTotal = 0, depTotal = 0;

      employees.forEach(emp => {
        eeTotal += medicalRatesByAge[tier]?.[emp.age] || 0;
        if (emp.depCount > 0) depTotal += medicalDepRates[tier] || 0;
      });

      const total = eeTotal + depTotal;
      const employerCost = (eeTotal * medEeContrib / 100) + (depTotal * medDepContrib / 100);
      const employeeCost = total - employerCost;

      return { ...plan, eeTotal, depTotal, total, employerCost, employeeCost };
    });
  }, [medEeContrib, medDepContrib]);

  // Calculate vision costs
  const visionCosts = useMemo(() => {
    if (!includeVision) return { total: 0, employerCost: 0, employeeCost: 0 };

    // 5 EE-only + 1 EC
    const total = (visionPlan.eeRate * 5) + visionPlan.ecRate;
    const employerCost = total * (visEeContrib / 100);
    const employeeCost = total - employerCost;

    return { total, employerCost, employeeCost };
  }, [includeVision, visEeContrib]);

  // Calculate per-employee breakdown when medical is selected
  const employeeCosts = useMemo(() => {
    if (!selectedMedical) return null;

    const tier = selectedMedical.tier;
    const medDepRate = medicalDepRates[tier] || 0;

    return employees.map(emp => {
      const medicalEE = medicalRatesByAge[tier]?.[emp.age] || 0;
      const medicalDepTotal = emp.depCount > 0 ? medDepRate : 0;
      const visionRate = includeVision ? (emp.tier === "EC" ? visionPlan.ecRate : visionPlan.eeRate) : 0;

      const medErPaysEE = medicalEE * (medEeContrib / 100);
      const medErPaysDep = medicalDepTotal * (medDepContrib / 100);
      const medEePays = (medicalEE - medErPaysEE) + (medicalDepTotal - medErPaysDep);
      const visErPays = visionRate * (visEeContrib / 100);
      const visEePays = visionRate - visErPays;

      const totalPremium = medicalEE + medicalDepTotal + visionRate;
      const employerTotal = medErPaysEE + medErPaysDep + visErPays;
      const employeePays = medEePays + visEePays;

      return {
        ...emp,
        medicalEE,
        medicalDep: medicalDepTotal,
        medicalErPays: medErPaysEE + medErPaysDep,
        medicalEePays: medEePays,
        visionRate,
        visionErPays: visErPays,
        visionEePays: visEePays,
        totalPremium,
        employerTotal,
        employeePays
      };
    });
  }, [selectedMedical, includeVision, medEeContrib, medDepContrib, visEeContrib]);

  // Total package costs
  const packageCosts = useMemo(() => {
    if (!employeeCosts) return { totalMonthly: 0, employerMonthly: 0, employeeMonthly: 0, medEr: 0, visEr: 0 };

    return employeeCosts.reduce((acc, emp) => ({
      totalMonthly: acc.totalMonthly + emp.totalPremium,
      employerMonthly: acc.employerMonthly + emp.employerTotal,
      employeeMonthly: acc.employeeMonthly + emp.employeePays,
      medEr: acc.medEr + emp.medicalErPays,
      visEr: acc.visEr + emp.visionErPays,
    }), { totalMonthly: 0, employerMonthly: 0, employeeMonthly: 0, medEr: 0, visEr: 0 });
  }, [employeeCosts]);

  // Quick scenarios
  const applyScenario = (med, vis) => {
    setMedEeContrib(med.ee);
    setMedDepContrib(med.dep);
    setVisEeContrib(vis.ee);
  };

  const scenarios = [
    { label: "100% Med EE / 100% Vision", med: { ee: 100, dep: 0 }, vis: { ee: 100 } },
    { label: "100% Med EE / 50% Vision", med: { ee: 100, dep: 0 }, vis: { ee: 50 } },
    { label: "100% Med EE+Dep / 100% Vision", med: { ee: 100, dep: 100 }, vis: { ee: 100 } },
    { label: "75% Med EE / Voluntary Vision", med: { ee: 75, dep: 0 }, vis: { ee: 0 } },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
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
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/50">
                <span className="text-blue-400 text-xs font-medium">ANTHEM BC MEDICAL</span>
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-700/50">
                <span className="text-cyan-400 text-xs font-medium">BEAM/VSP VISION</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Contribution Strategy */}
        <section className="mb-10">
          <SectionHeader icon="💰" title="Contribution Strategy" subtitle="Adjust employer contribution percentages" color="emerald" />
          <div className="p-6 rounded-xl bg-slate-900 border-2 border-slate-700">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Medical Contributions */}
              <div className="p-4 rounded-lg bg-slate-800/40 border-2 border-blue-600 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <h4 className="text-sm font-semibold text-slate-200">Medical (Anthem BC)</h4>
                </div>
                <div className="space-y-4">
                  <ContributionSlider label="Employee" value={medEeContrib} onChange={setMedEeContrib} color="text-emerald-400" />
                  <ContributionSlider label="Dependent" value={medDepContrib} onChange={setMedDepContrib} color="text-cyan-400" />
                </div>
              </div>

              {/* Vision Contributions */}
              <div className="p-4 rounded-lg bg-slate-800/40 border-2 border-cyan-600 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                    <h4 className="text-sm font-semibold text-slate-200">Vision (Beam/VSP)</h4>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVision}
                      onChange={(e) => setIncludeVision(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-slate-400">Include Vision</span>
                  </label>
                </div>
                <ContributionSlider
                  label="Employee"
                  value={visEeContrib}
                  onChange={setVisEeContrib}
                  color="text-emerald-400"
                />
                <p className="mt-3 text-xs text-slate-500">
                  VSP 2 Plan: $8.55/mo EE, $14.92/mo EE+Child, $150 frame allowance
                </p>
              </div>
            </div>

            {/* Quick Scenarios */}
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-3">Quick Scenarios:</p>
              <div className="flex flex-wrap gap-2">
                {scenarios.map(s => (
                  <button
                    key={s.label}
                    onClick={() => applyScenario(s.med, s.vis)}
                    className="px-4 py-2 rounded-lg text-sm bg-slate-800 border border-slate-600 hover:border-emerald-500 hover:bg-slate-700 transition-all"
                  >
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
                  <div className="flex justify-between"><span className="text-cyan-400">Vision:</span><span>{formatCurrency(packageCosts.visEr)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Plans */}
        <section className="mb-10">
          <SectionHeader
            icon="🏥"
            title="Medical Plans"
            subtitle={`Anthem Blue Cross PPO • ${medEeContrib}% EE / ${medDepContrib}% Dependent contribution`}
            color="blue"
          />
          <div className="grid gap-4">
            {medicalWithCosts.map((plan, i) => {
              const colors = tierColors[plan.tier];
              const isSelected = selectedMedical?.tier === plan.tier;

              return (
                <div
                  key={plan.tier}
                  onClick={() => setSelectedMedical(isSelected ? null : plan)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `${colors.bg} ${colors.border} shadow-lg`
                      : "bg-slate-900 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-lg text-sm font-bold text-white ${colors.badge}`}>
                        {plan.tier}
                      </span>
                      <span className="font-semibold text-lg">{plan.carrier}</span>
                      {isSelected && (
                        <span className="px-2 py-1 rounded text-xs bg-emerald-600 text-white font-medium">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-right flex gap-8 items-center">
                      <div>
                        <p className="text-slate-500 text-xs">Total</p>
                        <p className="text-xl font-medium">{formatCurrency(plan.total)}</p>
                      </div>
                      <div>
                        <p className="text-emerald-500 text-xs">Employer</p>
                        <p className="text-xl font-bold text-emerald-400">{formatCurrency(plan.employerCost)}</p>
                      </div>
                      <div>
                        <p className="text-orange-500 text-xs">Employee</p>
                        <p className="text-xl font-medium text-orange-400">{formatCurrency(plan.employeeCost)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Deductible:</span>
                      <span className="text-white font-medium ml-2">{plan.deductible}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">OOP Max:</span>
                      <span className="text-white font-medium ml-2">{plan.oop}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">PCP:</span>
                      <span className="text-white font-medium ml-2">{plan.pcp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Specialist:</span>
                      <span className="text-white font-medium ml-2">{plan.specialist}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Hospital:</span>
                      <span className="text-white font-medium ml-2">{plan.hospital}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Rx:</span>
                      <span className="text-white font-medium ml-2 text-xs">{plan.rx}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vision Plan */}
        <section className="mb-10">
          <SectionHeader
            icon="👁️"
            title="Vision Plan"
            subtitle={`Beam/VSP • ${visEeContrib}% EE contribution`}
            color="cyan"
          />
          <div className={`p-6 rounded-xl border-2 transition-all ${
            includeVision
              ? "bg-cyan-950/30 border-cyan-600"
              : "bg-slate-900 border-slate-700 opacity-60"
          }`}>
            <div className="flex flex-wrap justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{visionPlan.carrier}</h3>
                  <span className="px-2 py-1 rounded text-xs bg-cyan-600 text-white font-medium">
                    {visionPlan.plan}
                  </span>
                  {!includeVision && (
                    <span className="px-2 py-1 rounded text-xs bg-slate-600 text-slate-300">
                      Not Included
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-500 text-xs mb-1">Exam</p>
                    <p className="font-medium">{visionPlan.exam}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-500 text-xs mb-1">Lenses</p>
                    <p className="font-medium">{visionPlan.lenses}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-500 text-xs mb-1">Frames</p>
                    <p className="font-medium">{visionPlan.frames}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-500 text-xs mb-1">Contacts</p>
                    <p className="font-medium text-xs">{visionPlan.contacts}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-emerald-400 font-bold text-2xl">
                  {formatCurrency(visionCosts.employerCost)}
                  <span className="text-sm text-slate-400 font-normal">/mo ER</span>
                </p>
                <p className="text-orange-400 text-sm mt-1">
                  {formatCurrency(visionCosts.employeeCost)} EE
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Total: {formatCurrency(visionCosts.total)}/mo
                </p>
              </div>
            </div>

            {/* Vision Rate Table */}
            <div className="mt-6 p-4 rounded-lg bg-slate-800/30">
              <p className="text-xs text-slate-500 mb-3">Monthly Rates by Tier:</p>
              <div className="grid grid-cols-4 gap-4 text-sm text-center">
                <div>
                  <p className="text-slate-500 text-xs">EE Only</p>
                  <p className="font-semibold">{formatCurrency(visionPlan.eeRate)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">EE+Spouse</p>
                  <p className="font-semibold">{formatCurrency(visionPlan.esRate)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">EE+Child</p>
                  <p className="font-semibold">{formatCurrency(visionPlan.ecRate)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Family</p>
                  <p className="font-semibold">{formatCurrency(visionPlan.famRate)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Employee Cost Breakdown */}
        {employeeCosts && (
          <section className="mb-10">
            <SectionHeader
              icon="👥"
              title="Per-Employee Breakdown"
              subtitle={`${selectedMedical?.tier} plan selected • Monthly cost details`}
            />
            <div className="rounded-xl bg-slate-900 border-2 border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="text-left py-4 px-4">Employee</th>
                      <th className="text-center py-4 px-2">Age</th>
                      <th className="text-center py-4 px-2">Tier</th>
                      <th className="text-right py-4 px-2 text-blue-400">Medical</th>
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
                        <td className="text-right py-4 px-2">{formatCurrency(emp.visionRate)}</td>
                        <td className="text-right py-4 px-2 font-medium">{formatCurrency(emp.totalPremium)}</td>
                        <td className="text-right py-4 px-2 text-emerald-400 font-medium">{formatCurrency(emp.employerTotal)}</td>
                        <td className="text-right py-4 px-4 text-orange-400 font-medium">{formatCurrency(emp.employeePays)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-800 font-semibold">
                      <td className="py-4 px-4" colSpan={5}>MONTHLY TOTAL</td>
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

        {/* Select Medical Prompt */}
        {!selectedMedical && (
          <div className="mb-10 p-6 rounded-xl bg-slate-900 border-2 border-dashed border-slate-600 text-center">
            <p className="text-slate-400">
              <span className="text-2xl mb-2 block">☝️</span>
              Select a medical plan above to see the per-employee cost breakdown
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t-2 border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm mb-2">
            Presented by <span className="text-white font-medium">Caffrey Insurance Solutions, Inc.</span>
          </p>
          <p className="text-slate-500 text-xs">License# 0H66348 • Quote ID: 5984-7015</p>
          <p className="text-slate-600 text-xs mt-4">
            Rates are preliminary and subject to carrier approval. All rates monthly for 12 pay periods.
          </p>
        </div>
      </footer>
    </div>
  );
}
