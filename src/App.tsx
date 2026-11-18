import { useEffect, useRef, useState } from "react";

type Project = {
  code: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  details: string[];
  stack: string;
};

const projects: Project[] = [
  {
    code: "BS-01",
    title: "BindScope",
    type: "Computational drug discovery",
    date: "Nov 2026 - Present",
    summary: "A virtual screening pipeline predicting compound activity against EGFR, a kinase target implicated in several cancers.",
    details: [
      "Cleaning ChEMBL bioactivity records, standardising IC50 to pIC50, and removing duplicates and invalid structures.",
      "Featurising molecules with RDKit Morgan fingerprints and physicochemical descriptors, with Lipinski filtering.",
      "Using scaffold splits to test generalisation to unseen chemistry and SHAP attribution to inspect predictive substructures.",
    ],
    stack: "Python · RDKit · scikit-learn · XGBoost · SHAP · pandas · pytest",
  },
  {
    code: "SV-02",
    title: "SliceView",
    type: "Medical imaging",
    date: "Nov 2026 - Present",
    summary: "A Python tool for viewing DICOM CT series, reconstructing 3D volumes, and segmenting bone.",
    details: [
      "Converts pixel data to Hounsfield units with axial, coronal, and sagittal views plus radiology window presets.",
      "Measures segmented bone volume from voxel spacing and renders surfaces with marching cubes.",
      "Validates segmentation with the Dice coefficient against expert-labelled public datasets.",
    ],
    stack: "Python · pydicom · SimpleITK · scikit-image · PyVista · NumPy · pytest",
  },
  {
    code: "AI-03",
    title: "AI Investigation Assistant - SAS",
    type: "University of Glasgow team project",
    date: "Oct 2026 - Present",
    summary: "A proof-of-concept MCP investigation assistant built by a seven-person Agile team for evidence-grounded analysis.",
    details: [
      "Developing the TypeScript and Express agent layer, MCP client, and LLM tool-calling loop.",
      "Building a model-agnostic backend with live status updates and safeguards against unsupported answers.",
      "Acting as the client contact and translating requirements into user stories, issues, and MoSCoW priorities.",
    ],
    stack: "TypeScript · Node.js · Express · PostgreSQL · MCP SDK · OpenAI API",
  },
  {
    code: "WR-04",
    title: "When In Rome",
    type: "Django group project",
    date: "30 Mar 2026",
    summary: "A deployed web app for discovering and sharing local food and activity recommendations.",
    details: [
      "Designed the relational data model for users, recommendations, reviews, upvotes, and follows.",
      "Built trending, public profile, and social follow features with unit and integration tests.",
    ],
    stack: "Django · Python · Relational databases · Django TestCase",
  },
  {
    code: "PF-05",
    title: "Personal Portfolio",
    type: "Independent build",
    date: "02 Sep 2026",
    summary: "A responsive, interactive portfolio designed and built with a distinctive visual system.",
    details: ["Created with hand-written CSS custom properties and tested with Vitest and React Testing Library."],
    stack: "React · TypeScript · Tailwind CSS · Vitest · React Testing Library",
  },
];

const experience = [
  {
    org: "National University of Singapore & Hewlett Packard Enterprise",
    role: "Intern",
    date: "Jun - Sep 2021",
    text: "Summer programme in applied machine learning, from the linear algebra behind models to deploying a live prediction service.",
    details: [
      "Explored the role of linear algebra in ML, working with vectors, matrices and tensors.",
      "Trained and evaluated Decision Trees, Random Forests, SVMs and MLPs, using precision and recall to assess performance.",
      "Applied ML to breast cancer classification, predicting whether tumours are malignant or benign with SVM and MLP models.",
      "Developed a real-time flood prediction model in Azure ML Studio, training and deploying it on a 50-year weather dataset.",
      "Built a solution that predicts live flood status and estimates preventative costs to support disaster risk mitigation.",
    ],
    stack: "Python · Azure ML Studio",
  },
  {
    org: "Pastéis Lisboa",
    role: "Bakery Assistant / Kitchen Porter",
    date: "Nov 2025 - Present",
    text: "Support bakery production and front-of-house handling while helping the team meet daily targets in a safe, efficient, organised environment.",
  },
  {
    org: "JP Morgan Chase",
    role: "Spring into Software Engineering",
    date: "13 - 16 Apr 2026",
    text: "Gained exposure to enterprise software and cloud workflows. At Code for Good, developed a tiered early-warning system for elderly residents with the National Fire Chiefs Council.",
  },
  {
    org: "Inspirit AI",
    role: "Course participant",
    date: "Jul - Aug 2021",
    text: "Developed a BERT-based model for intent detection and entity extraction using BIO tagging, tokenisation, and attention masking.",
  },
  {
    org: "Deutsche Bank",
    role: "Women in Technology, Data & Innovation Insight",
    date: "10 Jun 2026",
    text: "Explored how diverse, cross-functional teams collaborate in a professional software engineering environment.",
  },
];

