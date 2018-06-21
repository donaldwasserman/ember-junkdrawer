import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['card-body'],
  classNameBindings: ['paddingClass'],

  /**
   * Default Padding
   * @type {Number}
   */
  paddingSize: 3,

  paddingClass: computed('paddingSize', function() {
    return `p-${this.get('paddingSize')}`;
  }),
});
