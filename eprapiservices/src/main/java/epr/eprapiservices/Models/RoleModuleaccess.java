
package epr.eprapiservices.Models;

import jakarta.persistence.*;


@Entity
@Table(name = "RoleModuleaccess")
public class RoleModuleaccess extends BaseModel {

    @Id
    @Column(name = "Rolemoduleaccess_Id")
    private Integer rolemoduleaccessId;

    @Column(name = "Role_Id")
    private Integer roleId;

    @Column(name = "Module_Id")
    private Integer moduleId;

    @Column(name = "Can_view")
    private Boolean canView;

    @Column(name = "Can_edit")
    private Boolean canEdit;

   

	public Integer getRolemoduleaccessId() {
		return rolemoduleaccessId;
	}

	public void setRolemoduleaccessId(Integer rolemoduleaccessId) {
		this.rolemoduleaccessId = rolemoduleaccessId;
	}

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public Integer getModuleId() {
		return moduleId;
	}

	public void setModuleId(Integer moduleId) {
		this.moduleId = moduleId;
	}

	public Boolean getCanView() {
		return canView;
	}

	public void setCanView(Boolean canView) {
		this.canView = canView;
	}

	public Boolean getCanEdit() {
		return canEdit;
	}

	public void setCanEdit(Boolean canEdit) {
		this.canEdit = canEdit;
	}

	
    // Getters and Setters


}
