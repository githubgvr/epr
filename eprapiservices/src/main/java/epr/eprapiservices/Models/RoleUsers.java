
package epr.eprapiservices.Models;

import jakarta.persistence.*;


@Entity
@Table(name = "Roleusers")
public class RoleUsers extends BaseModel {

    @Id
    @Column(name = "userrole_id")
    private Integer userroleId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "role_id")
    private Integer roleId;

    // Getters and Setters
	public Integer getUserroleId() {
		return userroleId;
	}

	public void setUserroleId(Integer userroleId) {
		this.userroleId = userroleId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}



   
    
}
