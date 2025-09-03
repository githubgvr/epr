
package epr.eprapiservices.dao.repository;

import epr.eprapiservices.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides data access methods with custom queries for user management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Check if a user exists with the given username.
     */
    boolean existsByUserName(String userName);

    /**
     * Check if a user exists with the given email.
     */
    boolean existsByEmail(String email);

    /**
     * Find user by username.
     */
    Optional<User> findByUserName(String userName);

    /**
     * Find user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Find users by active status.
     */
    List<User> findByIsActive(Boolean isActive);

    /**
     * Find users by nationality.
     */
    List<User> findByNationality(Integer nationality);

    /**
     * Custom query to find users by partial name match.
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(u.middleName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByNameContaining(@Param("name") String name);
}
