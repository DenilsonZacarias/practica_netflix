// Detecta o nome do repositório automaticamente
const repoName = window.location.pathname.split("/")[1]; // "practica_netflix"
const basePath = repoName ? `/${repoName}` : "";

// Função auxiliar para gerar caminhos corretos
function asset(path) {
  return `${basePath}/assets/${path}`;
}
function page(path) {
  return `${basePath}/pages/${path}`;
}

const app = document.getElementById("app");
let previousPage = null;
let currentPage = null;

window.addEventListener("navigate", (e) => {
  const page = e.detail.page;
  if (routes[page]) {
    navigateTo(page);
  } else {
    console.error(`Rota para página "${page}" não encontrada.`);
  }
});

const routes = {
  logo: "logo.html",
  username: "username.html",
  home: "index.html",
  movies: "movies.html",
  mylist: "mylist.html",
  downloads: "downloads.html",
  tvshows: "tvshows.html",
  search: "search.html",
  comingsoon: "comingsoon.html",
  more: "more.html",
  video: "video.html",
};

//Destaque dinamico em pagina no navbar
function highlightNavbar(page) {
  document.querySelectorAll("#navbar button[data-page]").forEach((btn) => {
    const btnPage = btn.getAttribute("data-page");
    if (btnPage === page) {
      btn.classList.add(
        "scale-110",
        "shadow-lg",
        "transition-transform",
        "duration-200"
      );
    } else {
      btn.classList.remove("scale-110", "shadow-lg");
    }
  });
}

// Função que carrega páginas
function navigateTo(page) {
  console.log("🔴 NAVEGANDO PARA:", page);

  // Controlar visibilidade da navbar
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (page === "logo" || page === "username") {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
  }
  previousPage = currentPage; // guarda a página atual como anterior
  currentPage = page; // atualiza a página atual

  fetch(routes[page])
    .then((response) => {
      if (!response.ok) throw new Error(`Erro ao carregar ${page}`);
      return response.text();
    })
    .then((html) => {
      app.innerHTML = html;
      window.scrollTo(0, 0);

      // Navbar — adiciona event listeners
      document.querySelectorAll("#navbar button[data-page]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetPage = btn.getAttribute("data-page");
          if (routes[targetPage]) navigateTo(targetPage);
        });
      });

      // Username page buttons
      if (page === "username") {
        setTimeout(() => {
          document.querySelectorAll(".grid button").forEach((btn) => {
            btn.addEventListener("click", () => navigateTo("home"));
          });
        }, 200);
      }

      // Video page
      if (page === "video") {
        // Salvar página anterior
        const pageToReturn = previousPage || "home";

        // Carregar script externo se não existir
        if (!document.getElementById("video-script")) {
          const script = document.createElement("script");
          console.log("basePath =", basePath);
          script.src = `${basePath}/assets/js/videoJS.js`;
          script.id = "video-script";
          document.body.appendChild(script);
        }

        // Adicionar listener ao botão de voltar DIRETAMENTE aqui
        setTimeout(() => {
          const backButton = document.getElementById("back-button");
          console.log("Procurando botão...", backButton); // debug

          if (backButton) {
            console.log("Botão encontrado! Adicionando listener..."); // debug

            // Remover listeners antigos
            const newBackButton = backButton.cloneNode(true);
            backButton.parentNode.replaceChild(newBackButton, backButton);

            // Adicionar novo listener
            newBackButton.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();
              console.log("Voltando para:", pageToReturn); // debug
              navigateTo(pageToReturn);
            });
          } else {
            console.error("Botão não encontrado!");
          }
        }, 300);
      }

      // Home page
      if (page === "home") {
        setTimeout(() => {
          // Botão play do vídeo
          document
            .querySelectorAll("button[data-page='video']")
            .forEach((btn) => {
              btn.addEventListener("click", () => navigateTo("video"));
            });
          attachInfoButtons(); // Mover attachInfoButtons para cá
        }, 200);
      } else {
        attachInfoButtons(); // Chamar aqui para outras páginas também
      }
    })
    .catch((err) => console.error(err));
}

