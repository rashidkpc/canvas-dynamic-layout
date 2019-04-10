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


export const positionElement = () => ({
  name: 'positionElement',
  type: 'render',
  help:
    'Position one or more elements in a container',
  args: {
    element: {
      types: ['render'],
      multi: true,
      help:
        'An expression to pass each resulting data table into. Tips: \n' +
        ' Expressions must return a render type.\n' +
        ' All render types do not have to be the same',
    },
    container: {
      types: ['position'],
      multi: true,
      default: '{position}',
      help: 'An expression to generate the containers to put the elements in',
    },
  },
  fn: (context, args) => {
    const originElements = args.element;
    const containers = args.container;

    const elements = originElements.map((originElement, i) => {
      const container = containers[i];
      const { css, containerStyle } = container;

      const angle = container.angle != null ? container.angle : 0;
      const height = container.height != null ? container.height : 1;
      const width = container.width != null ? container.width : 1;
      const top = container.top != null ? container.top : 0; //
      const left = container.left != null ? container.left : 0;

      const element = {
        ...originElement,
        css,
        containerStyle
      };
      return {
        element,
        position: { top, left, height, width, angle }
      };
    });

    return {
      type: 'render',
      as: 'pageElement',
      value: {
        elements
      },
    };
  },
});
