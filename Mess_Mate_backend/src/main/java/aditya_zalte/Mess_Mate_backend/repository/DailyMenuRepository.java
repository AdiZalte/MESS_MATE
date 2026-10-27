package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.DailyMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyMenuRepository extends JpaRepository<DailyMenu, String> {
    Optional<DailyMenu> findByMessIdAndDate(String messId, LocalDate date);
    List<DailyMenu> findByMessIdAndDateBetweenOrderByDateAsc(String messId, LocalDate start, LocalDate end);
    void deleteByMessId(String messId);
}