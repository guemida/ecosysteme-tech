/* Stats globales — calculées à partir de JOBS. */

import { JOBS } from './jobs.js';

export const STATS = {
  total: JOBS.length,
  penurie: JOBS.filter(j => j.market_tension === 'penurie').length,
  avgSenior: Math.round(JOBS.reduce((a, j) => a + j.salary.senior, 0) / JOBS.length),
  ects: 300,
  euCountries: 11
};
