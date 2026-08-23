package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessOwnerRepository extends JpaRepository<MessOwner, String>{

    Optional<MessOwner> findByEmail(String email);

    Optional<MessOwner> findById(String id);

    Optional<MessOwner> findByPhoneNumber(String phoneNumber);




}
