package epr.eprapiservices.Services;

import java.util.List;
import epr.eprapiservices.Models.*;
import epr.eprapiservices.dao.repository.*;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

    private final OrganizationRepository repository;

    public OrganizationService(OrganizationRepository repository) {
        this.repository = repository;
    }

    public List<Organization> getAll() {
        return repository.findAll();
    }

    public Organization getOrganizationById(long id) {
        return repository.findById(id).orElse(null);
    }

    public Organization create(Organization organization) {
        return repository.save(organization);
    }

    public Organization update(long id, Organization details) {
        Organization organization = repository.findById(id).orElse(null);
        if (organization != null) {
            organization.setOrgName(details.getOrgName());
            organization.setOrgTypeId(details.getOrgTypeId());
            organization.setIsActive(details.getIsActive());
            return repository.save(organization);
        }
        return null;
    }

    public void delete(long id) {
        repository.deleteById(id);
    }
}
