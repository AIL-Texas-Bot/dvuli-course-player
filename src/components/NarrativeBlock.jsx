import { useEffect, useRef, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import WidgetBlock from './WidgetBlock'

function scopeSelectors(selector, scope) {
  if (!selector || selector.startsWith('@')) return selector;
  return selector.split(',')
    .map(sel => {
      sel = sel.trim();
      if (!sel) return '';
      
      // Neutralize global selectors to prevent them from affecting the app
      if (sel === 'body' || sel === 'html' || sel === ':root' || sel === '*' || sel === '*::before' || sel === '*::after') {
        return `.html-content-dummy-${sel.replace(/[^a-z0-9]/gi, '')}`;
      }
      if (sel.startsWith('.container') || sel === '.container') {
        return sel.replace('.container', '.html-content-container-dummy');
      }
      if (sel === '#progress-bar' || sel.startsWith('#progress-bar ')) {
        return sel.replace('#progress-bar', '.html-content-progress-dummy');
      }
      if (sel === '.chapter-header' || sel.startsWith('.chapter-header ')) {
        return sel.replace('.chapter-header', '.html-content-header-dummy');
      }
      
      // Prepend the scope selector (e.g. .html-content) to isolate styles
      return `${scope} ${sel}`;
    })
    .join(', ');
}

function scopeCss(css, scope) {
  let result = '';
  let depth = 0;
  let buffer = '';
  let inMedia = false;

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    if (char === '{') {
      if (depth === 0) {
        const selector = buffer.trim();
        if (selector.startsWith('@media')) {
          inMedia = true;
          result += selector + ' {';
        } else {
          result += scopeSelectors(selector, scope) + ' {';
        }
        buffer = '';
      } else {
        if (inMedia && depth === 1) {
          const selector = buffer.trim();
          result += scopeSelectors(selector, scope) + ' {';
          buffer = '';
        } else {
          result += '{';
        }
      }
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        inMedia = false;
        result += '}';
      } else {
        result += '}';
      }
      buffer = '';
    } else {
      if (depth === 0 || (inMedia && depth === 1)) {
        buffer += char;
      } else {
        result += char;
      }
    }
  }
  return result;
}

function cleanHtmlContent(html) {
  if (!html) return ''
  
  // 1. Extract style tags and scope them
  let scopedStyles = '';
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    const css = match[1];
    scopedStyles += `<style>${scopeCss(css, '.html-content')}</style>`;
  }
  
  // 2. Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;
  
  // 3. Clean body content
  // Remove script tags and their contents
  bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove duplicate chapter headers
  bodyContent = bodyContent.replace(/<header class="chapter-header">[\s\S]*?<\/header>/gi, '');
  
  // Remove duplicate progress bars
  bodyContent = bodyContent.replace(/<div id="progress-bar"><\/div>/gi, '');
  
  // Neutralize inline event handlers (onclick, onchange, etc.) that reference
  // stripped <script> functions — prevents ReferenceError crashes in the browser
  bodyContent = bodyContent.replace(/\s+on[a-z]+="[^"]*"/gi, '')
  bodyContent = bodyContent.replace(/\s+on[a-z]+='[^']*'/gi, '')
  
  return scopedStyles + bodyContent;
}

export default function NarrativeBlock({ block, widgets = [] }) {
  const containerRef = useRef(null)
  const [mountedWidgets, setMountedWidgets] = useState([])

  const cleanedHtml = useMemo(() => cleanHtmlContent(block.html), [block.html])

  useEffect(() => {
    if (!containerRef.current || !widgets || widgets.length === 0) {
      setMountedWidgets([])
      return
    }

    // Query for all widget containers in the rendered HTML
    const containers = containerRef.current.querySelectorAll('.widget-container')
    const targets = []

    containers.forEach((container, index) => {
      // Clear any placeholder/mockup static HTML content
      container.innerHTML = ''
      
      const widgetBlock = widgets[index]
      if (widgetBlock) {
        targets.push({
          element: container,
          block: widgetBlock
        })
      }
    })

    setMountedWidgets(targets)
  }, [cleanedHtml, widgets])

  if (block.html) {
    return (
      <div className="narrative-block" ref={containerRef}>
        <div className="block-label">
          <span className="block-label-dot" />
          Reading
        </div>
        <div 
          className="narrative-text html-content" 
          dangerouslySetInnerHTML={{ __html: cleanedHtml }} 
        />
        
        {/* Render widgets in their HTML inline portal containers */}
        {mountedWidgets.map(({ element, block: wBlock }) => 
          createPortal(<WidgetBlock block={wBlock} />, element)
        )}
      </div>
    )
  }

  return (
    <div className="narrative-block">
      <div className="block-label">
        <span className="block-label-dot" />
        Overview
      </div>
      <p className="narrative-text">{block.text}</p>
    </div>
  )
}