const skillGroups = [
  ["Languages", "Python, C++, C, Java, TypeScript, SQL, HTML, CSS, Assembly Language (Sigma 16)"],
  ["Scientific computing", "RDKit, scikit-learn, XGBoost, SHAP, pandas, NumPy, matplotlib, SimpleITK, pydicom, scikit-image"],
  ["Data sources", "ChEMBL, Protein Data Bank, public bioactivity and medical imaging datasets"],
  ["Frameworks & tools", "FastAPI, Django, Node.js, Express, React 19, Angular, Spring Boot, Godot, Git"],
  ["AI & data", "Neural networks, BERT, Azure ML Studio, data analysis, regression, SVM, clustering and classification"],
  ["Testing", "pytest, Django test framework, Vitest"],
];

function MoleculeGraphic() {
  return (
    <svg className="molecule" viewBox="0 0 620 620" role="img" aria-label="Abstract molecular structure">
      <defs>
        <linearGradient id="bond" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#83b5a1" />
          <stop offset="1" stopColor="#d5ff6f" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g className="orbit"><circle cx="310" cy="310" r="240" /><circle cx="310" cy="310" r="176" /></g>
      <g className="bonds" stroke="url(#bond)" strokeWidth="3">
        <path d="M140 220 238 152 348 201 455 150 520 245 475 352 530 447" />
        <path d="M238 152 250 278 360 336 475 352" />
        <path d="M140 220 105 350 204 438 360 336 420 478 530 447" />
        <path d="M250 278 204 438" />
      </g>
      {[
        [140, 220, "N"], [238, 152, "C"], [348, 201, "O"], [455, 150, "N"],
        [520, 245, "C"], [475, 352, "C"], [530, 447, "O"], [420, 478, "N"],
        [360, 336, "C"], [250, 278, "C"], [105, 350, "S"], [204, 438, "C"],
      ].map(([x, y, label], i) => (
        <g className="atom" style={{ animationDelay: `${i * 90}ms` }} key={i} transform={`translate(${x} ${y})`}>
          <circle r={label === "C" ? 15 : 20} />
          <text textAnchor="middle" dominantBaseline="central">{label}</text>
        </g>
      ))}
      <g className="target" transform="translate(360 336)"><circle r="46" /><circle r="33" /><path d="M-58 0h116M0-58v116" /></g>
    </svg>
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span>{children}</div>;
}

function App() {
  const [activeProject, setActiveProject] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!nodes) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={rootRef}>
      <nav className="nav">
        <a className="brand" href="#top" onClick={closeMenu}><span className="brand-mark">NP</span><span>NISHITA PHUTANE</span></a>
        <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#research" onClick={closeMenu}>Research</a><a href="#experience" onClick={closeMenu}>Experience</a><a href="#skills" onClick={closeMenu}>Skills</a><a href="#contact" onClick={closeMenu}>Contact</a>
          <a className="nav-cta" href="./Nishita-Phutane-CV.docx" download>Download CV</a>
        </div>
      </nav>

      <main>
        <header className="hero" id="top">
          <div className="hero-copy">
            <p className="kicker" data-reveal>COMPUTING SCIENCE × DRUG DISCOVERY</p>
            <h1 data-reveal>Decoding molecules.<br /><em>Designing better questions.</em></h1>
            <p className="hero-intro" data-reveal>I’m Nishita Phutane, a third-year Computing Science student at the University of Glasgow, exploring how machine learning and cheminformatics can help us understand biological data and accelerate early-stage drug discovery.</p>
            <div className="hero-actions" data-reveal><a className="button primary" href="#research">Explore my research</a><a className="button secondary" href="mailto:nishitaphutane@gmail.com">Get in touch</a></div>
            <div className="hero-metrics" data-reveal>
              <div><strong>18/22</strong><span>On track for First Class Honours</span></div><div><strong>2028</strong><span>Expected graduation</span></div><div><strong>EGFR</strong><span>Current screening target</span></div>
            </div>
          </div>
          <div className="hero-visual" data-reveal>
            <div className="visual-label top">EGFR / VIRTUAL SCREEN</div><MoleculeGraphic />
            <div className="compound-card"><span>PIPELINE STATUS</span><strong>ACTIVE</strong><i /></div>
            <div className="visual-label bottom">Morgan radius 2 · pIC50 · Scaffold split</div>
          </div>
          <a className="scroll-cue" href="#research"><span />SCROLL TO EXPLORE</a>
        </header>

        <section className="research" id="research">
          <div className="section-heading" data-reveal><div><SectionLabel number="01">Selected work</SectionLabel><h2>Research &amp;<br /><em>projects</em></h2></div><p>Building at the intersection of molecular data, medical imaging, machine learning, and dependable software.</p></div>
          <div className="project-lab" data-reveal>
            <div className="project-index" role="tablist" aria-label="Projects">
              {projects.map((project, index) => (
                <button key={project.code} className={activeProject === index ? "active" : ""} onClick={() => setActiveProject(index)} role="tab" aria-selected={activeProject === index}>
                  <span>{project.code}</span><strong>{project.title}</strong><small>{project.type}</small>
                </button>
              ))}
            </div>
            <article className="project-detail">
              <div className="project-meta"><span>{projects[activeProject].type}</span><time>{projects[activeProject].date}</time></div>
              <h3>{projects[activeProject].title}</h3><p className="project-summary">{projects[activeProject].summary}</p>
              <ul>{projects[activeProject].details.map(detail => <li key={detail}>{detail}</li>)}</ul>
              <div className="stack"><span>METHODS / STACK</span>{projects[activeProject].stack}</div>
            </article>
          </div>
        </section>

        <section className="education">
          <div className="education-grid">
            <div data-reveal><SectionLabel number="02">Education</SectionLabel><h2>Computing with a<br /><em>biological lens.</em></h2></div>
            <div className="degree-card" data-reveal>
              <span className="degree-year">EXPECTED MAY 2028</span><h3>BSc (Hons) Computing Science</h3><p className="university">University of Glasgow · Glasgow, United Kingdom</p><p>Third year · Grade 18/22 · On track for First Class Honours</p>
              <div className="coursework"><span>Relevant coursework</span>Python · Java · C++ · C · SQL · Databases · Algorithms and Data Structures · OOP · Networks and Operating Systems · Systems Programming · Web Development · HCI</div>
              <div className="independent-study"><span>Independent study</span>Computational biology, medicinal chemistry, molecular biology, and cheminformatics through Patrick’s <cite>An Introduction to Medicinal Chemistry</cite>, Zvelebil &amp; Baum’s <cite>Understanding Bioinformatics</cite>, and TeachOpenCADD.</div>
            </div>
          </div>
        </section>

        <section className="experience" id="experience">
          <div className="section-heading" data-reveal><div><SectionLabel number="03">Experience</SectionLabel><h2>From models<br />to <em>real-world systems.</em></h2></div><p>Technical experience shaped by research, collaboration, client communication, and practical delivery.</p></div>
          <div className="timeline" data-reveal>
            {experience.map((item, index) => <article key={item.org}><span className="timeline-dot">{String(index + 1).padStart(2, "0")}</span><time>{item.date}</time><div><h3>{item.org}</h3><p className="role">{item.role}</p><p>{item.text}</p>{"details" in item && item.details && <ul className="exp-details">{item.details.map((d) => <li key={d}>{d}</li>)}</ul>}{"stack" in item && item.stack && <p className="exp-stack">{item.stack}</p>}</div></article>)}
          </div>
        </section>

        <section className="skills" id="skills">
          <div className="skills-grid">
            <div data-reveal><SectionLabel number="04">Technical toolkit</SectionLabel><h2>Built to inspect,<br /><em>test &amp; iterate.</em></h2><p>Tools for moving from raw biological or medical data to reproducible analysis and useful software.</p></div>
            <div className="skill-list" data-reveal>{skillGroups.map(([title, items], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{items}</p></div>)}</div>
          </div>
        </section>

        <section className="more">
          <div className="section-heading" data-reveal><div><SectionLabel number="05">Beyond the lab</SectionLabel><h2>Leadership &amp;<br /><em>recognition</em></h2></div></div>
          <div className="more-grid" data-reveal>
            <div><h3>Leadership</h3><ul><li><strong>Secretary</strong><span>University of Glasgow Robotics Society · Jan 2026 - Present</span></li><li><strong>Peer Mentor</strong><span>University of Glasgow · Sep 2025 - Present</span></li><li><strong>Welfare Officer</strong><span>University of Glasgow FinTech Society · Sep 2025 - May 2026</span></li></ul></div>
            <div><h3>Hackathons</h3><ul><li><strong>Honourable Mention · Morgan Stanley</strong><span>Do You Have The GUTS · Oct 2025</span></li><li><strong>Top 10 Finalist</strong><span>Microsoft Sustainability Hackathon · May 2023</span></li><li><strong>Glasgow 850 GameJam</strong><span>PubCrawl Simulator · Oct - Nov 2025</span></li></ul></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-orb" aria-hidden="true"><span>C</span><span>N</span><span>O</span></div>
          <div data-reveal><SectionLabel number="06">Contact</SectionLabel><h2>Let’s investigate<br /><em>what’s possible.</em></h2><p>I’m interested in research opportunities and collaborations across computational drug discovery, cheminformatics, scientific machine learning, and medical data.</p><a className="email-link" href="mailto:nishitaphutane@gmail.com">nishitaphutane@gmail.com <span>↗</span></a><div className="socials"><a href="https://www.linkedin.com/in/nishita-phutane" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://nishitaphutane.github.io/my_portfolio/" target="_blank" rel="noreferrer">Portfolio ↗</a></div></div>
        </section>
      </main>
      <footer><span>© {new Date().getFullYear()} Nishita Phutane</span><span>Computing science for better discovery.</span></footer>
    </div>
  );
}

export default App;
