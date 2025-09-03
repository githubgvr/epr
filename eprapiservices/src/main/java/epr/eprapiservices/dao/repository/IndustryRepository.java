package epr.eprapiservices.dao.repository;

import org.springframework.stereotype.Repository;

import epr.eprapiservices.Models.*;


import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface IndustryRepository extends JpaRepository<Industry, Integer> {

}
