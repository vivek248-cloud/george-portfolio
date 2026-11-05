(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const navigation = document.getElementById('main-navigation');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = [...navigation.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main > section[id]')];

  function closeMenu() {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  // Keep the current section in sync with the navigation, including at page bottom.
  let scrollScheduled = false;
  function updateScrollState() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    const readingLine = window.scrollY + header.offsetHeight + window.innerHeight * 0.22;
    let activeId = sections[0].id;
    for (const section of sections) {
      if (section.offsetTop <= readingLine) activeId = section.id;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) activeId = 'contact';
    navLinks.forEach(link => {
      const active = link.hash === '#' + activeId;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    scrollScheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateScrollState);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();

  // Animate skills only when they enter the viewport; the content remains visible without JS.
  const skillsGrid = document.querySelector('.skills-grid');
  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        skillsGrid.classList.add('is-visible');
        skillsObserver.disconnect();
      }
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsGrid);
  }

  const projects = {
    tshirt: {
      caption: 'From my desk,<br>to wardrobes worldwide.',
      title: 'T-Shirt Design Collection',
      category: 'Passion Project · Hobby',
      image: 'assets/tshirt-hero.jpg',
      imageAlt: 'Black t-shirt printed with a skeleton reading a book under candlelight and the line "just one more chapter"',
      overview: 'A personal hobby project: a growing collection of original t-shirt designs sold on Redbubble. It began as a way to keep drawing outside of client work and turned into a small print-on-demand collection reaching customers around the world.',
      role: 'T-Shirt Designer — a side passion, not client work. I concept, illustrate, typeset and prepare every design myself, then publish and manage the listings.',
      tools: 'Adobe Photoshop · Illustrator · Figma',
      challenge: 'Making artwork that works on a real product: it has to stay legible across shirt colours and sizes, say something at a glance, and stand out in a crowded marketplace — all while staying fun to make.',
      approach: 'Idea and theme exploration (anime, quotes, literature, minimal, culture), quick concept sketches, then digital illustration and typography in Photoshop and Illustrator. Each design is refined, exported at high resolution and published print-ready on Redbubble.',
      tags: ['Personal project', 'Illustration', 'Typography', 'Print-on-demand'],
      stats: [
        ['36', 'Total sales'],
        ['20%', 'Configured markup'],
        ['£44.85', 'Total price'],
        ['£7.48', 'Margin per sale']
      ]
    },
    ecotech: {
      caption: 'Designed for a seamless experience,<br>on every screen.',
      title: 'EcoTech Ltd',
      category: 'UX/UI Design',
      image: 'assets/ecotech.jpg',
      imageAlt: 'EcoTech sustainability website displayed on desktop and mobile',
      overview: 'A sustainability platform that makes exploring greener choices feel clear, engaging, and accessible.',
      role: 'UX research & UI design',
      tools: 'Figma · Webflow',
      challenge: 'Help visitors navigate sustainability information without feeling overwhelmed, while keeping the experience accessible across screen sizes.',
      approach: 'Structured the information around clear user journeys, designed responsive layouts, and created interactions with accessibility and WCAG guidance in mind. The experience was brought to life in Webflow.',
      tags: ['User flows', 'Accessibility', 'Responsive design', 'Interaction design']
    },
    morar: {
      caption: 'Calm, clear screens<br>that build better money habits.',
      title: 'Morar',
      category: 'UX/UI Design',
      image: 'assets/morar.jpg',
      imageAlt: 'Morar financial literacy platform displayed on desktop and mobile',
      overview: 'A friendly financial literacy app designed to help people learn, plan, and build better money habits.',
      role: 'End-to-end UX & UI design',
      tools: 'Figma',
      challenge: 'Make financial education approachable for people who are just starting to manage their money, with clear paths to learning, saving, and setting goals.',
      approach: 'Mapped the key user flows, explored the structure through wireframes, and developed high-fidelity screens. A calm visual language and simple navigation keep the focus on the next achievable step.',
      tags: ['User journeys', 'Wireframing', 'Mobile app design', 'Prototyping']
    },
    bookshop: {
      caption: 'Browsing, buying and managing<br>in one place.',
      title: 'Book Shop',
      category: 'Web Development',
      image: 'assets/bookshop.jpg',
      imageAlt: 'Book Shop online bookstore displayed on desktop and mobile',
      overview: 'A responsive e-commerce website that brings book discovery, shopping, and store management together.',
      role: 'Web design & development',
      tools: 'Bootstrap · PHP · MySQL',
      challenge: 'Create a straightforward shopping experience for readers, alongside a practical way for an administrator to manage books and customer orders.',
      approach: 'Built responsive pages with Bootstrap, supported by PHP and MySQL. The project includes user registration, book browsing, a shopping cart, and an admin panel for managing the catalogue and orders.',
      tags: ['E-commerce', 'Responsive development', 'Shopping cart', 'Admin dashboard']
    }
  };

  const dialog = document.getElementById('project-dialog');
  const dialogImage = document.getElementById('dialog-image');
  let previouslyFocused = null;

  function openProject(key, trigger) {
    const project = projects[key];
    if (!project) return;
    previouslyFocused = trigger;
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-category').textContent = project.category;
    document.getElementById('dialog-overview').textContent = project.overview;
    document.getElementById('dialog-role').textContent = project.role;
    document.getElementById('dialog-tools').textContent = project.tools;
    document.getElementById('dialog-challenge').textContent = project.challenge;
    document.getElementById('dialog-approach').textContent = project.approach;
    const caption = document.getElementById('dialog-caption');
    if (project.caption) caption.innerHTML = project.caption;
    dialogImage.src = project.image;
    dialogImage.alt = project.imageAlt;
    const tags = document.getElementById('dialog-tags');
    tags.replaceChildren(...project.tags.map(text => {
      const tag = document.createElement('span');
      tag.textContent = text;
      return tag;
    }));
    const designsBox = document.getElementById('dialog-designs');
    const designGrid = document.getElementById('design-grid');
    if (project.designs) {
      designGrid.replaceChildren(...project.designs.map(({ name, meta, image }) => {
        const li = document.createElement('li');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const caption = document.createElement('figcaption');
        const strong = document.createElement('strong');
        const span = document.createElement('span');
        img.src = image;
        img.alt = `T-shirt design: ${name}`;
        img.loading = 'lazy';
        img.width = 460;
        img.height = 455;
        strong.textContent = name;
        span.textContent = meta;
        caption.append(strong, span);
        figure.append(img, caption);
        li.append(figure);
        return li;
      }));
      designsBox.hidden = false;
    } else {
      designGrid.replaceChildren();
      designsBox.hidden = true;
    }
    const stats = document.getElementById('dialog-stats');
    if (project.stats) {
      stats.replaceChildren(...project.stats.map(([value,label]) => {
        const item = document.createElement('li');
        const strong = document.createElement('strong');
        const span = document.createElement('span');
        strong.textContent = value;
        span.textContent = label;
        item.append(strong, span);
        return item;
      }));
      stats.hidden = false;
    } else {
      stats.replaceChildren();
      stats.hidden = true;
    }
    document.body.classList.add('dialog-is-open');
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => openProject(button.dataset.project, button));
  });
  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-is-open');
    previouslyFocused?.focus({ preventScroll: true });
  });
  document.querySelector('.dialog-contact').addEventListener('click', event => {
    event.preventDefault();
    dialog.close();
    closeMenu();
    document.getElementById('contact').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });

  // Clipboard support with a fallback for static-file and restricted preview contexts.
  let toastTimeout;
  let copyTimeout;
  function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-text').textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function fallbackCopy(text) {
    const field = document.createElement('textarea');
    field.value = text;
    field.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    field.setAttribute('readonly', '');
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { /* Clipboard may be restricted. */ }
    field.remove();
    return copied;
  }

  document.getElementById('copy-email').addEventListener('click', async event => {
    const button = event.currentTarget;
    const email = 'fernandesgeorge873@gmail.com';
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      } else copied = fallbackCopy(email);
    } catch (_) { copied = fallbackCopy(email); }
    if (copied) {
      button.querySelector('use').setAttribute('href', '#icon-check');
      button.setAttribute('aria-label', 'Email address copied');
      showToast('Email address copied to clipboard');
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        button.querySelector('use').setAttribute('href', '#icon-copy');
        button.setAttribute('aria-label', 'Copy email address');
      }, 2500);
    } else showToast(email);
    button.focus({ preventScroll: true });
  });

  document.getElementById('copyright-year').textContent = new Date().getFullYear();
})();
