// Create a service for managing company accounts for findall, find byid, create, update, delete
package epr.eprapiservices.Services;

import org.springframework.stereotype.Service;
import epr.eprapiservices.Models.CompanyAccounts;

import epr.eprapiservices.dao.repository.CompanyaccountsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
@Service
public class CompanyAccountsService {

	@Autowired
	private CompanyaccountsRepository companyAccountsRepository;

	public CompanyAccountsService(CompanyaccountsRepository companyAccountsRepository) {
		this.companyAccountsRepository = companyAccountsRepository;
	}

	public List<CompanyAccounts> getAllCompanyAccounts() {
		return companyAccountsRepository.findAll();
	}

	public Optional<CompanyAccounts> getCompanyAccountById(Integer companyAccountsId) {
		return companyAccountsRepository.findById(companyAccountsId);
	}

	public CompanyAccounts create(CompanyAccounts account) {
		return companyAccountsRepository.save(account);
	}

	public CompanyAccounts update(Integer companyAccountsId, CompanyAccounts accountDetails) {
		CompanyAccounts existingAccount = companyAccountsRepository.findById(companyAccountsId).orElse(null);
		if (existingAccount != null) {
			existingAccount.setCompanyprofileId(accountDetails.getCompanyprofileId());
			existingAccount.setAccountId(accountDetails.getAccountId());
			existingAccount.setIsActive(accountDetails.getIsActive());
			return companyAccountsRepository.save(existingAccount);
		}
		return null;
	}

	public void delete(Integer companyAccountsId) {
		companyAccountsRepository.deleteById(companyAccountsId);
	}
}
