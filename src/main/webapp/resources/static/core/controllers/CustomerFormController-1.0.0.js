/**
 * 
 */
app.controller('CustomerFormController', ['$routeParams', 'CustomerService', 'AddressService', 'StateService', 'TelephoneService',
                                          function($routeParams, CustomerService, AddressService, StateService, TelephoneService) {
	
	var self = this;
	 
	var init = function() {
		if($routeParams.id > 0) {
			// Busca cliente por id
			CustomerService.get($routeParams.id).then(function(resp) {
				self.customer = resp.data;
				return resp;
			}).then(function(respCustomer) {
				// pega endereco por cliente
				AddressService.getListByPeople(respCustomer.data).then(function(resp) {
					self.addresses = resp.data;
				}, function(error) {
					alert(JSON.stringify(error));
				});
				return respCustomer;
			}).then(function(respCustomer) {
				// pega tel por cliente
				TelephoneService.getListByPeople(respCustomer.data).then(function(resp) {
					self.phones = resp.data;
				}, function(error) {
					alert(JSON.stringify(error));
				});				
			}, function(error) {
				alert(JSON.stringify(error)); 
			});
		} else {
			self.customer = {}; 
			self.customer.id = 0;
		}
		// Busca ufs
		StateService.getAll().then(function(resp) {
			self.states = resp.data;
		}, function(error) {
			alert(JSON.stringify(error));
		});
		
	};
	
	/**
	 * Salvar Cliente
	 */ 
	self.save = function(customer) {
		console.log(customer);
		CustomerService.saveParams(customer).then(function(resp) {
			self.customer = resp.data;
		}, function(error) {
			alert(JSON.stringify(error));
		});
	};
	
	/**
	 * Show Modal Address
	 */
	self.showAddressModal = function(address) {
		if(address == null || address == undefined) {
			self.address = {};
			self.address.id = 0;
		} else {
			self.address = address;
			for(var i = 0; i <= self.states.length-1; i++) {
				if(self.states[i].id == self.address.state.id) {
					self.address.state = self.states[i];
					break;
				}
			}
		}
		$('#idAddressModal').modal('show');
	};
	
	/**
	 * Salvar Cliente
	 */ 
	self.saveAddress = function(address) {
		address.people = {};
		address.people.id = self.customer.id;
		
		// Salvar endereco
		AddressService.saveParams(address).then(function(resp) {
			$('#idAddressModal').modal('hide');
			return resp;
		}).then(function(respAddress) {
			// Apos salvar endereco recarrega a lista dos mesmos
			AddressService.getListByPeople(respAddress.data.people).then(function(resp) {
				self.addresses = resp.data;
			}, function(error) {
				alert(JSON.stringify(error));
			});
		}, function(error) {
			alert(JSON.stringify(error));
		});
	};	
	
	/**
	 * Show Modal Address
	 */
	self.showPhoneModal = function(phone) {
		if(phone == null || phone == undefined) {
			self.phone = {};
			self.phone.id = 0;
		} else {
			self.phone = phone;
		}
		$('#idPhoneModal').modal('show');
	};	
	
	/**
	 * Salvar Tel
	 */ 
	self.savePhone = function(phone) {
		phone.people = {};
		phone.people.id = self.customer.id;
		
		// Salvar endereco
		TelephoneService.saveParams(phone).then(function(resp) {
			$('#idPhoneModal').modal('hide');
			return resp;
		}).then(function(respPhone) {
			// Apos salvar endereco recarrega a lista dos mesmos
			TelephoneService.getListByPeople(respPhone.data.people).then(function(resp) {
				self.phones = resp.data;
			}, function(error) {
				alert(JSON.stringify(error));
			});
		}, function(error) {
			alert(JSON.stringify(error));
		});
	};		
	
	init();
	
}]);