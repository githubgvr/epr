package epr.eprapiservices.Services;

import java.util.List;
import epr.eprapiservices.Models.*;
import epr.eprapiservices.dao.repository.*;

import org.springframework.stereotype.Service;

@Service
public class OrgTypeService {

	  private final OrgTypeRepository repository;
	  public OrgTypeService(OrgTypeRepository repository) {
	        this.repository = repository;
	    }

	    public List<OrgType> getAll() {
	        return repository.findAll();
	    }

	    public OrgType getOrgTypeById(Long id) {
	        return repository.findById(id).orElse(null);
	    }

	    public OrgType create(OrgType OrgType) {
	        return repository.save(OrgType);
	    }

	    public OrgType update(Long id, OrgType  details) {
	    	OrgType OrgType = repository.findById(id).orElse(null);
	        if (OrgType != null) {
	        	OrgType.setOrgTypeName(details.getOrgTypeName());
	        	OrgType.setIsActive(details.getIsActive());
	            return repository.save(OrgType);
	        }
	        return null;
	    }

	    public void delete(Long id) {
	        repository.deleteById(id);
	    }
}
