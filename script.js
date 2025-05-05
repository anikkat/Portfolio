const emailCopy = document.querySelector(".email-copy");
if (emailCopy) {
  emailCopy.addEventListener("click", (e) => {
    e.stopPropagation();
    const emailText = "katanik.des@gmail.com";
    navigator.clipboard
      .writeText(emailText)
      .then(() => {
        emailCopy.classList.add("copied");
      })
      .catch((err) => {
        console.error("Error copying email: ", err);
      });
  });

  emailCopy.addEventListener("mouseleave", () => {
    emailCopy.classList.remove("copied");
  });
}

const scrambleSpeed = 130;

function scrambleEachWord(text) {
  return text.replace(/[A-Za-z]+/g, function (word) {
    let letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join("");
  });
}

document.querySelectorAll(".email-copy, .instagram-link").forEach((el) => {
  el.dataset.originalText = el.textContent;
  let scrambleInterval;
  let tappedOnce = false;
  let tapResetTimer;
  let scrambleTimeout;

  el.addEventListener("mouseenter", () => {
    scrambleInterval = setInterval(() => {
      el.textContent = scrambleEachWord(el.dataset.originalText);
    }, scrambleSpeed);
  });

  el.addEventListener("mouseleave", () => {
    clearInterval(scrambleInterval);
    el.textContent = el.dataset.originalText;
  });

  // Mobile only
  if ("ontouchstart" in window) {
    el.addEventListener("touchend", (e) => {
      e.preventDefault();

      if (!tappedOnce) {
        tappedOnce = true;

        scrambleInterval = setInterval(() => {
          el.textContent = scrambleEachWord(el.dataset.originalText);
        }, scrambleSpeed);

        scrambleTimeout = setTimeout(() => {
          clearInterval(scrambleInterval);
          el.textContent = el.dataset.originalText;
        }, 1500);

        clearTimeout(tapResetTimer);
        tapResetTimer = setTimeout(() => {
          tappedOnce = false;
        }, 2000);
      } else {
        clearInterval(scrambleInterval);
        clearTimeout(scrambleTimeout);
        el.textContent = el.dataset.originalText;

        if (el.classList.contains("email-copy")) {
          navigator.clipboard.writeText("katanik.des@gmail.com").then(() => {
            alert("Copied to clipboard");
          });
        } else if (el.classList.contains("instagram-link")) {
          const url = el.getAttribute("data-url") || el.getAttribute("href");
          if (url) window.location.replace(url);
        }

        tappedOnce = false;
        clearTimeout(tapResetTimer);
      }
    });
  }
});

const toggleButtons = document.querySelectorAll(".toggle-button");

toggleButtons.forEach((button) => {
  const buttonText = button.querySelector(
    ".sp-button-text, .about-button-text, .project-gaa-button-text, .project-designx-button-text, .project-bs-button-text, .project-clown-button-text, .project-lenore-button-text"
  );
  const targetSelector = button.getAttribute("data-target");
  const toggleContent = document.querySelector(targetSelector);

  if (toggleContent && buttonText) {
    button.addEventListener("click", function () {
      const isHidden =
        window.getComputedStyle(toggleContent).display === "none";
      toggleContent.style.display = isHidden ? "block" : "none";

      if (isHidden) {
        buttonText.textContent = "less";
        buttonText.classList.remove("ellipsis");
        button.classList.add("toggled-active");
      } else {
        buttonText.textContent = "...";
        buttonText.classList.add("ellipsis");
        button.classList.remove("toggled-active");
      }

      if (targetSelector === ".sp-toggle-content") {
        const projectText = document.querySelector("#gd-tags");
        if (projectText) {
          projectText.style.display = isHidden ? "none" : "block";
        }
      }
    });
  }
});

(function () {
  const col1 = document.querySelector(".col-01");
  const col2 = document.querySelector(".col-02");
  const col3 = document.querySelector(".col-03");

  const originalCol1Nodes = Array.from(col1.childNodes);
  const originalCol2Nodes = Array.from(col2.childNodes);
  const originalCol3Nodes = Array.from(col3.childNodes);

  let currentLayout = "wide";

  function clearColumns() {
    col1.innerHTML = "";
    col2.innerHTML = "";
    col3.innerHTML = "";
  }

  function restoreWide() {
    col1.style.display = "block";
    col2.style.display = "block";
    col3.style.display = "block";

    clearColumns();
    originalCol1Nodes.forEach((node) => col1.appendChild(node));
    originalCol2Nodes.forEach((node) => col2.appendChild(node));
    originalCol3Nodes.forEach((node) => col3.appendChild(node));
  }

  function toMedium() {
    col1.style.display = "block";
    col2.style.display = "block";
    col3.style.display = "none";

    clearColumns();
    originalCol1Nodes.forEach((node) => col1.appendChild(node));
    originalCol2Nodes.forEach((node) => col2.appendChild(node));
    col2.appendChild(document.createElement("br"));
    originalCol3Nodes.forEach((node) => col2.appendChild(node));
  }

  function toMobile() {
    col1.style.display = "block";
    col2.style.display = "none";
    col3.style.display = "none";

    clearColumns();
    originalCol1Nodes.forEach((node) => col1.appendChild(node));
    col1.appendChild(document.createElement("br"));
    originalCol2Nodes.forEach((node) => col1.appendChild(node));
    col1.appendChild(document.createElement("br"));
    originalCol3Nodes.forEach((node) => col1.appendChild(node));
  }

  function updateLayout() {
    const width = window.innerWidth;
    if (width > 1400) {
      if (currentLayout !== "wide") {
        restoreWide();
        currentLayout = "wide";
      }
    } else if (width <= 1400 && width > 850) {
      if (currentLayout !== "medium") {
        toMedium();
        currentLayout = "medium";
      }
    } else if (width <= 850) {
      if (currentLayout !== "mobile") {
        toMobile();
        currentLayout = "mobile";
      }
    }
  }

  window.addEventListener("resize", updateLayout);
  updateLayout();
})();

