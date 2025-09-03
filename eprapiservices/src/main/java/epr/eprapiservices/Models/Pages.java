
package epr.eprapiservices.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "Pages")
public class Pages extends BaseModel {

    @Id
    @Column(name = "Page_Id")
    private Integer pageId;

    @Column(name = "Module_Id")
    private Integer moduleId;

    @Column(name = "Page_Name", nullable = false, length = 100)
    private String pageName;

    @Column(name = "Url_Path", length = 255)
    private String urlPath;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    

    // Getters and Setters
    
	public Integer getPageId() {
		return pageId;
	}

	public void setPageId(Integer pageId) {
		this.pageId = pageId;
	}

	public Integer getModuleId() {
		return moduleId;
	}

	public void setModuleId(Integer moduleId) {
		this.moduleId = moduleId;
	}

	public String getPageName() {
		return pageName;
	}

	public void setPageName(String pageName) {
		this.pageName = pageName;
	}

	public String getUrlPath() {
		return urlPath;
	}

	public void setUrlPath(String urlPath) {
		this.urlPath = urlPath;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
}
