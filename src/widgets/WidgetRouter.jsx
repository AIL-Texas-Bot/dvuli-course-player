import ReflectionPanels from './ReflectionPanels'
import HexagonRadar     from './HexagonRadar'
import DragRank         from './DragRank'
import ChecklistRater   from './ChecklistRater'
import BalanceScale     from './BalanceScale'
import StepJourney      from './StepJourney'
import ConcentricRings  from './ConcentricRings'
import FourQuadrant     from './FourQuadrant'
import TwoAxisMap       from './TwoAxisMap'
import Continuum        from './Continuum'

// New dedicated assessments
import DiscAssessment   from './DiscAssessment'
import MatchingGame     from './MatchingGame'
import SmartGoalAgenda  from './SmartGoalAgenda'
import LeadershipTree   from './LeadershipTree'
import ReflectiveJournal from './ReflectiveJournal'
import InteractiveDiagrams from './InteractiveDiagrams'
import BreakthroughFeedback from './BreakthroughFeedback'
import CollaborativeGrowth from './CollaborativeGrowth'
import PamRevisited from './PamRevisited'

import './widgets.css'

const COMPONENTS = {
  panels:    ReflectionPanels,
  hexagon:   HexagonRadar,
  dragrank:  DragRank,
  checklist: ChecklistRater,
  balance:   BalanceScale,
  steps:     StepJourney,
  rings:     ConcentricRings,
  quadrant:  FourQuadrant,
  twoaxis:   TwoAxisMap,
  continuum: Continuum,
  disc:      DiscAssessment,
  game:      MatchingGame,
  wizard:    SmartGoalAgenda,
  tree:      LeadershipTree,
  journal:   ReflectiveJournal,
  diagram:   InteractiveDiagrams,
  btfeedback: BreakthroughFeedback,
  collabgrowth: CollaborativeGrowth,
  pamrevisited: PamRevisited
}

const TYPE_LABELS = {
  panels:    'Reflection Panels',
  hexagon:   'Hexagon Assessment',
  dragrank:  'Priority Ranking',
  checklist: 'Rating Checklist',
  balance:   'Balance Scale',
  steps:     'Guided Journey',
  rings:     'Concentric Rings',
  quadrant:  'Planning Grid',
  twoaxis:   'Strategic Map',
  continuum: 'Spectrum Continuum',
  disc:      'DISC Assessment',
  game:      'Matching Card Game',
  wizard:    'Workbook Wizard',
  tree:      'Leadership Tree Map',
  journal:   'Reflective Journal Loop',
  diagram:   'Systems Diagram Map',
  btfeedback: 'Peer Feedback Hub',
  collabgrowth: 'Six-Skills Growth Tracker',
  pamrevisited: 'Full-Arc Hexagon Revisited'
}

const TYPE_ICONS = {
  panels:    '🪗',
  hexagon:   '⬡',
  dragrank:  '↕',
  checklist: '☑',
  balance:   '⚖',
  steps:     '🪜',
  rings:     '◎',
  quadrant:  '⊞',
  twoaxis:   '🎯',
  continuum: '↔',
  disc:      '🧬',
  game:      '🃏',
  wizard:    '🪄',
  tree:      '🌳',
  journal:   '📓',
  diagram:   '🕸',
  btfeedback: '📣',
  collabgrowth: '📈',
  pamrevisited: '👑'
}

const WIDGET_ROUTING = {
  'ch1-widget-0': 'rings',
  'ch1-widget-1': 'hexagon',
  'ch1-widget-2': 'dragrank',
  'ch2-widget-0': 'disc',
  'ch2-widget-1': 'disc',
  'ch2-widget-2': 'game',
  'ch3-widget-0': 'twoaxis',
  'ch3-widget-1': 'game',
  'ch3-widget-2': 'wizard',
  'ch4-widget-0': 'tree',
  'ch4-widget-1': 'tree',
  'ch4-widget-2': 'journal',
  'ch5-widget-0': 'hexagon',
  'ch5-widget-1': 'game',
  'ch5-widget-2': 'wizard',
  'ch6-widget-0': 'quadrant',
  'ch6-widget-1': 'checklist',
  'ch6-widget-2': 'steps',
  'ch7-widget-0': 'diagram',
  'ch7-widget-1': 'steps',
  'ch7-widget-2': 'panels',
  'ch8-widget-0': 'diagram',
  'ch8-widget-1': 'checklist',
  'ch8-widget-2': 'steps',
  'ch9-widget-0': 'checklist',
  'ch9-widget-1': 'balance',
  'ch9-widget-2': 'quadrant',
  'ch10-widget-0': 'panels',
  'ch10-widget-1': 'rings',
  'ch10-widget-2': 'continuum',
  'ch11-widget-0': 'continuum',
  'ch11-widget-1': 'steps',
  'ch11-widget-2': 'quadrant',
  'ch12-widget-0': 'steps',
  'ch12-widget-1': 'twoaxis',
  'ch12-widget-2': 'quadrant',
  'ch13-widget-0': 'steps',
  'ch13-widget-1': 'quadrant',
  'ch13-widget-2': 'quadrant',
  'ch14-widget-0': 'checklist',
  'ch14-widget-1': 'steps',
  'ch14-widget-2': 'steps',
  'ch15-widget-0': 'rings',
  'ch15-widget-1': 'steps',
  'ch15-widget-2': 'panels',
  'ch16-widget-0': 'btfeedback',
  'ch16-widget-1': 'collabgrowth',
  'ch16-widget-2': 'pamrevisited',
}

export default function WidgetRouter({ block }) {
  const config = block.config || {}
  const blockId = block.id || ''
  const type = WIDGET_ROUTING[blockId] || 'panels'
  const Component = COMPONENTS[type]

  return (
    <div className="widget-shell">
      <div className="widget-shell-header">
        <div className="widget-shell-header-left">
          <div className="widget-shell-label">
            <span className="widget-shell-label-dot" />
            {TYPE_ICONS[type]} Interactive · {TYPE_LABELS[type]}
          </div>
          <div className="widget-shell-title">{block.title}</div>
          {config.concept && (
            <div className="widget-shell-concept">{config.concept}</div>
          )}
        </div>
      </div>
      <div className="widget-body">
        <Component config={config} blockId={block.id} />
      </div>
    </div>
  )
}
