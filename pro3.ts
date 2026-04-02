interface Job {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
  role: string;
}

const jobs: Job[] = [
  { id: 1, title: "Frontend Developer", company: "Google", salary: "10 LPA", location: "Chennai", role: "Frontend" },
  { id: 2, title: "Backend Developer", company: "Amazon", salary: "12 LPA", location: "Bangalore", role: "Backend" },
  { id: 3, title: "Fullstack Engineer", company: "Microsoft", salary: "15 LPA", location: "Hyderabad", role: "Fullstack" },
  { id: 4, title: "Frontend Developer", company: "Amazon", salary: "9 LPA", location: "Pune", role: "Frontend" }
];

/* Local Storage */
let savedJobs: Job[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");

/* Elements */
const jobList = document.getElementById("jobList")!;
const savedJobsContainer = document.getElementById("savedJobs")!;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const companyFilter = document.getElementById("companyFilter") as HTMLSelectElement;
const roleFilter = document.getElementById("roleFilter") as HTMLSelectElement;
const noJobs = document.getElementById("noJobs")!;
const jobCount = document.getElementById("jobCount")!;

/* Populate Company */
[...new Set(jobs.map(j => j.company))].forEach(c => {
  const opt = document.createElement("option");
  opt.value = c;
  opt.textContent = c;
  companyFilter.appendChild(opt);
});

/* Save to LocalStorage */
function updateStorage() {
  localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
}

/* Render Jobs */
function renderJobs(data: Job[], container: HTMLElement, isSaved = false) {
  container.innerHTML = "";

  if (data.length === 0 && !isSaved) {
    noJobs.classList.remove("hidden");
  } else {
    noJobs.classList.add("hidden");
  }

  jobCount.textContent = `${data.length} Jobs Available`;

  data.forEach(job => {
    const isBookmarked = savedJobs.some(j => j.id === job.id);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="logo"></div>
      <h3>${job.title}</h3>
      <p><strong>${job.company}</strong></p>
      <p class="badge">${job.role}</p>
      <p>${job.salary}</p>
      <p>${job.location}</p>

      <div class="actions">
        <button class="save-btn" onclick="toggleSave(${job.id})">
          ${isBookmarked ? "Unsave" : "Save"}
        </button>
        ${isSaved ? `<button class="remove-btn" onclick="removeSaved(${job.id})">Remove</button>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}

/* Toggle Save */
(window as any).toggleSave = (id: number) => {
  const job = jobs.find(j => j.id === id);

  if (!job) return;

  const exists = savedJobs.find(j => j.id === id);

  if (exists) {
    savedJobs = savedJobs.filter(j => j.id !== id);
  } else {
    savedJobs.push(job);
  }

  updateStorage();
  filterJobs();
  renderJobs(savedJobs, savedJobsContainer, true);
};

/* Remove */
(window as any).removeSaved = (id: number) => {
  savedJobs = savedJobs.filter(j => j.id !== id);
  updateStorage();
  renderJobs(savedJobs, savedJobsContainer, true);
};

/* Filter */
function filterJobs() {
  const search = searchInput.value.toLowerCase();
  const company = companyFilter.value;
  const role = roleFilter.value;

  const filtered = jobs.filter(j =>
    (j.title.toLowerCase().includes(search) ||
     j.company.toLowerCase().includes(search) ||
     j.location.toLowerCase().includes(search)) &&
    (company === "" || j.company === company) &&
    (role === "" || j.role === role)
  );

  renderJobs(filtered, jobList);
}

/* Events */
searchInput.addEventListener("input", filterJobs);
companyFilter.addEventListener("change", filterJobs);
roleFilter.addEventListener("change", filterJobs);

/* Init */
renderJobs(jobs, jobList);
renderJobs(savedJobs, savedJobsContainer, true);