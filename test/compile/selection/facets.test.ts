/* tslint:disable quotemark */

import {assert} from 'chai';
import {FacetModel} from '../../../src/compile/facet';
import {unitName} from '../../../src/compile/selection';
import {assembleFacetSignals} from '../../../src/compile/selection/assemble';
import {UnitModel} from '../../../src/compile/unit';
import {parseModel} from '../../util';

describe('Faceted Selections', () => {
  const model = parseModel({
    data: {url: 'data/anscombe.json'},
    facet: {
      column: {field: 'Series', type: 'nominal'},
      row: {field: 'X', type: 'nominal', bin: true}
    },
    spec: {
      layer: [
        {
          mark: 'rule',
          encoding: {y: {value: 10}}
        },
        {
          selection: {
            one: {type: 'single'},
            twp: {type: 'multi'},
            three: {type: 'interval'}
          },
          mark: 'rule',
          encoding: {
            x: {value: 10}
          }
        }
      ]
    }
  });

  model.parse();
  const unit = model.children[0].children[1] as UnitModel;

  it('should assemble a facet signal', () => {
    assert.includeDeepMembers(assembleFacetSignals(model as FacetModel, []), [
      {
        name: 'facet',
        value: {},
        on: [
          {
            events: [{source: 'scope', type: 'mousemove'}],
            update: 'isTuple(facet) ? facet : group("cell").datum'
          }
        ]
      }
    ]);
  });

  it('should name the unit with the facet keys', () => {
    assert.equal(unitName(unit), `"child_layer_1" + '_' + (facet["bin_maxbins_6_X"]) + '_' + (facet["Series"])`);
  });
});
