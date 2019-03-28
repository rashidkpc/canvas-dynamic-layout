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
    // In the future it may make sense to add things like shape, or tooltip values, but I think what we have is good for now
    // The way the function below is written you can add as many arbitrary named args as you want.
  },
  fn: (context, { by, expression }) => {
    const datatables = by ? groupTable(context, by) : [context];

    return Promise.all(datatables.map(expression)).then(elements => {
      return {
        type: 'render',
        as: 'repeatElement',
        value: {
          elements: elements,
        },
      };
    });
  },
});
