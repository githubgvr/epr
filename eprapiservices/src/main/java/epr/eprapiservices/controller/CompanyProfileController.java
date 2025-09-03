
package epr.eprapiservices.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import epr.eprapiservices.Models.CompanyProfile;
import epr.eprapiservices.Services.CompanyProfileService;


@RestController
@RequestMapping("/api/companyprofile")
public class CompanyProfileController {

	private final CompanyProfileService service;

	public CompanyProfileController(CompanyProfileService _service) {
		this.service = _service;
	}

	@GetMapping
	public List<CompanyProfile> getAllCompanyProfiles() {
		return this.service.getAllCompanyProfiles();
	}

	@GetMapping("/{id}")
	public ResponseEntity<CompanyProfile> getCompanyProfile(@PathVariable Integer id) {
		CompanyProfile companyProfile = this.service.getCompanyProfileById(id).orElse(null);
		return companyProfile != null ? ResponseEntity.ok(companyProfile) : ResponseEntity.notFound().build();
	}

	@PostMapping
	public CompanyProfile createCompanyProfile(@RequestBody CompanyProfile companyProfile) {
		return service.create(companyProfile);
	}

	@PutMapping("/{id}")
	public ResponseEntity<CompanyProfile> updateCompanyProfile(@PathVariable Integer id,
			@RequestBody CompanyProfile details) {
		CompanyProfile updated = this.service.update(id, details);
		return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCompanyProfile(@PathVariable Integer id) {
		this.service.delete(id);
		return ResponseEntity.noContent().build();
	}
}
