import { useState, useEffect } from "react";
import "@/App.css";

const repoData = {
  repositories: [
    {
      name: "CloutScape",
      fullName: "damienmarx/CloutScape",
      url: "https://github.com/damienmarx/CloutScape",
      description: "The Ultimate RSPS & Gambling Ecosystem - Full gambling suite with RSPS integration",
      language: "Java",
      size: "59.3MB",
      stars: 0,
      forks: 0,
      created: "2026-02-17",
      updated: "2026-03-03",
      license: "None",
      potential: 95,
      monetization: 98,
      complexity: 92,
      scalability: 85,
      features: [
        "Advanced Slots & Keno Games",
        "Provably Fair Crash Game",
        "Syndicate Referral Program (15% tiers)",
        "Real-time GP Balance Sync",
        "Discord Bot Auto-Setup",
        "PvP Kill Tracking System",
        "Event Management (Giveaways, Tournaments)",
        "Flask + JavaScript Stack"
      ],
      techStack: ["Python", "Flask", "JavaScript", "HTML5", "Tailwind CSS", "Java RSPS"],
      category: "gambling",
      revenueModel: "House Edge + Referral Commissions",
      monthlyPotential: "$50,000 - $500,000+",
      riskLevel: "High (Legal/Regulatory)",
      uniqueFeatures: [
        "RSPS-to-Web GP synchronization",
        "Provably fair cryptographic verification",
        "Multi-tier affiliate syndicate program",
        "Discord community auto-setup"
      ]
    },
    {
      name: "Codez (GambleCodez)",
      fullName: "damienmarx/Codez",
      url: "https://github.com/damienmarx/Codez",
      description: "Professional referral link management system with dark neon theme for casino affiliates",
      language: "TypeScript",
      size: "861KB",
      stars: 1,
      forks: 0,
      created: "2026-03-10",
      updated: "2026-03-12",
      license: "None",
      potential: 85,
      monetization: 90,
      complexity: 75,
      scalability: 88,
      features: [
        "Dark Neon Cyberpunk UI",
        "48-Hour Promo Calendar",
        "Auto Affiliate Link Detection",
        "Telegram HTML Copy Buttons",
        "Click Analytics Dashboard",
        "Database Seeding (60+ Links)",
        "Replit Auth Integration"
      ],
      techStack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Drizzle ORM"],
      category: "affiliate-tools",
      revenueModel: "SaaS Subscription + Affiliate Revenue Share",
      monthlyPotential: "$5,000 - $50,000",
      riskLevel: "Medium (Gambling Affiliate)",
      uniqueFeatures: [
        "Telegram-optimized posting workflow",
        "Time-sensitive promo management",
        "Auto-populate affiliate URLs",
        "Beautiful cyberpunk aesthetic"
      ]
    },
    {
      name: "KodakGP",
      fullName: "damienmarx/KodakGP",
      url: "https://github.com/damienmarx/KodakGP",
      description: "Premium OSRS Gold & Scripts Marketplace - E-commerce for gaming items",
      language: "JavaScript",
      size: "267KB",
      stars: 0,
      forks: 0,
      created: "2026-03-10",
      updated: "2026-03-10",
      license: "None",
      potential: 80,
      monetization: 88,
      complexity: 70,
      scalability: 82,
      features: [
        "Gold Package Marketplace (1M-1B)",
        "Premium Automation Scripts Store",
        "Live Price Ticker",
        "User Account System",
        "Admin Panel",
        "Shopping Cart + Checkout",
        "CloutScape Affiliate Integration Plan"
      ],
      techStack: ["React 19", "FastAPI", "MongoDB", "Tailwind CSS", "JWT Auth"],
      category: "marketplace",
      revenueModel: "Transaction Fees + Margin on Gold",
      monthlyPotential: "$10,000 - $100,000",
      riskLevel: "Medium-High (ToS Violations)",
      uniqueFeatures: [
        "Cross-platform with CloutScape SSO",
        "Real-time gold price tracking",
        "PvP & Skilling automation scripts",
        "Unified wallet system planned"
      ]
    },
    {
      name: "BGaming-",
      fullName: "damienmarx/BGaming-",
      url: "https://github.com/damienmarx/BGaming-",
      description: "Demo-to-Real Money Session Converter - Become your own casino provider",
      language: "JavaScript",
      size: "36KB",
      stars: 0,
      forks: 0,
      created: "2026-03-14",
      updated: "2026-03-14",
      license: "None",
      potential: 92,
      monetization: 95,
      complexity: 85,
      scalability: 90,
      features: [
        "Demo to Real Money Conversion",
        "Custom RTP Configuration",
        "Multi-Currency Support",
        "Custom Balance Management",
        "No Middleman Commissions",
        "BGaming Full Support"
      ],
      techStack: ["Node.js", "Express"],
      category: "casino-infrastructure",
      revenueModel: "House Edge + License Fees",
      monthlyPotential: "$100,000 - $1,000,000+",
      riskLevel: "Very High (Legal/Licensing)",
      uniqueFeatures: [
        "Run your own casino provider",
        "Configure RTP per game",
        "Zero middleman fees",
        "Full BGaming integration"
      ]
    },
    {
      name: "openrs2",
      fullName: "damienmarx/openrs2",
      url: "https://github.com/damienmarx/openrs2",
      description: "Open-source RuneScape multiplayer server compatible with build 550 client",
      language: "Kotlin/Java",
      size: "4.5MB",
      stars: 0,
      forks: 0,
      created: "2026-02-18",
      updated: "2026-02-18",
      license: "ISC",
      potential: 75,
      monetization: 60,
      complexity: 95,
      scalability: 80,
      features: [
        "Build 550 Client Compatible",
        "Cache Decompilation Tools",
        "Network Protocol Implementation",
        "Deobfuscation Suite",
        "Injection Framework",
        "HTTP Server Components"
      ],
      techStack: ["Kotlin", "Java", "Gradle", "Netty"],
      category: "game-server",
      revenueModel: "Donations + Premium Features",
      monthlyPotential: "$1,000 - $10,000",
      riskLevel: "Medium (IP Concerns)",
      uniqueFeatures: [
        "Complete RSPS toolkit",
        "Build 550 compatibility",
        "Professional deobfuscation",
        "Active community support"
      ]
    },
    {
      name: "Precision",
      fullName: "damienmarx/Precision",
      url: "https://github.com/damienmarx/Precision",
      description: "Free AI Agents Resources - Comprehensive 2026 Learning Hub for AI/ML",
      language: "Markdown",
      size: "67KB",
      stars: 0,
      forks: 0,
      created: "2026-03-18",
      updated: "2026-03-18",
      license: "MIT",
      potential: 70,
      monetization: 45,
      complexity: 20,
      scalability: 95,
      features: [
        "Curated GitHub Repos List",
        "YouTube Course Collection",
        "Framework Comparisons",
        "Community Resources",
        "Learning Paths",
        "Free Books & PDFs"
      ],
      techStack: ["Markdown", "GitHub"],
      category: "educational",
      revenueModel: "Affiliate Links + Sponsorships",
      monthlyPotential: "$500 - $5,000",
      riskLevel: "Very Low",
      uniqueFeatures: [
        "Comprehensive AI agent resources",
        "2026 updated content",
        "Multiple learning paths",
        "Active maintenance"
      ]
    },
    {
      name: "Alpharecovery",
      fullName: "damienmarx/Alpharecovery",
      url: "https://github.com/damienmarx/Alpharecovery",
      description: "Full-stack application (Details pending - React/FastAPI structure)",
      language: "JavaScript",
      size: "242KB",
      stars: 0,
      forks: 0,
      created: "2026-03-11",
      updated: "2026-03-11",
      license: "None",
      potential: 55,
      monetization: 50,
      complexity: 60,
      scalability: 70,
      features: [
        "React Frontend",
        "FastAPI Backend",
        "MongoDB Database",
        "Test Reports System",
        "Memory Management"
      ],
      techStack: ["React", "FastAPI", "MongoDB"],
      category: "unknown",
      revenueModel: "TBD",
      monthlyPotential: "TBD",
      riskLevel: "Unknown",
      uniqueFeatures: ["Emergent platform structure", "Full-stack boilerplate"]
    },
    {
      name: "myshit",
      fullName: "damienmarx/myshit",
      url: "https://github.com/damienmarx/myshit",
      description: "Personal project repository (React/FastAPI structure)",
      language: "JavaScript",
      size: "276KB",
      stars: 0,
      forks: 0,
      created: "2026-03-18",
      updated: "2026-03-18",
      license: "None",
      potential: 50,
      monetization: 40,
      complexity: 55,
      scalability: 65,
      features: [
        "React Frontend",
        "FastAPI Backend",
        "MongoDB Database",
        "Design Guidelines",
        "Test Framework"
      ],
      techStack: ["React", "FastAPI", "MongoDB"],
      category: "personal",
      revenueModel: "N/A",
      monthlyPotential: "N/A",
      riskLevel: "N/A",
      uniqueFeatures: ["Personal workspace", "Development sandbox"]
    }
  ],
  summary: {
    totalRepos: 8,
    totalSize: "65.5MB",
    topLanguages: ["JavaScript", "TypeScript", "Python", "Java", "Kotlin"],
    avgPotential: 75.25,
    totalMonthlyPotential: "$166,500 - $1,665,000+",
    primaryFocus: "Gambling & Gaming Ecosystem"
  }
};

