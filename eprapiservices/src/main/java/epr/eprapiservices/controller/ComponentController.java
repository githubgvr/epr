package epr.eprapiservices.controller;

import epr.eprapiservices.entity.Component;
import epr.eprapiservices.service.ComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/components")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class ComponentController {

    @Autowired
    private ComponentService componentService;

    @GetMapping
    public ResponseEntity<List<Component>> getAllComponents(@RequestParam(required = false) Boolean active) {
        List<Component> components;
        if (active != null && active) {
            components = componentService.getActiveComponents();
        } else {
            components = componentService.getAllComponents();
        }
        return ResponseEntity.ok(components);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Component> getComponentById(@PathVariable Long id) {
        Component component = componentService.getComponentById(id);
        return ResponseEntity.ok(component);
    }

    @PostMapping
    public ResponseEntity<Component> createComponent(@RequestBody Component component) {
        Component createdComponent = componentService.createComponent(component);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComponent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Component> updateComponent(@PathVariable Long id, @RequestBody Component componentDetails) {
        Component updatedComponent = componentService.updateComponent(id, componentDetails);
        return ResponseEntity.ok(updatedComponent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComponent(@PathVariable Long id) {
        componentService.deleteComponent(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/inactive")
    public ResponseEntity<Component> markAsInactive(@PathVariable Long id) {
        Component component = componentService.markAsInactive(id);
        return ResponseEntity.ok(component);
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<Component> markAsActive(@PathVariable Long id) {
        Component component = componentService.markAsActive(id);
        return ResponseEntity.ok(component);
    }
}

