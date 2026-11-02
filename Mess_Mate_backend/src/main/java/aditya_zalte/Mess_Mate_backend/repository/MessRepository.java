package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MessRepository extends JpaRepository<Mess, String> {

    Optional<Mess> findFirstByOwnerId(String ownerId);
    List<Mess> findByIsVerifiedFalse();
    List<Mess> findByIsVerifiedTrue();
    List<Mess> findByIsVerifiedTrueAndIsActiveTrue();
    Optional<Mess> findByIdAndIsVerifiedTrueAndIsActiveTrue(String id);
    @Query("""
    SELECT m FROM Mess m
    WHERE m.isVerified = true AND m.isActive = true
      AND (LOWER(m.name)     LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(m.locality) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(m.city)     LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY m.name
    """)
    List<Mess> searchVerified(@Param("keyword") String keyword);

    List<Mess> findByIdInAndIsVerifiedTrueAndIsActiveTrue(Collection<String> ids);

}
