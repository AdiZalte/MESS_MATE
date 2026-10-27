package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.RatingModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<RatingModel, String> {
    void deleteByMessId(String messId);
}