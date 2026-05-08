/* parcoursPro.js — moteur du parcours pro (V4 — métier d'abord).

   Une seule fonction exportée :
     computeParcours(jobId, userLevels)
       userLevels = { skill_id: 0..3 }  (skill non listée = 0)
     → {
         jobId, jobName, family,
         match: { acquired, missing, percent },
         modules: [{ id, name, year, unit, days, skills_taught, prerequisites }],
         totalDays, totalHours
       }

   Logique :
     - Skill acquise ssi userLevels[skillId] >= levelRequired
     - Module retenu ssi il enseigne ≥ 1 skill de match.missing
     - Prérequis : si A enseigne S à L_X et B enseigne S à L_Y > L_X → A prérequis de B
     - Tri : year asc (M1 avant M2), unit asc (U1 < U2 < U3), id asc
*/

import { SKILL_BY_ID, JOBS_SKILLS_ATOMIC } from '../data/skills.js';
import { JOB_BY_ID } from '../data/jobs.js';
import { COURSE_SKILLS } from '../data/courses_skills.js';
import { COURSE_BY_ID } from '../data/courses.js';

const DAY_HOURS  = 7;
const UNIT_ORDER = { U1: 0, U2: 1, U3: 2 };
const orderOf = m => (m.year === 'M1' ? 0 : 10) + (UNIT_ORDER[m.unit] ?? 99);

function computeMatch(jobId, userLevels) {
  const required = JOBS_SKILLS_ATOMIC[jobId];
  if (!required) throw new Error(`Job '${jobId}' n'est pas dans le périmètre`);

  const acquired = [];
  const missing  = [];
  for (const { id, level: levelRequired } of required) {
    const levelAcquired = userLevels[id] || 0;
    const skill = SKILL_BY_ID[id];
    const entry = {
      skillId: id,
      name: skill ? skill.name : id,
      category: skill ? skill.category : 'unknown',
      levelRequired,
      levelAcquired
    };
    (levelAcquired >= levelRequired ? acquired : missing).push(entry);
  }
  const percent = Math.round((acquired.length / required.length) * 100);
  return { acquired, missing, percent };
}

function buildModule(courseId, missingIds) {
  const info = COURSE_BY_ID[courseId];
  const cfg  = COURSE_SKILLS[courseId];
  if (!info || !cfg) return null;
  const taught = cfg.skills_taught.filter(s => missingIds.has(s.id));
  if (taught.length === 0) return null;
  return {
    id: courseId,
    name: info.name,
    year: info.year,
    unit: info.unit,
    days: info.days,
    skills_taught: taught.map(s => ({
      skillId: s.id,
      name: SKILL_BY_ID[s.id]?.name || s.id,
      target_level: s.target_level
    })),
    prerequisites: []
  };
}

function linkPrerequisites(modules, missingIds) {
  // A prérequis de B ssi A et B enseignent une même skill S, et A à niveau < B.
  // 2 garde-fous :
  //   - S doit être dans le delta utilisateur (sinon c'est du "side-content")
  //   - Pas d'inversion temporelle : A doit venir avant B en (year, unit)
  for (const B of modules) {
    const cfgB = COURSE_SKILLS[B.id];
    for (const skillB of cfgB.skills_taught) {
      if (!missingIds.has(skillB.id)) continue;
      for (const A of modules) {
        if (A.id === B.id) continue;
        if (orderOf(A) > orderOf(B)) continue;
        const skillA = COURSE_SKILLS[A.id].skills_taught.find(s => s.id === skillB.id);
        if (skillA && skillA.target_level < skillB.target_level && !B.prerequisites.includes(A.id)) {
          B.prerequisites.push(A.id);
        }
      }
    }
  }
}

function sortModules(modules) {
  return modules.sort((a, b) => {
    const oa = orderOf(a), ob = orderOf(b);
    if (oa !== ob) return oa - ob;
    return a.id < b.id ? -1 : 1;
  });
}

export function computeParcours(jobId, userLevels = {}) {
  const job   = JOB_BY_ID[jobId];
  const match = computeMatch(jobId, userLevels);

  const missingIds = new Set(match.missing.map(s => s.skillId));
  const coveredMissingIds = new Set();
  const modules = Object.keys(COURSE_SKILLS)
    .map(cid => buildModule(cid, missingIds))
    .filter(Boolean);

  for (const module of modules) {
    for (const skill of module.skills_taught) {
      coveredMissingIds.add(skill.skillId);
    }
  }

  const uncoveredSkills = match.missing.filter((skill) => !coveredMissingIds.has(skill.skillId));

  linkPrerequisites(modules, missingIds);
  sortModules(modules);

  const totalDays = modules.reduce((s, m) => s + (m.days || 0), 0);

  return {
    jobId,
    jobName: job ? job.name : jobId,
    family:  job ? job.family : 'unknown',
    match,
    modules,
    uncoveredSkills,
    totalDays,
    totalHours: totalDays * DAY_HOURS
  };
}
