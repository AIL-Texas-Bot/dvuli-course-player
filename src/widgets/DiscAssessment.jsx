import { useState, useMemo } from 'react'

/* ══════════════════════════════════════════════════════════
   30-ITEM BIG FIVE (OCEAN) SURVEY ITEMS
   Derived from standard validated IPIP scales.
   Dimensions: O (Openness), C (Conscientiousness), E (Extraversion),
   A (Agreeableness), N (Neuroticism).
   ══════════════════════════════════════════════════════════ */
const QUESTIONS = [
  // Openness (Approach to New Ideas)
  { id: "o_1", dim: "O", text: "I have a rich vocabulary." },
  { id: "o_2", dim: "O", text: "I have excellent ideas." },
  { id: "o_3", dim: "O", text: "I am quick to understand things." },
  { id: "o_4", dim: "O", text: "I have difficulty understanding abstract ideas.", reverse: true },
  { id: "o_5", dim: "O", text: "I am not interested in abstract ideas.", reverse: true },
  { id: "o_6", dim: "O", text: "I do not have a good imagination.", reverse: true },

  // Conscientiousness (Approach to Work)
  { id: "c_1", dim: "C", text: "I am always prepared." },
  { id: "c_2", dim: "C", text: "I pay attention to details." },
  { id: "c_3", dim: "C", text: "I get chores done right away." },
  { id: "c_4", dim: "C", text: "I leave my belongings around.", reverse: true },
  { id: "c_5", dim: "C", text: "I make a mess of things.", reverse: true },
  { id: "c_6", dim: "C", text: "I often forget to put things back in their proper place.", reverse: true },

  // Extraversion (How You Interact with People)
  { id: "e_1", dim: "E", text: "I am the life of the party." },
  { id: "e_2", dim: "E", text: "I feel comfortable around people." },
  { id: "e_3", dim: "E", text: "I talk a lot to different people at parties." },
  { id: "e_4", dim: "E", text: "I tend to stay in the background in social settings.", reverse: true },
  { id: "e_5", dim: "E", text: "I have little to say.", reverse: true },
  { id: "e_6", dim: "E", text: "I don't talk a lot.", reverse: true },

  // Agreeableness (Collaboration Style)
  { id: "a_1", dim: "A", text: "I sympathize with others' feelings." },
  { id: "a_2", dim: "A", text: "I have a soft heart." },
  { id: "a_3", dim: "A", text: "I feel others' emotions." },
  { id: "a_4", dim: "A", text: "I am not really interested in others.", reverse: true },
  { id: "a_5", dim: "A", text: "I am not interested in other people's problems.", reverse: true },
  { id: "a_6", dim: "A", text: "I insult people.", reverse: true },

  // Neuroticism (Inverted to Response to Pressure)
  { id: "n_1", dim: "P", text: "I get stressed out easily." },
  { id: "n_2", dim: "P", text: "I worry about things." },
  { id: "n_3", dim: "P", text: "I am easily disturbed." },
  { id: "n_4", dim: "P", text: "I am relaxed most of the time.", reverse: true },
  { id: "n_5", dim: "P", text: "I seldom feel blue.", reverse: true },
  { id: "n_6", dim: "P", text: "I get upset easily." }
];

