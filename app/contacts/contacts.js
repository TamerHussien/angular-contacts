'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

.controller('ContactsCtrl', ['$scope','$firebaseArray', function($scope, $firebaseArray) {
	var ref = new Firebase('https://zennerscontacts.firebaseio.com/contacts')

	$scope.contacts = $firebaseArray(ref)

	$scope.contact = {
		name: '',
		email: '',
		company: '',
		mobile_phone: '',
		home_phone: '',
		work_phone: '',
		street_address: '',
		city: '',
		state: '',
		zipcode: ''
	}

	$scope.editContact = {
		name: '',
		email: '',
		company: '',
		mobile_phone: '',
		home_phone: '',
		work_phone: '',
		street_address: '',
		city: '',
		state: '',
		zipcode: ''
	}

	$scope.showAddForm = function(){
		
			$scope.addFormShow = true
			clearFields($scope.contact)
			
	}
	$scope.showEditForm = function(contact){
		
			$scope.editFormShow = true;

			$scope.editContact.id = contact.$id
			$scope.editContact.name = contact.name
			$scope.editContact.company = contact.company
			$scope.editContact.email = contact.email
			$scope.editContact.work_phone = contact.phones[0].work
			$scope.editContact.home_phone = contact.phones[0].home
			$scope.editContact.mobile_phone = contact.phones[0].mobile
			$scope.editContact.street_address = contact.address[0].street_address
			$scope.editContact.city = contact.address[0].city
			$scope.editContact.state = contact.address[0].state
			$scope.editContact.zipcode = contact.address[0].zipcode
		
		
	}
	$scope.showContact = function(contact){
		$scope.name = contact.name
		$scope.company = contact.company
		$scope.email = contact.email
		$scope.work_phone = contact.phones[0].work
		$scope.home_phone = contact.phones[0].home
		$scope.mobile_phone = contact.phones[0].mobile
		$scope.street_address = contact.address[0].street_address
		$scope.city = contact.address[0].city
		$scope.state = contact.address[0].state
		$scope.zipcode = contact.address[0].zipcode

		$scope.contactShow = true;
	}
	$scope.hide = function(){
		$scope.addFormShow = false;
		$scope.contactShow = false;
		$scope.editFormShow = false;
	}

	$scope.addFormSubmit = function(){
		console.log('adding')
		$scope.contacts.$add({
			name: $scope.contact.name,
			email: $scope.contact.email,
			company: $scope.contact.company,
			phones:[
				{
					mobile: $scope.contact.mobile_phone,
					home: $scope.contact.home_phone,
					work: $scope.contact.work_phone
				}
			],
			address: [
				{
					street_address: $scope.contact.street_address,
					city: $scope.contact.city,
					state: $scope.contact.state,
					zipcode: $scope.contact.zipcode
				}
			]
		}).then(function(ref){
			var id = ref.key();
			console.log('Added Contact with ID: '+id);

			// Clear Form
			clearFields($scope.contact);
			// Hide Form
			$scope.addFormShow = false;
			// Send Message
			$scope.msg = "Contact Added";
		});
	}

	$scope.editFormSubmit = function(){
		console.log('updating contact')

		var id = $scope.editContact.id;

		var record = $scope.contacts.$getRecord(id);

		record.name = $scope.editContact.name
		record.company = $scope.editContact.company
		record.email = $scope.editContact.email
		record.phones[0].work = $scope.editContact.work_phone
		record.phones[0].home = $scope.editContact.home_phone
		record.phones[0].mobile = $scope.editContact.mobile_phone
		record.address[0].street_address = $scope.editContact.street_address
		record.address[0].city = $scope.editContact.city
		record.address[0].state = $scope.editContact.state
		record.address[0].zipcode = $scope.editContact.zipcode

		console.log(record)


		$scope.contacts.$save(record).then(function(ref){
			console.log(ref.key)
		})

		clearFields($scope.contact);
		$scope.editFormShow = false;
		$scope.msg = "Updated Contact";
	}

	$scope.removeContact = function(contact){
		$scope.contacts.$remove(contact)
		$scope.msg = 'Successfully removed contact'
	}

	function clearFields(obj){
		for(var p in obj)
			if(obj.hasOwnProperty(p))
				obj[p] = '';
	}
}]);