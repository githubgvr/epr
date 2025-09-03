package epr.eprapiservices.Services;
//create a service class for Pages entity

import org.springframework.stereotype.Service;
import epr.eprapiservices.Models.Pages;
import epr.eprapiservices.dao.repository.PagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
@Service
public class PagesService  {

	@Autowired
	private PagesRepository pagesRepository;

	public PagesService(PagesRepository pagesRepository) {
        this.pagesRepository = pagesRepository;
    }
	public List<Pages> getAllPages() {
		return pagesRepository.findAll();
	}

	public Optional<Pages> getPageById(Integer pageId) {
		return pagesRepository.findById(pageId);
	}

	public Pages create(Pages page) {
		return pagesRepository.save(page);
	}

	public Pages update(Integer pageId, Pages pageDetails) {
		if (pagesRepository.existsById(pageId)) {
			pageDetails.setPageId(pageId);
			return pagesRepository.save(pageDetails);
		}
		return null;
	}

	public void delete(Integer pageId) {
		pagesRepository.deleteById(pageId);
	}
}
	