// ======================
// Fluxo inicial
// ======================
navigateTo("logo");
setTimeout(() => navigateTo("username"), 4000);

/* === CONFIG API === */
const apiBase = "https://api.themoviedb.org/3";

/* utility para abrir/fechar modal e preencher */
function openModal() {
  const modal = document.getElementById("movie-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.style.display = "flex";
}
function closeModal() {
  const modal = document.getElementById("movie-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.style.display = "none";
}

/* Limpa modal e mostra loading placeholder */
function setModalLoading() {
  const errEl = document.getElementById("modal-error");
  if (errEl) errEl.classList.add("hidden");

  const titleEl = document.getElementById("modal-title");
  if (titleEl) titleEl.textContent = "Loading...";

  const yearEl = document.getElementById("modal-year");
  if (yearEl) yearEl.textContent = "";

  const plotEl = document.getElementById("modal-plot");
  if (plotEl) plotEl.textContent = "";

  const posterEl = document.getElementById("modal-poster");
  if (posterEl) posterEl.src = "";

  const actorsEl = document.getElementById("modal-actors");
  if (actorsEl) actorsEl.textContent = "";
}

/* Preenche modal com dados */
function fillModal(data) {
  const titleEl = document.getElementById("modal-title");
  const yearEl = document.getElementById("modal-year");
  const plotEl = document.getElementById("modal-plot");
  const actorsEl = document.getElementById("modal-actors");
  const posterEl = document.getElementById("modal-poster");

  if (titleEl) titleEl.textContent = data.title || "Sem título";
  if (yearEl) yearEl.textContent = data.year ? `Ano: ${data.year}` : "";
  if (plotEl) plotEl.textContent = data.plot || "";
  if (actorsEl) actorsEl.textContent = data.actors || "";
  if (posterEl)
    posterEl.src = data.poster || `${basePath}/assets/placeholder_poster.png`;
}

/* Função principal que busca a API pelo título (ou id se preferir) */
// procura por título e abre modal com o primeiro resultado
async function fetchMovieInfoByTitle(title) {
  try {
    setModalLoading();
    openModal();

    // chama a serverless function
    const res = await fetch(`/api/movie?q=${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const json = await res.json();
    const movie = json.results && json.results.length ? json.results[0] : null;
    if (!movie) throw new Error("Filme não encontrado");

    // pede detalhes (com elenco)
    const detailsRes = await fetch(`/api/movieDetails?id=${movie.id}`);
    const details = await detailsRes.json();

    fillModal({
      title: details.title || movie.title,
      year: details.release_date ? details.release_date.split("-")[0] : "",
      plot: details.overview || "",
      poster: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : "",
      actors:
        details.credits?.cast
          ?.slice(0, 5)
          .map((a) => a.name)
          .join(", ") || "Elenco indisponível",
    });
  } catch (err) {
    console.error(err);
    document.getElementById("modal-error").textContent = err.message;
    document.getElementById("modal-error").classList.remove("hidden");
  }
}

/* Liga os botões ".info-btn" dentro do app — chamar depois de app.innerHTML ser atualizado */
function attachInfoButtons() {
  // remove listeners duplicados clonando
  document.querySelectorAll(".info-btn").forEach((btn) => {
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
  });
  // requery e attach
  document.querySelectorAll(".info-btn").forEach((btn) => {
    const title = btn.getAttribute("data-title") || btn.dataset.title;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!title) {
        console.warn("info-btn sem data-title");
        return;
      }
      fetchMovieInfoByTitle(title);
    });
  });
}

/* Fechar modal ao clicar no backdrop ou no close */
document.addEventListener("click", (ev) => {
  const modal = document.getElementById("movie-modal");
  if (!modal || modal.classList.contains("hidden")) return;
  const target = ev.target;
  if (target.id === "modal-backdrop" || target.id === "modal-close") {
    closeModal();
  }
});
