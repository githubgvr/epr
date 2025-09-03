
package epr.eprapiservices.Services;

import epr.eprapiservices.Models.*;
import epr.eprapiservices.dao.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleUsersService {

    private RoleusersRepository repository = null;

    @Autowired
    public RoleUsersService(RoleusersRepository _repository) {
        this.repository = _repository;
    }

    public List<RoleUsers> findAll() {
        return repository.findAll();
    }

    public Optional<RoleUsers> findById(Integer id) {
        return repository.findById(id);
    }

    public RoleUsers create(RoleUsers entity) {
        return repository.save(entity);
    }

    public Optional<RoleUsers> update(Integer id, RoleUsers entity) {
        return repository.findById(id)
                .map(existing -> {
                    entity.setUserroleId(id);
                    return repository.save(entity);
                });
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
