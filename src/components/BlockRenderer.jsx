import InfographicBlock    from './InfographicBlock'
import NarrativeBlock       from './NarrativeBlock'
import KeyConceptsBlock     from './KeyConceptsBlock'
import QuizBlock            from './QuizBlock'
import WeeklyChallengeBlock from './WeeklyChallengeBlock'
import DiscussionBlock      from './DiscussionBlock'
import ActivityBlock        from './ActivityBlock'
import SlidesBlock          from './SlidesBlock'
import AudioBlock           from './AudioBlock'
import WidgetBlock          from './WidgetBlock'
import CollapsibleBlock     from './CollapsibleBlock'

const BLOCK_MAP = {
  'infographic':      InfographicBlock,
  'narrative':        NarrativeBlock,
  'key-concepts':     KeyConceptsBlock,
  'quiz-in-class':    QuizBlock,
  'weekly-challenge': WeeklyChallengeBlock,
  'discussion':       DiscussionBlock,
  'activity':         ActivityBlock,
  'slides':           SlidesBlock,
  'audio':            AudioBlock,
  'widget':           WidgetBlock,
}

const COLLAPSIBLE_KINDS = ['weekly-challenge', 'discussion', 'activity', 'slides']

export default function BlockRenderer({ block, widgets, style }) {
  const Component = BLOCK_MAP[block.kind]
  if (!Component) return null

  const innerComponent = <Component block={block} widgets={widgets} />

  if (COLLAPSIBLE_KINDS.includes(block.kind)) {
    return (
      <div className="block-wrapper" id={block.id} style={style}>
        <CollapsibleBlock kind={block.kind} title={block.title}>
          {innerComponent}
        </CollapsibleBlock>
      </div>
    )
  }

  return (
    <div className="block-wrapper" id={block.id} style={style}>
      {innerComponent}
    </div>
  )
}
