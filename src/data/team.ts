export type TeamMember = {
  bio: string;
  image: string;
  imagePosition?: string;
  name: string;
  outsideWork?: string;
  role: string;
  shortBio: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Rolando Reveco",
    role: "Managing Director",
    image: "/assets/team/rolando-reveco.avif",
    imagePosition: "center top",
    shortBio:
      "Leads PlasterPro Solution with a disciplined focus on quality, safety, and long-term client relationships.",
    bio: "Originally from Chile, Rolando brings a technical and safety-focused background shaped by mining, electrical work, and regulated materials handling. With over 20 years of industry experience, he leads residential and commercial plastering and painting projects with precision, compliance, and a strong understanding of New Zealand building standards.",
    outsideWork:
      "Fishing, traditional Chilean-style barbecues, movies, and camping around New Zealand.",
  },
  {
    name: "Regan O'keefe",
    role: "Sales Representative",
    image: "/assets/team/regan-okeefe.avif",
    imagePosition: "center top",
    shortBio:
      "Connects technical knowledge, sales, quoting, and project planning for practical client outcomes.",
    bio: "Regan brings over 15 years of building industry experience, with a strong background in coatings and weathertightness. With business training and nearly ten years living and working in China, he combines technical understanding, communication, and cultural awareness to support clear planning and reliable delivery.",
    outsideWork:
      "Running, fishing, reading, and exploring new cultures, languages, and cuisines.",
  },
  {
    name: "Javier Cuadra",
    role: "Site Manager",
    image: "/assets/team/javier-cuadra.avif",
    imagePosition: "center top",
    shortBio:
      "Coordinates teams, materials, logistics, and delivery across active plastering and painting sites.",
    bio: "Javier has a Mechanical Engineering background in Industrial Maintenance and early experience in Chile's mining sector across logistics, procurement, and operations. Since moving to New Zealand in 2017, he has built strong construction experience in plastering, painting, and weathertight systems, leading teams with calm and people-focused decision-making.",
    outsideWork:
      "Anime, video games, family time, sports, and exploring new places across New Zealand.",
  },
  {
    name: "Pablo Hernandez",
    role: "Plasterer",
    image: "/assets/team/pablo-hernandez.avif",
    imagePosition: "center top",
    shortBio:
      "Brings organisation, attention to detail, and a team-first mindset to plastering work.",
    bio: "Pablo holds a Human Resources Engineering degree from Duoc UC in Chile, where he developed a strong foundation in management and operations. Since arriving in New Zealand six years ago, he has built experience across painting and plastering, working on interior and exterior residential and commercial projects.",
    outsideWork:
      "Bodyboarding, football, hiking, and spending time at the beach.",
  },
  {
    name: "Johny Villarroel",
    role: "Plasterer",
    image: "/assets/team/johny-villarroel.avif",
    imagePosition: "center top",
    shortBio:
      "A detail-focused plasterer with a practical background in supervision, construction, and carpentry.",
    bio: "Johny has a technical background in Telecommunications and supervisory experience in Chile, where he developed strong organisational, communication, and leadership skills. Since arriving in New Zealand in March 2023, he has worked across interior and exterior plastering, painting, and sealing on residential and commercial projects.",
    outsideWork: "Mechanics and cycling.",
  },
  {
    name: "Felipe Peralta",
    role: "Plasterer",
    image: "/assets/team/felipe-peralta.avif",
    imagePosition: "center top",
    shortBio:
      "Adds safety awareness, operational discipline, and a collaborative mindset to the site team.",
    bio: "Felipe holds a Risk Prevention Engineering degree and a diploma in Process and Procedure Management from Chile. After arriving in New Zealand in 2022, he moved into construction, building experience in residential and commercial painting before expanding into plastering with a focus on teamwork, punctuality, and continuous learning.",
    outsideWork:
      "Family time with his daughter, video games, anime, and exploring New Zealand parks.",
  },
  {
    name: "Miguel Hernandez",
    role: "Brand Manager",
    image: "/assets/team/miguel-hernandez.avif",
    imagePosition: "center top",
    shortBio:
      "Shapes the company's digital presence, content strategy, and brand communication.",
    bio: "Miguel holds a Bachelor's degree in Public Relations with a Marketing specialisation and brings over 9 years of experience in communications, content creation, and brand development. He works on strategic communication and brand positioning to keep PlasterPro Solution consistent, professional, and recognisable across platforms.",
  },
];
