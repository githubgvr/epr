package epr.eprapiservices.dao.repository;

import org.springframework.stereotype.Repository;

import epr.eprapiservices.Models.OrgType;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface OrgTypeRepository extends JpaRepository<OrgType, Long> {

}
