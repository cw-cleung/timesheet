app.controller('timesheet_input_by_dayCtrl', ['$scope', '$rootScope', '$log', '$tm1Ui', '$location', '$$helper', '$filter',
  function ($scope, $rootScope, $log, $tm1Ui, $location, $$helper, $filter) {
    /*
     *     defaults.* are variables that are declared once and are changed in the page, otherwise known as constants in programming languages
     *     lists.* should be used to store any lists that are used with ng-repeat, i.e. tm1-ui-element-list
     *     selections.* should be used for all selections that are made by a user in the page
     *     values.* should store the result of any dbr, dbra or other values from server that you want to store to use elsewhere, i.e. in a calculation
     *
     *     For more information: https://github.com/cubewise-code/canvas-best-practice
     */

    $rootScope.defaults = {
      instance: 'dev',
      sysInfoCube: 'System Info',
      sysInfoMeasure: 'String',
      ratingMax: 16
    };
    $scope.selections = {
    };

    $scope.lists = {
      selectedProjects: [],
      measureCommon: [],
      measureAll: [],
      ratingTitle: []

    };
    $scope.values = {
      userName: [],
      hour: {}
    };

    $scope.oneAtATime = true;

    $scope.status = {
      isCustomHeaderOpen: false,
      isFirstOpen: true,
      isFirstDisabled: false,
      is1Open: false,
      is2Open: false,
      overIcon: {}
    };

    $scope.commentModal = {
      weekday: '',
      project: []
    };

    $scope.mytime = "1:00";

    //Initialize all variables
    $scope.initializeVariables = function () {

      $$helper.updateSettings($scope.values, $scope.defaults, $scope.selections, "Year", "Cur Year", { "tm1Dimension": "Year" });
      $$helper.updateSettings($scope.values, $scope.defaults, $scope.selections, "Week", "Cur Week", { "tm1Dimension": "Week" });

      $tm1Ui.dimensionElements($scope.defaults.instance, "M Timesheet"
        , { "subset": "Measure_Common", "attributes": "Type" }).then(function (list) {
          $scope.lists.measureCommon = list;
        });

      $tm1Ui.dimensionElements($scope.defaults.instance, "M Timesheet"
        , { "subset": "Measure_All", "attributes": "Type" }).then(function (list) {
          $scope.lists.measureAll = list;
        });

      $tm1Ui.applicationUser("dev").then(function (data) {
        var mdxString = '{FILTER({TM1FILTERBYLEVEL({TM1SUBSETALL([Project])},0)},[Timesheet User Setting Project].([Consultant].[' + data.Name + '],[M Timesheet User Setting Project].[Count Selected Project])>0)}';
        $scope.values.userName = data;
        $tm1Ui.dimensionElements($scope.defaults.instance, "Project"
          , { "mdx": mdxString, "attributes": "Description" }).then(function (list) {
            $scope.lists.selectedProjects = list;
          });
      });

      //for uib rating bar tooltips
      $scope.defaults.ratingTitle = _.range(8 / $scope.defaults.ratingMax, 9, 8 / $scope.defaults.ratingMax);

      //commentList from local storage
      if ($rootScope.uiPrefs.commentList) {
        $scope.values.comments = $rootScope.uiPrefs.commentList;
      } else {
        $scope.values.comments = [];
      }

    }

    $scope.updateSettings = function (values, defaults, selections, urlParameter, sysParameter, sysParameterValue) {
      $$helper.updateSettings(values, defaults, selections, urlParameter, sysParameter, sysParameterValue);
    }


    //Run Initialization
    $scope.initializeVariables();


    $scope.hoveringOver = function (project, measure, value) {
      value = value / ($scope.defaults.ratingMax / 8);

      var overIconObj = {};
      overIconObj[measure] = true;
      $scope.status.overIcon[project] = overIconObj;

      var measureObj = {};
      measureObj[measure] = value;
      $scope.values.hour[project] = measureObj;
    };

    $scope.hoveringOut = function (project, measure) {
      var overIconObj = {};
      overIconObj[measure] = false;
      $scope.status.overIcon[project] = overIconObj;
    };

    $scope.updateHour = function (weekday, project, measure, value) {
      value = value / ($scope.defaults.ratingMax / 8);
      $tm1Ui.cellPut(value, $scope.defaults.instance, 'Timesheet', 'Actual', $scope.selections.Year, $scope.selections.Week, weekday, project, $scope.values.userName.Name, 'Local', measure).then(function () {
        $tm1Ui.dataRefresh();
      });
    };

    $scope.showCommentModal = function (weekday, projectObj) {
      $scope.commentModal.weekday = weekday;
      $scope.commentModal.projectObj = projectObj;
    };

    $scope.closeCommentModal = function () {
      $tm1Ui.dataRefresh();
    }

    $scope.addComment = function (commentObj) {
      commentObj.weekday = $scope.commentModal.weekday;
      commentObj.project = $scope.commentModal.projectObj.Index;

      $scope.values.comments.push(commentObj);

      //reset $scope.comment, $scope.commentHour
      $scope.comment = '';
      $scope.commentHour = null;
    };

    $scope.deleteComment = function (commentObj) {
      commentObj.weekday = $scope.commentModal.weekday;
      commentObj.project = $scope.commentModal.projectObj.Index;

      var result = $filter('filter')($scope.values.comments, commentObj, true)[0];
      if (result) {
        var pos = $scope.values.comments.indexOf(result);
        $scope.values.comments.splice(pos, 1);
      }
    };

    $scope.submitComment = function () {
      var commentObj = {};
      var weekday = $scope.commentModal.weekday;
      var projectObj = $scope.commentModal.projectObj;
      var measure = 'Project Consulting Hours';

      var results = $filter('filter')($scope.values.comments, { weekday: weekday, project: projectObj.Index }, true);
      if (results) {
        var total = 0;
        var commentStr = '';
        for (var i = 0; i < results.length; i++) {
          total += parseInt(results[i].commentHour);
          commentStr += results[i].comment + '(' + parseInt(results[i].commentHour) + 'h) ';
        }
        // console.log('total: ', total, ' str: ', commentStr);

        $tm1Ui.cellPut(total, $scope.defaults.instance, 'Timesheet', 'Actual', $scope.selections.Year, $scope.selections.Week, weekday, projectObj.Name, $scope.values.userName.Name, 'Local', measure).then(function (data) {
          if (!data.success) {
            $log.error(data);
          }
        });
        $tm1Ui.cellPut(commentStr, $scope.defaults.instance, 'Timesheet', 'Actual', $scope.selections.Year, $scope.selections.Week, weekday, projectObj.Name, $scope.values.userName.Name, 'Local', 'Comment').then(function (data) {
          if (!data.success) {
            $log.error(data);
          }

          // TODO: handle promise
          $scope.showSuccess = true;
        });

      }
    };



    $scope.$watch("values.comments", function (newVal, oldVal) {
      $rootScope.uiPrefs.commentList = $scope.values.comments;
    }, true);

  }]);
