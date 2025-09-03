package epr.eprapiservices.Models;

import jakarta.persistence.Table;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
@Table(name = "Organization")
public class Organization extends BaseModel {

    @Id   
    @Column(name = "Org_Id")
    private Integer orgId;

    @Column(name = "Org_Name", length = 50)
    private String orgName;

    @Column(name = "Org_TypeId")
    private Integer orgTypeId;

	public Integer getOrgId() {
		return orgId;
	}

	public void setOrgId(Integer orgId) {
		this.orgId = orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public Integer getOrgTypeId() {
		return orgTypeId;
	}

	public void setOrgTypeId(Integer orgTypeId) {
		this.orgTypeId = orgTypeId;
	}
  
}
