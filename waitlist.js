// Pre-registration form. Sign-ups are saved in BUDs' Supabase project by the
// join_waitlist() database function, and the page shows the counts from
// waitlist_counts(). Both are called with the publishable key, which is meant
// to be public: the database lets it do nothing else (no reading, changing or
// deleting anyone's sign-up). Never put a secret key here.
const SUPABASE_URL = "https://bimbyaniablowenahoep.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_R9U9rGiMs5CaCySI198H2Q_Z6DQP0Nd";

// The same list as the app (budsapp consts/countries.ts)
const COUNTRIES = [
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "DR Congo",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern and Antarctic Lands",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "North Korea",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn Islands",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of the Congo",
  "Réunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Barthélemy",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "São Tomé and Príncipe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "United States Virgin Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

// Counts under this are hidden (the database leaves them out too)
const MIN_COUNT = 10;

const form = document.getElementById("waitlist-form");
const pageOpenedAt = Date.now();

async function rpc(name, body) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// Countries, and exam months from this month for the next three years
function fillOptions() {
  const country = form.elements.country;
  for (const name of COUNTRIES) country.add(new Option(name, name));

  const month = form.elements.exam_month;
  const now = new Date();
  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    month.add(new Option(label, value));
  }
}

// Shows real numbers only, and only from MIN_COUNT up
let counts = null;
const formatCount = (n) => n.toLocaleString("en-GB");

function showTotal() {
  const el = document.getElementById("total-count");
  if (counts?.total >= MIN_COUNT) {
    el.textContent = `${formatCount(counts.total)} people have already joined the waitlist.`;
    el.hidden = false;
  }
}

function showExamCount() {
  const el = document.getElementById("exam-count");
  const exam = form.elements.exam.value;
  const n = counts?.exams?.[exam];
  if (exam && n >= MIN_COUNT) {
    el.textContent = `${formatCount(n)} people preparing for ${exam} have joined.`;
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}

async function loadCounts() {
  try {
    counts = await rpc("waitlist_counts", {});
    showTotal();
    showExamCount();
  } catch {
    // The counts are a nice extra; the form works without them
  }
}

const MESSAGES = {
  name: "Enter your name.",
  email: "Enter a valid email address, like name@example.com.",
  phone_type: "Choose the phone you use.",
  exam: "Choose the exam you're preparing for.",
  country: "Choose your country.",
  consent: "Tick this box so we can email you about the launch.",
};

function showFieldError(field, message) {
  const control = form.elements[field];
  const error = document.getElementById(`${field}-error`);
  const target = control instanceof RadioNodeList ? control[0] : control;
  const group = target.closest(".field");
  group.classList.toggle("has-error", !!message);
  error.textContent = message || "";
  for (const el of control instanceof RadioNodeList ? control : [control]) {
    el.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

// The database's rule for emails (supabase/schema.sql in budsapp)
const EMAIL_PATTERN = /^[a-z0-9._%+'-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

// The form is checked in the browser first; the database checks everything again
function collectErrors() {
  const data = new FormData(form);
  const errors = {};
  const name = (data.get("name") || "").trim();
  const email = (data.get("email") || "").trim();
  if (!name || name.length > 100) errors.name = name ? "Use 100 characters or fewer." : MESSAGES.name;
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.email = MESSAGES.email;
  if (!data.get("phone_type")) errors.phone_type = MESSAGES.phone_type;
  if (!data.get("exam")) errors.exam = MESSAGES.exam;
  if (!data.get("country")) errors.country = MESSAGES.country;
  if (!data.get("consent")) errors.consent = MESSAGES.consent;
  return errors;
}

function validate() {
  const errors = collectErrors();
  for (const field of Object.keys(MESSAGES)) showFieldError(field, errors[field]);
  const first = Object.keys(MESSAGES).find((f) => errors[f]);
  if (first) {
    const control = form.elements[first];
    (control instanceof RadioNodeList ? control[0] : control).focus();
  }
  return !first;
}

function setStatus(message) {
  const status = document.getElementById("form-status");
  status.textContent = message || "";
  status.hidden = !message;
}

function showThanks(alreadyJoined, email, betaTester) {
  const thanks = document.getElementById("thanks");
  document.getElementById("thanks-title").textContent = alreadyJoined
    ? "You're already on the list"
    : "You're on the list!";
  document.getElementById("thanks-text").textContent = alreadyJoined
    ? `${email} has already joined the BUDs waitlist, so there's nothing more to do. We'll email you when BUDs launches.`
    : betaTester
      ? `Thanks for joining. We'll email ${email} when beta testing opens, and again when BUDs launches.`
      : `Thanks for joining. We'll email ${email} when BUDs launches.`;
  form.hidden = true;
  thanks.hidden = false;
  thanks.focus();
}

async function onSubmit(event) {
  event.preventDefault();
  setStatus("");
  if (!validate()) return;

  const data = new FormData(form);
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Joining...";

  const email = data.get("email").trim();
  const betaTester = data.get("beta_tester") === "on";
  try {
    const result = await rpc("join_waitlist", {
      p_name: data.get("name").trim(),
      p_email: email,
      p_phone_type: data.get("phone_type"),
      p_exam: data.get("exam"),
      p_exam_month: data.get("exam_month") || "",
      p_country: data.get("country"),
      p_beta_tester: betaTester,
      p_consent: data.get("consent") === "on",
      // Spam protection: a hidden field people never fill in, and how long
      // the form was open (bots submit at once)
      p_website: data.get("website") || "",
      p_elapsed_ms: Date.now() - pageOpenedAt,
    });

    if (result === "joined" || result === "already") {
      showThanks(result === "already", email, betaTester);
      if (result === "joined") loadCounts();
    } else if (result === "too_many") {
      setStatus("Lots of people are signing up from your network right now. Please try again in an hour.");
    } else {
      setStatus("Something in the form isn't right. Check your details and try again.");
    }
  } catch {
    setStatus("We couldn't reach BUDs. Check your internet connection and try again.");
  } finally {
    button.disabled = false;
    button.textContent = "Join the waitlist";
  }
}

fillOptions();
loadCounts();
form.elements.exam.addEventListener("change", showExamCount);
form.addEventListener("submit", onSubmit);
// Clear a field's error as soon as it's fixed
form.addEventListener("change", (event) => {
  const field = event.target.name;
  if (field in MESSAGES && event.target.closest(".has-error")) {
    showFieldError(field, collectErrors()[field]);
  }
});
form.hidden = false;
document.getElementById("no-js").hidden = true;
