app.service('$$helper', ['$tm1Ui', '$location', function($tm1Ui, $location) {
    this.updateSettings = function (values, defaults, selections, urlParameter, sysParameter, sysParameterValue) {

    //Get user settings value from Settings cube

        $tm1Ui.cellGet(defaults.instance, defaults.sysInfoCube, sysParameter, defaults.sysInfoMeasure).then(function (data) {
            var tm1Value = data.Value;
            var urlValue = $location.search()[urlParameter];
            var newValue = undefined;
            
            //Determine the new value (SUBNM, URL or TM1)
            if(sysParameterValue.value){

                //if the value is coming from SUBNM
                newValue = sysParameterValue.value;

            }else{
                //if the value is coming from URL
                if (urlValue && urlValue != tm1Value) {
                    newValue = urlValue;
                }else{
                    newValue = tm1Value;
                }
            }

            console.log ('sysParameterValue:', sysParameterValue.value);

            //Set defaults variable
            defaults[urlParameter] = newValue;

            //Set selections variable (if tm1Alias = tm1Alias else newValue)
            if(sysParameterValue.tm1Alias){

                //Get Description alias for selections.version
                $tm1Ui.attributeGet(defaults.instance, sysParameterValue.tm1Dimension, newValue, sysParameterValue.tm1Alias).then(function (data) {
                    var aliasValue = undefined;

                    if(data.Value){
                        aliasValue = data.Value;

                    }else{
                        aliasValue = newValue;
                    }
                    selections[urlParameter] = aliasValue;
                });
            }else{
                selections[urlParameter] = newValue;
            }

            //Update the URL
            $location.search([urlParameter], newValue);

        });
    }
}]);