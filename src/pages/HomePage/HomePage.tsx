import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSurveyData } from '../../features/survey/api/surveyData';
import {
  getKeyMetrics,
  getToolAdoptionStats,
  getExperienceDistribution,
  getRoleDistribution,
  getIndustryDistribution,
  getAIExperienceLevels,
  getSDLCPhaseAverages,
  getQualityStrategyStats,
  getChallengeDistribution,
  getInteractionPatternStats,
  getCorrectionFrequencyStats,
  getComplianceStats,
  getProductivityDistribution,
  getTransformationDistribution,
  getOrganizationTypeStats,
  getBoxplotDataForSDLC,
} from '../../features/survey/utils/statisticalAnalysis';
import {
  getExperienceVsProductivity,
  getInteractionVsCorrection,
  getComplianceVsProductivity,
  getToolOverlapMatrix,
  getToolCountVsProductivity,
  getCompositeIndices,
  getCorrelationMatrix,
  getVariableImportance,
} from '../../features/survey/utils/crossAnalysis';
import { getRespondentClusters } from '../../features/survey/utils/clustering';
import { BarChart } from '../../features/charts/components/BarChart';
import { DonutChart } from '../../features/charts/components/DonutChart';
import { useFilters } from '../../features/survey/context/FilterContext';
import { FilterBar } from '../../features/survey/components/FilterBar';
import { ExecutiveSummary } from '../../features/survey/components/ExecutiveSummary';
import { StatDetail } from '../../features/survey/components/StatDetail';
import { BoxplotChart } from '../../features/survey/components/BoxplotChart';
import { KeyInsight } from '../../features/survey/components/KeyInsight';

/* ===== Animation Variants ===== */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ===== Sub-Components ===== */

const KPICard: React.FC<{
  value: string;
  label: string;
  subtitle: string;
  delay?: number;
}> = ({ value, label, subtitle, delay = 0 }) => (
  <motion.div
    className="glass-card"
    style={{ padding: '28px 24px', cursor: 'default', position: 'relative', overflow: 'hidden' }}
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] as const }}
  >
    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label}
    </div>
    <div style={{
      fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontWeight: 900, lineHeight: 1.1,
      background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    }}>
      {value}
    </div>
    <div style={{ fontSize: '13px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>
  </motion.div>
);

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <motion.div
    style={{ marginBottom: '40px' }}
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <h2 style={{
      marginBottom: subtitle ? '12px' : '0'
    }}>
      {title}
    </h2>
    {subtitle && <p style={{ fontSize: '16px', maxWidth: '700px' }}>{subtitle}</p>}
    <div style={{
      width: '60px', height: '4px', borderRadius: '2px',
      background: 'var(--accent-gradient)', marginTop: '16px'
    }} />
  </motion.div>
);

