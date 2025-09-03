
package epr.eprapiservices.Services;

import epr.eprapiservices.Models.Role;
import epr.eprapiservices.dao.repository.RoleRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoleService {
    private final RoleRepository repo;
    public RoleService(RoleRepository _repo) { this.repo = _repo; }
    public List<Role> getAll() { return repo.findAll(); }
    public Role getById(Long id) { return repo.findById(id).orElse(null); }
    public Role create(Role role) { return repo.save(role); }
    public Role update(Long id, Role details) {
        Role r = getById(id);
        if (r == null) return null;
        r.setRoleName(details.getRoleName());
        r.setAccountid(details.getAccountid());
        r.setIsActive(details.getIsActive());
        return repo.save(r);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
