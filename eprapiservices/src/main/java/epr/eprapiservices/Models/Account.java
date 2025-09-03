package epr.eprapiservices.Models;

import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
@Table(name="Account")
public class Account extends BaseModel {

	
	  @Id	
	  @Column(name = "AccountId") 
	  private long AccountId;
	  @Column(name = "AccountName") 
	  private String AccountName;
	  
	  public long getAccountId() {
		  return AccountId;
	  }
	  public void setAccountId(long accountId) {
		  AccountId = accountId;
	  }
	  public String getAccountName() {
		  return AccountName;
	  }
	  public void setAccountName(String accountName) {
		  AccountName = accountName;
	  }
	  
	  
	
	
}
