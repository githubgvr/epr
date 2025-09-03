
package epr.eprapiservices.Models;


import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
@Table(name = "Companyprofile")

public class CompanyProfile extends BaseModel    
{
	@Id
    @Column(name = "Companyprofile_Id")
    private Integer companyprofileId;

    @Column(name = "Company_Name", length = 100)
    private String companyName;

    @Column(name = "Company_Registeredname", length = 50)
    private String companyRegisteredname;

    @Column(name = "Registered_Id", length = 50)
    private String registeredId;

    @Column(name = "Industry_Id")
    private Integer industryId;

    @Column(name = "Companyprofile_Details", columnDefinition = "varchar(max)")
    private String companyprofileDetails;

    @Column(name = "Org_Id")
    private Integer orgId;

   
    // Getters and Setters

    public Integer getCompanyprofileId() {
        return companyprofileId;
    }

    public void setCompanyprofileId(Integer companyprofileId) {
        this.companyprofileId = companyprofileId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyRegisteredname() {
        return companyRegisteredname;
    }

    public void setCompanyRegisteredname(String companyRegisteredname) {
        this.companyRegisteredname = companyRegisteredname;
    }

    public String getRegisteredId() {
        return registeredId;
    }

    public void setRegisteredId(String registeredId) {
        this.registeredId = registeredId;
    }

    public Integer getIndustryId() {
        return industryId;
    }

    public void setIndustryId(Integer industryId) {
        this.industryId = industryId;
    }

    public String getCompanyprofileDetails() {
        return companyprofileDetails;
    }

    public void setCompanyprofileDetails(String companyprofileDetails) {
        this.companyprofileDetails = companyprofileDetails;
    }

    public Integer getOrgId() {
        return orgId;
    }

    public void setOrgId(Integer orgId) {
        this.orgId = orgId;
    }

}

