
package epr.eprapiservices.Services;

import epr.eprapiservices.Models.CompanyProfile;

import epr.eprapiservices.dao.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyProfileService {

    private final CompanyProfileRepository repostory;

    @Autowired
    public CompanyProfileService(CompanyProfileRepository companyProfileRepository) {
        this.repostory = companyProfileRepository;
    }

    public List<CompanyProfile> getAllCompanyProfiles() {
        return this.repostory.findAll();
    }

    public Optional<CompanyProfile> getCompanyProfileById(Integer id) {
        return this.repostory.findById(id);
    }


    public CompanyProfile create(CompanyProfile companyProfile) {
        return this.repostory.save(companyProfile);
    }

    public CompanyProfile update(Integer id, CompanyProfile  details) {
    	CompanyProfile companyProfile = this.repostory.findById(id).orElse(null);
        if (companyProfile != null) {
        	companyProfile.setCompanyName(details.getCompanyName());
        	companyProfile.setCompanyRegisteredname(details.getCompanyRegisteredname());
        	companyProfile.setRegisteredId(details.getRegisteredId());
        	companyProfile.setIndustryId(details.getIndustryId());
        	companyProfile.setCompanyprofileDetails(details.getCompanyprofileDetails());
        	companyProfile.setIsActive(details.getIsActive());
            return repostory.save(companyProfile);
        }
        return null;
    }

    public void delete(Integer id) {
    	this.repostory.deleteById(id);
    }
}
