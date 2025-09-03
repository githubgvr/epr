package epr.eprapiservices.dao.repository;
//CREATE ModulesRepository 

import epr.eprapiservices.Models.Modules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModulesRepository extends JpaRepository<Modules, Long> {
	// Additional query methods can be defined here if needed
	// For example, you can define methods to find modules by specific attributes
	// List<Modules> findByModuleName(String moduleName);
}	
