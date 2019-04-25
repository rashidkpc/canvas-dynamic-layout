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

      let top = null;
      let left = null;
      let bottom = null;
      let right = null;

      // If both top & bottom are unset, auto define top. If only one is set, set that one. If both are set, only set top;
      if (container.top == null) {
        if (container.bottom == null) {
          top = 0;
        } else {
          bottom = container.bottom;
        }
      } else {
        top = container.top;
      }

      if (container.left == null) {
        if (container.right == null) {
          left = 0;
        } else {
          right = container.right;
        }
      } else {
        left = container.left;
      }


      const angle = container.angle != null ? container.angle : 0;
      const height = container.height != null ? container.height : 1;
      const width = container.width != null ? container.width : 1;

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
  },
});
