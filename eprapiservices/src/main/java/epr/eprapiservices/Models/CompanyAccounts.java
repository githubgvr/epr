
package epr.eprapiservices.Models;

import jakarta.persistence.*;


@Entity
@Table(name = "Companyaccounts")
public class CompanyAccounts extends BaseModel {

    @Id
    @Column(name = "Companyaccounts_Id")
    private Integer companyaccountsId;

    @Column(name = "Companyprofile_Id", nullable = false)
    private Integer companyprofileId;

    @Column(name = "Account_Id", nullable = false)
    private Integer accountId;

    
    // Getters and Setters
	public Integer getCompanyaccountsId() {
		return companyaccountsId;
	}

	public void setCompanyaccountsId(Integer companyaccountsId) {
		this.companyaccountsId = companyaccountsId;
	}

	public Integer getCompanyprofileId() {
		return companyprofileId;
	}

	public void setCompanyprofileId(Integer companyprofileId) {
		this.companyprofileId = companyprofileId;
	}

	public Integer getAccountId() {
		return accountId;
	}

	public void setAccountId(Integer accountId) {
		this.accountId = accountId;
	}


    
}
