import LinkComponent from '@ember/routing/link-component';
import {get, computed} from '@ember/object';

export default LinkComponent.extend({
  classNames: ['list-group-item', 'list-group-item-action'],
  type: 'default',
  disabled: false,
  classNameBindings: ['contextualColor', 'disabled'],
  contextualColor: computed('type', function() {
    return `list-group-item-${get(this, 'type')}`;
  })
});
