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

App.RMHighAvailabilityWizardStep4View = App.HighAvailabilityProgressPageView.extend({

  templateName: require('templates/main/admin/highAvailability/resourceManager/step4'),

  headerTitle: Em.I18n.t('admin.rm_highAvailability.wizard.step4.header'),

  noticeInProgress: Em.I18n.t('admin.rm_highAvailability.wizard.step4.notice.inProgress'),

  noticeCompleted: Em.I18n.t('admin.rm_highAvailability.wizard.step4.notice.completed'),

  submitButtonText: Em.I18n.t('common.complete')

});
