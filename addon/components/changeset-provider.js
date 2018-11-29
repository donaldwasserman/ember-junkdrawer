import DSModelProvider from './ds-model-provider';
import layout from '../templates/components/changeset-provider';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';
import { A } from '@ember/array';

export default DSModelProvider.extend({
  layout,
  /**
   * @public
   */
  changeset: null,
  /**
   * @public
   */
  validator: null,
  /**
   * @public
   */
  model: null,
  /**
   * Server errors array
   * @public
   **/
  serverErrors: A(),

  didReceiveAttrs() {
    this._super(...arguments);
    let changeset = this.get('changeset');

    if (!changeset) {
      if (this.get('validator')) {
        changeset = new Changeset(this.get('model'), lookupValidator(this.get('validator')), this.get('validator'))
      } else {
        changeset = new Changeset(this.get('model'))
      }
    }

    this.set('changeset', changeset);
  },
  handleErrors(data) {
    if ('payload' in data) {
      data = data[ 'payload' ];
    }
    if ('errors' in data) {
      if (Array.isArray(data[ 'errors' ])) {
        data[ 'errors' ].forEach(item => {
          if (this.get('changeset')) {
            let { source: { pointer }, title = '', detail = '' } = item;
            let keys = pointer.split('/');
            let key = (keys[ 1 ] === 'attributes') ? keys.splice(2) : keys.splice(1);
            key = key.join('.');
            this.get('changeset').pushErrors(key, title, detail);
          } else {
            this.get('serverErrors').addObject(item.detail);
          }
        });
      }

      if ('non_field_errors' in data[ 'errors' ]) {
        data[ 'errors' ][ 'non_field_errors' ].forEach(item => {
          this.get('serverErrors').addObject(item.detail)
        });
      }
    }
  }
});
