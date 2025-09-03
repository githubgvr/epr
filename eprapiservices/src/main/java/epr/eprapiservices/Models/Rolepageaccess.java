
package epr.eprapiservices.Models;

import jakarta.persistence.*;


@Entity
@Table(name = "Rolepageaccess")
public class Rolepageaccess extends BaseModel {

    @Id
    @Column(name = "Rolepageaccess_Id")
    private Integer rolepageaccessId;

    @Column(name = "Role_Id")
    private Integer roleId;

    @Column(name = "Page_Id")
    private Integer pageId;

    @Column(name = "Can_view")
    private Boolean canView;

    @Column(name = "Can_edit")
    private Boolean canEdit;

   

    // Getters and Setters
}
