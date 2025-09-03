package epr.eprapiservices.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epr.eprapiservices.Models.Account;
import epr.eprapiservices.Services.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
	
	  private final AccountService service;
	  
	  public AccountController(AccountService service) {
	        this.service = service;
	    }

	  @GetMapping
	  public List<Account> getAllAccounts() {
	    return service.getAllAccounts();
	  }
	  @GetMapping("/{id}")
	    public ResponseEntity<Account> getAccount(@PathVariable Integer id) {
	        Account Account = service.getAccountById(id);
	        return Account != null ? ResponseEntity.ok(Account) : ResponseEntity.notFound().build();
	    }

	    @PostMapping
	    public Account createAccount(@RequestBody Account Account) {
	        return service.createAccount(Account);
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<Account> updateAccount(@PathVariable Integer id, @RequestBody Account AccountDetails) {
	        Account updated = service.updateAccount(id, AccountDetails);
	        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteAccount(@PathVariable Integer id) {
	        service.deleteAccount(id);
	        return ResponseEntity.noContent().build();
	    }
	  
}
