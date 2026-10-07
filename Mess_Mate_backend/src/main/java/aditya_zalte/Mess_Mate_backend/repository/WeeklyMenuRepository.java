package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.WeeklyMenu;
import aditya_zalte.Mess_Mate_backend.model.enums.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeeklyMenuRepository extends JpaRepository<WeeklyMenu, String> {

    Optional<WeeklyMenu> findByMessIdAndDayOfWeek(
            String messId,
            DayOfWeek dayOfWeek
    );

    List<WeeklyMenu> findByMessIdOrderByDayOfWeek(String messId);
}