package epr.eprapiservices.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epr.eprapiservices.Models.*;
import epr.eprapiservices.Services.*;

@RestController
@RequestMapping("/api/industry")
public class IndustryController {
	
	  private final IndustryService service;
	  
	  public IndustryController(IndustryService service) {
	        this.service = service;
	    }

	  @GetMapping
	  public List<Industry> getAll() {
	    return this.service.getAll();
	  }
	  @GetMapping("/{id}")
	    public ResponseEntity<Industry> getIndustry(@PathVariable Integer id) {
		  Industry industry = this.service.getIndustryById(id);
	        return industry != null ? ResponseEntity.ok(industry) : ResponseEntity.notFound().build();
	    }

	    @PostMapping
	    public Industry createIndustry(@RequestBody Industry industry) {
	        return this.service.create(industry);
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<Industry> updateIndustry(@PathVariable Integer id, @RequestBody Industry details) {
	    	Industry updated = this.service.update(id, details);
	        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteIndustry(@PathVariable Integer id) {
	        this.service.delete(id);
	        return ResponseEntity.noContent().build();
	    }
	  
}
