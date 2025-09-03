
package epr.eprapiservices.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role extends BaseModel {
    @Id    
    @Column(name = "role_id")
    private Long roleid;

    @Column(name = "role_name")
    private String roleName;    
    @Column(name = "Account_id")
    private int accountid;
    @Column(name = "description")
    private String roleDescription;
    
   
	public Long getRoleid() { return roleid; }
	public void setRoleid(Long roleid) { this.roleid = roleid; }
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    public int getAccountid() { return accountid; }
    public void setAccountid(int accountid) { this.accountid = accountid;}

	public String getRoleDescription() {
		return roleDescription;
	}
	public void setRoleDescription(String roleDescription) {
		this.roleDescription = roleDescription;
	}
}
