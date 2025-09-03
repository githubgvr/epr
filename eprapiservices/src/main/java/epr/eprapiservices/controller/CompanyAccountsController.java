//create a controller for CompanyAccounts
 package epr.eprapiservices.controller;

 import java.util.List;

 import org.springframework.web.bind.annotation.GetMapping;
 import org.springframework.web.bind.annotation.PathVariable;
 import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;

 import epr.eprapiservices.Models.*;
 import epr.eprapiservices.Services.*;

 import org.springframework.beans.factory.annotation.*;
 import org.springframework.http.ResponseEntity;
 import org.springframework.web.bind.annotation.*;

 @RestController
 @RequestMapping("/api/companyaccounts")
public class CompanyAccountsController {

		private final CompanyAccountsService companyAccountsService;

		@Autowired
		public CompanyAccountsController(CompanyAccountsService companyAccountsService) {
			this.companyAccountsService = companyAccountsService;
		}

		@GetMapping
		public List<CompanyAccounts> getAllCompanyAccounts() {
			return companyAccountsService.getAllCompanyAccounts();
		}

		@GetMapping("/{id}")
		public ResponseEntity<CompanyAccounts> getCompanyAccountById(@PathVariable Integer id) {
			return companyAccountsService.getCompanyAccountById(id).map(ResponseEntity::ok)
					.orElse(ResponseEntity.notFound().build());
		}

		@PostMapping
		public CompanyAccounts createCompanyAccount(@RequestBody CompanyAccounts account) {
			return companyAccountsService.create(account);
		}

		@PutMapping("/{id}")
		public ResponseEntity<CompanyAccounts> updateCompanyAccount(@PathVariable Integer id,
				@RequestBody CompanyAccounts accountDetails) {
			CompanyAccounts updatedAccount = companyAccountsService.update(id, accountDetails);
			return updatedAccount != null ? ResponseEntity.ok(updatedAccount) : ResponseEntity.notFound().build();
		}

		@DeleteMapping("/{id}")
		public ResponseEntity<Void> deleteCompanyAccount(@PathVariable Integer id) {
			companyAccountsService.delete(id);
			return ResponseEntity.noContent().build();
		}
	}