const LIKERT_OPTIONS = [
  { value: 1, label: "Very Inaccurate" },
  { value: 2, label: "Moderately Inaccurate" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Moderately Accurate" },
  { value: 5, label: "Very Accurate" }
];

/* ══════════════════════════════════════════════════════════
   DIMENSION LABELS & STYLES (OCEAN REFRAMED)
   ══════════════════════════════════════════════════════════ */
const DIM_INFO = {
  O: { key: "O", label: "Approach to New Ideas", color: "#6366F1", text: "Measures creative thinking, curiosity, and openness to strategic changes." },
  C: { key: "C", label: "Approach to Work", color: "#10B981", text: "Measures execution, detailed organization, and structured follow-through." },
  E: { key: "E", label: "How You Interact with People", color: "#F59E0B", text: "Measures social energy, comfortable teamwork, and verbal engagement." },
  A: { key: "A", label: "Collaboration Style", color: "#EC4899", text: "Measures team empathy, consensus-building, and relational warmth." },
  P: { key: "P", label: "Response to Pressure", color: "#14B8A6", text: "Measures emotional resilience, composure, and stability under stress." }
};

/* ══════════════════════════════════════════════════════════
   PERSONALIZED NARRATIVE FEEDBACK DATA (BY TIER)
   Contextualized for leadership in youth ministry
   ══════════════════════════════════════════════════════════ */
const DIMENSION_DETAILS = {
  O: {
    label: "Approach to New Ideas",
    desc: "Intellectual curiosity, creative imagination, and appetite for new paradigms and strategies.",
    tiers: {
      high: {
        title: "The Visionary Explorer",
        desc: "You have a strong appetite for new concepts, creative strategies, and philosophical depth. You love thinking outside the box, experimenting with new models, and asking big conceptual questions. In ministry, you bring fresh ideas and see possibilities others miss.",
        strengths: ["Highly creative problem-solver", "Appreciates deep conceptual thinking", "Enthusiastic about strategic innovation"],
        blindSpots: ["May struggle with boring routine execution", "Can overwhelm team with constant changes", "Tendency to start projects without finishing existing ones"]
      },
      mid: {
        title: "The Practical Adaptor",
        desc: "You balance curiosity with realism. You enjoy new strategies and creative thinking but want to make sure they have immediate, practical application. In leadership, you bridge the gap between creative visionaries and grounded executors.",
        strengths: ["Balances innovation with practicality", "Open-minded but pragmatic", "Adapts ideas to realistic parameters"],
        blindSpots: ["May hesitate on highly speculative ideas", "Can compromise too quickly between old and new", "Slight risk of reverting to comfort when execution gets tough"]
      },
      low: {
        title: "The Grounded Guardian",
        desc: "You value proven methods, consistency, and time-tested truths. You keep your ministry anchored to reliable processes and core lessons that work. You prefer concrete execution over abstract speculation.",
        strengths: ["Provides stability and continuity", "Respects tradition and proven methods", "Extremely focused on concrete reality"],
        blindSpots: ["Can resist necessary changes or adjustments", "May struggle in highly ambiguous situations", "Risks dismissing new ideas too quickly"]
      }
    }
  },
  C: {
    label: "Approach to Work",
    desc: "Orderliness, preparation, detail-orientation, and systematic focus.",
    tiers: {
      high: {
        title: "The Systematic Builder",
        desc: "You thrive on structure, meticulous preparation, and clear details. In ministry, you make sure processes work, schedules are kept, and policies protect the team. You hold high standards for yourself and your team.",
        strengths: ["Excellent follow-through and organization", "Catches details before they become crises", "Highly reliable and self-disciplined"],
        blindSpots: ["Perfectionism can lead to analysis paralysis", "Can micromanage or seem overly rigid", "Difficulty delegating to less systematic volunteers"]
      },
      mid: {
        title: "The Balanced Executor",
        desc: "You value order and planning but can pivot easily when ministry reality gets messy. You keep track of key details while remaining flexible enough to adapt to relational emergencies.",
        strengths: ["Organized yet flexible", "Maintains plans without rigidity", "Responsible and adaptive worker"],
        blindSpots: ["May drop minor details when rushed", "Can struggle to enforce strict boundaries", "Fails to document procedures for others"]
      },
      low: {
        title: "The Spontaneous Catalyst",
        desc: "You thrive in fluid, fast-changing situations and prefer working organically without rigid plans. You focus on immediate relational needs rather than administrative procedures.",
        strengths: ["Extremely flexible and responsive", "Unbothered by sudden changes", "Prioritizes immediate human connection"],
        blindSpots: ["Struggles with administrative tasks and schedules", "May leave things disorganized, creating stress for others", "Difficulty maintaining long-term project momentum"]
      }
    }
  },
  E: {
    label: "How You Interact with People",
    desc: "Social energy, ease in group settings, and verbal assertiveness.",
    tiers: {
      high: {
        title: "The Relational Catalyst",
        desc: "You draw energy from groups and verbal connection. In youth ministry, you are the natural bridge-builder, initiating contact easily, presenting vision boldly, and creating high-energy environments where youth feel welcome.",
        strengths: ["Connects quickly and enthusiastically", "Bold and expressive communicator", "Rallies volunteer teams easily"],
        blindSpots: ["May dominate group conversations", "Struggles with quiet, reflective tasks", "Slight risk of valuing broad reach over depth"]
      },
      mid: {
        title: "The Selective Connector",
        desc: "You are comfortable in group settings but also value quiet, focused time to recharge. You balance large-group outreach with intimate, one-on-one relational depth.",
        strengths: ["Versatile in both crowds and small groups", "Socially comfortable but respects reflection", "Empathetic and balanced communicator"],
        blindSpots: ["Can feel drained if forced to socialize too long", "May struggle to assert yourself in intense rooms", "Relational follow-up can be inconsistent"]
      },
      low: {
        title: "The Quiet Anchor",
        desc: "You lead through deep, focused, individual connections. You prefer listening over talking and build trust slowly and steadily. You are a calm, observant presence on your team.",
        strengths: ["Thoughtful, deep listener", "Builds highly loyal, long-term relationships", "Quietly observes group dynamics accurately"],
        blindSpots: ["May hesitate to initiate contact with strangers", "Can seem distant or hard to read", "Reluctant to speak up in large forums"]
      }
    }
  },
  A: {
    label: "Collaboration Style",
    desc: "Trust, warmth, empathy, and consensus-seeking cooperation.",
    tiers: {
      high: {
        title: "The Empathetic Ally",
        desc: "You prioritize harmony, team unity, and mutual care. In youth ministry, you are deeply attuned to others' feelings, creating incredibly safe spaces where youth and volunteers feel loved and supported.",
        strengths: ["Deep pastoral empathy and care", "Peacemaker and consensus-builder", "Extremely warm and approachable"],
        blindSpots: ["May swallow convictions to avoid conflict", "Struggles to enforce necessary boundaries or rules", "Can enable dependency in volunteers"]
      },
      mid: {
        title: "The Pragmatic Partner",
        desc: "You value collaboration and team unity but are not afraid to address disagreement constructively. You balance empathy with task accountability.",
        strengths: ["Balances empathy with clear standards", "Constructive approach to team conflict", "Collaborates while holding boundaries"],
        blindSpots: ["May seem inconsistent (varying between soft and direct)", "Can struggle when empathy and rules clash", "Tends to delay relational interventions"]
      },
      low: {
        title: "The Direct Challenger",
        desc: "You prioritize truth, clarity, and task excellence over group consensus. You push your team to deliver results and aren't afraid of healthy friction to get things right.",
        strengths: ["Unflinchingly honest and direct", "Holds high standards of accountability", "Confronts issues immediately before they fester"],
        blindSpots: ["Can seem demanding or critical to volunteers", "May overlook relational fallout in team decisions", "Struggles to extend grace in performance failures"]
      }
    }
  },
  P: {
    label: "Response to Pressure",
    desc: "Emotional resilience, composure, and stability under stress and rejection.",
    tiers: {
      high: {
        title: "The Composed Anchor",
        desc: "You maintain a calm, stable, and steady hand under pressure. In ministry crises or rejection, you don't panic, providing a reassuring sense of security for your team.",
        strengths: ["Steady and unshakeable in crisis", "Maintains perspective under high stress", "Buffers team from environmental anxiety"],
        blindSpots: ["May mask genuine personal stress or pain", "Can seem emotionally detached or flat", "Difficulty expressing vulnerability when helpful"]
      },
      mid: {
        title: "The Mindful Responder",
        desc: "You experience the normal emotional weight of high-stakes ministry. You manage stress well through intentional self-care, boundaries, and reflection.",
        strengths: ["Emotionally authentic and aware", "Balances resilience with healthy processing", "Relatable to others under pressure"],
        blindSpots: ["Can become reactive if stress accumulates", "Requires deliberate rest periods to recover", "May absorb team anxiety over time"]
      },
      low: {
        title: "The Sensitive Sentinel",
        desc: "You are highly vigilant, quickly sensing risks, team friction, or changes in your environment. You notice issues early and care deeply about outcomes.",
        strengths: ["Highly attuned to environmental changes", "Senses hidden team friction immediately", "Takes responsibility for outcomes deeply"],
        blindSpots: ["Easily overwhelmed by criticism or rejection", "Absorbs and carries others' stress home", "High risk of burnout without strict boundaries"]
      }
    }
  }
};

const BIBLICAL_CHARACTERS = {
  O: {
    name: "Paul the Pioneer",
    trait: "Ideas (Openness)",
    desc: "Demonstrates cultural adaptability, strategic innovation, and deep conceptual reasoning in expanding the early Church.",
    color: DIM_INFO.O.color
  },
  C: {
    name: "Nehemiah the Builder",
    trait: "Work (Conscientiousness)",
    desc: "Exemplifies meticulous planning, structured labor, and high standards of security and coordination in rebuilding the walls.",
    color: DIM_INFO.C.color
  },
  E: {
    name: "Peter the Catalyst",
    trait: "Interact (Extraversion)",
    desc: "Acts as a bold verbal catalyst with high social energy and warmth, speaking courageously at Pentecost and rallying teams.",
    color: DIM_INFO.E.color
  },
  A: {
    name: "Barnabas the Encourager",
    trait: "Collab (Agreeableness)",
    desc: "Champions team empathy, consensus-building, and relational warmth, famously defending John Mark and welcoming Paul.",
    color: DIM_INFO.A.color
  },
  P: {
    name: "Abraham the Composed",
    trait: "Pressure (Emotional Resilience)",
    desc: "Stands steady under decades of uncertainty, showing composure and trust in the covenant when facing high-stakes stress.",
    color: DIM_INFO.P.color
  }
};

/* ══════════════════════════════════════════════════════════
   DOMINANT TYPE ASSIGNMENT HELPER
   ══════════════════════════════════════════════════════════ */
function getDominantProfile(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const highest = sorted[0][0]; // 'O', 'C', 'E', 'A', or 'P'
  
  const profiles = {
    O: {
      name: "The Creative Explorer",
      tagline: "Visionary & Innovation Catalyst",
      desc: "Your leadership wiring is anchored in curiosity and new ideas. You thrive on designing new models, thinking conceptually, and bringing fresh, creative perspectives to your youth ministry. You keep the organization looking forward."
    },
    C: {
      name: "The Systematic Builder",
      tagline: "Organized & Reliable Steward",
      desc: "Your leadership wiring is anchored in preparation and structure. You excel at details, planning systematically, and building reliable operations that keep your youth ministry secure and highly effective."
    },
    E: {
      name: "The Relational Catalyst",
      tagline: "Bold & Expressive Bridge-Builder",
      desc: "Your leadership wiring is anchored in social connection and expressiveness. You naturally rally teams, initiate contact, and bring dynamic energy to your youth outreach, drawing others into shared vision."
    },
    A: {
      name: "The Empathetic Ally",
      tagline: "Warm & Harmonious Peacemaker",
      desc: "Your leadership wiring is anchored in empathy and collaboration. You prioritize team unity, deep pastoral care, and consensus, creating spaces where youth and volunteers feel safe and valued."
    },
    P: {
      name: "The Composed Anchor",
      tagline: "Resilient & Composed Coordinator",
      desc: "Your leadership wiring is anchored in composure under pressure. You bring stability and a steady hand to crises, buffering your team from stress and providing an unshakeable presence."
    }
  };
  return profiles[highest];
}

function getTier(val) {
  if (val >= 70) return 'high';
  if (val >= 35) return 'mid';
  return 'low';
}

/* ══════════════════════════════════════════════════════════
   SCORING ENGINE
   ══════════════════════════════════════════════════════════ */
function computeScores(answers) {
  const categories = { O: [], C: [], E: [], A: [], N: [] };
  const reverseKeys = {
    o_4: true, o_5: true, o_6: true,
    c_4: true, c_5: true, c_6: true,
    e_4: true, e_5: true, e_6: true,
    a_4: true, a_5: true, a_6: true,
    n_4: true, n_5: true
  };

  for (const [key, valRaw] of Object.entries(answers)) {
    const val = Number(valRaw);
    if (isNaN(val)) continue;
    const score = reverseKeys[key] ? (6 - val) : val;
    
    if (key.startsWith('o_')) categories.O.push(score);
    else if (key.startsWith('c_')) categories.C.push(score);
    else if (key.startsWith('e_')) categories.E.push(score);
    else if (key.startsWith('a_')) categories.A.push(score);
    else if (key.startsWith('n_')) categories.N.push(score);
  }

  const avg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 3.0;
  const toPercent = (val) => Math.round(((val - 1) / 4) * 100);

  const rawO = avg(categories.O);
  const rawC = avg(categories.C);
  const rawE = avg(categories.E);
  const rawA = avg(categories.A);
  const rawN = avg(categories.N);

  return {
    O: toPercent(rawO),
    C: toPercent(rawC),
    E: toPercent(rawE),
    A: toPercent(rawA),
    P: 100 - toPercent(rawN) // Invert Neuroticism to get Response to Pressure (Resilience/Composure)
  };
}

/* ══════════════════════════════════════════════════════════
   PENTAGON RADAR CHART (5-AXIS SVG)
   ══════════════════════════════════════════════════════════ */
function PentagonRadar({ scores, highestDim }) {
  const cx = 120, cy = 120, maxR = 85;
  const dims = ['O', 'C', 'E', 'A', 'P'];
  const themeColor = DIM_INFO[highestDim]?.color || "var(--navy)";
  
  function getPoint(idx, val) {
    const r = (val / 100) * maxR;
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 5;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  }

  // Draw 4 levels of background pentagons (25%, 50%, 75%, 100%)
  const gridRings = [25, 50, 75, 100].map(pct => {
    const pts = dims.map((_, i) => {
      const p = getPoint(i, pct);
      return `${p.x},${p.y}`;
    }).join(' ');
    return (
      <polygon
        key={pct}
        points={pts}
        fill="none"
        stroke="rgba(228, 223, 217, 0.6)"
        strokeWidth={pct === 100 ? '1.5' : '0.75'}
        strokeDasharray={pct === 100 ? 'none' : '2 2'}
      />
    );
  });

  // Draw 5 radial axis lines from center
  const axisLines = dims.map((_, i) => {
    const outer = getPoint(i, 100);
    return (
      <line
        key={i}
        x1={cx}
        y1={cy}
        x2={outer.x}
        y2={outer.y}
        stroke="rgba(228, 223, 217, 0.4)"
        strokeWidth="1"
      />
    );
  });

  // Calculate polygon points for user scores
  const userVals = [scores.O, scores.C, scores.E, scores.A, scores.P];
  const dataPoints = dims.map((_, i) => getPoint(i, userVals[i]));
  const polyPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Render axis text labels slightly offset outwards
  const textLabels = dims.map((d, i) => {
    const outer = getPoint(i, 108);
    let textAnchor = "middle";
    if (outer.x > cx + 10) textAnchor = "start";
    else if (outer.x < cx - 10) textAnchor = "end";

    return (
      <text
        key={d}
        x={outer.x}
        y={outer.y + 4}
        textAnchor={textAnchor}
        className="disc-axis-label"
        fill={DIM_INFO[d].color}
        style={{ fontSize: '10.5px', fontWeight: '800' }}
      >
        {d === 'O' ? 'Ideas' : d === 'C' ? 'Work' : d === 'E' ? 'Interact' : d === 'A' ? 'Collab' : 'Pressure'}
      </text>
    );
  });

  return (
    <svg viewBox="0 0 240 240" className="disc-radar" style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}>
      {gridRings}
      {axisLines}
      {/* Shaded area */}
      <polygon
        points={polyPoints}
        fill={`${themeColor}1a`}
        stroke={themeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="disc-radar-poly"
      />
      {/* Dot markers */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4.5"
          fill={DIM_INFO[dims[i]].color}
          stroke="#fff"
          strokeWidth="1.5"
        />
      ))}
      {textLabels}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   DIMENSION BARS COMPONENT
   ══════════════════════════════════════════════════════════ */
function DimensionBars({ scores }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', padding: '4px 0' }}>
      {['O', 'C', 'E', 'A', 'P'].map(dim => {
        const themeColor = DIM_INFO[dim].color;
        return (
          <div key={dim} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  background: `${themeColor}12`,
                  color: themeColor,
                  fontWeight: '800',
                  fontSize: '11px',
                  fontFamily: "'Inter', sans-serif"
                }}>{dim}</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{DIM_INFO[dim].label}</span>
              </div>
              <span style={{ fontWeight: '700', color: themeColor }}>{scores[dim]}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(228, 223, 217, 0.4)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  height: '100%',
                  width: `${scores[dim]}%`,
                  background: `linear-gradient(90deg, ${themeColor}88 0%, ${themeColor} 100%)`,
                  borderRadius: '99px',
                  transition: 'width 0.8s cubic-bezier(.22, 1, .36, 1)',
                  boxShadow: `0 1px 4px ${themeColor}20`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   GAP VISUALIZER (BIG FIVE EDITION)
   ══════════════════════════════════════════════════════════ */
function GapVisualizer() {
  const [natural, setNatural] = useState({ O: 3, C: 3, E: 3, A: 3, P: 3 });
  const [adapted, setAdapted] = useState({ O: 3, C: 3, E: 3, A: 3, P: 3 });
  const [reflection, setReflection] = useState('');
  const [savedGap, setSavedGap] = useState(false);

  const stressDimensions = [];
  Object.keys(natural).forEach(dim => {
    if (Math.abs(natural[dim] - adapted[dim]) >= 2) stressDimensions.push(DIM_INFO[dim].label);
  });
  const stressIndex = Math.min(100, Math.round((stressDimensions.length / 5) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '24px' }}>
        {/* Left column: Rating inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Rate your traits (1-5):
          </div>
          {['O', 'C', 'E', 'A', 'P'].map(dim => {
            const themeColor = DIM_INFO[dim].color;
            return (
              <div key={dim} style={{
                background: '#fff',
                border: '1.5px solid rgba(228, 223, 217, 0.7)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.01)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(228, 223, 217, 0.4)', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: themeColor }} />
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--navy)' }}>{DIM_INFO[dim].label}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: themeColor, background: `${themeColor}12`, padding: '2px 8px', borderRadius: '20px' }}>
                    Gap: {Math.abs(natural[dim] - adapted[dim])}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Natural (Authentic Wiring)</span>
                      <span style={{ fontWeight: '700', color: themeColor }}>{natural[dim]} / 5</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={natural[dim]}
                      className="widget-slider"
                      onChange={e => setNatural({ ...natural, [dim]: Number(e.target.value) })}
                      style={{
                        background: `linear-gradient(90deg, ${themeColor} 0%, #cbd5e1 100%)`,
                        height: '6px',
                        borderRadius: '99px',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Adapted (Ministry Role Demands)</span>
                      <span style={{ fontWeight: '700', color: themeColor }}>{adapted[dim]} / 5</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={adapted[dim]}
                      className="widget-slider"
                      onChange={e => setAdapted({ ...adapted, [dim]: Number(e.target.value) })}
                      style={{
                        background: `linear-gradient(90deg, ${themeColor}80 0%, #cbd5e1 100%)`,
                        height: '6px',
                        borderRadius: '99px',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Overlap chart and alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>
          <div style={{
            background: '#fff',
            border: '1.5px solid rgba(228, 223, 217, 0.7)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--navy)', letterSpacing: '0.8px', marginBottom: '20px' }}>
              📊 Style Profile Overlap
            </div>
            
            <div style={{
              display: 'flex',
              gap: '24px',
              height: '180px',
              alignItems: 'end',
              width: '100%',
              justifyContent: 'center',
              paddingBottom: '12px',
              borderBottom: '2px solid rgba(228, 223, 217, 0.6)'
            }}>
              {['O', 'C', 'E', 'A', 'P'].map(dim => {
                const hNat = (natural[dim] / 5) * 140;
                const hAdp = (adapted[dim] / 5) * 140;
                const themeColor = DIM_INFO[dim].color;
                return (
                  <div key={dim} style={{ display: 'flex', gap: '6px', alignItems: 'end', position: 'relative' }}>
                    <div style={{
                      width: '16px',
                      height: `${hNat}px`,
                      background: `linear-gradient(180deg, ${themeColor} 0%, ${themeColor}bb 100%)`,
                      borderRadius: '4px 4px 0 0',
                      boxShadow: `0 2px 6px ${themeColor}20`,
                      transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} title={`Natural ${dim}: ${natural[dim]}`} />
                    <div style={{
                      width: '16px',
                      height: `${hAdp}px`,
                      background: `linear-gradient(180deg, ${themeColor}50 0%, ${themeColor}30 100%)`,
                      borderRadius: '4px 4px 0 0',
                      border: `1px dashed ${themeColor}80`,
                      transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} title={`Adapted ${dim}: ${adapted[dim]}`} />
                    <span style={{
                      position: 'absolute',
                      bottom: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: themeColor,
                      fontFamily: "'Inter', sans-serif"
                    }}>{dim}</span>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', gap: '20px', fontSize: '11.5px', marginTop: '36px', fontWeight: '600', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--navy)' }} /> Natural Wiring
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--navy)', opacity: 0.3, border: '1px dashed var(--navy)' }} /> Adapted Demands
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '20px',
            background: stressIndex > 0 ? 'rgba(217, 119, 6, 0.04)' : 'rgba(49, 155, 65, 0.04)',
            border: '1.5px solid',
            borderColor: stressIndex > 0 ? 'rgba(217, 119, 6, 0.16)' : 'rgba(49, 155, 65, 0.16)',
            borderRadius: '16px',
            fontSize: '13.5px',
            lineHeight: '1.55',
            color: 'var(--text-primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
          }}>
            {stressIndex > 0 ? (
              <>⚠️ <strong>Adaptation Stress Index ({stressIndex}%):</strong><br />
                You are adapting significantly (≥ 2 points gap) on: <strong>{stressDimensions.join(', ')}</strong>. Sustained adaptation of your natural wiring to match role expectations represents a significant exhaustion risk.</>
            ) : (
              <>✅ <strong>Excellent Wiring Alignment:</strong><br />
                Your natural wiring and current role demands are well-aligned. You can lead authentically with minimal environmental pressure or adaptation stress.</>
            )}
          </div>
        </div>
      </div>

      {!savedGap ? (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            className="widget-textarea"
            placeholder="What does this gap cost you energetically? How can you structure your role or partner with others to lead more out of your natural wiring?"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            style={{
              borderRadius: '14px',
              border: '1.5px solid rgba(228, 223, 217, 0.8)',
              padding: '16px',
              fontSize: '14px',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              outline: 'none',
              resize: 'vertical',
              minHeight: '100px',
              transition: 'border-color 0.2s'
            }}
          />
          <button
            type="button"
            className="widget-save-btn"
            onClick={() => setSavedGap(true)}
            disabled={reflection.trim().length < 5}
            style={{
              padding: '12px 20px',
              background: 'var(--navy)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: reflection.trim().length < 5 ? 'not-allowed' : 'pointer',
              opacity: reflection.trim().length < 5 ? 0.6 : 1,
              transition: 'all 0.2s',
              alignSelf: 'flex-start'
            }}
          >
            Save Alignment Profile →
          </button>
        </div>
      ) : (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(0, 85, 140, 0.04)',
          border: '1.5px solid rgba(0, 85, 140, 0.15)',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
        }}>
          <span style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: '600' }}>✓ Alignment Profile and Reflection saved to your leadership journal.</span>
          <button type="button" className="widget-reset-btn" onClick={() => setSavedGap(false)}>↺ Edit</button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ACTION HERO + NEEDS/ASSETS SCENARIOS (PRESERVED)
   ══════════════════════════════════════════════════════════ */
const ACTION_HERO_SCENARIOS = [
  {
    title: 'Volunteer Class Preparation',
    desc: 'A parent complains that a volunteer leader\'s lesson plan seems rushed and disorganized.',
    options: [
      { text: 'I\'ll take over teaching the class myself next week so it\'s done right.', style: 'Hero' },
      { text: 'I\'ll meet with the volunteer, coach them on lesson preparation, and help them run it.', style: 'Collab' }
    ]
  },
  {
    title: 'Youth Retreat Flyer Design',
    desc: 'The youth retreat flyer needs urgent revision before printing, and the student designer is hard to reach.',
    options: [
      { text: 'I\'ll log into the design software and fix the text myself to meet the printer\'s deadline.', style: 'Hero' },
      { text: 'I\'ll call the student, explain the deadline, and guide them through making the updates.', style: 'Collab' }
    ]
  },
  {
    title: 'Summer Camp Fundraising',
    desc: 'Your youth group needs to raise $5,000 for summer camp within the next month.',
    options: [
      { text: 'I\'ll personally write all donor letters and solicit funding directly from my contacts.', style: 'Hero' },
      { text: 'I\'ll pull the youth council together, and facilitate a brainstorming session for them to organize a community fundraiser.', style: 'Collab' }
    ]
  }
];

const NEEDS_ASSETS_SCENARIOS = [
  {
    title: 'Entering a New Neighborhood',
    desc: 'You are planning to expand your youth outreach program into a neighboring community.',
    options: [
      { text: 'I will start by compiling a database of local crime rates, high-school dropouts, and poverty statistics.', style: 'Needs' },
      { text: 'I will walk the neighborhood to list active churches, local parks, and respected community residents.', style: 'Assets' }
    ]
  },
  {
    title: 'Support for Teen Parents',
    desc: 'You want to start a support initiative for teen parents in your area.',
    options: [
      { text: 'I will design a class curriculum to teach them the basic parenting skills they are lacking.', style: 'Needs' },
      { text: 'I will invite teen parents to a roundtable discussion to co-create a peer support circle, leveraging their daily experiences.', style: 'Assets' }
    ]
  },
  {
    title: 'Sharing with Donors',
    desc: 'You are writing an appeal letter to local donors about your youth center.',
    options: [
      { text: 'I will emphasize the brokenness, lack of resources, and systemic disadvantages of the youth to inspire charity.', style: 'Needs' },
      { text: 'I will highlight the resilience, creative skills, and leadership potential of our youth to invite investment.', style: 'Assets' }
    ]
  }
];

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function DiscAssessment({ blockId, config }) {
  const isGap = blockId === 'ch2-widget-1' || config?.description?.toLowerCase().includes('gap');
  const isActionHero = blockId === 'ch7-widget-2' || config?.description?.toLowerCase().includes('action hero');
  const isNeedsAssets = blockId === 'ch10-widget-0' || config?.description?.toLowerCase().includes('needs map');

  const mode = isGap ? 'gap' : isActionHero ? 'hero' : isNeedsAssets ? 'needs' : 'ocean';

  // State
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [itemId]: Number(1-5) }
  const [showResult, setShowResult] = useState(false);

  // Simulators State
  const [simIdx, setSimIdx] = useState(0);
  const [simAnswers, setSimAnswers] = useState([]);
  const [simDone, setSimDone] = useState(false);

  // Auto-advance logic after clicking an option
  function handleSelectOption(itemId, val) {
    setAnswers(prev => ({ ...prev, [itemId]: val }));
    
    setTimeout(() => {
      if (qIdx + 1 < QUESTIONS.length) {
        setQIdx(qIdx + 1);
      } else {
        setShowResult(true);
      }
    }, 300);
  }

  function resetAssessment() {
    setQIdx(0);
    setAnswers({});
    setShowResult(false);
  }

  // Simulators handlers
  function handleSimAnswer(style) {
    const deck = mode === 'hero' ? ACTION_HERO_SCENARIOS : NEEDS_ASSETS_SCENARIOS;
    const next = [...simAnswers, style];
    setSimAnswers(next);
    if (simIdx + 1 < deck.length) {
      setSimIdx(simIdx + 1);
    } else {
      setSimDone(true);
    }
  }

  function resetSim() {
    setSimIdx(0);
    setSimAnswers([]);
    setSimDone(false);
  }

  // ─── GAP VISUALIZER ───
  if (mode === 'gap') return <GapVisualizer />;

  // ─── ACTION HERO / NEEDS-ASSETS INSTINCT SIMULATORS ───
  if (mode === 'hero' || mode === 'needs') {
    const deck = mode === 'hero' ? ACTION_HERO_SCENARIOS : NEEDS_ASSETS_SCENARIOS;
    const active = deck[simIdx];

    if (simDone) {
      if (mode === 'hero') {
        const heroCount = simAnswers.filter(a => a === 'Hero').length;
        const collabCount = simAnswers.filter(a => a === 'Collab').length;
        const dominant = heroCount > collabCount ? 'Action Hero' : 'Collaborative Leader';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="cr-summary-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)', fontFamily: "'Fraunces', serif" }}>
                Your Style: {dominant}
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                {dominant === 'Action Hero'
                  ? 'You default to taking control and doing tasks yourself to ensure quality and speed (Action Hero instinct). This is valuable in a crisis, but it creates a development ceiling for your team and leads directly to leadership burnout.'
                  : 'You default to empowering others, coaching them through challenges, and building leadership capacity (Collaborative Leader instinct). This is the key to multiplying your ministry impact sustainably.'}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="widget-reset-btn" onClick={resetSim}>↺ Retest Instincts</button>
            </div>
          </div>
        );
      }
      
      // Needs/Assets
      const needsCount = simAnswers.filter(a => a === 'Needs').length;
      const assetsCount = simAnswers.filter(a => a === 'Assets').length;
      const dominant = needsCount > assetsCount ? 'Needs-based Mindset' : 'Asset-based Mindset';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="cr-summary-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)', fontFamily: "'Fraunces', serif" }}>
              Dominant Mindset: {dominant}
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              {dominant === 'Needs-based Mindset'
                ? 'You naturally focus on problems, deficits, and gaps (Needs map). While this helps specify relief projects, it frames the community as dependent consumers. Try shifting to see the assets first.'
                : 'You naturally focus on local relationships, capabilities, and strengths (Asset map). This frames the community as active co-creators of their own transformation, enabling sustainable growth.'}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="widget-reset-btn" onClick={resetSim}>↺ Retest Mindset</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-light)', fontWeight: '700' }}>
          <span>SCENARIO {simIdx + 1} OF {deck.length}</span>
          <span style={{ textTransform: 'uppercase' }}>{mode === 'hero' ? 'Action Hero vs. Collaborative' : 'Needs Map vs. Asset Map'}</span>
        </div>
        <div style={{ background: '#faf8f5', border: '1px solid rgba(228,223,217,0.8)', padding: '20px', borderRadius: '14px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--navy)', marginBottom: '8px', fontFamily: "'Fraunces', serif" }}>
            {active.title}
          </h4>
          <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
            {active.desc}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {active.options.map((opt, i) => (
            <button key={i} type="button" className="quiz-option"
              onClick={() => handleSimAnswer(opt.style)}
              style={{ padding: '14px 18px', textAlign: 'left', background: '#fff', border: '1.5px solid rgba(228,223,217,0.8)' }}>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── BIG FIVE RESULTS VIEW ───
  if (showResult) {
    const scores = computeScores(answers);
    const dominantProfile = getDominantProfile(scores);
    const highestDim = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

    const dominantColor = DIM_INFO[highestDim].color;

    return (
      <div className="disc-results" style={{ width: '100%' }}>
        {/* Dominant Type Header */}
        <div className="disc-profile-header" style={{
          background: `linear-gradient(135deg, ${dominantColor}08 0%, #fff 100%)`,
          border: `1.5px solid ${dominantColor}24`,
          boxShadow: `0 8px 30px ${dominantColor}08`
        }}>
          <div className="disc-blend-badge" style={{
            background: dominantColor,
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '20px',
            boxShadow: `0 4px 14px ${dominantColor}40`
          }}>
            ⚡
          </div>
          <div className="disc-profile-info">
            <h3 className="disc-profile-name" style={{ fontSize: '22px', fontFamily: "'Fraunces', serif" }}>{dominantProfile.name}</h3>
            <span className="disc-profile-tagline" style={{ fontWeight: '600', color: dominantColor }}>{dominantProfile.tagline}</span>
          </div>
        </div>

        <div className="disc-profile-desc-card" style={{
          marginBottom: '24px',
          background: `linear-gradient(135deg, ${dominantColor}03 0%, #fff 100%)`,
          border: `1.5px solid ${dominantColor}15`,
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
        }}>
          <p className="disc-profile-desc" style={{ fontSize: '14.5px', lineHeight: '1.6', margin: 0, color: 'var(--text-primary)' }}>
            {dominantProfile.desc}
          </p>
        </div>

        {/* Charts & Dimension bars */}
        <div className="disc-charts-grid" style={{ marginBottom: '24px' }}>
          <div className="disc-chart-card" style={{
            background: '#fff',
            border: '1.5px solid rgba(228, 223, 217, 0.7)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="disc-chart-title" style={{ color: dominantColor, fontWeight: '800' }}>Personal Wiring Shape</div>
            <PentagonRadar scores={scores} highestDim={highestDim} />
          </div>
          <div className="disc-chart-card" style={{
            background: '#fff',
            border: '1.5px solid rgba(228, 223, 217, 0.7)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.015)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}>
            <div className="disc-chart-title" style={{ color: dominantColor, fontWeight: '800', textAlign: 'center', marginBottom: '16px' }}>Dimension Percentiles</div>
            <DimensionBars scores={scores} />
          </div>
        </div>

        {/* Biblical Character Alignment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid #e4dfd9', paddingBottom: '6px' }}>
            ✝️ Biblical Character Alignment
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 8px 0' }}>
            DVULI uses biblical leadership exemplars to connect your unique wiring to scripture. Below is how the five dimensions map to key figures:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {Object.entries(BIBLICAL_CHARACTERS).map(([dimKey, char]) => {
              const isDominant = dimKey === highestDim;
              return (
                <div
                  key={dimKey}
                  style={{
                    background: isDominant ? `linear-gradient(135deg, ${char.color}03 0%, #ffffff 100%)` : '#fff',
                    border: isDominant ? `2.5px solid ${char.color}` : '1.5px solid rgba(228, 223, 217, 0.7)',
                    borderRadius: '18px',
                    padding: '20px',
                    position: 'relative',
                    boxShadow: isDominant ? `0 10px 28px ${char.color}16, 0 3px 8px ${char.color}08` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transform: isDominant ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {isDominant && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '12px',
                      background: char.color,
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      padding: '2px 10px',
                      borderRadius: '10px',
                      boxShadow: `0 3px 6px ${char.color}40`,
                      letterSpacing: '0.5px'
                    }}>
                      ✓ Dominant Exemplar
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: char.color }} />
                      <span style={{ fontSize: '10.5px', fontWeight: 'bold', color: char.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        {char.trait}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 8px 0', fontFamily: "'Fraunces', serif" }}>
                      {char.name}
                    </h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                      {char.desc}
                    </p>
                  </div>

                  <div style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: isDominant ? char.color : 'var(--text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(228, 223, 217, 0.4)',
                    paddingTop: '10px',
                    marginTop: '4px'
                  }}>
                    <span>Dimension Score</span>
                    <span style={{
                      fontSize: '13.5px',
                      background: isDominant ? `${char.color}15` : 'rgba(228, 223, 217, 0.3)',
                      color: isDominant ? char.color : 'var(--text-secondary)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>{scores[dimKey]}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* In-Depth Traits breakdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid #e4dfd9', paddingBottom: '6px' }}>
            🔍 In-Depth Trait Profiles
          </div>

          {['O', 'C', 'E', 'A', 'P'].map(dim => {
            const val = scores[dim];
            const tier = getTier(val);
            const detail = DIMENSION_DETAILS[dim];
            const profile = detail.tiers[tier];

            return (
              <div key={dim} style={{ background: '#fff', border: '1.5px solid rgba(228, 223, 217, 0.7)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(228, 223, 217, 0.5)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: DIM_INFO[dim].color }} />
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--navy)' }}>{detail.label}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: DIM_INFO[dim].color, fontSize: '14px', background: `${DIM_INFO[dim].color}12`, padding: '4px 10px', borderRadius: '20px' }}>
                    {val}% • {profile.title}
                  </span>
                </div>
                
                <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
                  {profile.desc}
                </p>

                <div className="disc-profile-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>
                  <div className="disc-profile-col" style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '12px', padding: '12px' }}>
                    <div className="disc-col-header disc-col-strengths" style={{ color: '#047857', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      💪 Key Strengths
                    </div>
                    <ul className="disc-col-list" style={{ paddingLeft: '20px', margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {profile.strengths.map((s, i) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)}
                    </ul>
                  </div>

                  <div className="disc-profile-col" style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px', padding: '12px' }}>
                    <div className="disc-col-header disc-col-blindspots" style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      👁 Watch-outs / Blind Spots
                    </div>
                    <ul className="disc-col-list" style={{ paddingLeft: '20px', margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {profile.blindSpots.map((s, i) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="widget-reset-btn" onClick={resetAssessment}>↺ Retake Profile Assessment</button>
        </div>
      </div>
    );
  }

  // ─── BIG FIVE SURVEY IN PROGRESS ───
  const activeQuestion = QUESTIONS[qIdx];
  const progress = Math.round((qIdx / QUESTIONS.length) * 100);
  const themeColor = DIM_INFO[activeQuestion.dim].color;

  return (
    <div className="disc-assessment" style={{ width: '100%' }}>
      {/* Progress tracking */}
      <div className="disc-progress-area">
        <div className="disc-progress-bar" style={{ background: `${themeColor}15` }}>
          <div
            className="disc-progress-fill"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${themeColor}aa 0%, ${themeColor} 100%)`
            }}
          />
        </div>
        <div className="disc-progress-text">
          <span>Question {qIdx + 1} of {QUESTIONS.length}</span>
          <span className="disc-progress-pct" style={{ color: themeColor }}>{progress}%</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="disc-instruction" style={{ marginBottom: '20px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
        Rate how accurately the following statement describes you. Answer quickly and honestly:
      </div>

      {/* Question Card */}
      <div style={{
        background: `linear-gradient(135deg, ${themeColor}03 0%, ${themeColor}0e 100%)`,
        border: `1.5px solid ${themeColor}22`,
        borderRadius: '20px',
        padding: '32px 24px',
        marginBottom: '20px',
        textAlign: 'center',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.015), 0 1px 2px rgba(0, 0, 0, 0.005)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `${themeColor}0a`,
          filter: 'blur(12px)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          fontSize: '11px',
          fontWeight: '800',
          color: themeColor,
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          marginBottom: '10px'
        }}>
          {DIM_INFO[activeQuestion.dim].label}
        </div>
        <div style={{
          fontSize: '19px',
          fontWeight: '700',
          color: 'var(--navy)',
          lineHeight: '1.4',
          fontFamily: "'Fraunces', serif"
        }}>
          "{activeQuestion.text}"
        </div>
      </div>

      {/* Likert Selection Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {LIKERT_OPTIONS.map(opt => {
          const isSelected = answers[activeQuestion.id] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`quiz-option ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectOption(activeQuestion.id, opt.value)}
              style={{
                padding: '14px 18px',
                textAlign: 'left',
                background: isSelected ? `${themeColor}08` : '#fff',
                border: isSelected ? `2px solid ${themeColor}` : '1.5px solid rgba(228, 223, 217, 0.7)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: isSelected ? '700' : '500',
                color: isSelected ? themeColor : 'var(--text-primary)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: isSelected ? `0 4px 12px ${themeColor}12` : 'none',
                transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* Option circular number indicator */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${isSelected ? themeColor : 'rgba(228, 223, 217, 0.8)'}`,
                background: isSelected ? themeColor : '#fff',
                color: isSelected ? '#fff' : 'var(--text-light)',
                marginRight: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}>
                {opt.value}
              </span>
              <span style={{ flexGrow: 1 }}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Back button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="button"
          className="widget-reset-btn"
          onClick={() => setQIdx(Math.max(0, qIdx - 1))}
          disabled={qIdx === 0}
          style={{ opacity: qIdx === 0 ? 0.4 : 1, cursor: qIdx === 0 ? 'not-allowed' : 'pointer' }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
