// Register `phoneList` component, along with its associated controller and template

angular.
    module('shop.header').
    component('headerView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/header/header.view.html",
        controller: function HeaderController() {
            
        }
    });
