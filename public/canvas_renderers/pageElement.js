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

import ReactDOM from 'react-dom';
import React from 'react';
import { ElementContent } from '../components/element_content';

export const pageElement = () => ({
  name: 'pageElement',
  displayName: 'Layout Element',
  help: 'Layout a list of elements like they might be laid out on a page',
  reuseDomNode: true,
  render(domNode, config, handlers) {
    const { elements } = config;
    const noop = () => { };
    const elementHandlers = { getFilter: noop, setFilter: noop, done: noop, onComplete: noop };
    const destroy = () => ReactDOM.unmountComponentAtNode(domNode);

    const draw = () => {
      destroy();
      const nodeHeight = domNode.clientHeight;
      const nodeWidth = domNode.clientWidth;
      const content = (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {elements.map((element, i) => {
            
            // Some brief sanity checking
            if (!element.position) return;
            if (!element.element) return;
            if (!element.element.type === 'render') return;

            const { top, left, height, width, angle, bottom, right } = element.position;
            const customClass = element.position.class;
            const pxHeight = nodeHeight * height;
            const pxWidth = nodeWidth * width;
            return (
              <div
                className={["canvasPageElement", customClass].join(' ')}
                key={i}
                style={{
                  position: 'absolute',
                  height: pxHeight,
                  width: pxWidth,
                  top: top != null ? nodeHeight * top : null,
                  left: left != null ? nodeWidth * left : null,
                  bottom: bottom != null ? nodeHeight * bottom : null,
                  right: right != null ? nodeWidth * right : null,
                  transform: `rotate(${360 * angle}deg)`
                }}
              >
                <ElementContent
                  state="done"
                  renderable={element.element}
                  handlers={elementHandlers}
                  size={{ height: pxHeight, width: pxWidth }} />
              </div>
            );
          }).filter(e => e !== null)}
        </div>
      );
      ReactDOM.render(content, domNode, () => handlers.done());
    };
    draw();


    handlers.onDestroy(destroy);
    handlers.onResize(() => {
      destroy();
      draw();
    });
  },
});
