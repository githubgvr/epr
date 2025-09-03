package epr.eprapiservices.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epr.eprapiservices.Models.*;
import epr.eprapiservices.Services.*;


@RestController
@RequestMapping("/api/orgtype")
public class OrgTypeController {
	
	  private final OrgTypeService service;
	  
	  public OrgTypeController(OrgTypeService _service) {
	        this.service = _service;
	    }

	  @GetMapping
	  public List<OrgType> getAllOrgTypes() {
	    return this.service.getAll();
	  }
	  @GetMapping("/{id}")
	    public ResponseEntity<OrgType> getAccount(@PathVariable Long id) {
		  OrgType orgType = service.getOrgTypeById(id);
	        return orgType != null ? ResponseEntity.ok(orgType) : ResponseEntity.notFound().build();
	    }

	    @PostMapping
	    public OrgType createAccount(@RequestBody OrgType orgType) {
	        return service.create(orgType);
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<OrgType> updateAccount(@PathVariable Long id, @RequestBody OrgType details) {
	    	OrgType updated = service.update(id, details);
	        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
	        service.delete(id);
	        return ResponseEntity.noContent().build();
	    }
	  
}
