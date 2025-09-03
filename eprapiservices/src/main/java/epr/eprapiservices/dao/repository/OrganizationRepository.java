package epr.eprapiservices.dao.repository;

import org.springframework.stereotype.Repository;

import epr.eprapiservices.Models.Organization;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

}
