
package epr.eprapiservices.controller;

import epr.eprapiservices.Models.Role;
import epr.eprapiservices.Services.RoleService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/role")
public class RoleController {
    private final RoleService service;
    public RoleController(RoleService _service) { this.service = _service; }

    @GetMapping
    public List<Role> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Role> get(@PathVariable Long id) {
        Role r = service.getById(id);
        return r != null ? ResponseEntity.ok(r) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Role create(@RequestBody Role role) { return service.create(role); }

    @PutMapping("/{id}")
    public ResponseEntity<Role> update(@PathVariable Long id, @RequestBody Role details) {
        Role updated = service.update(id, details);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
