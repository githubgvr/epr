package epr.eprapiservices.controller;
//create a controller for the modules

import epr.eprapiservices.Models.Modules;
import epr.eprapiservices.dao.repository.ModulesRepository;
import epr.eprapiservices.Services.ModulesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/modules")
public class ModulesController {

	private final ModulesService service;

	@Autowired
	public ModulesController(ModulesService service) {
		this.service = service;
	}

	@GetMapping
	public List<Modules> getAllModules() {
		return service.getAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Modules> getModule(@PathVariable Long id) {
		Modules module = service.getModuleById(id);
		return module != null ? ResponseEntity.ok(module) : ResponseEntity.notFound().build();
	}

	@PostMapping
	public Modules createModule(@RequestBody Modules module) {
		return service.create(module);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Modules> updateModule(@PathVariable Long id, @RequestBody Modules moduleDetails) {
		Modules updated = service.update(id, moduleDetails);
		return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}

