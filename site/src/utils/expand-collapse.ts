/**
 * Shared expand/collapse functionality for experience cards.
 * Handles toggle state, keyboard navigation, and hash-based expansion.
 */

/** Delay before scrolling to allow expand animation to start */
const EXPAND_ANIMATION_DELAY_MS = 100;

/**
 * Configuration for expand/collapse behavior on a container of cards.
 */
export interface ExpandCollapseConfig {
  /** CSS selector for the card container elements */
  containerSelector: string;
  /** CSS selector for the clickable header within each card */
  headerSelector: string;
  /** CSS selector for the toggle button within each card */
  toggleSelector: string;
  /** CSS selector for the collapsed content section */
  collapsedSelector: string;
  /** CSS selector for the expanded content section */
  expandedSelector: string;
  /** HTML attribute name that stores the card's unique ID */
  idAttribute: string;
  /** Prefix to prepend when constructing element IDs for scrolling */
  idPrefix: string;
  /** Tailwind margin class to apply in expanded/collapsed states */
  margin: 'mt-2' | 'mt-4';
  /** Optional CSS selector for company links that should not trigger toggle */
  companyLinkSelector?: string;
}

interface CardController {
  setExpanded: (expand: boolean) => void;
}

interface ExpandCollapseState {
  controller: AbortController | null;
  cardControllers: Map<string, CardController>;
  initialized: boolean;
  swapHandler: (() => void) | null;
  cleanupHandler: (() => void) | null;
}

const stateByType: Map<string, ExpandCollapseState> = new Map();

function getState(containerSelector: string): ExpandCollapseState {
  let state = stateByType.get(containerSelector);
  if (!state) {
    state = {
      controller: null,
      cardControllers: new Map(),
      initialized: false,
      swapHandler: null,
      cleanupHandler: null,
    };
    stateByType.set(containerSelector, state);
  }
  return state;
}

/**
 * Cleans up state for a specific container selector.
 * Removes event listeners, aborts controllers, and removes from stateByType.
 */
function cleanupState(containerSelector: string): void {
  const state = stateByType.get(containerSelector);
  if (!state) return;

  if (state.swapHandler) {
    document.removeEventListener('astro:after-swap', state.swapHandler);
  }
  if (state.cleanupHandler) {
    document.removeEventListener(
      'astro:before-preparation',
      state.cleanupHandler,
    );
  }
  if (state.controller) {
    state.controller.abort();
  }
  state.cardControllers.clear();
  stateByType.delete(containerSelector);
}

function setExpanded(
  expand: boolean,
  elements: {
    header: Element | null;
    toggle: Element | null;
    collapsed: Element | null;
    expanded: Element | null;
    chevron: Element | null;
  },
  margin: string,
): void {
  const { header, toggle, collapsed, expanded, chevron } = elements;

  header?.setAttribute('aria-expanded', String(expand));
  toggle?.setAttribute(
    'aria-label',
    expand ? 'Collapse details' : 'Expand details',
  );

  if (expand) {
    collapsed?.classList.remove('grid-rows-[1fr]', margin);
    collapsed?.classList.add('grid-rows-[0fr]', 'mt-0');
    expanded?.classList.remove('grid-rows-[0fr]', 'mt-0');
    expanded?.classList.add('grid-rows-[1fr]', margin);
    chevron?.classList.add('rotate-180');
  } else {
    collapsed?.classList.remove('grid-rows-[0fr]', 'mt-0');
    collapsed?.classList.add('grid-rows-[1fr]', margin);
    expanded?.classList.remove('grid-rows-[1fr]', margin);
    expanded?.classList.add('grid-rows-[0fr]', 'mt-0');
    chevron?.classList.remove('rotate-180');
  }
}

export function initExpandCollapse(config: ExpandCollapseConfig): void {
  const state = getState(config.containerSelector);

  if (state.controller) {
    state.controller.abort();
  }
  state.controller = new AbortController();
  state.cardControllers.clear();

  const opts = { signal: state.controller.signal };

  document.querySelectorAll(config.containerSelector).forEach((card) => {
    const header = card.querySelector(config.headerSelector);
    const toggle = card.querySelector(config.toggleSelector);
    const collapsed = card.querySelector(config.collapsedSelector);
    const expanded = card.querySelector(config.expandedSelector);
    const chevron = toggle?.querySelector('svg') ?? null;
    const cardId = card.getAttribute(config.idAttribute);

    let isExpanded = false;
    const elements = { header, toggle, collapsed, expanded, chevron };

    function handleSetExpanded(expand: boolean): void {
      isExpanded = expand;
      setExpanded(expand, elements, config.margin);
    }

    function handleToggle(e: Event): void {
      e.preventDefault();
      handleSetExpanded(!isExpanded);
    }

    header?.addEventListener('click', handleToggle, opts);
    header?.addEventListener(
      'keydown',
      (e) => {
        if (
          (e as KeyboardEvent).key === 'Enter' ||
          (e as KeyboardEvent).key === ' '
        ) {
          e.preventDefault();
          handleToggle(e);
        }
      },
      opts,
    );

    toggle?.addEventListener(
      'click',
      (e) => {
        e.stopPropagation();
        handleToggle(e);
      },
      opts,
    );

    if (config.companyLinkSelector) {
      card.querySelector(config.companyLinkSelector)?.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
        },
        opts,
      );
    }

    if (cardId) {
      state.cardControllers.set(cardId, { setExpanded: handleSetExpanded });
    }
  });

  const handleHash = (): void => {
    const hash = window.location.hash.slice(1);
    const cardController = state.cardControllers.get(hash);
    if (cardController) {
      cardController.setExpanded(true);
      setTimeout(() => {
        document
          .getElementById(`${config.idPrefix}${hash}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, EXPAND_ANIMATION_DELAY_MS);
    }
  };

  handleHash();
  window.addEventListener('hashchange', handleHash, opts);
}

export function registerExpandCollapseInit(config: ExpandCollapseConfig): void {
  const state = getState(config.containerSelector);

  initExpandCollapse(config);

  if (!state.initialized) {
    state.initialized = true;

    // Store handler on state so the same reference can be removed later
    state.swapHandler = () => initExpandCollapse(config);
    document.addEventListener('astro:after-swap', state.swapHandler);

    // Clean up on page navigation (Astro-specific lifecycle)
    // Each container registers its own cleanup handler
    const containerSelector = config.containerSelector;
    state.cleanupHandler = () => cleanupState(containerSelector);
    document.addEventListener('astro:before-preparation', state.cleanupHandler);
  }
}
