package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessRepository extends JpaRepository<Mess, String> {

    Optional<Mess> findFirstByOwnerId(String ownerId);
    List<Mess> findByIsVerifiedFalse();
    List<Mess> findByIsVerifiedTrue();
    List<Mess> findByIsVerifiedTrueAndIsActiveTrue();
    Optional<Mess> findByIdAndIsVerifiedTrueAndIsActiveTrue(String id);
}
