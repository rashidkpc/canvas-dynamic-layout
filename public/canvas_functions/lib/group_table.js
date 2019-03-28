    
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { groupBy, pick } from 'lodash';

export const groupTable = (table, columns = []) => {
  if (columns.length === 0) {
    return [table];
  }

  // Make sure columns exist
  columns.forEach(by => {
    const column = table.columns.find(column => column.name === by);
    if (!column) {
      throw new Error(`Column not found: '${by}'`);
    }
  });
  const keyedDatatables = groupBy(table.rows, row => JSON.stringify(pick(row, columns)));
  return Object.values(keyedDatatables).map(rows => ({
    ...table,
    rows,
  }));
};