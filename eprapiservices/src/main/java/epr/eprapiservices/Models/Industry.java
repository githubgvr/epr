package epr.eprapiservices.Models;

import jakarta.persistence.*;


@Entity
@Table(name = "Industry", schema = "dbo")
public class Industry extends BaseModel {

    @Id
    @Column(name = "IndustryId", nullable = false)
    private Integer industryId;

    @Column(name = "IndustryName", length = 50)
    private String industryName;

   

    // Getters and Setters

    public Integer getIndustryId() {
        return industryId;
    }

    public void setIndustryId(Integer industryId) {
        this.industryId = industryId;
    }

    public String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(String industryName) {
        this.industryName = industryName;
    }

    
}
