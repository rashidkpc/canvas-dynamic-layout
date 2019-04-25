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

const snippet1 = `representing a percentage of the parent container's`;


// Note that none of these have defaults. Passing null is desirable here as the consumer of these objects determines how defaults are filled
export const position = () => ({
  name: 'position',
  type: 'position',
  help: 'Create a position specification. Usually paired with a layout function of some sort.',
  args: {
    height: {
      types: ['number'],
      help: `Height of the element as a number between 0 and 1 ${snippet1} height`,
    },
    width: {
      types: ['number'],
      help: `Width of the element as a number between 0 and 1 ${snippet1} width`,
    },
    top: {
      types: ['number'],
      help: `Distance from top as a number between 0 and 1 ${snippet1} height`,
    },
    left: {
      types: ['number'],
      help: `Distance from left edge as a number between 0 and 1 ${snippet1} width`,
    },
    bottom: {
      types: ['number'],
      help: `Distance from bottom as a number between 0 and 1 ${snippet1} height`,
    },
    right: {
      types: ['number'],
      help: `Distance from right edge as a number between 0 and 1 ${snippet1} width`,
    },
    angle: {
      types: ['number'],
      help: `A number between 0 and 1 representing the angle to position the element at. 0 = 0deg, 1 = 360deg`,
    },
    css: {
      types: ['string'],
      help:
        'Custom CSS style to apply to container. Same as you would use in a call to `render`. Clobbers custom CSS applied to the elements',
    },
    class: {
      types: ['string'],
      default: 'canvasPositionFn',
      help: 'Advanced: Attach a custom CSS class to the element',
    },
    containerStyle: {
      types: ['containerStyle'],
      default: '{containerStyle}',
      help: 'Container styling, clobbers container styling applied to the element',
    },
  },
  fn: (context, args) => {
    return {
      type: 'position',
      ...args
    };
  }
});
