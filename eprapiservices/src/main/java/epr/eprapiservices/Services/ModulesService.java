package epr.eprapiservices.Services;


import org.springframework.stereotype.Service;
import epr.eprapiservices.Models.Modules;
import epr.eprapiservices.dao.repository.ModulesRepository;
import java.util.List;
 
@Service
public class ModulesService {

	private final ModulesRepository repository;

	public ModulesService(ModulesRepository _repository) {
		this.repository = _repository;
	}

	public List<Modules> getAll() {
		return this.repository.findAll();
	}

	public Modules getModuleById(Long id) {
		return repository.findById(id).orElse(null);
	}

	public Modules create(Modules module) {
		return repository.save(module);
	}

	public Modules update(Long id, Modules details) {
		Modules module = repository.findById(id).orElse(null);
		if (module != null) {
			module.setModuleName(details.getModuleName());
			module.setIsActive(details.getIsActive());
			return repository.save(module);
		}
		return null;
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}
}
