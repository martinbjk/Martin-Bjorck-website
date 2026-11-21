/* =========================================================
   flytande-scroll.js
   Ger din sida:
   1) Mjuk scroll (med biblioteket Lenis)
   2) Inflytning – bilder och text tonar fram när de syns
   Lägg bara till en rad i index.html (se instruktionen).
   ========================================================= */

(function () {
  // Respektera besökare som valt "minska rörelse" i sitt system
  var minskaRorelse = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- 1. CSS som behövs ----------
  var css = `
    html.lenis, html.lenis body { height: auto; }
    .lenis.lenis-smooth { scroll-behavior: auto !important; }

    .flyt-dold {
      opacity: 0;
      transform: translateY(40px);
    }
    .flyt-synlig {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.9s ease, transform 0.9s ease;
    }
  `;
  var stil = document.createElement("style");
  stil.textContent = css;
  document.head.appendChild(stil);

  // ---------- 2. Mjuk scroll ----------
  function startaMjukScroll() {
    if (minskaRorelse) return;
    var skript = document.createElement("script");
    skript.src = "https://unpkg.com/lenis@1.1.13/dist/lenis.min.js";
    skript.onload = function () {
      var lenis = new Lenis({
        duration: 1.2,      // högre = mjukare/långsammare
        smoothWheel: true
      });
      function steg(tid) {
        lenis.raf(tid);
        requestAnimationFrame(steg);
      }
      requestAnimationFrame(steg);

      // Gör så att menylänkar (#kontakt osv.) också glider mjukt
      document.querySelectorAll('a[href^="#"]').forEach(function (lank) {
        lank.addEventListener("click", function (e) {
          var mal = document.querySelector(lank.getAttribute("href"));
          if (mal) {
            e.preventDefault();
            lenis.scrollTo(mal);
          }
        });
      });
    };
    document.head.appendChild(skript);
  }

  // ---------- 3. Inflytning ----------
  function startaInflytning() {
    if (minskaRorelse || !("IntersectionObserver" in window)) return;

    // Vilka delar ska flyta in? Ändra listan om du vill.
    var delar = document.querySelectorAll("section, img, video, h2, h3, .flyt");

    var observator = new IntersectionObserver(function (poster) {
      poster.forEach(function (post) {
        if (post.isIntersecting) {
          post.target.classList.add("flyt-synlig");
          post.target.classList.remove("flyt-dold");
          observator.unobserve(post.target); // visa bara en gång
        }
      });
    }, { threshold: 0.15 });

    delar.forEach(function (del) {
      del.classList.add("flyt-dold");
      observator.observe(del);
    });
  }

  // Kör när sidan har laddat klart
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      startaMjukScroll();
      startaInflytning();
    });
  } else {
    startaMjukScroll();
    startaInflytning();
  }
})();