const CategoryBadge = ({ category }) => {
  const colors = {
    gambling: "from-red-500 to-orange-500",
    "affiliate-tools": "from-purple-500 to-pink-500",
    marketplace: "from-green-500 to-emerald-500",
    "casino-infrastructure": "from-yellow-500 to-amber-500",
    "game-server": "from-blue-500 to-cyan-500",
    educational: "from-indigo-500 to-violet-500",
    unknown: "from-gray-500 to-slate-500",
    personal: "from-slate-500 to-zinc-500"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${colors[category] || colors.unknown} text-white uppercase tracking-wider`}>
      {category.replace("-", " ")}
    </span>
  );
};

const RiskBadge = ({ risk }) => {
  const colors = {
    "Very High": "bg-red-500/20 text-red-400 border-red-500/30",
    "High": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "Medium-High": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Medium": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Very Low": "bg-green-500/20 text-green-400 border-green-500/30",
    "Unknown": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    "N/A": "bg-slate-500/20 text-slate-400 border-slate-500/30"
  };
  
  const riskLevel = risk.split(" (")[0];
  
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${colors[riskLevel] || colors.Unknown}`}>
      {risk}
    </span>
  );
};

const PotentialMeter = ({ value, label }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-slate-400 w-20">{label}</span>
    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${
          value >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
          value >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
          value >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
          'bg-gradient-to-r from-red-500 to-orange-400'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-xs font-mono text-slate-300 w-8">{value}%</span>
  </div>
);

const RepoCard = ({ repo, index, isExpanded, onToggle }) => {
  return (
    <div 
      className={`relative group transition-all duration-300 ${isExpanded ? 'col-span-full' : ''}`}
      data-testid={`repo-card-${repo.name.toLowerCase()}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${
        repo.potential >= 90 ? 'from-emerald-500/20 to-cyan-500/20' :
        repo.potential >= 80 ? 'from-blue-500/20 to-purple-500/20' :
        repo.potential >= 70 ? 'from-amber-500/20 to-orange-500/20' :
        'from-slate-500/20 to-zinc-500/20'
      } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                #{index + 1}
              </span>
              <h3 className="text-xl font-bold text-white">{repo.name}</h3>
              <CategoryBadge category={repo.category} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{repo.description}</p>
          </div>
          <a 
            href={repo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            data-testid={`github-link-${repo.name.toLowerCase()}`}
          >
            <svg className="w-6 h-6 text-slate-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Metrics */}
        <div className="space-y-2 mb-4">
          <PotentialMeter value={repo.potential} label="Potential" />
          <PotentialMeter value={repo.monetization} label="Revenue" />
          <PotentialMeter value={repo.complexity} label="Complexity" />
          <PotentialMeter value={repo.scalability} label="Scalability" />
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs">
          <span className="px-2 py-1 bg-slate-800 rounded-lg text-slate-300">
            <span className="text-slate-500">Lang:</span> {repo.language}
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded-lg text-slate-300">
            <span className="text-slate-500">Size:</span> {repo.size}
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded-lg text-slate-300">
            <span className="text-slate-500">★</span> {repo.stars}
          </span>
          <RiskBadge risk={repo.riskLevel} />
        </div>

        {/* Revenue Potential */}
        {repo.monthlyPotential && repo.monthlyPotential !== "TBD" && repo.monthlyPotential !== "N/A" && (
          <div className="mb-4 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl">
            <div className="text-xs text-emerald-400 mb-1">Monthly Revenue Potential</div>
            <div className="text-lg font-bold text-emerald-300">{repo.monthlyPotential}</div>
            <div className="text-xs text-slate-400 mt-1">via {repo.revenueModel}</div>
          </div>
        )}

        {/* Expand Button */}
        <button 
          onClick={onToggle}
          className="w-full py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          data-testid={`expand-${repo.name.toLowerCase()}`}
        >
          {isExpanded ? '▲ Collapse Details' : '▼ View Full Analysis'}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4 animate-fadeIn">
            {/* Features */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {repo.features.map((feature, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {repo.techStack.map((tech, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Unique Features */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Unique Selling Points</h4>
              <ul className="space-y-1">
                {repo.uniqueFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Created: {repo.created}</span>
              <span>Updated: {repo.updated}</span>
              <span>License: {repo.license}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ data }) => (
  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6" data-testid="summary-card">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-lg">
        📊
      </span>
      Portfolio Summary
    </h2>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-white">{data.totalRepos}</div>
        <div className="text-xs text-slate-400 mt-1">Repositories</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-emerald-400">{data.totalSize}</div>
        <div className="text-xs text-slate-400 mt-1">Total Code</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-cyan-400">{Math.round(data.avgPotential)}%</div>
        <div className="text-xs text-slate-400 mt-1">Avg Potential</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-xl font-bold text-amber-400">{data.primaryFocus}</div>
        <div className="text-xs text-slate-400 mt-1">Primary Focus</div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4">
      <div className="text-sm text-emerald-400 mb-1">Combined Monthly Revenue Potential</div>
      <div className="text-2xl font-bold text-white">{data.totalMonthlyPotential}</div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {data.topLanguages.map((lang, i) => (
        <span key={i} className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
          {lang}
        </span>
      ))}
    </div>
  </div>
);

const InsightsSection = () => (
  <div className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 border border-amber-500/20 rounded-2xl p-6" data-testid="insights-section">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <span className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-lg">
        💡
      </span>
      Strategic Insights
    </h2>

    <div className="space-y-4">
      <div className="bg-slate-900/50 rounded-xl p-4">
        <h3 className="font-semibold text-emerald-400 mb-2">🎯 Highest Potential: BGaming-</h3>
        <p className="text-sm text-slate-300">The casino infrastructure tool has the highest revenue ceiling at $100K-$1M+/month. Consider compliance consulting before scaling.</p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4">
        <h3 className="font-semibold text-blue-400 mb-2">🔗 Ecosystem Synergy</h3>
        <p className="text-sm text-slate-300">CloutScape + KodakGP + Codez form a powerful affiliate ecosystem. Cross-platform SSO and unified wallets would multiply value.</p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4">
        <h3 className="font-semibold text-purple-400 mb-2">📈 Growth Opportunities</h3>
        <ul className="text-sm text-slate-300 space-y-1 mt-2">
          <li>• Implement CloutScape x KodakGP unified account system</li>
          <li>• Add Stripe/Crypto payments to Codez for premium tiers</li>
          <li>• Build mobile apps for CloutScape gambling suite</li>
          <li>• Expand Precision into paid course platform</li>
        </ul>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4">
        <h3 className="font-semibold text-red-400 mb-2">⚠️ Risk Mitigation</h3>
        <ul className="text-sm text-slate-300 space-y-1 mt-2">
          <li>• Consult gambling license requirements by jurisdiction</li>
          <li>• Implement KYC/AML compliance for high-value transactions</li>
          <li>• Consider crypto-only payments for regulatory flexibility</li>
          <li>• Build fail-safes for RSPS ToS enforcement</li>
        </ul>
      </div>
    </div>
  </div>
);

const RecommendationsSection = () => (
  <div className="bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 border border-cyan-500/20 rounded-2xl p-6" data-testid="recommendations-section">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-lg">
        🚀
      </span>
      Prioritized Action Plan
    </h2>

    <div className="space-y-3">
      {[
        { priority: "P0", label: "Critical", color: "red", item: "Deploy BGaming- infrastructure with proper licensing consultation" },
        { priority: "P0", label: "Critical", color: "red", item: "Complete CloutScape ↔ KodakGP SSO integration" },
        { priority: "P1", label: "High", color: "orange", item: "Add payment processing to Codez (Stripe + Crypto)" },
        { priority: "P1", label: "High", color: "orange", item: "Implement provably fair verification UI for CloutScape" },
        { priority: "P2", label: "Medium", color: "yellow", item: "Build mobile-responsive PWA for CloutScape" },
        { priority: "P2", label: "Medium", color: "yellow", item: "Add AI-powered affiliate link recommendations to Codez" },
        { priority: "P3", label: "Low", color: "blue", item: "Expand Precision into video course platform" },
        { priority: "P3", label: "Low", color: "blue", item: "Open-source non-critical CloutScape components" }
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3">
          <span className={`px-2 py-0.5 text-xs font-bold rounded bg-${item.color}-500/20 text-${item.color}-400 border border-${item.color}-500/30`}>
            {item.priority}
          </span>
          <span className="text-sm text-slate-300">{item.item}</span>
        </div>
      ))}
    </div>
  </div>
);

function App() {
  const [expandedRepo, setExpandedRepo] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("potential");

  const filteredRepos = repoData.repositories
    .filter(repo => filter === "all" || repo.category === filter)
    .sort((a, b) => {
      if (sortBy === "potential") return b.potential - a.potential;
      if (sortBy === "monetization") return b.monetization - a.monetization;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const categories = ["all", ...new Set(repoData.repositories.map(r => r.category))];

  return (
    <div className="min-h-screen bg-slate-950 text-white" data-testid="audit-dashboard">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                GitHub Portfolio Audit
              </h1>
              <p className="text-slate-400 mt-1">
                damienmarx • {repoData.summary.totalRepos} repositories analyzed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/damienmarx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                data-testid="view-github-profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View Profile
              </a>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === cat 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  data-testid={`filter-${cat}`}
                >
                  {cat === "all" ? "All" : cat.replace("-", " ")}
                </button>
              ))}
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              data-testid="sort-select"
            >
              <option value="potential">Sort by Potential</option>
              <option value="monetization">Sort by Revenue</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Summary Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SummaryCard data={repoData.summary} />
          <InsightsSection />
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <RecommendationsSection />
        </div>

        {/* Repository Cards */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg">
            📁
          </span>
          Repository Analysis
          <span className="text-sm font-normal text-slate-400 ml-2">
            ({filteredRepos.length} shown)
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredRepos.map((repo, index) => (
            <RepoCard
              key={repo.name}
              repo={repo}
              index={index}
              isExpanded={expandedRepo === repo.name}
              onToggle={() => setExpandedRepo(expandedRepo === repo.name ? null : repo.name)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-slate-500 text-sm">
            Generated by Emergent AI • Audit Date: {new Date().toLocaleDateString()} • 
            <span className="text-emerald-400 ml-2">damienmarx Portfolio Analysis</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
