/**
 * Utilities for extracting sections from MDX body content by parsing headings.
 *
 * For single experiences:
 *   - ## Highlights -> condensed view (work summary)
 *   - ## Description -> expanded view (role/team context)
 *   - ## Details -> responsibilities (parsed as list items)
 *
 * For grouped experiences:
 *   - ## {role-id}
 *     - ### Highlights -> condensed view
 *     - ### Description -> expanded view context
 *     - ### Details -> role responsibilities
 */

export interface ParsedSection {
  highlights: string;
  description: string;
  details: string[];
}

export interface ParsedRoleContent {
  [roleId: string]: ParsedSection;
}

/**
 * Parse a single-position MDX body into highlights, description, and details.
 * Expects markdown structure:
 *   ## Highlights
 *   <text for condensed view>
 *   ## Description
 *   <text for expanded view context>
 *   ## Details
 *   - item 1
 *   - item 2
 */
export function parseSingleExperienceContent(body: string): ParsedSection {
  const lines = body.split('\n');
  let currentSection: 'none' | 'highlights' | 'description' | 'details' =
    'none';
  const highlights: string[] = [];
  const description: string[] = [];
  const details: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.toLowerCase() === '## highlights') {
      currentSection = 'highlights';
      continue;
    }
    if (trimmed.toLowerCase() === '## description') {
      currentSection = 'description';
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

    if (currentSection === 'highlights' && trimmed) {
      highlights.push(trimmed);
    } else if (currentSection === 'description' && trimmed) {
      description.push(trimmed);
    } else if (currentSection === 'details') {
      // Parse list items (- or * prefix)
      const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
      if (listMatch) {
        details.push(listMatch[1]);
      }
    }
  }

  return {
    highlights: highlights.join(' '),
    description: description.join(' '),
    details,
  };
}

/**
 * Parse a grouped-position MDX body into per-role content.
 * Expects markdown structure:
 *   ## role-id-1
 *   ### Highlights
 *   <text for condensed view>
 *   ### Description
 *   <text for expanded view context>
 *   ### Details
 *   - item 1
 *   ## role-id-2
 *   ...
 */
export function parseGroupedExperienceContent(body: string): ParsedRoleContent {
  const lines = body.split('\n');
  const roles: ParsedRoleContent = {};

  let currentRoleId: string | null = null;
  let currentSubSection: 'none' | 'highlights' | 'description' | 'details' =
    'none';
  let currentHighlights: string[] = [];
  let currentDescription: string[] = [];
  let currentDetails: string[] = [];

  const saveCurrentRole = () => {
    if (currentRoleId) {
      roles[currentRoleId] = {
        highlights: currentHighlights.join(' '),
        description: currentDescription.join(' '),
        details: currentDetails,
      };
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // H2 = new role section
    const h2Match = trimmed.match(/^## (.+)$/);
    if (
      h2Match &&
      !['highlights', 'description', 'details'].includes(
        h2Match[1].toLowerCase(),
      )
    ) {
      saveCurrentRole();
      currentRoleId = h2Match[1];
      currentSubSection = 'none';
      currentHighlights = [];
      currentDescription = [];
      currentDetails = [];
      continue;
    }

    // H3 = sub-section within role
    if (trimmed.toLowerCase() === '### highlights') {
      currentSubSection = 'highlights';
      continue;
    }
    if (trimmed.toLowerCase() === '### description') {
      currentSubSection = 'description';
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
      if (currentSubSection === 'highlights' && trimmed) {
        currentHighlights.push(trimmed);
      } else if (currentSubSection === 'description' && trimmed) {
        currentDescription.push(trimmed);
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
