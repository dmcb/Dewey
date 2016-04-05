var controllers=angular.module("dewyControllers",[]);controllers.controller("accountController",["$scope","$timeout","$rootScope","userFactory",function(a,b,c,d){a.cancel=function(){window.history.back()},a.check=function(b,c,e){if(a[c][e].$valid){var f={};f[e]=a[e],d.checkAccount(b,f).success(function(b){"error"in a[c]||(a[c].error={}),a[c].error[e]=b.error})}},a.submitAccount=function(c){a.accountForm.$valid&&d.changeAccount(c,a.passwordExisting,a.email,a.password).success(function(c){a.accountSubmitMessage="Success",a.accountSubmitStatus="success",a.accountSubmit=!0,b(function(){a.accountSubmit=!1,a.accountSubmitStatus="submitting"},1500)}).error(function(b,c){"400"!=c?a.accountForm.error={error:"Dewy could not update your account at this time."}:a.accountForm.error=b})},a.submitProfile=function(c){a.profileForm.$valid&&d.changeProfile(c,a.username).success(function(c){a.profileSubmitMessage="Success",a.profileSubmitStatus="success",a.profileSubmit=!0,b(function(){a.profileSubmit=!1,a.profileSubmitStatus="submitting"},1500)}).error(function(b,c){"400"!=c?a.profileForm={error:"Dewy could not update your profile at this time."}:a.profileForm=b})},a.username==c.currentUser.username,a.email==c.currentUser.email}]),controllers.controller("appController",["$scope","$location","authService",function(a,b,c){a.signOff=function(){c.signOff()}}]),controllers.controller("filterController",["$scope","$location","filterFactory","operators","fields","filters","currentFilter","tags",function(a,b,c,d,e,f,g,h){a.addRule=function(b,c){function d(c){var f,g=c.rules;if(g)for(f=g.length;f--;){if(g[f]==b)return a.currentFilter.count++,g[f].rules?g[f].rules.splice(0,0,e):g.splice(f+1,0,e);d(g[f])}}var e;e=c?{operator:"any",rules:[{field:"Base URL",choice:"contains"}]}:{field:"Base URL",choice:"contains"},d(a.currentFilter)},a.cancel=function(){window.history.back()},a.deleteFilter=function(){c["delete"](a.currentFilter.fid).then(function(a){window.history.back()})},a.deleteRule=function(b){function c(d){var e,f=d.rules;if(f){if(e=f.length,!e)return"empty";for(;e--;){if(f[e]==b){var g=f.splice(e,1);if(g[0].rules)for(var h=g[0].rules.length;h--;)f.splice(e,0,g[0].rules[h]);else a.currentFilter.count--;if(!f.length)return"empty";return}"empty"==c(f[e])&&a.deleteRule(f[e])}}}c(a.currentFilter)},a.getChoices=function(b){for(var c=0;c<a.fields.length;c++)if(a.fields[c].title==b)return a.fields[c].choices},a.getDetails=function(b){for(var c=0;c<a.fields.length;c++)if(a.fields[c].title==b)return a.fields[c].details},a.saveFilter=function(){a.filterForm.$valid&&(a.currentFilter.fid?c.update(a.currentFilter).then(function(a){b.path("sites/"+a.data.fid)}):c.create(a.currentFilter).then(function(a){b.path("sites/"+a.data.fid)}))},a.updateChoice=function(b,c){choices=a.getChoices(b.field);var d=b.choice;b.choice=choices[0].id;for(var e=0;e<choices.length;e++)choices[e].id==d&&(b.choice=choices[e].id);details=a.getDetails(b.field),details&&-1==details.indexOf(b.choice)&&(b.detail=details[0]);for(var e=0;e<a.fields.length;e++)a.fields[e].title==b.field&&(field=a.fields[e]);for(var e=0;e<a.fields.length;e++)a.fields[e].title==c&&(oldField=a.fields[e]);field.value!=oldField.value&&("tag"==field.value?b.value=a.tags[0]:"integer"==field.value?b.value=0:b.value=null)},a.updateNotifications=function(b){b||(a.currentFilter.notifications.appears.enabled=a.currentFilter.notifications.disappears.enabled=a.currentFilter.notifications.total.enabled=!1)},a.valueIsType=function(b,c){for(var d=0;d<a.fields.length;d++)if(a.fields[d].title==b)return a.fields[d].value==c},a.operators=d,a.fields=e,a.filters=f,a.currentFilter=g,a.tags=h,a.notificationsOn=!!(g.notifications.appears.enabled||g.notifications.disappears.enabled||g.notifications.total.enabled),a.notificationChoices=["is","is not","is greater than","is less than","is greater than or equal to","is less than or equal to"],a.sortableOptions={connectWith:".rule-group",handle:".handle",helper:"clone",opacity:.75,placeholder:"rule-group-placeholder",stop:function(b,c){a.deleteRule(null)}}}]),controllers.controller("manageController",["$scope","$timeout","$moment","sites","user","sitesFactory","userFactory",function(a,b,c,d,e,f,g){a.auditSite=function(d){return a.sites[d].submitMessage="Auditing...",a.sites[d].submit=!0,f.audit(a.sites[d].sid).error(function(e,f){a.sites[d].submitMessage="Error: "+a.sites[d].audited.error,a.sites[d].submitStatus="error",b(function(){a.sites[d].submit=!1,a.sites[d].submitStatus="submitting"},1500),a.sites[d].audited.date=c().fromNow(),a.sites[d].audited.error=e.statusCode}).success(function(c){a.sites[d].submitMessage="Success",a.sites[d].submitStatus="success",b(function(){a.sites[d].submit=!1,a.sites[d].submitStatus="submitting";a.sites.splice(d,1)},1500)})},a.getKey=function(){a.apikey=e.apikey},a.deleteSite=function(b){f["delete"](a.sites[b].sid).success(function(c){a.sites.splice(b,1)})},a.resetKey=function(b){g.resetKey(b).then(function(b){a.apikey=b})},a.sites=d;for(site in a.sites)a.sites[site].dateAdded=c(1e3*a.sites[site].dateAdded).fromNow(),"audited"in a.sites[site]&&(a.sites[site].audited.date=c(1e3*a.sites[site].audited.date).fromNow());a.apikey=e.apikey}]),controllers.controller("signonController",["authService","$scope","$http",function(a,b,c){b.submit=function(){if(b.form.$valid){b.message=null;var d="http://dewy.io/auth/signon";c.post(d,{username:b.username,password:b.password}).success(function(c){a.signOn(c,b.remember)}).error(function(a,c){"400"==c?b.message="Your username and password combination is incorrect, please try again.":b.message="Dewy could not authenticate at this time."})}}}]),controllers.controller("signupController",["authService","$scope","$http",function(a,b,c){b.check=function(a){if(b.form[a].$valid){var d="http://dewy.io/auth/signup",e={};e[a]=b[a],e.check=!0,c.post(d,e).success(function(c){"error"in b||(b.error={}),b.error[a]=c})}},b.submit=function(){if(b.form.$valid){b.message=null;var d="http://dewy.io/auth/signup";c.post(d,{username:b.username,email:b.email,password:b.password}).success(function(b){a.signOn(b)}).error(function(a,c){"400"!=c?b.message="Dewy could not sign you up at this time.":b.error=a})}}}]),controllers.controller("overviewController",["$scope","$location","sitesFactory","filters","data",function(a,b,c,d,e){a.changeFilter=function(c){c?b.path(a.view+"/"+c):b.path(a.view)},a.openFolder=function(b){a.folders[b]=!a.folders[b],sessionStorage.folders=JSON.stringify(a.folders)},a.currentFilter=e.currentFilter,b.path()=="/"+e.view||"url"in a.currentFilter||b.path(e.view),a.view=e.view,"sites"==a.view?(a.sites=e.sites,a.viewPage="templates/overview_sites.html"):"modules"==a.view?(a.modules=e.modules,a.viewPage="templates/overview_modules.html"):"users"==a.view?a.viewPage="templates/overview_users.html":"content"==a.view&&(a.viewPage="templates/overview_content.html"),sessionStorage.folders?a.folders=JSON.parse(sessionStorage.folders):a.folders={},a.filters=d}]),controllers.controller("overviewContentController",["$scope",function(a){}]),controllers.controller("overviewModulesController",["$scope",function(a){a.changeSorting=function(b){var c=a.sort;c.column==b?c.descending=!c.descending:(c.column=b,c.descending=!1)},a.sort={column:"title",descending:!1}}]),controllers.controller("overviewSitesController",["$scope","sitesFactory",function(a,b){a.addTags=function(c){var d="tagForm"+c;if(this[d].$valid){for(a.openSite.tags||(a.openSite.tags=[]),tags=this.tags.split(","),i=0;i<tags.length;i++)tag=tags[i].trim(),""!=tag&&-1==a.openSite.tags.indexOf(tag)&&(a.openSite.tags.push(tag),console.log(a.openSite.tags));b.setTags(a.openSite),this.tags=null,this[d].$setPristine(),this[d].tags.$setUntouched()}},a.changeSorting=function(b){var c=a.sort;c.column==b?c.descending=!c.descending:(c.column=b,c.descending=!1)},a.deleteTag=function(c,d){a.sites[d].tags.splice(c,1),b.setTags(a.sites[d])},a.getNumber=function(a){return new Array(Math.round(a))},a.openDetails=function(c,d){a.openSite&&a.openSite.sid==a.sites[c].sid&&a.openSite.detail==d?a.openSite=null:"details"in a.sites[c]?a.openSite={sid:a.sites[c].sid,tags:a.sites[c].tags,details:a.sites[c].details,detail:d}:b.get(a.sites[c].sid).then(function(b){a.sites[c].details=b,a.openSite={sid:a.sites[c].sid,tags:a.sites[c].tags,details:a.sites[c].details,detail:d}})},a.sort={column:"title",descending:!1}}]),controllers.controller("overviewUsersController",["$scope",function(a){}]),controllers.controller("verifyController","user",["$scope","user",function(a){a.error=user}]);
//# sourceMappingURL=controllers.js.map