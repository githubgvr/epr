package epr.eprapiservices.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import epr.eprapiservices.Models.Industry;
import epr.eprapiservices.dao.repository.IndustryRepository;

@Service
public class IndustryService {

	  
	  private final IndustryRepository repository;
	  public IndustryService(IndustryRepository _repository) {
	        this.repository = _repository;
	    }

	    public List<Industry> getAll() {
	        return this.repository.findAll();
	    }

	    public Industry getIndustryById(Integer id) {
	        return repository.findById(id).orElse(null);
	    }

	    public Industry create(Industry industry) {
	        return repository.save(industry);
	    }

	    public Industry update(Integer id, Industry  details) {
	    	Industry industry = repository.findById(id).orElse(null);
	        if (industry != null) {
	        	industry.setIndustryName(details.getIndustryName());
	        	industry.setIsActive(details.getIsActive());
	            return repository.save(industry);
	        }
	        return null;
	    }

	    public void delete(Integer id) {
	        repository.deleteById(id);
	    }
}
