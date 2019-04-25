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

export const layoutElements = () => ({
  name: 'layoutElements',
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
    elements: {
      types: ['render'],
      resolve: false,
      aliases: ['fn', 'function'],
      help:
        'An expression to pass each resulting data table into. Tips: \n' +
        ' Expressions must return a render type.\n' +
        ' All render types do not have to be the same',
    },
    containers: {
      types: ['position'],
      resolve: false,
      aliases: ['fn', 'function'],
      help: 'An expression to generate the containers to put the elements in',
    },
  },
  fn: (context, args) => {
    const datatables = args.by ? groupTable(context, args.by) : [context];

    const originElements = Promise.all(datatables.map(args.elements));
    const containers = Promise.all(datatables.map(args.containers));

    return Promise.all([originElements, containers]).then(([originElements, containers]) => {
      const count = containers.length;
      const elements = originElements.map((originElement, i) => {
        const container = containers[i];
        const { css, containerStyle } = container;

        let top = null;
        let left = null;
        let bottom = null;
        let right = null;
        if (container.top == null) {
          if (container.bottom == null) {
            top = (1 / count) * i;
          } else {
            bottom = container.bottom;
          }
        } else {
          top = container.top;
        }

        if (container.left == null) {
          if (container.right == null) {
            left = (1 / count) * i;
          } else {
            right = container.right;
          }
        } else {
          left = container.left;
        }

        // Auto calculated values
        const height = container.height != null ? container.height : (1 / count);
        const width = container.width != null ? container.width : (1 / count);
        const angle = container.angle != null ? container.angle : 0;

        const element = {
          ...originElement,
          css,
          containerStyle
        };
        return {
          element,
          position: { ...container, top, left, height, width, angle, bottom, right }
        };
      });

      return {
        type: 'render',
        as: 'pageElement',
        value: {
          elements
        },
      };
    });
  },
});
