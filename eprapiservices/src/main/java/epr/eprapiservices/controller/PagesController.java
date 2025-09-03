package epr.eprapiservices.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import epr.eprapiservices.Models.*;
import epr.eprapiservices.Services.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pages")
public class PagesController {

	private final PagesService pagesService;

	@Autowired
	public PagesController(PagesService pagesService) {
		this.pagesService = pagesService;
	}

	@GetMapping
	public List<Pages> getAllPages() {
		return pagesService.getAllPages();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Pages> getPageById(@PathVariable Integer id) {
		return pagesService.getPageById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Pages createPage(@RequestBody Pages page) {
		return pagesService.create(page);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Pages> updatePage(@PathVariable Integer id, @RequestBody Pages pageDetails) {
		Pages updatedPage = pagesService.update(id, pageDetails);
		return updatedPage != null ? ResponseEntity.ok(updatedPage) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePage(@PathVariable Integer id) {
		pagesService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
