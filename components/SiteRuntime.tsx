'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function sameDocumentHashNavigation(url: URL): boolean {
  return url.pathname === window.location.pathname &&
    url.search === window.location.search &&
    Boolean(url.hash);
}

export function SiteRuntime() {
  const pathname = usePathname();
  const router = useRouter();

  // The legacy static content contains normal <a> tags. Intercept only local links
  // and send them through the Next.js App Router so route changes do not hard-refresh.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href')?.trim() || '';
      if (!rawHref || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();

      if (sameDocumentHashNavigation(url)) {
        const nextUrl = `${url.pathname}${url.search}${url.hash}`;
        window.history.pushState({}, '', nextUrl);
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        const id = decodeURIComponent(url.hash.slice(1));
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      router.push(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const intervals: number[] = [];
    const observers: IntersectionObserver[] = [];
    const abortController = new AbortController();
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

    const listen = <K extends keyof HTMLElementEventMap>(
      element: HTMLElement,
      type: K,
      handler: (event: HTMLElementEventMap[K]) => void
    ) => {
      element.addEventListener(type, handler as EventListener);
      cleanups.push(() => element.removeEventListener(type, handler as EventListener));
    };

    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Hero slider.
    const slides = Array.from(document.querySelectorAll<HTMLElement>('.hero-slide'));
    let heroIndex = 0;
    const showHero = (index: number) => {
      slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
    };
    if (slides.length) {
      showHero(0);
      if (slides.length > 1 && !reduceMotion) {
        intervals.push(window.setInterval(() => {
          heroIndex = (heroIndex + 1) % slides.length;
          showHero(heroIndex);
        }, 6500));
      }
    }

    // FAQ accordion.
    document.querySelectorAll<HTMLElement>('.faq-question').forEach((button) => {
      listen(button, 'click', () => {
        const item = button.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.toggle('active');
        button.setAttribute('aria-expanded', String(isOpen));
      });
    });

    // About read-more interaction.
    const aboutToggle = document.querySelector<HTMLElement>('[data-about-toggle]');
    const aboutBody = document.querySelector<HTMLElement>('[data-expandable-about]');
    if (aboutToggle && aboutBody) {
      listen(aboutToggle, 'click', () => {
        const expanded = aboutBody.classList.toggle('expanded');
        aboutToggle.setAttribute('aria-expanded', String(expanded));
        const label = aboutToggle.querySelector<HTMLElement>('.about-expand-label');
        if (label) label.textContent = expanded ? 'Show less' : 'Read full overview';
      });
    }

    // Logo marquees. All clones are marked so they can be removed safely.
    if (!reduceMotion) {
      document.querySelectorAll<HTMLElement>('[data-marquee-track]').forEach((track) => {
        track.querySelectorAll('[data-next-marquee-clone="true"]').forEach((node) => node.remove());
        const viewport = track.closest<HTMLElement>('.marquee-viewport');
        const group = track.querySelector<HTMLElement>(':scope > .marquee-group');
        if (!viewport || !group || group.children.length === 0) return;

        const seedItems = Array.from(group.children);
        if (seedItems.length === 1) {
          track.classList.add('is-marquee-static');
          return;
        }

        let guard = 0;
        while (group.scrollWidth < viewport.clientWidth * 1.15 && guard < 24) {
          const seed = seedItems[guard % seedItems.length];
          const clone = seed.cloneNode(true) as HTMLElement;
          clone.dataset.nextMarqueeClone = 'true';
          clone.setAttribute('aria-hidden', 'true');
          if (clone.matches('a')) clone.setAttribute('tabindex', '-1');
          clone.querySelectorAll<HTMLElement>('a, button, input, textarea, select').forEach((element) => element.setAttribute('tabindex', '-1'));
          group.appendChild(clone);
          guard += 1;
        }

        const groupClone = group.cloneNode(true) as HTMLElement;
        groupClone.dataset.nextMarqueeClone = 'true';
        groupClone.setAttribute('aria-hidden', 'true');
        groupClone.querySelectorAll<HTMLElement>('a, button, input, textarea, select').forEach((element) => element.setAttribute('tabindex', '-1'));
        track.appendChild(groupClone);
        track.classList.add('is-marquee-ready');

        cleanups.push(() => {
          track.classList.remove('is-marquee-ready', 'is-marquee-static');
          track.querySelectorAll('[data-next-marquee-clone="true"]').forEach((node) => node.remove());
        });
      });
    }

    // Reveal animations.
    const revealItems = document.querySelectorAll<HTMLElement>('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      observers.push(revealObserver);
      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('visible'));
    }

    const animateCounter = (element: HTMLElement) => {
      if (element.dataset.counterStarted === 'true') return;
      element.dataset.counterStarted = 'true';
      const target = Number(element.dataset.target || 0);
      if (reduceMotion || target <= 0) {
        element.textContent = target.toLocaleString();
        return;
      }

      let current = 0;
      const step = Math.max(1, Math.ceil(target / 70));
      const timer = window.setInterval(() => {
        current = Math.min(target, current + step);
        element.textContent = current.toLocaleString();
        if (current >= target) window.clearInterval(timer);
      }, 20);
      intervals.push(timer);
    };

    const initCounters = async () => {
      const visitor = document.querySelector<HTMLElement>('[data-visitor-counter]');
      if (visitor) {
        try {
          const response = await fetch('/api/visitor-counter', {
            method: 'GET',
            headers: { Accept: 'application/json' },
            cache: 'no-store',
            credentials: 'same-origin',
            signal: abortController.signal
          });
          const data = await response.json().catch(() => ({}));
          if (response.ok && data?.ok) {
            visitor.dataset.target = String(Number(data.count || 0));
          }
        } catch (error) {
          if ((error as Error)?.name !== 'AbortError') {
            visitor.dataset.target = visitor.dataset.target || '0';
          }
        }
      }

      const counters = document.querySelectorAll<HTMLElement>('.counter');
      if ('IntersectionObserver' in window && !reduceMotion) {
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target as HTMLElement);
            counterObserver.unobserve(entry.target);
          });
        }, { threshold: 0.35 });
        observers.push(counterObserver);
        counters.forEach((counter) => counterObserver.observe(counter));
      } else {
        counters.forEach(animateCounter);
      }
    };
    void initCounters();

    // Portfolio filtering.
    const portfolioFilters = Array.from(document.querySelectorAll<HTMLElement>('[data-portfolio-filter]'));
    const portfolioItems = Array.from(document.querySelectorAll<HTMLElement>('[data-portfolio-item]'));
    if (portfolioFilters.length && portfolioItems.length) {
      const applyPortfolioFilter = (filter?: string) => {
        const normalized = (filter || 'all').toLowerCase();
        portfolioFilters.forEach((button) => {
          const active = button.dataset.portfolioFilter === normalized;
          button.classList.toggle('active', active);
          button.setAttribute('aria-pressed', String(active));
        });
        portfolioItems.forEach((card) => {
          const matches = normalized === 'all' || card.dataset.category === normalized;
          card.classList.toggle('hidden', !matches);
        });
      };
      portfolioFilters.forEach((button) => listen(button, 'click', () => applyPortfolioFilter(button.dataset.portfolioFilter)));
      applyPortfolioFilter('all');
    }

    // Insight filtering and hash-aware navigation.
    const newsFilters = Array.from(document.querySelectorAll<HTMLElement>('[data-news-filter]'));
    const newsItems = Array.from(document.querySelectorAll<HTMLElement>('[data-news-item]'));
    if (newsFilters.length && newsItems.length) {
      const applyNewsFilter = (filter?: string) => {
        const normalized = (filter || 'all').toLowerCase();
        newsFilters.forEach((button) => button.classList.toggle('active', button.dataset.newsFilter === normalized));
        newsItems.forEach((item) => {
          item.hidden = normalized !== 'all' && item.dataset.newsType !== normalized;
        });
      };
      const applyFromHash = () => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        applyNewsFilter(['company', 'technology'].includes(hash) ? hash : 'all');
      };
      newsFilters.forEach((button) => listen(button, 'click', () => applyNewsFilter(button.dataset.newsFilter)));
      window.addEventListener('hashchange', applyFromHash);
      cleanups.push(() => window.removeEventListener('hashchange', applyFromHash));
      applyFromHash();
    }

    // Contact form submission through the Next.js API route.
    const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
    if (form) {
      const status = form.querySelector<HTMLElement>('[data-form-status]');
      const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (status) {
          status.className = 'form-status';
          status.textContent = 'Sending your message...';
        }
        if (submit) {
          submit.disabled = true;
          submit.dataset.originalText = submit.textContent || 'Send Message';
          submit.textContent = 'Sending...';
        }

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok || !data?.ok) throw new Error(data?.message || 'Message could not be sent.');
          form.reset();
          if (status) {
            status.className = 'form-status success';
            status.textContent = data.message || 'Thank you. Your message has been sent successfully.';
          }
        } catch (error) {
          if (status) {
            status.className = 'form-status error';
            status.textContent = error instanceof Error
              ? error.message
              : 'We could not send your message right now. Please email info@nexasmc.com directly.';
          }
        } finally {
          if (submit) {
            submit.disabled = false;
            submit.textContent = submit.dataset.originalText || 'Send Message';
          }
        }
      };
      form.addEventListener('submit', onSubmit);
      cleanups.push(() => form.removeEventListener('submit', onSubmit));
    }

    // When a client-side route contains a hash, scroll after the new page is mounted.
    if (window.location.hash) {
      const hashTimer = window.setTimeout(() => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      }, 50);
      cleanups.push(() => window.clearTimeout(hashTimer));
    }

    return () => {
      abortController.abort();
      intervals.forEach((timer) => window.clearInterval(timer));
      observers.forEach((observer) => observer.disconnect());
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
