/* Soft skills — 12 compétences transverses, chacune rattachée à un cours. */

export const SOFTSKILLS = [
  { id: 'SS01', name: 'Leadership technique',      courseId: 'M1GESTI', desc: "Animer une équipe tech, arbitrer, décider" },
  { id: 'SS02', name: 'Storytelling Data',         courseId: 'M1DASC',  desc: "Vulgariser des insights data auprès de décideurs" },
  { id: 'SS03', name: 'Esprit équipe Cyber',       courseId: 'M1APPW',  desc: "Coordination Blue/Red Team, gestion de crise" },
  { id: 'SS04', name: 'Innovation & pitch',        courseId: 'M1INNO',  desc: "Défendre un projet devant un jury" },
  { id: 'SS05', name: 'Réflexion stratégique',     courseId: 'M2GESTP', desc: "Vision business + tech, leadership de projet" },
  { id: 'SS06', name: 'Éthique professionnelle',   courseId: 'M2ETHI',  desc: "Décisions IA/cyber responsables" },
  { id: 'SS07', name: 'Intelligence économique',   courseId: 'M2VEILL', desc: "Veille concurrentielle, RGPD, influence" },
  { id: 'SS08', name: 'Communication exécutive',   courseId: 'M2GESTP', desc: "Convaincre un comité de direction" },
  { id: 'SS09', name: 'Conformité et droit',       courseId: 'M2VEILL', desc: "RGPD, contrats, responsabilité juridique" },
  { id: 'SS10', name: 'Gestion de projet Agile',   courseId: 'M1PROJ',  desc: "Scrum, sprints, backlog, rétrospectives" },
  { id: 'SS11', name: 'Prise de parole',           courseId: 'M1SPRO',  desc: "Pitch, improvisation, présentation" },
  { id: 'SS12', name: 'Data Storytelling avancé',  courseId: 'M2GOUVD', desc: "Visualisation décisionnelle, gouvernance data" }
];

export const SS_BY_ID = Object.fromEntries(SOFTSKILLS.map(s => [s.id, s]));
