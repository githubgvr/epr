package epr.eprapiservices.Models;

import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
@Table(name = "Orgtype", schema = "dbo")
public class OrgType extends BaseModel {

    @Id    
    @Column(name = "Orgtype_Id")
    private Integer orgTypeId;

    @Column(name = "Orgtype_Name", length = 50)
    private String orgTypeName;
/*
    @Column(name = "Created_By")
    private Integer createdBy;

    @Column(name = "Updated_By")
    private Integer updatedBy;

    @Column(name = "Created_Date")
    private LocalDateTime createdDate;

    @Column(name = "Updated_Date")
    private LocalDateTime updatedDate;

    @Column(name = "Is_Active")
    private Boolean isActive;
*/
    // Getters and Setters

    public Integer getOrgTypeId() {
        return orgTypeId;
    }

    public void setOrgTypeId(Integer orgTypeId) {
        this.orgTypeId = orgTypeId;
    }

    public String getOrgTypeName() {
        return orgTypeName;
    }

    public void setOrgTypeName(String orgTypeName) {
        this.orgTypeName = orgTypeName;
    }

    /*
    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Integer getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Integer updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    */
}
