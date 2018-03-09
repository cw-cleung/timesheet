app.controller('timesheet_input_by_dayCtrl', ['$scope', '$rootScope', '$log', '$tm1Ui', '$location', '$$helper', 
        function($scope, $rootScope, $log, $tm1Ui, $location, $$helper) {
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
        };
    $scope.selections = {
        };

    $scope.lists = {
            selectedProjects: [],
            measureCommon: [],
            measureAll: []
            
        };
    $scope.values = {
        userName : []
    };

    //Initialize all variables
    $scope.initializeVariables = function(){

        $$helper.updateSettings($scope.values, $scope.defaults, $scope.selections, "Year", "Cur Year", {"tm1Dimension":"Year"});
        $$helper.updateSettings($scope.values, $scope.defaults, $scope.selections, "Week", "Cur Week", {"tm1Dimension":"Week"});

        $tm1Ui.dimensionElements($scope.defaults.instance, "M Timesheet"
                    , {"subset": "Measure_Common","attributes":"Type"}).then(function(list){
                $scope.lists.measureCommon = list;
                });

        $tm1Ui.dimensionElements($scope.defaults.instance, "M Timesheet"
                , {"subset": "Measure_All","attributes":"Type"}).then(function(list){
            $scope.lists.measureAll = list;
            });

        $tm1Ui.applicationUser("dev").then(function(data){
            var mdxString = '{FILTER({TM1FILTERBYLEVEL({TM1SUBSETALL([Project])},0)},[Timesheet User Setting Project].([Consultant].[' + data.Name + '],[M Timesheet User Setting Project].[Count Selected Project])>0)}';
            $scope.values.userName = data;
            $tm1Ui.dimensionElements($scope.defaults.instance, "Project"
                      , {"mdx": mdxString,"attributes":"Description"}).then(function(list){
                    $scope.lists.selectedProjects = list;
                    });
        });   
    }

    $scope.updateSettings = function (values, defaults, selections, urlParameter, sysParameter, sysParameterValue){
             $$helper.updateSettings(values, defaults, selections, urlParameter, sysParameter, sysParameterValue); 
         }


    //Run Initialization
    $scope.initializeVariables();

    console.log ('sysParameterValue:', $scope.lists.selectedProjects);


    $scope.hoveringOver = function(value) {
        $scope.overIcon = value;
        $scope.hour = (value / ($scope.max / 8));
      };



      $scope.oneAtATime = true;
    
      $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false,
        is1Open: false,
        is2Open: false
      };

      $scope.mytime = "1:00";
    
}]);