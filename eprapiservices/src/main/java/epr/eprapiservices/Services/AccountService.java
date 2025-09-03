package epr.eprapiservices.Services;

import java.util.List;
import epr.eprapiservices.Models.Account;
import epr.eprapiservices.dao.repository.AccountRepository;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

	  private final AccountRepository repository;
	  public AccountService(AccountRepository repository) {
	        this.repository = repository;
	    }

	    public List<Account> getAllAccounts() {
	        return repository.findAll();
	    }

	    public Account getAccountById(Integer id) {
	        return repository.findById(id).orElse(null);
	    }

	    public Account createAccount(Account Account) {
	        return repository.save(Account);
	    }

	    public Account updateAccount(Integer id, Account AccountDetails) {
	        Account Account = repository.findById(id).orElse(null);
	        if (Account != null) {
	            Account.setAccountName(AccountDetails.getAccountName());
	            Account.setIsActive(AccountDetails.getIsActive());
	            return repository.save(Account);
	        }
	        return null;
	    }

	    public void deleteAccount(Integer id) {
	        repository.deleteById(id);
	    }
}
