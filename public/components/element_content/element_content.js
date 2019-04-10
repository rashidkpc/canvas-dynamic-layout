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

import React from 'react';
import PropTypes from 'prop-types';
import { pure, compose, branch, renderComponent } from 'recompose';
import Style from 'style-it';
import { getType } from '@kbn/interpreter/common';
import { Loading } from '../../../../../x-pack/plugins/canvas/public/components/loading';
import { RenderWithFn } from '../../../../../x-pack/plugins/canvas/public/components/render_with_fn';
import { ElementShareContainer } from '../../../../../x-pack/plugins/canvas/public/components/element_share_container';
import { InvalidExpression } from './invalid_expression';
import { InvalidElementType } from './invalid_element_type';

/*
  Branches
  Short circut rendering of the element if the element isn't ready or isn't valid.
*/
const branches = [
  // no renderable or renderable config value, render loading
  branch(({ renderable, state }) => {
    return !state || !renderable;
  }, renderComponent(() => <Loading />)),
  // renderable is available, but no matching element is found, render invalid
  branch(({ renderable, renderFunction }) => {
    return renderable && getType(renderable) !== 'render' && !renderFunction;
  }, renderComponent(InvalidElementType)),

  // error state, render invalid expression notice
  branch(({ renderable, renderFunction, state }) => {
    return (
      state === 'error' || // The renderable has an error
      getType(renderable) !== 'render' || // The renderable isn't, well, renderable
      !renderFunction // We can't find an element in the registry for this
    );
  }, renderComponent(InvalidExpression)),
];

export const ElementContent = compose(
  pure,
  ...branches
)(({ renderable, renderFunction, size, handlers }) => {
  const { getFilter, setFilter, done, onComplete } = handlers;
  const style = { ...renderable.containerStyle, ...size };

  // HELLO
  return Style.it(
    renderable.css || 'div {}',
    <div
      // TODO: 'canvas__element' was added for BWC, It can be removed after a while
      className={'canvas__element canvasElement'}
      style={style}
      data-test-subj="canvasWorkpadPageElementContent"
    >
      <ElementShareContainer
        className="canvasElement__content"
        onComplete={onComplete}
        functionName={renderFunction.name}
      >
        <RenderWithFn
          name={renderFunction.name}
          renderFn={renderFunction.render}
          reuseNode={renderFunction.reuseDomNode}
          config={renderable.value}
          size={size} // Size is only passed for the purpose of triggering the resize event, it isn't really used otherwise
          handlers={{ getFilter, setFilter, done }}
        />
      </ElementShareContainer>
    </div>
  );
});

ElementContent.propTypes = {
  renderable: PropTypes.shape({
    css: PropTypes.string,
    value: PropTypes.object,
  }),
  renderFunction: PropTypes.shape({
    name: PropTypes.string,
    render: PropTypes.func,
    reuseDomNode: PropTypes.bool,
  }),
  size: PropTypes.object,
  handlers: PropTypes.shape({
    setFilter: PropTypes.func.isRequired,
    getFilter: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired, // local, not passed through
  }).isRequired,
  state: PropTypes.string,
};