document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = carousel.querySelectorAll("img, video, #canvas-container");
  const leftArrow = carousel.querySelector(".carousel-arrow.left");
  const rightArrow = carousel.querySelector(".carousel-arrow.right");
  let currentIndex = 0;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  function updateCarousel() {
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function snapTo(index) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    updateCarousel();
    const slide = slides[currentIndex];
    const videoEl =
      slide.tagName === "VIDEO" ? slide : slide.querySelector("video");
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play();
    }
  }

  function resetCarouselVideos() {
    carousel.querySelectorAll("video").forEach((video) => {
      video.muted = true;
      video.pause();
      video.currentTime = 0;
      const btn = video.parentElement.querySelector(".audio-toggle-btn");
      if (btn) {
        btn.classList.add("muted");
        btn.classList.remove("unmuted");
      }
    });
  }

  function nextSlide() {
    resetCarouselVideos();
    if (currentIndex < slides.length - 1) {
      snapTo(currentIndex + 1);
    } else {
      snapTo(0);
    }
  }

  function prevSlide() {
    resetCarouselVideos();
    snapTo(currentIndex - 1);
  }

  function resetCarousel() {
    currentIndex = 0;
    updateCarousel();
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", nextSlide);
  }
  if (leftArrow) {
    leftArrow.addEventListener("click", prevSlide);
  }

  slides.forEach((slide) => {
    slide.addEventListener("click", nextSlide);
    slide.addEventListener("dragstart", (e) => e.preventDefault());
  });

  if (!isMobile) {
    let isDragging = false;
    let dragStartX = 0;
    let dragDelta = 0;

    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragDelta = 0;
      track.style.transition = "none";
      e.preventDefault();
    });

    track.addEventListener("mousemove", (e) => {
      if (!isDragging) {
        return;
      }
      dragDelta = e.clientX - dragStartX;
      const offset = -currentIndex * carousel.offsetWidth + dragDelta;
      track.style.transform = `translateX(${offset}px)`;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) {
        return;
      }
      isDragging = false;

      const threshold = carousel.offsetWidth / 4;
      if (dragDelta > threshold) {
        prevSlide();
      } else if (dragDelta < -threshold) {
        nextSlide();
      } else {
        updateCarousel();
      }
      dragDelta = 0;
    });
  }

  if (isMobile) {
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });
    track.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (diff > 30) {
        nextSlide();
      } else if (diff < -30) {
        prevSlide();
      }
    });
  }

  const toggleButton = carousel.querySelector(
    ".sp-toggle-button, .about-toggle-button, .project-gaa-toggle-button"
  );
  const toggleContent = carousel.querySelector(
    ".sp-toggle-content, .about-toggle-content, .project-gaa-toggle-content"
  );

  if (toggleButton && toggleContent) {
    toggleButton.addEventListener("click", () => {
      const isVisible =
        window.getComputedStyle(toggleContent).display === "block";
      if (!isVisible) {
        resetCarousel();
      }
    });
  }
});

function toggleFootnote(id, toggleEl) {
  const fn = document.getElementById(id);
  const isOpen = getComputedStyle(fn).display !== "none";
  fn.style.display = isOpen ? "none" : "inline";
  toggleEl.classList.toggle("open", !isOpen);
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".sp-toggle-content");
  const btnText = document.querySelector(".sp-toggle-button .sp-button-text");
  const tags = document.getElementById("gd-tags");

  content.style.display = "block";
  btnText.textContent = "less";
  btnText.classList.remove("ellipsis");
  if (tags) {
    tags.style.display = "none";
  }
});

document.querySelectorAll(".audio-toggle-btn").forEach((btn) => {
  const video = btn.previousElementSibling;
  btn.addEventListener("click", () => {
    const isMuted = (video.muted = !video.muted);
    btn.classList.toggle("muted", isMuted);
    btn.classList.toggle("unmuted", !isMuted);
  });
});
