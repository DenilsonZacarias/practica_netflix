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
  logo: "/pages/logo.html",
  username: "/pages/username.html",
  home: "/index.html",
  movies: "/pages/movies.html",
  mylist: "/pages/mylist.html",
  downloads: "/pages/downloads.html",
  tvshows: "/pages/tvshows.html",
  search: "/pages/search.html",
  comingsoon: "/pages/comingsoon.html",
  more: "/pages/more.html",
  video: "/pages/video.html", // adicionei a rota para a página de vídeo
};

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
          script.src = "/assets/js/videoJS.js";
          script.id = "video-script";
          document.body.appendChild(script);
        }

        // Adicionar listener ao botão de voltar DIRETAMENTE aqui
        setTimeout(() => {
          const backButton = document.getElementById("back-button");
          console.log("Procurando botão...", backButton); // debug

          if (backButton) {
            console.log("Botão encontrado! Adicionando listener..."); // debug

            // Remover listeners antigos (se existirem)
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
        }, 200);
      }
    })
    .catch((err) => console.error(err));
}

// ======================
// Fluxo inicial
// ======================
navigateTo("logo");
setTimeout(() => navigateTo("username"), 4000);
