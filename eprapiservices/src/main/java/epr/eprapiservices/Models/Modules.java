package epr.eprapiservices.Models;

import jakarta.persistence.*;


@Entity
@Table(name = "Modules", schema = "dbo")
public class Modules extends BaseModel {

	// Primary Key

	@Id
    @Column(name = "Module_Id")
    private int moduleId;

    @Column(name = "Module_Name", nullable = false, length = 100)
    private String moduleName;

    @Column(name = "Parentmodule_Id", nullable = true)
    private Integer parentmoduleId;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

  
    // Getters and Setters
    public int getModuleId() {
		return moduleId;
	}

	public void setModuleId(int moduleId) {
		this.moduleId = moduleId;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public Integer getParentmoduleId() {
		return parentmoduleId;
	}

	public void setParentmoduleId(Integer parentmoduleId) {
		this.parentmoduleId = parentmoduleId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	
}
