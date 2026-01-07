/**
 * Utilities for extracting sections from MDX body content by parsing headings.
 *
 * For single experiences:
 *   - ## Summary -> description
 *   - ## Details -> responsibilities (parsed as list items)
 *
 * For grouped experiences:
 *   - ## {role-id}
 *     - ### Summary -> role description
 *     - ### Details -> role responsibilities
 */

export interface ParsedSection {
  summary: string;
  details: string[];
}

export interface ParsedRoleContent {
  [roleId: string]: ParsedSection;
}

/**
 * Parse a single-position MDX body into summary and details.
 * Expects markdown structure:
 *   ## Summary
 *   <text>
 *   ## Details
 *   - item 1
 *   - item 2
 */
export function parseSingleExperienceContent(body: string): ParsedSection {
  const lines = body.split('\n');
  let currentSection: 'none' | 'summary' | 'details' = 'none';
  const summary: string[] = [];
  const details: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.toLowerCase() === '## summary') {
      currentSection = 'summary';
      continue;
    }
    if (trimmed.toLowerCase() === '## details') {
      currentSection = 'details';
      continue;
    }

    // Skip other h2 headers
    if (trimmed.startsWith('## ')) {
      currentSection = 'none';
      continue;
    }

    if (currentSection === 'summary' && trimmed) {
      summary.push(trimmed);
    } else if (currentSection === 'details') {
      // Parse list items (- or * prefix)
      const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
      if (listMatch) {
        details.push(listMatch[1]);
      }
    }
  }

  return {
    summary: summary.join(' '),
    details,
  };
}

/**
 * Parse a grouped-position MDX body into per-role content.
 * Expects markdown structure:
 *   ## role-id-1
 *   ### Summary
 *   <text>
 *   ### Details
 *   - item 1
 *   ## role-id-2
 *   ...
 */
export function parseGroupedExperienceContent(body: string): ParsedRoleContent {
  const lines = body.split('\n');
  const roles: ParsedRoleContent = {};

  let currentRoleId: string | null = null;
  let currentSubSection: 'none' | 'summary' | 'details' = 'none';
  let currentSummary: string[] = [];
  let currentDetails: string[] = [];

  const saveCurrentRole = () => {
    if (currentRoleId) {
      roles[currentRoleId] = {
        summary: currentSummary.join(' '),
        details: currentDetails,
      };
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // H2 = new role section
    const h2Match = trimmed.match(/^## (.+)$/);
    if (h2Match && !['summary', 'details'].includes(h2Match[1].toLowerCase())) {
      saveCurrentRole();
      currentRoleId = h2Match[1];
      currentSubSection = 'none';
      currentSummary = [];
      currentDetails = [];
      continue;
    }

    // H3 = sub-section within role
    if (trimmed.toLowerCase() === '### summary') {
      currentSubSection = 'summary';
      continue;
    }
    if (trimmed.toLowerCase() === '### details') {
      currentSubSection = 'details';
      continue;
    }

    // Skip other h3 headers
    if (trimmed.startsWith('### ')) {
      currentSubSection = 'none';
      continue;
    }

    if (currentRoleId) {
      if (currentSubSection === 'summary' && trimmed) {
        currentSummary.push(trimmed);
      } else if (currentSubSection === 'details') {
        const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (listMatch) {
          currentDetails.push(listMatch[1]);
        }
      }
    }
  }

  // Save last role
  saveCurrentRole();

  return roles;
}
