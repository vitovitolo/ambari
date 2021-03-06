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
require('mixins/common/table_server_view_mixin');

describe('App.MainConfigHistoryView', function() {
  var view = Em.View.create(App.TableServerViewMixin, {
    filteredCount: 0,
    totalCount: 0,
    content: [],
    filteredContent: [],
    refresh: Em.K,
    saveFilterConditions: Em.K,
    controller: Em.Object.create({
      name: 'mainConfigHistoryController',
      paginationProps: [
        {
          name: 'displayLength',
          value: '25'
        },
        {
          name: 'startIndex',
          value: 0
        }
      ]
    })
  });

  describe('#pageContent', function() {
    beforeEach(function(){
      view.propertyDidChange('pageContent');
    });
    it('filtered content is empty', function() {
      view.set('filteredContent', []);
      expect(view.get('pageContent')).to.be.empty;
    });
    it('filtered content contain one item', function() {
      view.set('filteredCount', 1);
      view.set('filteredContent', [Em.Object.create()]);

      expect(view.get('pageContent')).to.eql([Em.Object.create()]);
    });
    it('filtered content contain two unsorted items', function() {
      view.set('filteredCount', 2);
      view.set('filteredContent', [
        Em.Object.create({index:2}),
        Em.Object.create({index:1})
      ]);

      expect(view.get('pageContent')).to.eql([
        Em.Object.create({index:1}),
        Em.Object.create({index:2})
      ]);
    });
  });

  describe('#updatePagination', function() {
    beforeEach(function () {
      sinon.spy(view, 'refresh');
      sinon.stub(App.db, 'setDisplayLength', Em.K);
      sinon.stub(App.db, 'setStartIndex', Em.K);
    });
    afterEach(function () {
      view.refresh.restore();
      App.db.setStartIndex.restore();
      App.db.setDisplayLength.restore();
    });

    it('displayLength is correct', function() {
      view.set('displayLength', '50');
      view.set('startIndex', null);

      view.updatePagination();

      expect(view.refresh.calledOnce).to.be.true;
      expect(App.db.setStartIndex.called).to.be.false;
      expect(App.db.setDisplayLength.calledWith('mainConfigHistoryController', '50')).to.be.true;
      expect(view.get('controller.paginationProps').findProperty('name', 'startIndex').value).to.equal(0);
      expect(view.get('controller.paginationProps').findProperty('name', 'displayLength').value).to.equal('50');
    });
    it('startIndex is correct', function() {
      view.set('displayLength', null);
      view.set('startIndex', 10);

      view.updatePagination();

      expect(view.refresh.calledOnce).to.be.true;
      expect(App.db.setStartIndex.calledWith('mainConfigHistoryController', 10)).to.be.true;
      expect(App.db.setDisplayLength.called).to.be.false;
      expect(view.get('controller.paginationProps').findProperty('name', 'startIndex').value).to.equal(10);
      expect(view.get('controller.paginationProps').findProperty('name', 'displayLength').value).to.equal('50');
    });
    it('displayLength and startIndex are correct', function() {
      view.set('displayLength', '100');
      view.set('startIndex', 20);

      view.updatePagination();

      expect(view.refresh.calledOnce).to.be.true;
      expect(App.db.setStartIndex.calledWith('mainConfigHistoryController', 20)).to.be.true;
      expect(App.db.setDisplayLength.calledWith('mainConfigHistoryController', '100')).to.be.true;
      expect(view.get('controller.paginationProps').findProperty('name', 'startIndex').value).to.equal(20);
      expect(view.get('controller.paginationProps').findProperty('name', 'displayLength').value).to.equal('100');
    });
    it('displayLength and startIndex are null', function() {
      view.set('displayLength', null);
      view.set('startIndex', null);

      view.updatePagination();

      expect(view.refresh.calledOnce).to.be.true;
      expect(App.db.setStartIndex.called).to.be.false;
      expect(App.db.setDisplayLength.called).to.be.false;
      expect(view.get('controller.paginationProps').findProperty('name', 'startIndex').value).to.equal(20);
      expect(view.get('controller.paginationProps').findProperty('name', 'displayLength').value).to.equal('100');
    });
  });

  describe('#updateFilter()', function() {
    beforeEach(function () {
      sinon.stub(view, 'saveFilterConditions', Em.K);
      sinon.stub(view, 'refresh', Em.K);
      sinon.spy(view, 'updateFilter');
    });
    afterEach(function () {
      view.saveFilterConditions.restore();
      view.updateFilter.restore();
      view.refresh.restore();
    });
    it('filteringComplete is false', function() {
      this.clock = sinon.useFakeTimers();

      view.set('filteringComplete', false);
      view.updateFilter(1, '', 'string');
      expect(view.get('controller.resetStartIndex')).to.be.false;
      expect(view.saveFilterConditions.calledWith(1, '', 'string', false)).to.be.true;
      view.set('filteringComplete', true);
      this.clock.tick(view.get('filterWaitingTime'));
      expect(view.updateFilter.calledWith(1, '', 'string')).to.be.true;
      this.clock.restore();
    });
    it('filteringComplete is true', function() {
      view.set('filteringComplete', true);

      view.updateFilter(1, '', 'string');
      expect(view.get('controller.resetStartIndex')).to.be.true;
      expect(view.refresh.calledOnce).to.be.true;
    });
  });

  describe('#resetStartIndex()', function() {
    it('resetStartIndex is false and filteredCount is 0', function() {
      view.set('filteredCount', 0);
      view.set('controller.resetStartIndex', false);
      view.set('startIndex', 0);
      view.resetStartIndex();
      expect(view.get('startIndex')).to.equal(0);
    });
    it('resetStartIndex is true and filteredCount is 0', function() {
      view.set('filteredCount', 0);
      view.set('controller.resetStartIndex', true);
      view.set('startIndex', 0);
      view.resetStartIndex();
      expect(view.get('startIndex')).to.equal(0);
    });
    it('resetStartIndex is false and filteredCount is 5', function() {
      view.set('filteredCount', 5);
      view.set('controller.resetStartIndex', false);
      view.set('startIndex', 0);
      view.resetStartIndex();
      expect(view.get('startIndex')).to.equal(0);
    });
    it('resetStartIndex is true and filteredCount is 5', function() {
      view.set('controller.resetStartIndex', true);
      view.set('filteredCount', 5);
      view.set('startIndex', 0);
      view.resetStartIndex();
      expect(view.get('startIndex')).to.equal(1);
    });
  });
});
