import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['accordion-wrapper'],

  authzStore: service('authz-store'),

  model: null,

  init() {
    this._super(...arguments);
    this.set('model.supplementalGroups', this.get('model.supplementalGroups') || this.get('authzStore').createRecord({
      type: 'supplementalGroupsStrategyOptions',
      rule: 'RunAsAny',
    }));
  },

  actions: {
    add: function() {
      this.get('model.supplementalGroups.ranges').pushObject(
        this.get('authzStore').createRecord({
          type: 'idRange',
          min: 0,
          max: 6,
        })
      );
    },
    remove: function(obj) {
      this.get('model.supplementalGroups.ranges').removeObject(obj);
    },
  },

  ruleDidChange: function() {
    const rule = this.get('model.supplementalGroups.rule');
    if (rule === 'MustRunAs') {
      this.set('model.supplementalGroups.ranges', []);
      this.send('add');
    } else {
      this.set('model.supplementalGroups.ranges', null);
    }
  }.observes('model.supplementalGroups.rule'),

  didReceiveAttrs() {
    if (!this.get('expandFn')) {
      this.set('expandFn', function (item) {
        item.toggleProperty('expanded');
      });
    }
  },

  statusClass: null,
  status: null,
});