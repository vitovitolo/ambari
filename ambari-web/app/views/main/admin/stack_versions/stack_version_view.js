/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');
var filters = require('views/common/filter_view');
var sort = require('views/common/sort_view');

App.MainStackVersionsView = App.TableView.extend({
  templateName: require('templates/main/admin/stack_versions/stack_versions'),

  content: function () {
    return this.get('controller.content');
  }.property('controller.content'),

  /**
   * return filtered number of all content number information displayed on the page footer bar
   * @returns {String}
   */
  filteredContentInfo: function () {
    return this.t('tableView.filters.filteredConfigVersionInfo').format(this.get('filteredCount'), this.get('content.length'));
  }.property('filteredCount', 'content.length'),

  /**
   * associations between stack version property and column index
   * @type {Array}
   */
  colPropAssoc: function () {
    var associations = [];
    associations[1] = 'name';
    associations[2] = 'repositoryVersion.displayName';
    associations[3] = 'repositoryVersion.operatingSystems';
    associations[4] = 'installedHosts.length';
    associations[5] = 'currentHosts.length';
    return associations;
  }.property(),

  sortView: sort.wrapperView,
  stackNameSort: sort.fieldView.extend({
    column: 1,
    name: 'name',
    displayName: Em.I18n.t('admin.stackVersions.table.header.stack'),
    type: 'version',
    classNames: ['first']
  }),
  stackVersionSort: sort.fieldView.extend({
    column: 2,
    name: 'repositoryVersion.displayName',
    displayName: Em.I18n.t('admin.stackVersions.table.header.version'),
    type: 'version'
  }),
  osSort: sort.fieldView.extend({
    column: 3,
    name: 'repositoryVersionoperatingSystems',
    displayName: Em.I18n.t('admin.stackVersions.table.header.os')
  }),
  installedSort: sort.fieldView.extend({
    column: 4,
    name: 'installedHosts.length',
    displayName: Em.I18n.t('admin.stackVersions.table.header.installed'),
    type: "number"
  }),
  currentSort: sort.fieldView.extend({
    column: 5,
    name: 'currentHosts.length',
    displayName: Em.I18n.t('admin.stackVersions.table.header.current'),
    type: "number"
  }),

  stackNameFilterView: filters.createSelectView({
    column: 1,
    fieldType: 'filter-input-width',
    content: function () {
      var names = this.get('parentView.content').mapProperty('name').uniq();
      return [
        {
          value: '',
          label: Em.I18n.t('common.all')
        }
      ].concat(names.map(function (name) {
        return {
          value: name,
          label: name
        }
      }));
    }.property('App.router.mainStackVersionsController.dataIsLoaded'),
    onChangeValue: function () {
      this.get('parentView').updateFilter(this.get('column'), this.get('value'), 'select');
    }
  }),

  stackVersionFilterView: filters.createTextView({
    column: 2,
    fieldType: 'filter-input-width',
    onChangeValue: function () {
      this.get('parentView').updateFilter(this.get('column'), this.get('value'), 'string');
    }
  }),

  osFilterView: filters.createTextView({
    column: 3,
    fieldType: 'filter-input-width',
    onChangeValue: function () {
      this.get('parentView').updateFilter(this.get('column'), this.get('value'), 'string');
    }
  }),

  installedFilterView: filters.createTextView({
    column: 4,
    fieldType: 'filter-input-width',
    onChangeValue: function () {
      this.get('parentView').updateFilter(this.get('column'), this.get('value'), 'string');
    }
  }),

  currentFilterView: filters.createTextView({
    column: 5,
    fieldType: 'filter-input-width',
    onChangeValue: function () {
      this.get('parentView').updateFilter(this.get('column'), this.get('value'), 'string');
    }
  }),

  didInsertElement: function() {
    this.set('controller.isPolling', true);
    this.get('controller').load();
    this.get('controller').doPolling();
  },


  willDestroyElement: function () {
    this.set('controller.isPolling', false);
    clearTimeout(this.get('controller.timeoutRef'));
  },

  StackVersionView: Em.View.extend({
    tagName: 'tr',
    didInsertElement: function () {
      App.tooltip(this.$("[rel='Tooltip']"));
      this.set('isOsCollapsed', true);
    },

    toggleOs: function(event) {
      this.set('isOsCollapsed', !this.get('isOsCollapsed'));
      this.$('.operating-systems').toggle();
    },

    labels: function() {
      return this.get('content.repositoryVersion.operatingSystems') &&
        this.get('content.repositoryVersion.operatingSystems').getEach('osType').join("<br/>");
    }.property('content.repositoryVersion.operatingSystems.length')
  })

});
