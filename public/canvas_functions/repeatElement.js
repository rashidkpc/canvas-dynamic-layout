/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { groupTable } from './lib/group_table';

export const repeatElement = () => ({
  name: 'repeatElement',
  type: 'render',
  help:
    'Subdivide a datatable, pass the resulting tables into an expression that returns a set of renderable elements',
  context: {
    types: ['datatable'],
  },
  args: {
    by: {
      types: ['string'],
      help: 'The column to subdivide on',
      multi: true,
    },
    expression: {
      types: ['render'],
      resolve: false,
      aliases: ['fn', 'function'],
      help:
        'An expression to pass each resulting data table into. Tips: \n' +
        ' Expressions must return a render type.\n' +
        ' All render types do not have to be the same',
    },
    direction: {
      types: ['string'],
      help: 'Repeat as a column or a row?',
      default: 'row',
    },
    // In the future it may make sense to add things like shape, or tooltip values, but I think what we have is good for now
    // The way the function below is written you can add as many arbitrary named args as you want.
  },
  fn: (context, { by, expression, direction }) => {
    const datatables = by ? groupTable(context, by) : [context];

    return Promise.all(datatables.map(expression)).then(elements => {
      return {
        type: 'render',
        as: 'repeatElement',
        value: {
          direction,
          elements: elements,
        },
      };
    });
  },
});
