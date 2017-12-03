# ember-junkdrawer
https://www.npr.org/sections/theprotojournalist/2014/08/15/337759135/what-your-junk-drawer-reveals-about-you

## Install
```bash
ember install ember-junkdrawer
```

# Quick & Dirty Component Examples
## Tables
Template driven tables with support for filtering.

```handlebars
{{#table/model-table
  dir=dir
  sort=sort
  columns=columns
  recordType=recordType as |t| }}

  {{#t.filter
    defaultRecordQuery=defaultRecordQuery
    preFilterAlter=(action "preFilterAlter")
  as |filter|}}
    {{filter.element label="Name" controlType="text" property="name__icontains"}}
    {{filter.element label="Date Range" controlType="baremetrics" presets=dateFilterPresets property="daterange"}}
  {{/t.filter}}

{{/table/model-table}}
```

## Forms

component.js:
```js
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';

import FormComponent from 'ember-junkdrawer/components/form/changeset-form';
import OrganizationValidations from '../../validators/organization';

export default FormComponent.extend({
  flashMessages: service(),

  validator: OrganizationValidations,
  model: computed(function() {
    return get(this, 'organization');
  }),

  /**
   * Success
   */
  onSubmitSuccess() {
    get(this, 'flashMessages').success('Organization Updated');
  },

});
```

### Form Controls
This addon provides two custom form controls: Baremetrics Calendar and Avatar.
Avatar is a custom upload type with configurable in-browser image cropping.

```handlebars
{{#bs-form model=changeset onSubmit=(action "submit") as |form|}}
  {{#ui/ui-box as |b|}}
    {{#b.body}}
      {{form.element controlType="avatar" property="logoPropertyName"}}
      {{form.element controlType="baremetrics" property="dateRange" options=(hash presets=presets)}}
    {{/b.body}}
  {{/ui/ui-box}}
{{/bs-form}}
```

The baremetrics calendar element takes a hash of `options` that is the same hash available to pass
to [Baremetrics Calendar](https://github.com/davewasmer/ember-baremetrics-calendar/pull/12)

component.hbs:
```handlebars
{{component/my-component organization=model}}
```

## UI Box
component.hbs:
```handlebars
{{#ui/ui-box as |b|}}

  {{#b.header}}
    Create New Organization
  {{/b.header}}

  {{#b.body classNames="no-padding"}}
    {{form.element label="Organization Name" controlType="text" property="name"}}
  {{/b.body}}

  {{#b.footer}}
    {{bs-button defaultText="Create Organization" pendingText="Saving..." buttonType="submit"}}
  {{/b.footer}}

{{/ui/ui-box}}
```
Set `classNames` to pass modifier classes to the component.
Set `tagName` to override the component's default element.


# Tree Shaking
Use either blacklist or whitelist, not both.
In your ember-cli-build.js:

```js
    'ember-junkdrawer': {
      'blacklist': [
        'service:current-user'
      ]
    },
```

## List of things that can be added/removed:
| Type          |       Label |
| ------------- | ------------- |
| Form Control  | form-control:avatar  |
| Component  | component:changeset-form  |
| Component  | component:simple-form-group  |
| Component  | component:table-loader  |
| Component  | component:thing-list-item  |
| Component  | component:thing-list  |
| Component  | component:thing-list  |
| Component  | component:ui-box  |
| Component  | compoennt:close-button |
| Helper  | helper:ui-page-property  |
| Mixin  | mixin:model-data-table-common  |
| Service  | service:current-user  |
| Service  | service:ui-global  |


# Random Stuff

## Custom Blueprint
`ember g changeset-form <name>`: Generates the default `.hbs` and `.js` files for
the changeset form.

## Close Button
At long last, our national nightmare of copying and pasting a close button is over.

```hbs
  {{close-button (action "myCloseActionName")}}
```

## Current User Service
The `ember-junkdrawer` current user service provides lots of helpful functionality
for getting the current user via ember-concurrency tasks.

Requirements:
**You must** have an endpoint to fetch the current user at `/users/?current=true`.
That endpoint should serialize with your store's user object.

By default, the CurrentUser service will push data to `ember-intercom`. Don't wan't that? You can opt out at anytime:

### Configuration

```js
//environment.js
ENV['ember-junkdrawer'] = {
  enableFeatures: false,
  enableIntercom: false,
  enableFlashMessages: false
}
```

If your app doesn't include those, it won't inject them.

### Hooks
This addon exposes three hooks you can use to implement in your own. You can use the default
generator to extend the provided service `ember generate current-user <your service>`.

```js
didSetupUser(user) {},
didSetupOrganization(organization) {},
didUserLoadError(){}
```
