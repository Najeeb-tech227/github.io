/* ══════════════════════════════════════════════
   GLOBAL NAMESPACE: window.NajeebProfile
   All functions accessible from APEX Dynamic Actions
   ══════════════════════════════════════════════ */
window.NajeebProfile = (function($) {

  /* ── 1. CANVAS PARTICLE NETWORK ─────────────────────── */
  function initCanvas() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, dots = [];
    var MOUSE = { x: -999, y: -999 };

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', function(e) {
      MOUSE.x = e.clientX; MOUSE.y = e.clientY;
    });

    var COUNT = Math.min(80, Math.floor(window.innerWidth / 18));
    for (var i = 0; i < COUNT; i++) {
      dots.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,87,34,0.4)';
        ctx.fill();

        for (var j = i + 1; j < dots.length; j++) {
          var d2 = dots[j];
          var dx = d.x - d2.x, dy = d.y - d2.y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = 'rgba(255,87,34,' + (1 - dist/120) * 0.12 + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        var mx = d.x - MOUSE.x, my = d.y - MOUSE.y;
        var md = Math.sqrt(mx*mx + my*my);
        if (md < 150) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(MOUSE.x, MOUSE.y);
          ctx.strokeStyle = 'rgba(255,87,34,' + (1 - md/150) * 0.25 + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── 2. TYPED TEXT ──────────────────────────────────── */
  function initTyped() {
    var phrases = [
      'Oracle APEX Developer',
      'PL/SQL Engineer',
      'ERP Systems Builder',
      'ORDS & REST Integrator',
      'UI/UX Customizer',
      'Jasper Reports Expert'
    ];
    var el = document.getElementById('typed-text');
    if (!el) return;
    var pi = 0, ci = 0, deleting = false;

    function type() {
      var phrase = phrases[pi];
      if (!deleting) {
        el.textContent = phrase.substring(0, ci + 1);
        ci++;
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 65);
      } else {
        el.textContent = phrase.substring(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35);
      }
    }
    setTimeout(type, 1400);
  }

  /* ── 3. HERO LAST NAME FILL ON SCROLL ───────────────── */
  function initHeroEffect() {
    var $last = $('#hero-last');
    var triggered = false;
    $(window).on('scroll', function() {
      if (!triggered && $(window).scrollTop() > 50) {
        triggered = true;
        setTimeout(function() { $last.addClass('filled'); }, 100);
      }
    });
    setTimeout(function() {
      if (!triggered) { triggered = true; $last.addClass('filled'); }
    }, 2500);
  }

  /* ── 4. COUNTER ANIMATION ───────────────────────────── */
  function animateCounter($el, target, duration) {
    duration = duration || 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      $el.text(Math.floor(eased * target) + '+');
      if (p < 1) requestAnimationFrame(step);
      else $el.text(target + '+');
    }
    requestAnimationFrame(step);
  }

  /* ── 5. SCROLL PROGRESS BAR ─────────────────────────── */
  function initProgressBar() {
    $(window).on('scroll', function() {
      var scrollTop = $(this).scrollTop();
      var docH = $(document).height() - $(window).height();
      var pct = (scrollTop / docH) * 100;
      $('#progress-bar').css('width', pct + '%');
    });
  }

  /* ── 6. NAV SCROLL STATE ─────────────────────────────── */
  function initNav() {
    $(window).on('scroll', function() {
      if ($(this).scrollTop() > 40) {
        $('#main-nav').addClass('scrolled');
      } else {
        $('#main-nav').removeClass('scrolled');
      }
    });
    // Smooth scroll for nav links
    $('a[href^="#"]').on('click', function(e) {
      e.preventDefault();
      var target = $($(this).attr('href'));
      if (target.length) {
        $('html,body').animate({ scrollTop: target.offset().top - 70 }, 600, 'swing');
      }
    });
  }

  /* ── 7. REVEAL ON SCROLL ─────────────────────────────── */
  function initReveal() {
    function check() {
      var wBottom = $(window).scrollTop() + $(window).height();

      // Generic reveals
      $('.reveal').each(function() {
        var $el = $(this);
        if ($el.offset().top < wBottom - 80 && !$el.hasClass('visible')) {
          var delay = $el.data('delay') || 0;
          setTimeout(function() { $el.addClass('visible'); }, delay);
        }
      });

      // Highlight cards
      $('.highlight-card').each(function() {
        var $el = $(this);
        if ($el.offset().top < wBottom - 60 && !$el.hasClass('visible')) {
          var delay = $el.data('delay') || 0;
          setTimeout(function() {
            $el.addClass('visible').css({ opacity: 1, transform: 'translateY(0)' });
            var $num = $el.find('.hc-num[data-target]');
            if ($num.length) animateCounter($num, parseInt($num.data('target')));
          }, delay);
        }
      });

      // Experience items
      $('.exp-item').each(function() {
        var $el = $(this);
        if ($el.offset().top < wBottom - 60) {
          $el.addClass('visible');
        }
      });

      // Skill items
      var skillsBottom = $('#skill-bars').offset().top + $('#skill-bars').height();
      if (skillsBottom > $(window).scrollTop() && $('#skill-bars').offset().top < wBottom - 60) {
        if (!$('#skill-bars').hasClass('triggered')) {
          $('#skill-bars').addClass('triggered');
          $('.skill-item').each(function(i) {
            var $item = $(this);
            setTimeout(function() {
              $item.addClass('visible');
              var $fill = $item.find('.skill-fill');
              $fill.css('width', $fill.data('pct') + '%');
              setTimeout(function() { $fill.addClass('done'); }, 1300);
            }, i * 120);
          });
        }
      }

      // Hero counters (sidebar)
      if ($('.hero-stat-item').first().offset().top < wBottom) {
        if (!window._heroCountersDone) {
          window._heroCountersDone = true;
          $('[data-target]', '.hero').each(function() {
            animateCounter($(this), parseInt($(this).data('target')));
          });
        }
      }

      // Expertise cells
      var $grid = $('#expertise-grid');
      if ($grid.length && $grid.offset().top < wBottom - 40 && !$grid.hasClass('triggered')) {
        $grid.addClass('triggered');
        $('.expertise-cell').each(function(i) {
          var $el = $(this);
          setTimeout(function() {
            $el.css({ opacity: 1, transition: 'opacity 0.4s, transform 0.4s', transform: 'translateY(0)' });
          }, i * 50);
        });
      }
    }

    $(window).on('scroll', check);
    setTimeout(check, 100); // initial check
  }

  /* ── 8. EXPERTISE CELL MAGNETIC HOVER ───────────────── */
  function initMagneticCards() {
    $('.highlight-card').on('mousemove', function(e) {
      var rect = this.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      $(this).css({ '--mx': x + '%', '--my': y + '%' });
    });
  }

  /* ── 9. EXPERTISE CELL HOVER COUNTER ───────────────── */
  function initExpertiseInteraction() {
    $('.expertise-cell').on('mouseenter', function() {
      $(this).css('transform', 'translateY(-4px)');
    }).on('mouseleave', function() {
      $(this).css('transform', '');
    });
  }

  /* ── 10. PUBLIC API ──────────────────────────────────── */
  function getProfileData() {
    return {
      name: 'Najeeb Alikhel',
      title: 'Oracle APEX Developer',
      location: 'Islamabad, Pakistan',
      phone: '+923015887156',
      email: 'najeeb.khan.1994.04.01@gmail.com',
      linkedin: 'https://www.linkedin.com/in/najeeb-khan1994/',
      youtube: 'https://youtube.com/@Najeeb_khan',
      experience_years: 4,
      current_company: 'Datawise Consulting Services',
      current_location: 'Doha, Qatar (Remote)',
      education: 'BSE – IQRA National University, Peshawar (2021)',
      skills: ['Oracle APEX','PL/SQL','SQL','JavaScript','jQuery',
               'HTML','CSS','ORDS','REST API','Jasper Reports',
               'Apache Tomcat','ERP Systems','Java OOP']
    };
  }

  function highlightSection(id) {
    var $el = $('#' + id);
    if (!$el.length) return;
    $('html,body').animate({ scrollTop: $el.offset().top - 70 }, 600);
    $el.css({ outline: '2px solid rgba(255,87,34,0.6)', outlineOffset: '4px' });
    setTimeout(function() { $el.css({ outline: '' }); }, 2000);
  }

  function scrollToContact() {
    $('html,body').animate({ scrollTop: $('#contact').offset().top - 70 }, 600);
  }

  /* ── INIT ALL ─────────────────────────────────────────── */
  function init() {
    initCanvas();
    initTyped();
    initHeroEffect();
    initProgressBar();
    initNav();
    initReveal();
    initMagneticCards();
    initExpertiseInteraction();
    // Animate hero stats immediately
    setTimeout(function() {
      $('[data-target]', '.hero').each(function() {
        animateCounter($(this), parseInt($(this).data('target')));
      });
    }, 1400);
  }

  if (document.readyState === 'loading') {
    $(document).ready(init);
  } else {
    init();
  }

  return {
    getProfileData: getProfileData,
    highlightSection: highlightSection,
    scrollToContact: scrollToContact,
    animateCounter: function(el, target) { animateCounter($(el), target); }
  };

})(jQuery);
