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
    const draw = () => {
      const nodeHeight = domNode.clientHeight;
      const nodeWidth = domNode.clientWidth;
      const content = (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {elements.map((element, i) => {
            const { top, left, height, width, angle } = element.position;
            return (
              <div
                className="canvasPageElement"
                key={i}
                style={{
                  position: 'absolute',
                  height: nodeHeight * height,
                  width: nodeWidth * width,
                  top: nodeHeight * top,
                  left: nodeWidth * left,
                  transform: `rotate(${360 * angle}deg)`
                }}
              >
                <ElementContent state="done" renderable={element.element} handlers={elementHandlers} />
              </div>
            );
          })}
        </div>
      );
      ReactDOM.render(content, domNode, () => handlers.done());
    };
    draw();

    const destroy = () => ReactDOM.unmountComponentAtNode(domNode);

    handlers.onDestroy(destroy);
    handlers.onResize(() => {
      destroy();
      draw();
    });
  },
});
