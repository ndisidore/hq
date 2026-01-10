/**
 * Shared expand/collapse functionality for experience cards.
 * Handles toggle state, keyboard navigation, and hash-based expansion.
 */

/** Delay before scrolling to allow expand animation to start */
const EXPAND_ANIMATION_DELAY_MS = 100;

export interface ExpandCollapseConfig {
  containerSelector: string;
  headerSelector: string;
  toggleSelector: string;
  collapsedSelector: string;
  expandedSelector: string;
  idAttribute: string;
  idPrefix: string;
  margin: 'mt-2' | 'mt-4';
  companyLinkSelector?: string;
}

interface CardController {
  setExpanded: (expand: boolean) => void;
}

interface ExpandCollapseState {
  controller: AbortController | null;
  cardControllers: Map<string, CardController>;
  initialized: boolean;
  cleanupRegistered: boolean;
}

const stateByType: Map<string, ExpandCollapseState> = new Map();

function getState(containerSelector: string): ExpandCollapseState {
  let state = stateByType.get(containerSelector);
  if (!state) {
    state = {
      controller: null,
      cardControllers: new Map(),
      initialized: false,
      cleanupRegistered: false,
    };
    stateByType.set(containerSelector, state);
  }
  return state;
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
    const swapHandler = () => initExpandCollapse(config);
    document.addEventListener('astro:after-swap', swapHandler);

    // Clean up on page unload (Astro-specific lifecycle)
    if (!state.cleanupRegistered) {
      state.cleanupRegistered = true;
      document.addEventListener(
        'astro:before-preparation',
        () => {
          document.removeEventListener('astro:after-swap', swapHandler);
          if (state.controller) state.controller.abort();
          state.initialized = false;
          state.cleanupRegistered = false;
        },
        { once: true },
      );
    }
  }
}