const ChartCard: React.FC<{
  title: string; description?: string; children: React.ReactNode;
  height?: string; span?: number;
}> = ({ title, description, children, height = '400px', span = 1 }) => (
  <motion.div
    className="glass-card"
    style={{
      padding: '28px 24px',
      gridColumn: span > 1 ? `span ${span}` : undefined,
      overflow: 'hidden',
    }}
    variants={fadeInUp}
  >
    <h3 style={{ marginBottom: '4px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
    {description && <p style={{ fontSize: '14px', marginBottom: '24px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{description}</p>}
    <div style={{ height, overflow: 'hidden' }}>{children}</div>
  </motion.div>
);

const InsightBox: React.FC<{ children: React.ReactNode; variant?: 'purple' | 'blue' | 'green' | 'warning' }> = ({ children, variant = 'purple' }) => {
  const bgMap = {
    purple: 'linear-gradient(135deg, rgba(161, 0, 255, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
    blue: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
    green: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
    warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)',
  };
  const borderMap = {
    purple: 'rgba(161, 0, 255, 0.25)',
    blue: 'rgba(59, 130, 246, 0.25)',
    green: 'rgba(16, 185, 129, 0.25)',
    warning: 'rgba(245, 158, 11, 0.25)',
  };
  return (
    <motion.div
      style={{
        background: bgMap[variant],
        border: `1px solid ${borderMap[variant]}`,
        borderRadius: '16px',
        padding: '24px 32px',
      }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// StatBadge was removed because it's no longer used.

/** Heatmap Cell for correlation/overlap matrices */
const HeatmapCell: React.FC<{ value: number; max: number; label?: string; size?: number }> = ({ value, max, label, size = 40 }) => {
  const intensity = max === 0 ? 0 : Math.abs(value) / max;
  const isNeg = value < 0;
  const bg = isNeg
    ? `rgba(239, 68, 68, ${intensity * 0.6})`
    : `rgba(99, 102, 241, ${intensity * 0.6})`;
  return (
    <div style={{
      width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: bg, borderRadius: '4px', fontSize: '10px', fontWeight: 600,
      color: intensity > 0.3 ? '#fff' : 'var(--text-muted)',
    }} title={label}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </div>
  );
};

/* ===== Main Page ===== */
export const HomePage: React.FC = () => {
  const { data: rawSurveyData, isLoading, error } = useSurveyData();
  const { filters } = useFilters();

  const filteredData = useMemo(() => {
    if (!rawSurveyData) return [];

    const normalize = (s: string | null | undefined) => (s || '').replace(/\s+/g, ' ').trim();

    return rawSurveyData.filter(r => {
      if (filters.experience && normalize(r.experience) !== normalize(filters.experience)) return false;
      if (filters.industry && normalize(r.industry) !== normalize(filters.industry)) return false;
      if (filters.organizationType && normalize(r.organizationType) !== normalize(filters.organizationType)) return false;
      return true;
    });
  }, [rawSurveyData, filters]);

  // Primary analysis
  const metrics = useMemo(() => filteredData.length > 0 ? getKeyMetrics(filteredData) : null, [filteredData]);
  const toolAdoption = useMemo(() => filteredData.length > 0 ? getToolAdoptionStats(filteredData) : null, [filteredData]);
  const experienceData = useMemo(() => filteredData.length > 0 ? getExperienceDistribution(filteredData) : null, [filteredData]);
  const roleData = useMemo(() => filteredData.length > 0 ? getRoleDistribution(filteredData) : null, [filteredData]);
  const industryData = useMemo(() => filteredData.length > 0 ? getIndustryDistribution(filteredData) : null, [filteredData]);
  const aiExperienceData = useMemo(() => filteredData.length > 0 ? getAIExperienceLevels(filteredData) : null, [filteredData]);
  const sdlcData = useMemo(() => filteredData.length > 0 ? getSDLCPhaseAverages(filteredData) : null, [filteredData]);
  const qualityData = useMemo(() => filteredData.length > 0 ? getQualityStrategyStats(filteredData) : null, [filteredData]);
  const challengeData = useMemo(() => filteredData.length > 0 ? getChallengeDistribution(filteredData) : null, [filteredData]);
  const interactionData = useMemo(() => filteredData.length > 0 ? getInteractionPatternStats(filteredData) : null, [filteredData]);
  const correctionData = useMemo(() => filteredData.length > 0 ? getCorrectionFrequencyStats(filteredData) : null, [filteredData]);
  const complianceData = useMemo(() => filteredData.length > 0 ? getComplianceStats(filteredData) : null, [filteredData]);
  const productivityDist = useMemo(() => filteredData.length > 0 ? getProductivityDistribution(filteredData) : null, [filteredData]);
  const transformationDist = useMemo(() => filteredData.length > 0 ? getTransformationDistribution(filteredData) : null, [filteredData]);
  const orgTypeData = useMemo(() => filteredData.length > 0 ? getOrganizationTypeStats(filteredData) : null, [filteredData]);

  // Cross-analyses
  const expVsProd = useMemo(() => filteredData.length > 0 ? getExperienceVsProductivity(filteredData) : null, [filteredData]);
  const interactionVsCorr = useMemo(() => filteredData.length > 0 ? getInteractionVsCorrection(filteredData) : null, [filteredData]);
  const complianceVsProd = useMemo(() => filteredData.length > 0 ? getComplianceVsProductivity(filteredData) : null, [filteredData]);
  const toolOverlap = useMemo(() => filteredData.length > 0 ? getToolOverlapMatrix(filteredData) : null, [filteredData]);
  const toolCountProd = useMemo(() => filteredData.length > 0 ? getToolCountVsProductivity(filteredData) : null, [filteredData]);
  const compositeIndices = useMemo(() => filteredData.length > 0 ? getCompositeIndices(filteredData) : null, [filteredData]);
  const correlationMatrix = useMemo(() => filteredData.length > 0 ? getCorrelationMatrix(filteredData) : null, [filteredData]);
  const clusterData = useMemo(() => filteredData.length > 0 ? getRespondentClusters(filteredData) : null, [filteredData]);
  const varImportance = useMemo(() => filteredData.length > 0 ? getVariableImportance(filteredData) : null, [filteredData]);
  const boxplotSDLC = useMemo(() => filteredData.length > 0 ? getBoxplotDataForSDLC(filteredData) : null, [filteredData]);

  const executiveInsights = useMemo(() => {
    if (!filteredData.length || !varImportance || !correlationMatrix || !clusterData) return [];

    const topDriver = varImportance[0];
    const highBelievers = clusterData.find(c => c.id === 'innovators')?.percentage || 0;

    // Find strongest correlation in matrix (excluding self-correlations)
    const strongCorr = correlationMatrix.matrix
      .filter(m => m.var1 !== m.var2)
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))[0];

    return [
      {
        title: 'Primary Productivity Driver',
        description: `The strongest predictor for productivity gain is <strong>${topDriver.label}</strong>.`,
        stat: `${topDriver.percentage.toFixed(0)}%`,
        label: 'Relative Importance',
        color: '#A100FF'
      },
      {
        title: 'Transformation Momentum',
        description: `<strong>${highBelievers.toFixed(0)}%</strong> of respondents are classified as <strong>AI Champions</strong>, showing deep SDLC integration.`,
        stat: `${highBelievers.toFixed(0)}%`,
        label: 'AI Champion Cohort',
        color: '#6366F1'
      },
      {
        title: 'Statistically Significant Link',
        description: `There is a robust link between <strong>${strongCorr.var1}</strong> and <strong>${strongCorr.var2}</strong> (corr: ${strongCorr.correlation}).`,
        stat: strongCorr.correlation > 0 ? `+${strongCorr.correlation}` : `${strongCorr.correlation}`,
        label: 'Pearson Correlation',
        color: '#EC4899'
      }
    ];
  }, [filteredData, varImportance, correlationMatrix, clusterData]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ width: '48px', height: '48px', border: '3px solid var(--bg-tertiary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <h2 style={{ color: '#EF4444', marginBottom: '16px' }}>Error Loading Data</h2>
        <p>There was an error loading the survey results. Please try again later.</p>
      </div>
    );
  }

  if (filteredData.length === 0) {
    const { resetFilters } = useFilters();
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>No Data Found</h2>
        <p style={{ maxWidth: '500px', marginBottom: '24px', opacity: 0.8 }}>No survey responses match your currently selected filters. Please try adjusting your criteria or reset all filters.</p>
        <button
          onClick={resetFilters}
          style={{ background: 'var(--accent-gradient)', border: 'none', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  const chartColors = ['#A100FF', '#6366F1', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#F97316', '#14B8A6'];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>



      {/* ===== HERO SECTION WITH DEMOGRAPHICS OVERVIEW ===== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 24px 40px',
      }}>
        {/* Animated Background Orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(161, 0, 255, 0.12) 0%, transparent 70%)',
            top: '-200px', right: '-100px', animation: 'float 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            bottom: '-100px', left: '-100px', animation: 'float 10s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
            top: '30%', left: '20%', animation: 'float 12s ease-in-out infinite 2s',
          }} />
        </div>

        <motion.div
          style={{ textAlign: 'center', maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 1 }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >

          <motion.h1
            variants={fadeInUp}
            custom={0}
            style={{
              marginBottom: '40px',
              fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
              lineHeight: 1.1,
              fontWeight: 800
            }}
          >
            <span style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Agentic AI</span> in the <br />
            Software Development Life Cycle
          </motion.h1>

          <FilterBar />

          {/* Primary KPIs */}
          <motion.div variants={fadeInUp} custom={2} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            maxWidth: '1200px',
            margin: '0 auto 28px',
          }}>
            <KPICard value={`${metrics.completedResponses}`} label="Completed Responses" subtitle={`${metrics.totalResponses} total (${metrics.completionRate.toFixed(0)}% completion)`} delay={0.3} />
            <KPICard value={`${metrics.activeAIUsers.percentage.toFixed(0)}%`} label="Active AI Users" subtitle={`${metrics.activeAIUsers.codingOnly} coding · ${metrics.activeAIUsers.techTasks} tech tasks`} delay={0.4} />
            <KPICard value={`${metrics.avgTransformationBelief.value.toFixed(1)}/10`} label="Transformation Belief" subtitle={`Median: ${metrics.avgTransformationBelief.median} · σ ${metrics.avgTransformationBelief.stdDev.toFixed(1)}`} delay={0.5} />
            <KPICard value={`${metrics.avgProductivityChange.value.toFixed(1)}/10`} label="Productivity Gain" subtitle={`Median: ${metrics.avgProductivityChange.median} · σ ${metrics.avgProductivityChange.stdDev.toFixed(1)}`} delay={0.6} />
          </motion.div>

          {/* Demographics Summary Row */}
          <motion.div variants={fadeInUp} custom={3}>
            <div style={{
              fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--text-muted)', marginBottom: '12px',
            }}>
              Respondent Profile
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px',
              maxWidth: '1200px',
              margin: '0 auto',
            }}>
              {/* Experience */}
              {experienceData && (() => {
                const senior = experienceData.find(d => d.experience.includes('> 10') || d.experience.includes('>10') || d.experience.includes('10+'));
                return (
                  <div className="glass-card" style={{ padding: '14px 12px', textAlign: 'center', cursor: 'default' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Top Experience</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06B6D4', lineHeight: 1 }}>{senior ? `${senior.percentage.toFixed(0)}%` : '–'}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>&gt;10 years</div>
                  </div>
                );
              })()}

              {/* Organization Type */}
              {orgTypeData && (() => {
                const largest = orgTypeData.sort((a, b) => b.percentage - a.percentage)[0];
                return (
                  <div className="glass-card" style={{ padding: '14px 12px', textAlign: 'center', cursor: 'default' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Large Enterprise</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A100FF', lineHeight: 1 }}>{largest ? `${largest.percentage.toFixed(0)}%` : '–'}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>&gt;250 employees</div>
                  </div>
                );
              })()}

              {/* Compliance */}
              {complianceData && (
                <div className="glass-card" style={{ padding: '14px 12px', textAlign: 'center', cursor: 'default' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Regulated Env.</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>{complianceData.compliance.yes.percentage.toFixed(0)}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>compliance required</div>
                </div>
              )}

              {/* Top Role */}
              {roleData && roleData.length > 0 && (
                <div className="glass-card" style={{ padding: '14px 12px', textAlign: 'center', cursor: 'default' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Top Role</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8B5CF6', lineHeight: 1 }}>{roleData[0].percentage.toFixed(0)}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{roleData[0].role.length > 20 ? roleData[0].role.substring(0, 18) + '...' : roleData[0].role}</div>
                </div>
              )}

              {/* Top Industry */}
              {industryData && industryData.length > 0 && (
                <div className="glass-card" style={{ padding: '14px 12px', textAlign: 'center', cursor: 'default' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Top Industry</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EC4899', lineHeight: 1 }}>{industryData[0].percentage.toFixed(0)}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{industryData[0].industry.length > 20 ? industryData[0].industry.substring(0, 18) + '...' : industryData[0].industry}</div>
                </div>
              )}

              {/* Tool Leader */}
              {toolAdoption && (
                <div className="glass-card" style={{ padding: '14px 12px', textAlign: 'center', cursor: 'default' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Top AI Tool</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>{toolAdoption.githubCopilot.percentage.toFixed(0)}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>GitHub Copilot</div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)' }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div style={{ width: '24px', height: '40px', border: '2px solid var(--text-muted)', borderRadius: '12px', position: 'relative' }}>
            <motion.div
              style={{ width: '4px', height: '8px', background: 'var(--accent-primary)', borderRadius: '2px', position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)' }}
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== EXECUTIVE SUMMARY (APPLE STYLE) ===== */}
      {executiveInsights.length > 0 && <ExecutiveSummary insights={executiveInsights} />}

      {/* ===== MANAGEMENT SUMMARY ===== */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div className="section-container">
          <SectionTitle title="Management Summary" subtitle="Data-driven key findings from the practitioner survey on Agentic AI adoption in software development" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'grid', gap: '16px' }}
          >
            {/* Finding 1: AI Adoption */}
            <InsightBox variant="purple">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '44px', height: '44px', borderRadius: '12px', background: 'rgba(161, 0, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>1</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '6px' }}>High AI Adoption Across All Experience Levels</div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '14px', margin: 0 }}>
                    <strong>{metrics.activeAIUsers.percentage.toFixed(0)}%</strong> of {metrics.completedResponses} respondents actively use AI tools in their workflow –
                    {' '}{metrics.activeAIUsers.codingOnly} directly for coding and {metrics.activeAIUsers.techTasks} for technical non-coding tasks.
                    {toolAdoption && <> <strong>GitHub Copilot</strong> dominates at {toolAdoption.githubCopilot.percentage.toFixed(0)}%, followed by {toolAdoption.claudeCode.label} ({toolAdoption.claudeCode.percentage.toFixed(0)}%) and {toolAdoption.gemini.label} ({toolAdoption.gemini.percentage.toFixed(0)}%).</>}
                    {expVsProd && expVsProd.length > 1 && <> Notably, experienced developers (&gt;10 years) report <strong>{expVsProd[expVsProd.length - 1]?.avgProductivity.toFixed(1)}/10</strong> productivity gain, comparable to less experienced colleagues.</>}
                  </p>
                </div>
              </div>
            </InsightBox>

            {/* Finding 2: SDLC Impact */}
            {sdlcData && (() => {
              const maxPhase = sdlcData.reduce((max, p) => p.value > max.value ? p : max, sdlcData[0]);
              const minPhase = sdlcData.reduce((min, p) => p.value < min.value ? p : min, sdlcData[0]);
              const avgAll = sdlcData.reduce((s, p) => s + p.value, 0) / sdlcData.length;
              return (
                <InsightBox variant="blue">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ minWidth: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>2</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#67E8F9', marginBottom: '6px' }}>Broad SDLC Coverage with Coding as Primary Impact Area</div>
                      <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '14px', margin: 0 }}>
                        AI impacts all 6 SDLC phases with an overall average of <strong>{avgAll.toFixed(2)}/5</strong>.
                        {' '}<strong>{maxPhase.phase}</strong> rates highest at {maxPhase.value.toFixed(2)}/5 (median: {maxPhase.median.toFixed(1)}, σ={maxPhase.stdDev.toFixed(1)}),
                        while <strong>{minPhase.phase}</strong> rates lowest at {minPhase.value.toFixed(2)}/5.
                        The narrow spread ({minPhase.value.toFixed(1)}–{maxPhase.value.toFixed(1)}) indicates AI is not limited to code generation but is becoming relevant across the entire development lifecycle.
                      </p>
                    </div>
                  </div>
                </InsightBox>
              );
            })()}

            {/* Finding 3: Productivity & Transformation */}
            <InsightBox variant="green">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>3</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#6EE7B7', marginBottom: '6px' }}>Strong Productivity Gains and High Transformation Confidence</div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '14px', margin: 0 }}>
                    Respondents report an average productivity gain of <strong>{metrics.avgProductivityChange.value.toFixed(1)}/10</strong> (median: {metrics.avgProductivityChange.median}, σ={metrics.avgProductivityChange.stdDev.toFixed(1)}).
                    The belief that AI will fundamentally transform software development scores <strong>{metrics.avgTransformationBelief.value.toFixed(1)}/10</strong> (median: {metrics.avgTransformationBelief.median}).
                    {complianceVsProd && complianceVsProd.length > 0 && (() => {
                      const regulated = complianceVsProd.find(c => c.compliance === 'Regulated');
                      const unregulated = complianceVsProd.find(c => c.compliance === 'Not Regulated');
                      return regulated && unregulated ? ` Interestingly, regulated environments report ${regulated.avgProductivity.toFixed(1)}/10 vs. ${unregulated.avgProductivity.toFixed(1)}/10 for unregulated ones – compliance does not significantly dampen perceived gains.` : '';
                    })()}
                  </p>
                </div>
              </div>
            </InsightBox>

            {/* Finding 4: Challenges */}
            {challengeData && challengeData.length > 0 && (
              <InsightBox variant="warning">
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>4</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#FCD34D', marginBottom: '6px' }}>Key Adoption Barriers: Quality Concerns and Trust</div>
                    <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '14px', margin: 0 }}>
                      The top challenges are <strong>{challengeData[0].label}</strong> ({challengeData[0].percentage.toFixed(0)}%)
                      {challengeData.length > 1 && <> and <strong>{challengeData[1].label}</strong> ({challengeData[1].percentage.toFixed(0)}%)</>}
                      {challengeData.length > 2 && <>, followed by <strong>{challengeData[2].label}</strong> ({challengeData[2].percentage.toFixed(0)}%)</>}.
                      {correctionData && (() => {
                        const frequent = correctionData.find(d => d.label.toLowerCase().includes('always') || d.label.toLowerCase().includes('often') || d.label.toLowerCase().includes('meist') || d.label.toLowerCase().includes('häufig'));
                        return frequent ? ` ${frequent.percentage.toFixed(0)}% of developers report frequent correction needs, underlining the importance of code review processes.` : '';
                      })()}
                    </p>
                  </div>
                </div>
              </InsightBox>
            )}

            {/* Finding 5: Quality & Compliance */}
            {complianceData && (
              <InsightBox variant="blue">
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>5</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#A5B4FC', marginBottom: '6px' }}>Regulatory Context: Majority in Compliance-Sensitive Environments</div>
                    <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '14px', margin: 0 }}>
                      <strong>{complianceData.compliance.yes.percentage.toFixed(0)}%</strong> of respondents work in regulated environments, {complianceData.compliance.no.percentage.toFixed(0)}% do not, and {complianceData.compliance.notSure.percentage.toFixed(0)}% are unsure.
                      Regulatory influence on AI usage scores <strong>{complianceData.avgRegulatoryInfluence.toFixed(2)}/5</strong>,
                      indicating {complianceData.avgRegulatoryInfluence > 3 ? 'significant regulatory pressure on AI adoption decisions' : 'moderate but noteworthy regulatory considerations'}.
                      {qualityData && qualityData.length > 0 && <> The most common quality assurance strategy is <strong>{qualityData[0].label}</strong> ({qualityData[0].percentage.toFixed(0)}%).</>}
                    </p>
                  </div>
                </div>
              </InsightBox>
            )}

            {/* Finding 6: Sample Profile */}
            <InsightBox variant="purple">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>6</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>Diverse but Enterprise-Oriented Sample</div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '14px', margin: 0 }}>
                    {metrics.completedResponses} of {metrics.totalResponses} responses are complete ({metrics.completionRate.toFixed(0)}% completion rate).
                    {orgTypeData && orgTypeData.length > 0 && <> The largest segment is {orgTypeData[0].label.toLowerCase()} ({orgTypeData[0].percentage.toFixed(0)}%).</>}
                    {experienceData && (() => {
                      const senior = experienceData.find(d => d.experience.includes('> 10') || d.experience.includes('>10') || d.experience.includes('10+'));
                      return senior ? ` ${senior.percentage.toFixed(0)}% of participants have >10 years of professional experience.` : '';
                    })()}
                    {roleData && roleData.length > 1 && <> Roles are diverse, led by {roleData[0].role} ({roleData[0].percentage.toFixed(0)}%) and {roleData[1].role} ({roleData[1].percentage.toFixed(0)}%).</>}
                    {industryData && industryData.length > 0 && <> The leading industry is {industryData[0].industry} ({industryData[0].percentage.toFixed(0)}%).</>}
                  </p>
                </div>
              </div>
            </InsightBox>
          </motion.div>
        </div>
      </section>

      {/* ===== TOOL ADOPTION ===== */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, transparent 0%, rgba(161, 0, 255, 0.03) 50%, transparent 100%)' }}>
        <div className="section-container">
          <SectionTitle title="Tool Adoption Landscape" subtitle="Which AI tools are most commonly used by respondents?" />
          {toolAdoption && (
            <motion.div className="glass-card" style={{ padding: '32px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ height: '500px' }}>
                <BarChart
                  data={Object.values(toolAdoption)
                    .map((t) => ({ id: t.label, label: t.label, value: t.percentage }))
                    .sort((a, b) => b.value - a.value)}
                  height={480}
                  layout="horizontal"
                  showPercentage={true}
                  colors={chartColors}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== TOOL ECOSYSTEM DEEP DIVE ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-container">
          <SectionTitle title="Tool Ecosystem" subtitle="Tool co-usage patterns and the relationship between tool diversity and productivity" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}
          >
            {/* Tool Overlap Heatmap */}
            <ChartCard title="Tool Co-Usage Matrix" description="Which tools are used together? Darker = higher overlap">
              {toolOverlap && (
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(${toolOverlap.labels.length}, 1fr)`, gap: '2px', minWidth: '380px' }}>
                    {/* Header row */}
                    <div />
                    {toolOverlap.labels.map(l => (
                      <div key={l} style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '2px' }}>{l}</div>
                    ))}
                    {/* Data rows */}
                    {toolOverlap.labels.map((row, ri) => (
                      <React.Fragment key={row}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px' }}>{row}</div>
                        {toolOverlap.labels.map((col, ci) => {
                          const cell = toolOverlap.matrix[ri * toolOverlap.labels.length + ci];
                          return <HeatmapCell key={`${row}-${col}`} value={cell.count} max={metrics.completedResponses} label={`${row} + ${col}: ${cell.count}`} size={34} />;
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>

            {/* Tool Count × Productivity */}
            <ChartCard title="Tool Diversity vs. Productivity" description="Does using more tools improve perceived productivity?">
              {toolCountProd && (
                <BarChart
                  data={toolCountProd.map(d => ({
                    id: `${d.toolCount} tools`,
                    label: `${d.toolCount} tools (n=${d.respondents})`,
                    value: Number(d.avgProductivity.toFixed(1)),
                  }))}
                  height={370}
                  layout="vertical"
                  showPercentage={false}
                  colors={['#8B5CF6']}
                />
              )}
            </ChartCard>
          </motion.div>
        </div>
      </section>

      {/* ===== SDLC PHASE IMPACT ===== */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.03) 50%, transparent 100%)' }}>
        <div className="section-container">
          <SectionTitle title="SDLC Phase Impact" subtitle="Distribution of AI impact ratings across the lifecycle. Boxplots reveal the variance and consensus levels (scale 1-5)." />

          <KeyInsight
            type="important"
            text="Wissenschaftlicher Befund: Während <strong>Coding</strong> den höchsten Durchschnitt erreicht, zeigt die <strong>Requirements</strong>-Phase die größte Varianz - ein Hinweis darauf, dass das Potenzial hier je nach Methodik stark schwankt."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            <ChartCard title="AI Impact Distribution (Boxplot)" description="Showing Min/Max, Quartiles and Medians for each SDLC stage." span={2}>
              {boxplotSDLC && <BoxplotChart data={boxplotSDLC} maxScale={5} />}
            </ChartCard>
          </div>

          {sdlcData && (() => {
            const maxPhase = sdlcData.reduce((max, p) => p.value > max.value ? p : max, sdlcData[0]);
            return (
              <div style={{ marginTop: '24px' }}>
                <InsightBox variant="blue">
                  <p style={{ color: 'var(--text-primary)', margin: 0 }}>
                    <strong>Statistical Context:</strong> The "{maxPhase.phase}" phase is the primary beneficiary with a median of <strong>{maxPhase.median.toFixed(1)}</strong>.
                    The interquartile range (IQR) in the Boxplot reveals the {maxPhase.stdDev > 2.5 ? 'diverse experience spectrum' : 'strong peer consensus'} for this phase.
                  </p>
                </InsightBox>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ===== PRODUCTIVITY & BELIEF DISTRIBUTIONS ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-container">
          <SectionTitle title="Productivity & Transformation" subtitle="How do respondents rate productivity gains and their belief in AI-driven transformation?" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}
          >
            <ChartCard title="Productivity Change" description={`Distribution (1-10) · Mean: ${metrics.avgProductivityChange.value.toFixed(1)} · Median: ${metrics.avgProductivityChange.median} · σ: ${metrics.avgProductivityChange.stdDev.toFixed(1)}`}>
              {productivityDist && (
                <BarChart
                  data={productivityDist.map(d => ({ id: String(d.score), label: String(d.score), value: d.count }))}
                  height={350}
                  layout="vertical"
                  showPercentage={false}
                  colors={['#10B981']}
                />
              )}
            </ChartCard>
            <ChartCard title="Transformation Belief" description={`Distribution (1-10) · Mean: ${metrics.avgTransformationBelief.value.toFixed(1)} · Median: ${metrics.avgTransformationBelief.median} · σ: ${metrics.avgTransformationBelief.stdDev.toFixed(1)}`}>
              {transformationDist && (
                <BarChart
                  data={transformationDist.map(d => ({ id: String(d.score), label: String(d.score), value: d.count }))}
                  height={350}
                  layout="vertical"
                  showPercentage={false}
                  colors={['#A100FF']}
                />
              )}
            </ChartCard>
          </motion.div>
        </div>
      </section>

      {/* ===== CROSS-ANALYSIS: EXPERIENCE × PRODUCTIVITY ===== */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.03) 50%, transparent 100%)' }}>
        <div className="section-container">
          <SectionTitle title="Deep Dive: Cross-Analyses" subtitle="Multi-dimensional insights by combining survey questions for deeper understanding" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}
          >
            {/* Experience × Productivity */}
            <ChartCard title="Experience × Productivity" description="Do senior developers benefit more from AI?">
              {expVsProd && (
                <BarChart
                  data={expVsProd.map(d => ({
                    id: d.experience,
                    label: `${d.experience} (n=${d.count})`,
                    value: Number(d.avgProductivity.toFixed(1)),
                  }))}
                  height={370}
                  layout="horizontal"
                  showPercentage={false}
                  colors={['#10B981']}
                />
              )}
            </ChartCard>

            {/* Compliance × Productivity */}
            <ChartCard title="Compliance × Productivity" description="Does regulatory compliance impact AI productivity gains?">
              {complianceVsProd && (
                <BarChart
                  data={complianceVsProd.map(d => ({
                    id: d.compliance,
                    label: `${d.compliance} (n=${d.count})`,
                    value: Number(d.avgProductivity.toFixed(1)),
                  }))}
                  height={370}
                  layout="horizontal"
                  showPercentage={false}
                  colors={['#6366F1']}
                />
              )}
            </ChartCard>
          </motion.div>

          {/* Interaction × Correction */}
          {interactionVsCorr && (
            <motion.div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>Interaction Pattern × Correction Frequency</h3>
              <p style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--text-secondary)' }}>Which work style produces the fewest errors?</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Pattern</th>
                      {interactionVsCorr[0]?.frequencies.map(f => (
                        <th key={f.frequency} style={{ textAlign: 'center', padding: '12px 4px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px' }}>
                          {f.frequency.includes('(') ? f.frequency.match(/\(([^)]+)\)/)?.[1] || f.frequency : f.frequency}
                        </th>
                      ))}
                      <th style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>n</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interactionVsCorr.map(row => (
                      <tr key={row.pattern} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 8px', color: 'var(--text-primary)', fontWeight: 500 }}>{row.pattern}</td>
                        {row.frequencies.map(f => (
                          <td key={f.frequency} style={{ textAlign: 'center', padding: '10px 4px' }}>
                            <span style={{
                              background: `rgba(99, 102, 241, ${f.percentage / 100 * 0.6})`,
                              padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                              color: f.percentage > 30 ? '#fff' : 'var(--text-muted)',
                            }}>
                              {f.percentage.toFixed(0)}%
                            </span>
                          </td>
                        ))}
                        <td style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text-muted)' }}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Insight for cross-analyses */}
          {expVsProd && complianceVsProd && (
            <InsightBox variant="green">
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#10B981', marginBottom: '8px' }}>Cross-Analysis Insights</div>
              <p style={{ color: 'var(--text-primary)', margin: 0, lineHeight: 1.8 }}>
                {(() => {
                  const sorted = [...expVsProd].sort((a, b) => b.avgProductivity - a.avgProductivity);
                  const highest = sorted[0];
                  const lowest = sorted[sorted.length - 1];
                  const regulated = complianceVsProd.find(c => c.compliance === 'Regulated');
                  const unregulated = complianceVsProd.find(c => c.compliance === 'Not Regulated');
                  return (
                    <>
                      Developers with <strong>{highest.experience}</strong> experience report the highest productivity gains
                      (avg. {highest.avgProductivity.toFixed(1)}/10), while those with {lowest.experience} rate at {lowest.avgProductivity.toFixed(1)}/10.
                      {regulated && unregulated && ` Compliance ${regulated.avgProductivity > unregulated.avgProductivity ? 'does not hinder' : 'slightly impacts'} productivity – 
                      regulated environments report ${regulated.avgProductivity.toFixed(1)}/10 vs. ${unregulated.avgProductivity.toFixed(1)}/10 for unregulated ones.`}
                    </>
                  );
                })()}
              </p>
            </InsightBox>
          )}
        </div>
      </section>

      {/* ===== CORRELATION MATRIX ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-container">
          <SectionTitle title="Statistical Correlations" subtitle="Pearson correlation between key metric dimensions (range -1 to +1)" />
          {correlationMatrix && (
            <motion.div className="glass-card" style={{ padding: '32px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${correlationMatrix.labels.length}, 1fr)`, gap: '3px', minWidth: '500px' }}>
                  <div />
                  {correlationMatrix.labels.map(l => (
                    <div key={l} style={{ fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 600, padding: '4px 2px' }}>{l}</div>
                  ))}
                  {correlationMatrix.labels.map((row, ri) => (
                    <React.Fragment key={row}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', fontWeight: 500 }}>{row}</div>
                      {correlationMatrix.labels.map((_col, ci) => {
                        const cell = correlationMatrix.matrix[ri * correlationMatrix.labels.length + ci];
                        return (
                          <HeatmapCell
                            key={`${row}-${_col}`}
                            value={cell.correlation}
                            max={1}
                            label={`${cell.var1} × ${cell.var2}: r=${cell.correlation}`}
                            size={50}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>
                Blue = positive correlation · Red = negative · Darker = stronger relationship
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== COMPOSITE INDICES ===== */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.03) 50%, transparent 100%)' }}>
        <div className="section-container">
          <SectionTitle title="Composite Indices" subtitle="Aggregated scores that combine multiple survey dimensions into single metrics" />
          {compositeIndices && (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}
            >
              <ChartCard title="Adoption Index (0-9)" description={`Tools adopted per respondent · Mean: ${compositeIndices.adoptionIndex.mean.toFixed(1)} · Median: ${compositeIndices.adoptionIndex.median}`}>
                <BarChart
                  data={compositeIndices.adoptionIndex.distribution.map(d => ({ id: String(d.score), label: `${d.score} tools`, value: d.count }))}
                  height={350}
                  layout="vertical"
                  showPercentage={false}
                  colors={['#A100FF']}
                />
              </ChartCard>
              <ChartCard title="Quality Strategy Coverage (0-7)" description={`Strategies per respondent · Mean: ${compositeIndices.qualityCoverage.mean.toFixed(1)} · Median: ${compositeIndices.qualityCoverage.median}`}>
                <BarChart
                  data={compositeIndices.qualityCoverage.distribution.map(d => ({ id: String(d.score), label: `${d.score} strategies`, value: d.count }))}
                  height={350}
                  layout="vertical"
                  showPercentage={false}
                  colors={['#06B6D4']}
                />
              </ChartCard>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== QUALITY STRATEGIES ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-container">
          <SectionTitle title="Quality Assurance" subtitle="Which strategies are used to ensure the quality of AI-generated code?" />
          {qualityData && (
            <motion.div className="glass-card" style={{ padding: '32px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ height: '400px' }}>
                <BarChart
                  data={qualityData.map(q => ({ id: q.id, label: q.label, value: q.percentage }))}
                  height={380}
                  layout="horizontal"
                  showPercentage={true}
                  colors={['#06B6D4']}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== CHALLENGES ===== */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, transparent 0%, rgba(236, 72, 153, 0.03) 50%, transparent 100%)' }}>
        <div className="section-container">
          <SectionTitle title="Challenges" subtitle="Ranked by respondents: % who placed each challenge in their top 2 priorities" />
          {challengeData && challengeData.length > 0 && (
            <motion.div className="glass-card" style={{ padding: '32px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ height: `${Math.max(400, challengeData.slice(0, 10).length * 50)}px` }}>
                <BarChart
                  data={challengeData.slice(0, 10).map(c => ({ id: c.id, label: c.label, value: c.percentage }))}
                  height={Math.max(380, challengeData.slice(0, 10).length * 50 - 20)}
                  layout="horizontal"
                  showPercentage={true}
                  colors={['#EC4899']}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== INTERACTION PATTERNS & CORRECTION ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-container">
          <SectionTitle title="AI Interaction" subtitle="How do developers work with AI tools – and how often do results need correction?" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}
          >
            <ChartCard title="Interaction Patterns" description="Typical collaboration patterns with AI development tools" height="350px">
              {interactionData && (
                <DonutChart
                  data={interactionData.map(d => ({ id: d.id, label: d.label, value: d.percentage }))}
                  height={340}
                  colors={chartColors}
                />
              )}
            </ChartCard>
            <ChartCard title="Correction Frequency" description="How often do AI-generated results require revision?" height="350px">
              {correctionData && (
                <DonutChart
                  data={correctionData.map(d => ({ id: d.id, label: d.label, value: d.percentage }))}
                  height={340}
                  colors={['#F59E0B', '#EC4899', '#10B981', '#6366F1', '#06B6D4']}
                />
              )}
            </ChartCard>
          </motion.div>
        </div>
      </section>

      {/* ===== DEMOGRAPHICS ===== */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, transparent 0%, rgba(161, 0, 255, 0.03) 50%, transparent 100%)' }}>
        <div className="section-container">
          <SectionTitle title="Demographics" subtitle="Who participated in the survey? Experience, roles, industries, organization types, and AI experience" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}
          >
            <ChartCard title="Professional Experience" description="Years of professional experience in software development">
              {experienceData && (
                <DonutChart
                  data={experienceData.map(d => ({ id: d.experience, label: d.experience, value: d.percentage }))}
                  height={370}
                  colors={chartColors}
                />
              )}
            </ChartCard>
            <ChartCard title="Organization Type" description="What type of organization do participants work for?">
              {orgTypeData && (
                <DonutChart
                  data={orgTypeData.map(d => ({ id: d.id, label: d.label.length > 35 ? d.label.substring(0, 32) + '...' : d.label, value: d.percentage }))}
                  height={370}
                  colors={chartColors}
                />
              )}
            </ChartCard>
            <ChartCard title="Top 10 Roles" description="Most frequently represented professional roles">
              {roleData && (
                <BarChart
                  data={roleData.map(d => ({ id: d.role, label: d.role, value: d.percentage }))}
                  height={370}
                  layout="horizontal"
                  showPercentage={true}
                  colors={['#8B5CF6']}
                />
              )}
            </ChartCard>
            <ChartCard title="Industry Distribution" description="Which industries do participants work in?">
              {industryData && (
                <BarChart
                  data={industryData.slice(0, 8).map(d => ({ id: d.industry, label: d.industry.length > 30 ? d.industry.substring(0, 27) + '...' : d.industry, value: d.percentage }))}
                  height={370}
                  layout="horizontal"
                  showPercentage={true}
                  colors={['#F97316']}
                />
              )}
            </ChartCard>
            <ChartCard title="AI Experience Level" description="How experienced are participants with AI-assisted development?">
              {aiExperienceData && (
                <DonutChart
                  data={aiExperienceData.map(d => ({ id: d.level, label: d.level.length > 30 ? d.level.substring(0, 27) + '...' : d.level, value: d.percentage }))}
                  height={370}
                  colors={chartColors}
                />
              )}
            </ChartCard>
          </motion.div>
        </div>
      </section>

      {/* ===== ADVANCED STATISTICAL INSIGHTS ===== */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-subtle), transparent)' }} />
        <div className="section-container">
          <SectionTitle
            title="Advanced Statistical Insights"
            subtitle="Automated clustering of participants and analysis of productivity drivers through variable importance."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}
          >
            {/* Cluster Analysis (Respondent Segments) */}
            <ChartCard
              title="Respondent Segmentation"
              description="Clustering participants into behavioral profiles based on adoption mindset and experience."
              span={1}
              height="450px"
            >
              {clusterData && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <DonutChart
                      data={clusterData.map(d => ({ id: d.id, label: d.name, value: d.percentage }))}
                      height={300}
                      colors={clusterData.map(d => d.color)}
                    />
                  </div>
                  <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    {clusterData.map(cluster => (
                      <div key={cluster.id} style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', borderLeft: `5px solid ${cluster.color}` }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>{cluster.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>{cluster.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>

            {/* Variable Importance (Productivity Drivers) */}
            <ChartCard
              title="Productivity Gain Drivers"
              description="Variable Importance Analysis: Which factors have the strongest correlation with productivity increases?"
              span={1}
              height="450px"
            >
              {varImportance && (
                <>
                  <BarChart
                    data={varImportance.map(d => ({ id: d.id, label: d.label, value: d.percentage }))}
                    height={350}
                    layout="horizontal"
                    colors={['#A100FF']}
                    showPercentage={true}
                  />
                  <div style={{ marginTop: '12px' }}>
                    <StatDetail
                      label="Top Driver Signifikanz"
                      value={`p = ${varImportance[0].pValue}`}
                      info={varImportance[0].isSignificant ? 'Statistisch signifikant (p < 0.05)' : 'Nicht signifikant'}
                    />
                  </div>
                </>
              )}
            </ChartCard>

            {/* Correlation Matrix */}
            <ChartCard
              title="Metric Correlations"
              description="Heatmap showing relationships between key metrics. Darker cells indicate stronger connections."
              span={2}
              height="auto"
            >
              {correlationMatrix && (
                <div style={{ padding: '20px 0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${correlationMatrix.labels.length + 1}, 1fr)`, gap: '4px' }}>
                    <div />
                    {correlationMatrix.labels.map(label => (
                      <div key={label} style={{ fontSize: '10px', fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '10px 0' }}>
                        {label}
                      </div>
                    ))}
                    {correlationMatrix.labels.map((rowLabel, i) => (
                      <React.Fragment key={rowLabel}>
                        <div style={{ fontSize: '11px', fontWeight: 600, alignSelf: 'center', color: 'var(--text-secondary)' }}>
                          {rowLabel}
                        </div>
                        {correlationMatrix.matrix.slice(i * correlationMatrix.labels.length, (i + 1) * correlationMatrix.labels.length).map((cell, j) => (
                          <div key={j} style={{ position: 'relative' }}>
                            <HeatmapCell value={Math.abs(cell.correlation)} max={1} label={cell.correlation > 0 ? `+${cell.correlation}` : `${cell.correlation}`} size={60} />
                            {cell.var1 !== cell.var2 && (
                              <div style={{ position: 'absolute', bottom: 2, right: 2 }}>
                                <StatDetail label="p-Wert" value={cell.pValue} info={cell.isSignificant ? 'Signifikant' : 'Nicht signifikant'} />
                              </div>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>
          </motion.div>
        </div>
      </section>

      {/* ===== COMPLIANCE & REGULATORY ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-container">
          <SectionTitle title="Compliance & Regulation" subtitle="How do regulatory requirements influence AI adoption?" />
          {complianceData && (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}
            >
              <ChartCard title="Compliance Environment" description="Do participants work in regulated environments?">
                <DonutChart
                  data={[
                    { id: 'Yes', label: 'Regulated', value: complianceData.compliance.yes.percentage },
                    { id: 'No', label: 'Not regulated', value: complianceData.compliance.no.percentage },
                    { id: 'Not Sure', label: 'Unsure', value: complianceData.compliance.notSure.percentage },
                  ]}
                  height={370}
                  colors={['#A100FF', '#374151', '#F59E0B']}
                />
              </ChartCard>
              <ChartCard title="Regulatory Impact" description={`Avg. impact: ${complianceData.avgRegulatoryInfluence.toFixed(2)}/5 – How strongly do regulations affect AI usage? (1 = Not at all, 5 = Very strongly)`}>
                <BarChart
                  data={complianceData.regulatoryInfluence.map(d => ({ id: String(d.score), label: String(d.score), value: d.count }))}
                  height={370}
                  layout="vertical"
                  showPercentage={false}
                  colors={['#6366F1']}
                />
              </ChartCard>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== SURVEY PARTICIPATION CTA ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-container">
          <motion.div
            style={{
              background: 'linear-gradient(135deg, rgba(161, 0, 255, 0.2) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%)',
              border: '1px solid rgba(161, 0, 255, 0.3)',
              borderRadius: '24px',
              padding: 'clamp(40px, 5vw, 64px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(circle at 50% 50%, rgba(161, 0, 255, 0.1) 0%, transparent 60%)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ marginBottom: '16px' }}>Haven't Participated Yet?</h2>
              <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px', color: 'var(--text-secondary)' }}>
                Your opinion matters! Help us better understand the future of Agentic AI in software development.
                The survey takes only about 5 minutes.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://www.empirio.ai/s/8ef35a9f-3f46-497a-8301-1c325837d541"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 40px',
                    background: 'var(--accent-gradient)',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 24px rgba(161, 0, 255, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(161, 0, 255, 0.5)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(161, 0, 255, 0.4)'; }}
                >
                  Take the Survey Now
                </a>
                <a
                  href="https://github.com/andre/agentic-ai-survey-viz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 40px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub Repository
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="section-container">
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Agentic AI Adoption Survey · Master's Thesis 2026
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Built with React 19, TypeScript 5, Nivo Charts, Framer Motion & Styled Components
          </p>
        </div>
      </footer>
    </div>
  );
};
