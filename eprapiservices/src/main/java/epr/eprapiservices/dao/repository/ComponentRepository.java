package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentRepository extends JpaRepository<Component, Long> {
    
    List<Component> findByIsActive(Boolean isActive);
    
    Optional<Component> findByComponentCode(String componentCode);
    
    boolean existsByComponentCode(String componentCode);
    
    boolean existsByComponentCodeAndComponentIdNot(String componentCode, Long componentId);
}

